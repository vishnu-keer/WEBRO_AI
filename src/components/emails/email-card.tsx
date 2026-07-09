import Link from "next/link";

export function EmailCard({
  id,
  url,
  goal,
  createdAt,
}: {
  id: string;
  url: string | null;
  goal: string | null;
  createdAt: string;
}) {
  return (
    <Link
      href={`/dashboard/emails/${id}`}
      className="block rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/60"
    >
      <div className="truncate text-sm font-medium">{url ?? "Email sequence"}</div>
      {goal && <p className="mt-1 line-clamp-2 text-xs text-foreground/50">{goal}</p>}
      <p className="mt-2 text-[10px] uppercase tracking-wide text-foreground/40">
        {new Date(createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}
