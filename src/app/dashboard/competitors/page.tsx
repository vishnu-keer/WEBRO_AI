import { createClient } from "@/lib/supabase/server";
import { CompetitorForm } from "@/components/competitors/competitor-form";
import { CompetitorCard } from "@/components/competitors/competitor-card";

export default async function CompetitorsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("competitors")
    .select("id, name, website, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Competitor Research</h1>
        <p className="text-sm text-foreground/60">
          Find a prospect&apos;s real competitors and an angle to win them.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <CompetitorForm />
      </div>

      {!rows || rows.length === 0 ? (
        <p className="text-sm text-foreground/40">No competitor research yet. Run your first one above.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <CompetitorCard key={r.id} id={r.id} website={r.website} name={r.name} createdAt={r.created_at} />
          ))}
        </div>
      )}
    </div>
  );
}

// This page triggers an AI agent via a server action; allow up to Vercel's
// 60s function limit so long Gemini calls are not cut off in production.
export const maxDuration = 60;
