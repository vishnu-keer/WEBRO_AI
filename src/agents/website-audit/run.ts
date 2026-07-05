/**
 * The Website Audit service. Orchestrates the full vertical slice:
 *   crawl+extract -> runAgent (Claude) -> deterministic scoring -> persist.
 *
 * Exposed two ways:
 *   - runWebsiteAudit(): called synchronously by the server action (instant UX).
 *   - a registered job handler: lets the queue/worker run audits in the
 *     background (used later by the orchestrator).
 */
import { runAgent, type AgentContext } from "@/agents/core";
import { registerJobHandler } from "@/lib/jobs/worker";
import { crawlAndExtract } from "./extract";
import { websiteAuditAgent } from "./index";
import { computeOverallScore, toGrade } from "./scoring";
import { RunAuditRequestSchema, type RunAuditRequest, type WebsiteAuditOutput } from "./schema";

export interface RunAuditResult {
  auditId: string;
  output: WebsiteAuditOutput;
}

export async function runWebsiteAudit(
  request: RunAuditRequest,
  ctx: AgentContext,
): Promise<RunAuditResult> {
  const { url, leadId } = RunAuditRequestSchema.parse(request);

  // 1. Deterministic crawl + extraction.
  const snapshot = await crawlAndExtract(url);

  // 2. Reasoning through the shared Runner (validates + logs telemetry).
  const runCtx: AgentContext = { ...ctx, leadId: leadId ?? ctx.leadId };
  const { output } = await runAgent(websiteAuditAgent, { url, snapshot }, runCtx);

  // 3. Deterministic top-line score (never trust the model for the headline number).
  output.overallScore = computeOverallScore(output.categoryScores);
  output.grade = toGrade(output.overallScore);
  output.url = url;

  // 4. Persist. Full typed audit lives in `data`; hot fields are mirrored.
  const scores = Object.fromEntries(
    Object.entries(output.categoryScores).map(([k, v]) => [k, v.score]),
  );
  const { data, error } = await ctx.supabase
    .from("audits")
    .insert({
      workspace_id: ctx.workspaceId,
      lead_id: leadId ?? null,
      url,
      overall_score: output.overallScore,
      summary: output.summary,
      scores,
      issues: output.criticalIssues,
      data: output,
      model: websiteAuditAgent.model,
    })
    .select("id")
    .single();
  if (error) throw error;

  return { auditId: data.id as string, output };
}

// Background path: run an audit off the job queue with the service-role client.
registerJobHandler("website-audit", async (job) => {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  await runWebsiteAudit(
    { url: String(job.payload.url), leadId: job.leadId },
    { supabase, workspaceId: job.workspaceId, leadId: job.leadId, workflowRunId: job.workflowRunId },
  );
});
