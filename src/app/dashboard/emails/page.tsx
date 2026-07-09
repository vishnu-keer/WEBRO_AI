import { createClient } from "@/lib/supabase/server";
import { EmailForm } from "@/components/emails/email-form";
import { EmailCard } from "@/components/emails/email-card";
import type { EmailSequenceOutput } from "@/agents/email-sequence/schema";

export default async function EmailsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("email_sequences")
    .select("id, goal, data, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Email Campaigns</h1>
        <p className="text-sm text-foreground/60">A multi-step outreach sequence to win a prospect — human, trust-first.</p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <EmailForm />
      </div>

      {!rows || rows.length === 0 ? (
        <p className="text-sm text-foreground/40">No email sequences yet. Write your first above.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => {
            const d = r.data as unknown as EmailSequenceOutput | null;
            return <EmailCard key={r.id} id={r.id} url={d?.url ?? null} goal={r.goal} createdAt={r.created_at} />;
          })}
        </div>
      )}
    </div>
  );
}

// This page triggers an AI agent via a server action; allow up to Vercel's
// 60s function limit so long Gemini calls are not cut off in production.
export const maxDuration = 60;
