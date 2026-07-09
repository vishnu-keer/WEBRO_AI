import Link from "next/link";

export function AdsCard({
  id,
  platform,
  url,
  createdAt,
}: {
  id: string;
  platform: string | null;
  url: string | null;
  createdAt: string;
}) {
  return (
    <Link
      href={`/dashboard/ads/${id}`}
      className="block rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/60"
    >
      <div className="truncate text-sm font-medium">{url ?? "Ad set"}</div>
      {platform && <p className="mt-1 text-xs text-foreground/50">{platform}</p>}
      <p className="mt-2 text-[10px] uppercase tracking-wide text-foreground/40">
        {new Date(createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}
