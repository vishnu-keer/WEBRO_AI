import { Badge, type BadgeTone } from "@/components/ui/badge";

export interface IssueItem {
  title: string;
  description: string;
  badges?: { label: string; tone?: BadgeTone }[];
}

/** Reusable list for critical issues, quick wins, and priority improvements. */
export function IssueList({ title, items, empty }: { title: string; items: IssueItem[]; empty?: string }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground/60">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-foreground/40">{empty ?? "None."}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((it, i) => (
            <li key={i} className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{it.title}</span>
                {it.badges?.map((b, j) => (
                  <Badge key={j} tone={b.tone}>
                    {b.label}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-foreground/60">{it.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
