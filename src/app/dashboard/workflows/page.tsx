import { createClient } from "@/lib/supabase/server";
import { WorkflowForm } from "@/components/workflows/workflow-form";
import { WorkflowCard } from "@/components/workflows/workflow-card";
import type { WorkflowContext } from "@/orchestrator/types";

export default async function WorkflowsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("workflow_runs")
    .select("id, status, context, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Workflows</h1>
        <p className="text-sm text-foreground/60">
          One click runs the full prospect workup: Audit, SEO, Competitors, Report, Email, Proposal.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <WorkflowForm />
      </div>

      {!rows || rows.length === 0 ? (
        <p className="text-sm text-foreground/40">No workflows yet. Run your first above.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => {
            const c = r.context as unknown as WorkflowContext | null;
            return <WorkflowCard key={r.id} id={r.id} url={c?.url ?? null} status={r.status} createdAt={r.created_at} />;
          })}
        </div>
      )}
    </div>
  );
}

// This page triggers an AI agent via a server action; allow up to Vercel's
// 60s function limit so long Gemini calls are not cut off in production.
export const maxDuration = 60;
