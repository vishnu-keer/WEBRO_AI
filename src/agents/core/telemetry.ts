/**
 * Every agent execution is recorded to `agent_runs` — model, tokens, cost,
 * latency, status. No exceptions (Design principle #3). Powers the future
 * "cost per prospect / per proposal" view.
 */
import type { AgentContext } from "./types";
import type { TokenUsage } from "@/lib/claude/client";
import { estimateCostUsd } from "@/config/models";

export interface AgentRunRecord {
  agent: string;
  version: string;
  model: string;
  input: unknown;
  output?: unknown;
  usage: TokenUsage;
  status: "success" | "error";
  error?: string;
  durationMs: number;
}

export async function recordAgentRun(ctx: AgentContext, run: AgentRunRecord): Promise<void> {
  const cost = estimateCostUsd(run.model, run.usage.inputTokens, run.usage.outputTokens);
  const { error } = await ctx.supabase.from("agent_runs").insert({
    workspace_id: ctx.workspaceId,
    lead_id: ctx.leadId ?? null,
    workflow_run_id: ctx.workflowRunId ?? null,
    agent: run.agent,
    version: run.version,
    model: run.model,
    input: run.input,
    output: run.output ?? null,
    input_tokens: run.usage.inputTokens,
    output_tokens: run.usage.outputTokens,
    cost_usd: cost,
    status: run.status,
    error: run.error ?? null,
    duration_ms: run.durationMs,
  });
  // Telemetry must never break the agent — log and move on.
  if (error) console.error("[telemetry] failed to record agent_run:", error.message);
}
