import { Progress } from "@/components/ui/progress";
import { scoreColor } from "@/lib/score";

export interface CategoryBarItem {
  label: string;
  score: number;
  summary: string;
  findings: string[];
}

/** Generic category-score bars — reusable across any agent's category breakdown. */
export function CategoryBars({ items }: { items: CategoryBarItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((c) => (
        <div key={c.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium">{c.label}</span>
            <span className="font-semibold" style={{ color: scoreColor(c.score) }}>
              {c.score}
            </span>
          </div>
          <Progress value={c.score} color={scoreColor(c.score)} />
          <p className="mt-1 text-xs text-foreground/60">{c.summary}</p>
          {c.findings?.length > 0 && (
            <ul className="mt-1 list-disc pl-4 text-xs text-foreground/45">
              {c.findings.slice(0, 4).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
