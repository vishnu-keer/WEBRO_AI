export interface LeadRowProps {
  business_name: string;
  website: string | null;
  industry: string | null;
  location: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
}

export function LeadRow(lead: LeadRowProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">{lead.business_name}</span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-foreground/50">
          {lead.status ?? "new"}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground/50">
        {lead.website ? (
          <a href={lead.website} target="_blank" rel="noreferrer" className="text-accent hover:underline">
            {lead.website}
          </a>
        ) : (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300">No website — prime lead</span>
        )}
        {lead.location && <span>{lead.location}</span>}
        {lead.industry && <span>· {lead.industry}</span>}
      </div>
      {lead.notes && <p className="mt-1 text-xs text-foreground/50">{lead.notes}</p>}
    </div>
  );
}
