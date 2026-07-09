import Link from "next/link";

export function CompetitorCard({
  id,
  website,
  name,
  createdAt,
}: {
  id: string;
  website: string | null;
  name: string | null;
  createdAt: string;
}) {
  return (
    <Link
      href={`/dashboard/competitors/${id}`}
      className="block rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/60"
    >
      <div className="truncate text-sm font-medium">{website ?? name ?? "Analysis"}</div>
      {name && name !== website && <p className="mt-1 truncate text-xs text-foreground/50">{name}</p>}
      <p className="mt-2 text-[10px] uppercase tracking-wide text-foreground/40">
        {new Date(createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}
