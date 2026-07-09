import type { AdsOutput } from "@/agents/ad-copy/schema";

export function AdsReport({ ads, createdAt }: { ads: AdsOutput; createdAt?: string }) {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="break-all text-xl font-semibold">{ads.url}</h1>
        {createdAt && <p className="text-xs text-foreground/50">{new Date(createdAt).toLocaleString()}</p>}
        <p className="mt-2 text-sm text-foreground/70">{ads.business}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-border bg-muted px-2 py-0.5">{ads.platform}</span>
          <span className="rounded-full border border-border bg-muted px-2 py-0.5">{ads.objective}</span>
        </div>
      </header>

      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground/60">
          Ad variants ({ads.variants.length})
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {ads.variants.map((v, i) => (
            <div key={i} className="flex flex-col rounded-lg border border-border bg-muted/30 p-4">
              <div className="mb-2 inline-flex w-fit rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent">
                {v.angle}
              </div>
              <div className="text-sm font-semibold">{v.headline}</div>
              <p className="mt-1 flex-1 text-sm text-foreground/70">{v.primaryText}</p>
              <div className="mt-3 inline-flex w-fit rounded-md bg-accent px-3 py-1 text-xs font-medium text-white">
                {v.cta}
              </div>
            </div>
          ))}
        </div>
      </section>

      {ads.keywords?.length > 0 && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">Suggested keywords</h3>
          <ul className="flex flex-wrap gap-2">
            {ads.keywords.map((k, i) => (
              <li key={i} className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground/70">
                {k}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-border bg-muted/30 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">Targeting tips</h3>
        <p className="text-sm text-foreground/70">{ads.targetingTips}</p>
      </section>
    </div>
  );
}
