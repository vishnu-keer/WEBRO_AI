/**
 * runAgent — the one function every agent runs through. It:
 *   1. validates input (Zod)
 *   2. optionally retrieves RAG context
 *   3. calls Claude with the output schema forced
 *   4. validates the result (Zod)
 *   5. records telemetry (success or failure)
 *   6. returns typed output
 *
 * No agent re-implements any of this. Add an agent = write a spec + prompt.
 */
import { generateObject } from "@/lib/claude/tool-use";
import { llmProvider } from "@/lib/claude/client";
import { geminiModel } from "@/config/models";
import { retrieve, type RetrievedChunk } from "@/lib/rag/retrieve";
import { recordAgentRun } from "./telemetry";
import type { AgentSpec, AgentContext, AgentRunResult } from "./types";

export async function runAgent<I, O>(
  spec: AgentSpec<I, O>,
  rawInput: unknown,
  ctx: AgentContext,
): Promise<AgentRunResult<O>> {
  const started = Date.now();
  const input = spec.input.parse(rawInput);
  // Log the model that ACTUALLY ran so telemetry + cost are accurate. When
  // LLM_PROVIDER=gemini, generateObject ignores spec.model and uses geminiModel().
  const billedModel = llmProvider() === "gemini" ? geminiModel() : spec.model;

  try {
    let retrieved: RetrievedChunk[] = [];
    if (spec.ragNamespaces?.length) {
      const query = spec.ragQuery ? spec.ragQuery(input) : JSON.stringify(input);
      retrieved = await retrieve({
        supabase: ctx.supabase,
        workspaceId: ctx.workspaceId,
        query,
        namespaces: spec.ragNamespaces,
      });
    }

    const userMessage = spec.formatInput
      ? spec.formatInput(input, retrieved)
      : JSON.stringify(input, null, 2);

    const system = retrieved.length
      ? `${spec.systemPrompt}\n\n<retrieved_context>\n${retrieved
          .map((r) => r.content)
          .join("\n\n---\n\n")}\n</retrieved_context>`
      : spec.systemPrompt;

    const { object, usage } = await generateObject<O>({
      model: spec.model,
      system,
      messages: [{ role: "user", content: userMessage }],
      schema: spec.output,
      toolName: `record_${spec.name.replace(/-/g, "_")}`,
      maxTokens: spec.maxTokens,
    });

    const durationMs = Date.now() - started;
    await recordAgentRun(ctx, {
      agent: spec.name,
      version: spec.version,
      model: billedModel,
      input,
      output: object,
      usage,
      status: "success",
      durationMs,
    });

    return { output: object, usage, durationMs };
  } catch (err) {
    await recordAgentRun(ctx, {
      agent: spec.name,
      version: spec.version,
      model: billedModel,
      input,
      usage: { inputTokens: 0, outputTokens: 0 },
      status: "error",
      error: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - started,
    });
    throw err;
  }
}
