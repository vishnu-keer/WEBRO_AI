import { createClient } from "@/lib/supabase/server";
import { ReportForm } from "@/components/reports/report-form";
import { ReportCard } from "@/components/reports/report-card";

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("reports")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Marketing Reports</h1>
        <p className="text-sm text-foreground/60">
          One client-ready report combining a prospect&apos;s audit, SEO, and competitor findings.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <ReportForm />
      </div>

      {!rows || rows.length === 0 ? (
        <p className="text-sm text-foreground/40">No reports yet. Generate your first above.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <ReportCard key={r.id} id={r.id} title={r.title} createdAt={r.created_at} />
          ))}
        </div>
      )}
    </div>
  );
}

// This page triggers an AI agent via a server action; allow up to Vercel's
// 60s function limit so long Gemini calls are not cut off in production.
export const maxDuration = 60;
