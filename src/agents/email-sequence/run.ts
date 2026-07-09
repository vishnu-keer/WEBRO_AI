/** Email sequence service: scrape -> Runner (LLM) -> persist to email_sequences. */
import { runAgent, type AgentContext } from "@/agents/core";
import { registerJobHandler } from "@/lib/jobs/worker";
import { gatherBusiness } from "./gather";
import { emailAgent } from "./index";
import { RunEmailRequestSchema, type RunEmailRequest, type EmailSequenceOutput } from "./schema";

export interface RunEmailResult {
  sequenceId: string;
  output: EmailSequenceOutput;
}

export async function runEmailCampaign(request: RunEmailRequest, ctx: AgentContext): Promise<RunEmailResult> {
  const req = RunEmailRequestSchema.parse(request);

  const business = await gatherBusiness(req.url);
  const runCtx: AgentContext = { ...ctx, leadId: req.leadId ?? ctx.leadId };
  const { output } = await runAgent(emailAgent, { url: req.url, goal: req.goal, business }, runCtx);
  output.url = req.url;

  const { data, error } = await ctx.supabase
    .from("email_sequences")
    .insert({
      workspace_id: ctx.workspaceId,
      lead_id: req.leadId ?? null,
      goal: output.goal,
      data: output,
    })
    .select("id")
    .single();
  if (error) throw error;

  return { sequenceId: data.id as string, output };
}

registerJobHandler("email-sequence", async (job) => {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  await runEmailCampaign(
    {
      url: String(job.payload.url),
      goal: job.payload.goal ? String(job.payload.goal) : undefined,
      leadId: job.leadId,
    },
    { supabase, workspaceId: job.workspaceId, leadId: job.leadId, workflowRunId: job.workflowRunId },
  );
});
