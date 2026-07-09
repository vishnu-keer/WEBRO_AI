import { createClient } from "@/lib/supabase/server";
import { ProposalForm } from "@/components/proposals/proposal-form";
import { ProposalCard } from "@/components/proposals/proposal-card";

export default async function ProposalsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("proposals")
    .select("id, title, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Proposals</h1>
        <p className="text-sm text-foreground/60">
          AI-generated sales proposals, personalized from a prospect&apos;s site + your knowledge base.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <ProposalForm />
      </div>

      {!rows || rows.length === 0 ? (
        <p className="text-sm text-foreground/40">No proposals yet. Generate your first above.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <ProposalCard key={r.id} id={r.id} title={r.title} status={r.status} createdAt={r.created_at} />
          ))}
        </div>
      )}
    </div>
  );
}

// This page triggers an AI agent via a server action; allow up to Vercel's
// 60s function limit so long Gemini calls are not cut off in production.
export const maxDuration = 60;
