import Link from "next/link";

export function StatCard({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: string | number;
  href?: string;
  accent?: boolean;
}) {
  const inner = (
    <div
      className={`rounded-xl border border-border p-4 transition-colors ${
        href ? "hover:bg-muted/60" : ""
      } ${accent ? "bg-accent/10" : "bg-muted/40"}`}
    >
      <div className="text-2xl font-bold" style={accent ? { color: "var(--accent)" } : undefined}>
        {value}
      </div>
      <div className="mt-1 text-xs text-foreground/60">{label}</div>
    </div>
  );
  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}
