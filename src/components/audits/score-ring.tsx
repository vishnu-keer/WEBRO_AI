import { scoreColor } from "@/lib/score";

/** Circular /100 score gauge. Pure SVG — server-renderable, reusable. */
export function ScoreRing({ score, size = 140, label }: { score: number; size?: number; label?: string }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const dash = (pct / 100) * c;
  const color = scoreColor(score);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Score ${Math.round(score)} out of 100`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.28} fontWeight="700" fill="var(--foreground)">
        {Math.round(score)}
      </text>
      <text x="50%" y="66%" textAnchor="middle" fontSize={size * 0.1} fill="var(--foreground)" opacity="0.6">
        {label ?? "/100"}
      </text>
    </svg>
  );
}
