/** Ads service: scrape client site -> Runner (LLM) -> persist to ad_copy. */
import { runAgent, type AgentContext } from "@/agents/core";
import { registerJobHandler } from "@/lib/jobs/worker";
import { gatherBusiness } from "./gather";
import { adsAgent } from "./index";
import { RunAdsRequestSchema, type RunAdsRequest, type AdsOutput } from "./schema";

export interface RunAdsResult {
  adId: string;
  output: AdsOutput;
}

export async function runAdsGenerator(request: RunAdsRequest, ctx: AgentContext): Promise<RunAdsResult> {
  const req = RunAdsRequestSchema.parse(request);

  const business = await gatherBusiness(req.url);
  const runCtx: AgentContext = { ...ctx, leadId: req.leadId ?? ctx.leadId };
  const { output } = await runAgent(
    adsAgent,
    { url: req.url, platform: req.platform, objective: req.objective, business },
    runCtx,
  );
  output.url = req.url;
  output.platform = req.platform;

  const { data, error } = await ctx.supabase
    .from("ad_copy")
    .insert({
      workspace_id: ctx.workspaceId,
      lead_id: req.leadId ?? null,
      platform: req.platform,
      objective: output.objective,
      data: output,
    })
    .select("id")
    .single();
  if (error) throw error;

  return { adId: data.id as string, output };
}

registerJobHandler("ad-copy", async (job) => {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  await runAdsGenerator(
    {
      url: String(job.payload.url),
      platform: String(job.payload.platform ?? "Meta"),
      objective: job.payload.objective ? String(job.payload.objective) : undefined,
      leadId: job.leadId,
    },
    { supabase, workspaceId: job.workspaceId, leadId: job.leadId, workflowRunId: job.workflowRunId },
  );
});
