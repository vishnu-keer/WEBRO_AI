/**
 * Helpers over the Messages API:
 *  - `generateObject`: force Claude to return data matching a Zod schema (via a
 *    single required tool). This is how agents produce typed, validated output.
 *  - `runToolLoop`:    a minimal agentic loop that lets Claude call registered
 *    tools until it produces a final answer. Used by agents that need to act
 *    (scrape, search, retrieve) before answering.
 *
 * Both return the token usage so callers can log cost to `agent_runs`.
 */
import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { anthropic, gemini, llmProvider, type TokenUsage } from "./client";
import { geminiModel, type ModelId } from "@/config/models";

type Msg = Anthropic.MessageParam;

export interface GenerateObjectArgs<T> {
  model: ModelId;
  system: string;
  messages: Msg[];
  schema: z.ZodType<T>;
  /** Name/description shown to the model for the output tool. */
  toolName?: string;
  toolDescription?: string;
  maxTokens?: number;
}

export async function generateObject<T>(
  args: GenerateObjectArgs<T>,
): Promise<{ object: T; usage: TokenUsage }> {
  if (llmProvider() === "gemini") return generateObjectGemini(args);
  return generateObjectAnthropic(args);
}

const GEMINI_MAX_RETRIES = 4;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** True if the error is a Gemini rate-limit / quota error (HTTP 429). */
function isGeminiRateLimit(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /\b429\b|RESOURCE_EXHAUSTED|rate limit|quota/i.test(msg);
}

/** True if the 429 is the *daily* free-tier cap (no point retrying within the same run). */
function isGeminiDailyQuota(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /PerDay|per day|\bdaily\b/i.test(msg);
}

/** True for transient server-side blips (503/500 overload) that clear on retry. */
function isGeminiTransient(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /\b503\b|\b500\b|UNAVAILABLE|INTERNAL|overloaded|high demand|try again/i.test(msg);
}

/** Server-suggested wait (seconds) from a 429 body, e.g. "retryDelay":"3s". */
function geminiRetryDelaySeconds(err: unknown): number | null {
  const msg = err instanceof Error ? err.message : String(err);
  const secs = msg.match(/"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/)?.[1];
  return secs ? Math.ceil(parseFloat(secs)) : null;
}

/** Gemini structured output: ask for JSON, then validate with Zod. */
async function generateObjectGemini<T>(
  args: GenerateObjectArgs<T>,
): Promise<{ object: T; usage: TokenUsage }> {
  const jsonSchema = zodToJsonSchema(args.schema, { target: "openApi3", $refStrategy: "none" });
  const userText = args.messages
    .map((m) => (typeof m.content === "string" ? m.content : ""))
    .filter(Boolean)
    .join("\n\n");
  const system =
    `${args.system}\n\nReturn ONLY a JSON object that matches this JSON schema ` +
    `(no markdown fences, no commentary):\n${JSON.stringify(jsonSchema)}`;

  let lastErr: unknown;
  for (let attempt = 0; attempt <= GEMINI_MAX_RETRIES; attempt++) {
    try {
      const res = await gemini().models.generateContent({
        model: geminiModel(),
        contents: userText,
        config: {
          systemInstruction: system,
          responseMimeType: "application/json",
          // temperature 0 = deterministic: the model picks its single most-confident
          // answer, so re-analyzing the same site gives consistent, repeatable scores
          // instead of a different number each run.
          temperature: 0,
          // Current Gemini Flash models "think", and those hidden tokens share the
          // output budget — a tight cap truncates the JSON ("Unterminated string").
          // The answer itself is ~5-8k tokens; give generous headroom for thinking.
          maxOutputTokens: Math.max(args.maxTokens ?? 8192, 32768),
        },
      });

      const raw = (res.text ?? "").trim();
      const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      const payload = cleaned || raw;

      let parsed: unknown;
      try {
        parsed = JSON.parse(payload);
      } catch {
        // Almost always means the model hit its output-token limit and the JSON
        // was cut off. Give an actionable message instead of a cryptic parse error.
        const finish = res.candidates?.[0]?.finishReason;
        if (finish === "MAX_TOKENS" || !/[}\]]\s*$/.test(payload)) {
          throw new Error(
            `Gemini's response was cut off before the JSON finished ` +
              `(finishReason=${finish ?? "unknown"}, model=${geminiModel()}). ` +
              `Use a model with a larger output limit or request less detail.`,
          );
        }
        throw new Error(`Gemini returned invalid JSON that could not be parsed (model=${geminiModel()}).`);
      }

      return {
        object: args.schema.parse(parsed),
        usage: {
          inputTokens: res.usageMetadata?.promptTokenCount ?? 0,
          outputTokens: res.usageMetadata?.candidatesTokenCount ?? 0,
        },
      };
    } catch (err) {
      lastErr = err;
      // Auto-retry the recoverable cases (never on the final attempt):
      //  - per-minute rate limits (but NOT the daily cap — that won't clear by waiting)
      //  - transient 503/500 "high demand" server blips
      const recoverable =
        (isGeminiRateLimit(err) && !isGeminiDailyQuota(err)) || isGeminiTransient(err);
      if (attempt < GEMINI_MAX_RETRIES && recoverable) {
        const backoff = geminiRetryDelaySeconds(err) ?? Math.min(2 ** attempt, 8);
        await sleep(backoff * 1000);
        continue;
      }
      // Daily free-tier cap: turn Google's wall-of-text error into a clear next step.
      if (isGeminiRateLimit(err) && isGeminiDailyQuota(err)) {
        throw new Error(
          `Gemini free-tier daily quota reached for model "${geminiModel()}". ` +
            `Wait for the daily reset (midnight US Pacific), set GEMINI_MODEL to another ` +
            `free model, or add billing to your Google AI Studio key.`,
        );
      }
      throw err;
    }
  }
  throw lastErr;
}

async function generateObjectAnthropic<T>(
  args: GenerateObjectArgs<T>,
): Promise<{ object: T; usage: TokenUsage }> {
  const toolName = args.toolName ?? "record_result";
  const jsonSchema = zodToJsonSchema(args.schema, {
    target: "openApi3",
    $refStrategy: "none", // inline everything — Claude tool schemas must be self-contained
  }) as Record<string, unknown>;

  const res = await anthropic().messages.create({
    model: args.model,
    max_tokens: args.maxTokens ?? 4096,
    temperature: 0, // deterministic → consistent, repeatable scores for the same input
    system: args.system,
    messages: args.messages,
    tools: [
      {
        name: toolName,
        description: args.toolDescription ?? "Return the final structured result.",
        input_schema: jsonSchema as Anthropic.Tool["input_schema"],
      },
    ],
    tool_choice: { type: "tool", name: toolName },
  });

  const block = res.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") {
    throw new Error("Model did not return the expected structured tool call.");
  }

  return {
    object: args.schema.parse(block.input),
    usage: { inputTokens: res.usage.input_tokens, outputTokens: res.usage.output_tokens },
  };
}

export interface ToolLoopTool {
  name: string;
  description: string;
  input_schema: Anthropic.Tool["input_schema"];
  execute: (input: unknown) => Promise<unknown>;
}

export async function runToolLoop(args: {
  model: ModelId;
  system: string;
  messages: Msg[];
  tools: ToolLoopTool[];
  maxTokens?: number;
  maxSteps?: number;
}): Promise<{ finalText: string; usage: TokenUsage }> {
  const messages: Msg[] = [...args.messages];
  const usage: TokenUsage = { inputTokens: 0, outputTokens: 0 };
  const toolDefs = args.tools.map(({ name, description, input_schema }) => ({
    name,
    description,
    input_schema,
  }));

  for (let step = 0; step < (args.maxSteps ?? 8); step++) {
    const res = await anthropic().messages.create({
      model: args.model,
      max_tokens: args.maxTokens ?? 4096,
      system: args.system,
      messages,
      tools: toolDefs,
    });
    usage.inputTokens += res.usage.input_tokens;
    usage.outputTokens += res.usage.output_tokens;

    if (res.stop_reason !== "tool_use") {
      const text = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      return { finalText: text, usage };
    }

    messages.push({ role: "assistant", content: res.content });

    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of res.content) {
      if (block.type !== "tool_use") continue;
      const tool = args.tools.find((t) => t.name === block.name);
      try {
        const output = tool ? await tool.execute(block.input) : { error: "unknown tool" };
        results.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(output),
        });
      } catch (err) {
        results.push({
          type: "tool_result",
          tool_use_id: block.id,
          is_error: true,
          content: err instanceof Error ? err.message : String(err),
        });
      }
    }
    messages.push({ role: "user", content: results });
  }

  throw new Error("runToolLoop exceeded maxSteps without a final answer.");
}
