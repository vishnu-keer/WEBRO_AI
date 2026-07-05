import { createClient } from "@/lib/supabase/server";
import { SeoForm } from "@/components/seo/seo-form";
import { SeoCard } from "@/components/seo/seo-card";

export default async function SeoPage() {
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("seo_reports")
    .select("id, score, data, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">SEO Audits</h1>
        <p className="text-sm text-foreground/60">
          Technical + on-page + structured data + AI-search (AEO) readiness.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <SeoForm />
      </div>

      {!reports || reports.length === 0 ? (
        <p className="text-sm text-foreground/40">No SEO audits yet. Run your first one above.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => {
            const d = r.data as unknown as { url?: string; summary?: string } | null;
            return (
              <SeoCard key={r.id} id={r.id} url={d?.url ?? null} score={r.score} summary={d?.summary ?? null} createdAt={r.created_at} />
            );
          })}
        </div>
      )}
    </div>
  );
}
