import Link from "next/link";

export function WorkflowCard({
  id,
  url,
  status,
  createdAt,
}: {
  id: string;
  url: string | null;
  status: string | null;
  createdAt: string;
}) {
  return (
    <Link
      href={`/dashboard/workflows/${id}`}
      className="block rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/60"
    >
      <div className="truncate text-sm font-medium">{url ?? "Workflow"}</div>
      {status && <p className="mt-1 text-xs capitalize text-foreground/50">{status.replace(/_/g, " ")}</p>}
      <p className="mt-2 text-[10px] uppercase tracking-wide text-foreground/40">
        {new Date(createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}
