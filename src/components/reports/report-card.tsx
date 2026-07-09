import Link from "next/link";

export function ReportCard({
  id,
  title,
  createdAt,
}: {
  id: string;
  title: string | null;
  createdAt: string;
}) {
  return (
    <Link
      href={`/dashboard/reports/${id}`}
      className="block rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/60"
    >
      <div className="line-clamp-2 text-sm font-medium">{title ?? "Marketing report"}</div>
      <p className="mt-2 text-[10px] uppercase tracking-wide text-foreground/40">
        {new Date(createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}
