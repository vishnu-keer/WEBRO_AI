import type { CompetitorAnalysisOutput } from "@/agents/competitor-research/schema";

export function CompetitorReport({
  analysis,
  createdAt,
}: {
  analysis: CompetitorAnalysisOutput;
  createdAt?: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="break-all text-xl font-semibold">{analysis.targetUrl}</h1>
        {createdAt && <p className="text-xs text-foreground/50">{new Date(createdAt).toLocaleString()}</p>}
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">{analysis.targetSummary}</p>
      </header>

      <section className="rounded-xl border border-border bg-muted/30 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">Positioning</h3>
        <p className="text-sm text-foreground/70">{analysis.positioning}</p>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground/60">
          Competitors ({analysis.competitors.length})
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {analysis.competitors.map((c, i) => (
            <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{c.name}</span>
                {c.website && (
                  <a href={c.website} target="_blank" rel="noreferrer" className="truncate text-xs text-accent hover:underline">
                    {c.website}
                  </a>
                )}
              </div>
              <p className="mt-1 text-sm text-foreground/60">{c.summary}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="mb-1 font-semibold text-emerald-400">Strengths</div>
                  <ul className="list-disc pl-4 text-foreground/60">
                    {c.strengths.map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-red-400">Weaknesses</div>
                  <ul className="list-disc pl-4 text-foreground/60">
                    {c.weaknesses.map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-3 text-xs text-foreground/50">
                <span className="text-foreground/70">Website vs prospect:</span> {c.websiteComparison}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">Opportunities to win</h3>
        <ul className="list-disc pl-5 text-sm text-foreground/70">
          {analysis.opportunities.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-accent/40 bg-accent/10 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">WEBRO pitch angle</h3>
        <p className="text-sm text-foreground/80">{analysis.webroPitch}</p>
      </section>
    </div>
  );
}
