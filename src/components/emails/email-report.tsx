import type { EmailSequenceOutput } from "@/agents/email-sequence/schema";

export function EmailReport({ sequence, createdAt }: { sequence: EmailSequenceOutput; createdAt?: string }) {
  const steps = [...sequence.steps].sort((a, b) => a.stepNumber - b.stepNumber);
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="break-all text-xl font-semibold">{sequence.url}</h1>
        {createdAt && <p className="text-xs text-foreground/50">{new Date(createdAt).toLocaleString()}</p>}
        <p className="mt-2 text-sm text-foreground/70">{sequence.business}</p>
        <p className="mt-1 text-xs text-foreground/50">Goal: {sequence.goal}</p>
      </header>

      <section className="flex flex-col gap-4">
        {steps.map((s, i) => (
          <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-accent/15 px-2 py-0.5 font-medium text-accent">Email {s.stepNumber}</span>
              <span className="text-foreground/50">
                {s.delayDays === 0 ? "Send immediately" : `Wait ${s.delayDays} day${s.delayDays === 1 ? "" : "s"}`}
              </span>
              <span className="rounded-full border border-border px-2 py-0.5 text-foreground/60">{s.purpose}</span>
            </div>
            <div className="text-sm font-semibold">Subject: {s.subject}</div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/70">{s.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
