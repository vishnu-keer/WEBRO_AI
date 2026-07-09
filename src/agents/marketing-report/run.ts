/** Marketing report service: gather (scrape + saved reports) -> Runner -> persist. */
import { runAgent, type AgentContext } from "@/agents/core";
import { registerJobHandler } from "@/lib/jobs/worker";
import { gatherReportContext } from "./gather";
import { reportAgent } from "./index";
import { RunReportRequestSchema, type RunReportRequest, type MarketingReportOutput } from "./schema";

export interface RunReportResult {
  reportId: string;
  output: MarketingReportOutput;
}

export async function runMarketingReport(request: RunReportRequest, ctx: AgentContext): Promise<RunReportResult> {
  const req = RunReportRequestSchema.parse(request);

  const gathered = await gatherReportContext(req.url, ctx.supabase);
  const runCtx: AgentContext = { ...ctx, leadId: req.leadId ?? ctx.leadId };
  const { output } = await runAgent(
    reportAgent,
    {
      url: req.url,
      business: gathered.business,
      auditSummary: gathered.auditSummary,
      seoSummary: gathered.seoSummary,
      competitorSummary: gathered.competitorSummary,
    },
    runCtx,
  );
  output.url = req.url;

  const { data, error } = await ctx.supabase
    .from("reports")
    .insert({
      workspace_id: ctx.workspaceId,
      lead_id: req.leadId ?? null,
      title: output.title,
      content: output,
      data: output,
    })
    .select("id")
    .single();
  if (error) throw error;

  return { reportId: data.id as string, output };
}

registerJobHandler("marketing-report", async (job) => {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  await runMarketingReport(
    { url: String(job.payload.url), leadId: job.leadId },
    { supabase, workspaceId: job.workspaceId, leadId: job.leadId, workflowRunId: job.workflowRunId },
  );
});
