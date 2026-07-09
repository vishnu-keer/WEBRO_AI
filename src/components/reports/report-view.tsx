import type { MarketingReportOutput } from "@/agents/marketing-report/schema";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">{title}</h3>
      {children}
    </section>
  );
}

export function ReportView({ report, createdAt }: { report: MarketingReportOutput; createdAt?: string }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <header>
        <p className="text-xs uppercase tracking-wide text-foreground/40">Marketing report — {report.clientName}</p>
        <h1 className="mt-1 text-2xl font-semibold">{report.title}</h1>
        {createdAt && <p className="mt-1 text-xs text-foreground/50">{new Date(createdAt).toLocaleString()}</p>}
      </header>

      <section className="rounded-xl border border-border bg-muted/30 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">Executive summary</h3>
        <p className="text-sm text-foreground/80">{report.executiveSummary}</p>
      </section>

      <Section title="Current state">
        <p className="text-sm text-foreground/70">{report.currentState}</p>
      </Section>

      <Section title="Key findings">
        <div className="flex flex-col gap-3">
          {report.keyFindings.map((f, i) => (
            <div key={i} className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="text-xs font-semibold text-accent">{f.area}</div>
              <p className="mt-1 text-sm text-foreground/70">{f.finding}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Priorities">
        <ol className="flex flex-col gap-3">
          {report.priorities.map((p, i) => (
            <li key={i} className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="text-sm font-medium">
                {i + 1}. {p.title}
              </div>
              <p className="mt-1 text-sm text-foreground/60">{p.why}</p>
              <p className="mt-1 text-xs text-foreground/50">Impact: {p.impact}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Expected impact">
        <p className="text-sm text-foreground/70">{report.expectedImpact}</p>
      </Section>

      <section className="rounded-xl border border-accent/40 bg-accent/10 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">Recommendation</h3>
        <p className="text-sm text-foreground/80">{report.recommendation}</p>
      </section>
    </div>
  );
}
