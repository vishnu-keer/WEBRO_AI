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
import { anthropic, type TokenUsage } from "./client";
import type { ModelId } from "@/config/models";

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
  const toolName = args.toolName ?? "record_result";
  const jsonSchema = zodToJsonSchema(args.schema, {
    target: "openApi3",
    $refStrategy: "none", // inline everything — Claude tool schemas must be self-contained
  }) as Record<string, unknown>;

  const res = await anthropic().messages.create({
    model: args.model,
    max_tokens: args.maxTokens ?? 4096,
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
