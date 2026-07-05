import Link from "next/link";
import { scoreColor } from "@/lib/score";

export function SeoCard({
  id, url, score, summary, createdAt,
}: {
  id: string; url: string | null; score: number | null; summary: string | null; createdAt: string;
}) {
  return (
    <Link href={`/dashboard/seo/${id}`} className="block rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/60">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-sm font-medium">{url ?? "Untitled report"}</span>
        <span className="shrink-0 text-lg font-bold" style={{ color: scoreColor(score ?? 0) }}>{score ?? "—"}</span>
      </div>
      {summary && <p className="mt-1 line-clamp-2 text-xs text-foreground/50">{summary}</p>}
      <p className="mt-2 text-[10px] uppercase tracking-wide text-foreground/40">{new Date(createdAt).toLocaleDateString()}</p>
    </Link>
  );
}
