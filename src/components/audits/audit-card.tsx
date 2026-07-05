import Link from "next/link";
import { scoreColor } from "@/lib/score";

export function AuditCard({
  id,
  url,
  overallScore,
  summary,
  createdAt,
}: {
  id: string;
  url: string | null;
  overallScore: number | null;
  summary: string | null;
  createdAt: string;
}) {
  return (
    <Link
      href={`/dashboard/audits/${id}`}
      className="block rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/60"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-sm font-medium">{url ?? "Untitled audit"}</span>
        <span className="shrink-0 text-lg font-bold" style={{ color: scoreColor(overallScore ?? 0) }}>
          {overallScore ?? "—"}
        </span>
      </div>
      {summary && <p className="mt-1 line-clamp-2 text-xs text-foreground/50">{summary}</p>}
      <p className="mt-2 text-[10px] uppercase tracking-wide text-foreground/40">
        {new Date(createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}
