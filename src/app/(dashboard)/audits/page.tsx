import { createClient } from "@/lib/supabase/server";
import { AuditForm } from "@/components/audits/audit-form";
import { AuditCard } from "@/components/audits/audit-card";

export default async function AuditsPage() {
  const supabase = await createClient();
  const { data: audits } = await supabase
    .from("audits")
    .select("id, url, overall_score, summary, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Website Audits</h1>
        <p className="text-sm text-foreground/60">Analyze any website's UI/UX and conversion readiness.</p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <AuditForm />
      </div>

      {!audits || audits.length === 0 ? (
        <p className="text-sm text-foreground/40">No audits yet. Run your first one above.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {audits.map((a) => (
            <AuditCard
              key={a.id}
              id={a.id}
              url={a.url}
              overallScore={a.overall_score}
              summary={a.summary}
              createdAt={a.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
