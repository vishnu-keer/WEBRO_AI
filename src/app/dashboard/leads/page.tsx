import { createClient } from "@/lib/supabase/server";
import { LeadsForm } from "@/components/leads/leads-form";
import { LeadRow } from "@/components/leads/lead-row";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("id, business_name, website, industry, location, status, notes, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Leads</h1>
        <p className="text-sm text-foreground/60">
          Find local businesses to pitch — then audit and reach out to them.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <LeadsForm />
      </div>

      {!leads || leads.length === 0 ? (
        <p className="text-sm text-foreground/40">No leads yet. Find your first batch above.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {leads.map((l) => (
            <LeadRow
              key={l.id}
              business_name={l.business_name}
              website={l.website}
              industry={l.industry}
              location={l.location}
              status={l.status}
              notes={l.notes}
              created_at={l.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// This page triggers an AI agent via a server action; allow up to Vercel's
// 60s function limit so long Gemini calls are not cut off in production.
export const maxDuration = 60;
