import type { ProposalOutput } from "@/agents/proposal-generator/schema";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">{title}</h3>
      {children}
    </section>
  );
}

export function ProposalReport({ proposal, createdAt }: { proposal: ProposalOutput; createdAt?: string }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <header>
        <p className="text-xs uppercase tracking-wide text-foreground/40">Proposal for {proposal.clientName}</p>
        <h1 className="mt-1 text-2xl font-semibold">{proposal.title}</h1>
        {createdAt && <p className="mt-1 text-xs text-foreground/50">{new Date(createdAt).toLocaleString()}</p>}
      </header>

      <Section title="Understanding">
        <p className="text-sm text-foreground/70">{proposal.understanding}</p>
      </Section>

      <Section title="What we found">
        <ul className="list-disc pl-5 text-sm text-foreground/70">
          {proposal.findings.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </Section>

      <Section title="Our solution">
        <p className="text-sm text-foreground/70">{proposal.solution}</p>
      </Section>

      <Section title="Deliverables">
        <ul className="list-disc pl-5 text-sm text-foreground/70">
          {proposal.deliverables.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </Section>

      <Section title="Timeline">
        <div className="flex flex-col gap-1 text-sm text-foreground/70">
          {proposal.timeline.map((t, i) => (
            <div key={i} className="flex justify-between border-b border-border/60 py-1">
              <span>{t.phase}</span>
              <span className="text-foreground/50">{t.duration}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Investment">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex flex-col gap-1 text-sm">
            {proposal.pricing.map((p, i) => (
              <div key={i} className="flex justify-between border-b border-border/60 py-1">
                <span className="text-foreground/70">{p.item}</span>
                <span className="font-medium">{p.price}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-foreground/50">{proposal.investmentNote}</p>
        </div>
      </Section>

      <Section title="Why WEBRO">
        <p className="text-sm text-foreground/70">{proposal.proof}</p>
      </Section>

      <section className="rounded-xl border border-accent/40 bg-accent/10 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">Next step</h3>
        <p className="text-sm text-foreground/80">{proposal.nextStep}</p>
      </section>
    </div>
  );
}
