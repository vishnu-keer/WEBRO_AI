/**
 * The SEO audit service: crawl+extract (homepage + robots + sitemap) -> Runner
 * (Claude) -> deterministic scoring -> persist to seo_reports.
 */
import { runAgent, type AgentContext } from "@/agents/core";
import { registerJobHandler } from "@/lib/jobs/worker";
import { crawlAndExtractSeo } from "./extract";
import { seoAgent } from "./index";
import { computeSeoScore, toGrade } from "./scoring";
import { RunSeoRequestSchema, type RunSeoRequest, type SeoAuditOutput } from "./schema";

export interface RunSeoResult {
  reportId: string;
  output: SeoAuditOutput;
}

export async function runSeoAudit(request: RunSeoRequest, ctx: AgentContext): Promise<RunSeoResult> {
  const { url, leadId } = RunSeoRequestSchema.parse(request);

  const snapshot = await crawlAndExtractSeo(url);
  const runCtx: AgentContext = { ...ctx, leadId: leadId ?? ctx.leadId };
  const { output } = await runAgent(seoAgent, { url, snapshot }, runCtx);

  output.overallScore = computeSeoScore(output.categoryScores);
  output.grade = toGrade(output.overallScore);
  output.url = url;

  const { data, error } = await ctx.supabase
    .from("seo_reports")
    .insert({
      workspace_id: ctx.workspaceId,
      lead_id: leadId ?? null,
      score: output.overallScore,
      recommendations: output.priorityImprovements,
      data: output,
      model: seoAgent.model,
    })
    .select("id")
    .single();
  if (error) throw error;

  return { reportId: data.id as string, output };
}

registerJobHandler("seo", async (job) => {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  await runSeoAudit(
    { url: String(job.payload.url), leadId: job.leadId },
    { supabase, workspaceId: job.workspaceId, leadId: job.leadId, workflowRunId: job.workflowRunId },
  );
});
