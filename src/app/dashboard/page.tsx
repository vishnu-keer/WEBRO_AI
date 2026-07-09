import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";

async function countOf(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
): Promise<number> {
  const { count } = await supabase.from(table as never).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function DashboardHome() {
  const supabase = await createClient();

  const [leads, audits, seo, competitors, ads, emails, proposals, reports, workflows] = await Promise.all([
    countOf(supabase, "leads"),
    countOf(supabase, "audits"),
    countOf(supabase, "seo_reports"),
    countOf(supabase, "competitors"),
    countOf(supabase, "ad_copy"),
    countOf(supabase, "email_sequences"),
    countOf(supabase, "proposals"),
    countOf(supabase, "reports"),
    countOf(supabase, "workflow_runs"),
  ]);

  const { data: costRows } = await supabase.from("agent_runs").select("cost_usd");
  const totalRuns = costRows?.length ?? 0;
  const totalCost = (costRows ?? []).reduce((s, r) => s + (Number(r.cost_usd) || 0), 0);

  const { data: recent } = await supabase
    .from("agent_runs")
    .select("agent, status, model, cost_usd, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-semibold">WEBRO AI Marketing OS</h1>
        <p className="text-sm text-foreground/60">Your client-acquisition command center.</p>
      </header>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/leads"><Button>Find leads</Button></Link>
        <Link href="/dashboard/audits"><Button variant="outline">Run an audit</Button></Link>
        <Link href="/dashboard/workflows"><Button variant="outline">Full workup</Button></Link>
      </div>

      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground/60">Pipeline</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Leads" value={leads} href="/dashboard/leads" />
          <StatCard label="Audits" value={audits} href="/dashboard/audits" />
          <StatCard label="SEO" value={seo} href="/dashboard/seo" />
          <StatCard label="Competitors" value={competitors} href="/dashboard/competitors" />
          <StatCard label="Ads" value={ads} href="/dashboard/ads" />
          <StatCard label="Emails" value={emails} href="/dashboard/emails" />
          <StatCard label="Proposals" value={proposals} href="/dashboard/proposals" />
          <StatCard label="Reports" value={reports} href="/dashboard/reports" />
          <StatCard label="Workflows" value={workflows} href="/dashboard/workflows" />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground/60">AI usage</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Agent runs" value={totalRuns} />
          <StatCard label="Est. AI cost" value={`$${totalCost.toFixed(2)}`} accent />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground/60">Recent activity</h3>
        {!recent || recent.length === 0 ? (
          <p className="text-sm text-foreground/40">No agent runs yet. Run an audit or a full workup to get started.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border/60 rounded-xl border border-border bg-muted/30">
            {recent.map((r, i) => (
              <div key={i} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: r.status === "success" ? "#22c55e" : "#ef4444" }}
                  />
                  <span className="font-medium">{r.agent}</span>
                  <span className="text-xs text-foreground/40">{r.model}</span>
                </div>
                <span className="text-xs text-foreground/40">{new Date(r.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
