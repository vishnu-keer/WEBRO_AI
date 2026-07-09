import Link from "next/link";

export function ProposalCard({
  id,
  title,
  status,
  createdAt,
}: {
  id: string;
  title: string | null;
  status: string | null;
  createdAt: string;
}) {
  return (
    <Link
      href={`/dashboard/proposals/${id}`}
      className="block rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/60"
    >
      <div className="line-clamp-2 text-sm font-medium">{title ?? "Proposal"}</div>
      {status && <p className="mt-1 text-xs capitalize text-foreground/50">{status}</p>}
      <p className="mt-2 text-[10px] uppercase tracking-wide text-foreground/40">
        {new Date(createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}
