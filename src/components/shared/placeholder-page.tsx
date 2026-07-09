/** A clean, styled starter page for sections not yet built (no more 404s). */
export function PlaceholderPage({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase?: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-foreground/60">{description}</p>
      </div>
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
        <p className="text-sm text-foreground/70">This section is scaffolded and wired up.</p>
        {phase && (
          <p className="mt-2 text-xs text-foreground/40">Full functionality arrives in {phase}.</p>
        )}
      </div>
    </div>
  );
}
