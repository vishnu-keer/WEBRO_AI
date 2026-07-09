/** Proposal service: gather (site + KB) + latest audit -> Runner -> persist to proposals. */
import { runAgent, type AgentContext } from "@/agents/core";
import { registerJobHandler } from "@/lib/jobs/worker";
import { gatherProposalContext } from "./gather";
import { proposalAgent } from "./index";
import { RunProposalRequestSchema, type RunProposalRequest, type ProposalOutput } from "./schema";

export interface RunProposalResult {
  proposalId: string;
  output: ProposalOutput;
}

export async function runProposalGenerator(
  request: RunProposalRequest,
  ctx: AgentContext,
): Promise<RunProposalResult> {
  const req = RunProposalRequestSchema.parse(request);

  const { business, knowledgeBase } = await gatherProposalContext(req.url);

  // Pull the most recent audit for this URL (if any) so the proposal cites real findings.
  let auditSummary: string | undefined;
  let auditFindings: string[] | undefined;
  const { data: audit } = await ctx.supabase
    .from("audits")
    .select("summary, data")
    .eq("url", req.url)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (audit?.data) {
    const a = audit.data as { summary?: string; criticalIssues?: { title: string }[] };
    auditSummary = audit.summary ?? a.summary;
    auditFindings = (a.criticalIssues ?? []).map((i) => i.title);
  }

  const runCtx: AgentContext = { ...ctx, leadId: req.leadId ?? ctx.leadId };
  const { output } = await runAgent(
    proposalAgent,
    { url: req.url, scope: req.scope, business, knowledgeBase, auditSummary, auditFindings },
    runCtx,
  );
  output.url = req.url;

  const { data, error } = await ctx.supabase
    .from("proposals")
    .insert({
      workspace_id: ctx.workspaceId,
      lead_id: req.leadId ?? null,
      title: output.title,
      status: "draft",
      pricing: output.pricing,
      content: output,
      data: output,
    })
    .select("id")
    .single();
  if (error) throw error;

  return { proposalId: data.id as string, output };
}

registerJobHandler("proposal-generator", async (job) => {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  await runProposalGenerator(
    { url: String(job.payload.url), scope: job.payload.scope ? String(job.payload.scope) : undefined, leadId: job.leadId },
    { supabase, workspaceId: job.workspaceId, leadId: job.leadId, workflowRunId: job.workflowRunId },
  );
});
