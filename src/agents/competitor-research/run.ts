/**
 * Competitor Research service: discover (scrape + search + scrape) -> Runner
 * (LLM comparison) -> persist to `competitors`.
 */
import { runAgent, type AgentContext } from "@/agents/core";
import { registerJobHandler } from "@/lib/jobs/worker";
import { discoverCompetitors } from "./discover";
import { competitorAgent } from "./index";
import { RunCompetitorRequestSchema, type RunCompetitorRequest, type CompetitorAnalysisOutput } from "./schema";

export interface RunCompetitorResult {
  analysisId: string;
  output: CompetitorAnalysisOutput;
}

export async function runCompetitorResearch(
  request: RunCompetitorRequest,
  ctx: AgentContext,
): Promise<RunCompetitorResult> {
  const req = RunCompetitorRequestSchema.parse(request);

  const research = await discoverCompetitors(req);
  const runCtx: AgentContext = { ...ctx, leadId: req.leadId ?? ctx.leadId };
  const { output } = await runAgent(
    competitorAgent,
    { url: req.url, location: req.location, industry: req.industry, research },
    runCtx,
  );
  output.targetUrl = req.url;

  const { data, error } = await ctx.supabase
    .from("competitors")
    .insert({
      workspace_id: ctx.workspaceId,
      lead_id: req.leadId ?? null,
      name: research.target.title ?? req.url,
      website: req.url,
      comparison: output.competitors,
      data: output,
    })
    .select("id")
    .single();
  if (error) throw error;

  return { analysisId: data.id as string, output };
}

registerJobHandler("competitor-research", async (job) => {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  await runCompetitorResearch(
    {
      url: String(job.payload.url),
      location: job.payload.location ? String(job.payload.location) : undefined,
      industry: job.payload.industry ? String(job.payload.industry) : undefined,
      leadId: job.leadId,
    },
    { supabase, workspaceId: job.workspaceId, leadId: job.leadId, workflowRunId: job.workflowRunId },
  );
});
