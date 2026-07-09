import Link from "next/link";
import type { WorkflowContext } from "@/orchestrator/types";

export function WorkflowView({ context, status, createdAt }: { context: WorkflowContext; status: string; createdAt?: string }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h1 className="break-all text-xl font-semibold">Full workup — {context.url}</h1>
        {createdAt && <p className="text-xs text-foreground/50">{new Date(createdAt).toLocaleString()}</p>}
        <p className="mt-1 text-xs capitalize text-foreground/60">{status.replace(/_/g, " ")}</p>
      </header>

      <ol className="flex flex-col gap-3">
        {context.steps.map((s, i) => (
          <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <span
                className="grid h-6 w-6 place-items-center rounded-full text-xs font-bold"
                style={{
                  background: s.status === "done" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  color: s.status === "done" ? "#22c55e" : "#ef4444",
                }}
              >
                {s.status === "done" ? "✓" : "!"}
              </span>
              <div>
                <div className="text-sm font-medium">{s.label}</div>
                {s.status === "error" && <div className="text-xs text-red-400">{s.error}</div>}
              </div>
            </div>
            {s.status === "done" && s.route && (
              <Link href={s.route} className="text-xs text-accent hover:underline">
                View →
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
