/**
 * Master Orchestrator — the "Full Prospect Workup".
 *
 * Runs the agents in dependency order for one prospect URL. Each step is isolated
 * so a single failure doesn't abort the rest. The Marketing Report runs after the
 * research agents so it can synthesize their saved results; the Proposal runs after
 * the audit so it can cite real findings. Synchronous for local dev; production can
 * move this onto the background job queue (already scaffolded in src/lib/jobs).
 */
import type { AgentContext } from "@/agents/core";
import { runWebsiteAudit } from "@/agents/website-audit/run";
import { runSeoAudit } from "@/agents/seo/run";
import { runCompetitorResearch } from "@/agents/competitor-research/run";
import { runMarketingReport } from "@/agents/marketing-report/run";
import { runEmailCampaign } from "@/agents/email-sequence/run";
import { runProposalGenerator } from "@/agents/proposal-generator/run";
import type { WorkflowStepResult } from "./types";

export interface RunWorkupRequest {
  url: string;
  location?: string;
  industry?: string;
  leadId?: string;
}

export async function runFullWorkup(req: RunWorkupRequest, ctx: AgentContext): Promise<string> {
  const startedAt = new Date().toISOString();
  const steps: WorkflowStepResult[] = [];

  const step = async (
    key: string,
    label: string,
    fn: () => Promise<string>,
    route: (id: string) => string,
  ): Promise<void> => {
    try {
      const id = await fn();
      steps.push({ key, label, status: "done", outputId: id, route: route(id) });
    } catch (err) {
      steps.push({ key, label, status: "error", error: err instanceof Error ? err.message : String(err) });
    }
  };

  const lead = req.leadId;
  await step("audit", "Website Audit", async () => (await runWebsiteAudit({ url: req.url, leadId: lead }, ctx)).auditId, (id) => `/dashboard/audits/${id}`);
  await step("seo", "SEO", async () => (await runSeoAudit({ url: req.url, leadId: lead }, ctx)).reportId, (id) => `/dashboard/seo/${id}`);
  await step("competitors", "Competitors", async () => (await runCompetitorResearch({ url: req.url, location: req.location, industry: req.industry, leadId: lead }, ctx)).analysisId, (id) => `/dashboard/competitors/${id}`);
  await step("report", "Marketing Report", async () => (await runMarketingReport({ url: req.url, leadId: lead }, ctx)).reportId, (id) => `/dashboard/reports/${id}`);
  await step("email", "Email Sequence", async () => (await runEmailCampaign({ url: req.url, leadId: lead }, ctx)).sequenceId, (id) => `/dashboard/emails/${id}`);
  await step("proposal", "Proposal", async () => (await runProposalGenerator({ url: req.url, leadId: lead }, ctx)).proposalId, (id) => `/dashboard/proposals/${id}`);

  const hasError = steps.some((s) => s.status === "error");
  const { data, error } = await ctx.supabase
    .from("workflow_runs")
    .insert({
      workspace_id: ctx.workspaceId,
      lead_id: lead ?? null,
      status: hasError ? "completed_with_errors" : "completed",
      context: { url: req.url, steps },
      started_at: startedAt,
      finished_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}
