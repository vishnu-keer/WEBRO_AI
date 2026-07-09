/** Leads finder service: search -> Runner (LLM structuring) -> insert into leads. */
import { runAgent, type AgentContext } from "@/agents/core";
import { registerJobHandler } from "@/lib/jobs/worker";
import { discoverLeads } from "./discover";
import { leadsAgent } from "./index";
import { RunLeadsRequestSchema, type RunLeadsRequest } from "./schema";

export interface RunLeadsResult {
  added: number;
  found: number;
}

export async function runLeadsFinder(request: RunLeadsRequest, ctx: AgentContext): Promise<RunLeadsResult> {
  const req = RunLeadsRequestSchema.parse(request);

  const results = await discoverLeads(req);
  const { output } = await runAgent(
    leadsAgent,
    { businessType: req.businessType, location: req.location, results },
    ctx,
  );

  // Dedupe against existing leads (by website when present).
  const { data: existing } = await ctx.supabase.from("leads").select("website");
  const seen = new Set(
    (existing ?? [])
      .map((l: { website: string | null }) => (l.website ?? "").toLowerCase().replace(/\/$/, ""))
      .filter(Boolean),
  );

  const rows = output.leads
    .filter((l) => {
      const key = (l.website ?? "").toLowerCase().replace(/\/$/, "");
      if (key && seen.has(key)) return false;
      if (key) seen.add(key);
      return true;
    })
    .map((l) => ({
      workspace_id: ctx.workspaceId,
      business_name: l.name,
      website: l.website ?? null,
      industry: req.businessType,
      location: l.location ?? req.location,
      status: "new",
      source: "leads-finder",
      notes: `[${l.websiteQuality} website] ${l.whyGoodLead}`,
    }));

  if (rows.length) {
    const { error } = await ctx.supabase.from("leads").insert(rows);
    if (error) throw error;
  }
  return { added: rows.length, found: output.leads.length };
}

registerJobHandler("leads-finder", async (job) => {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  await runLeadsFinder(
    { businessType: String(job.payload.businessType), location: String(job.payload.location) },
    { supabase, workspaceId: job.workspaceId, leadId: job.leadId, workflowRunId: job.workflowRunId },
  );
});
