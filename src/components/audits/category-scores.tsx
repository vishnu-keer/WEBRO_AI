import { AUDIT_CATEGORIES, CATEGORY_LABELS, type WebsiteAuditOutput } from "@/agents/website-audit/schema";
import { Progress } from "@/components/ui/progress";
import { scoreColor } from "@/lib/score";

/** Renders all nine category scores with bars, summaries, and findings. */
export function CategoryScores({ scores }: { scores: WebsiteAuditOutput["categoryScores"] }) {
  return (
    <div className="flex flex-col gap-4">
      {AUDIT_CATEGORIES.map((cat) => {
        const c = scores[cat];
        return (
          <div key={cat}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">{CATEGORY_LABELS[cat]}</span>
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
        );
      })}
    </div>
  );
}
