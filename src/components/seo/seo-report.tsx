import { ScoreRing } from "@/components/audits/score-ring";
import { IssueList, type IssueItem } from "@/components/audits/issue-list";
import { CategoryBars, type CategoryBarItem } from "@/components/shared/category-bars";
import type { BadgeTone } from "@/components/ui/badge";
import { gradeColor } from "@/lib/score";
import { SEO_CATEGORIES, SEO_CATEGORY_LABELS, type SeoAuditOutput } from "@/agents/seo/schema";

const impactTone = (v: string): BadgeTone => (v === "high" ? "low" : v === "medium" ? "medium" : "neutral");

export function SeoReport({ report, createdAt }: { report: SeoAuditOutput; createdAt?: string }) {
  const bars: CategoryBarItem[] = SEO_CATEGORIES.map((cat) => ({
    label: SEO_CATEGORY_LABELS[cat],
    score: report.categoryScores[cat].score,
    summary: report.categoryScores[cat].summary,
    findings: report.categoryScores[cat].findings,
  }));

  const critical: IssueItem[] = report.criticalIssues.map((i) => ({
    title: i.title,
    description: `${i.description} — Impact: ${i.businessImpact}`,
    badges: [{ label: i.severity, tone: i.severity as BadgeTone }, { label: i.category, tone: "neutral" }],
  }));
  const wins: IssueItem[] = report.quickWins.map((i) => ({
    title: i.title,
    description: i.description,
    badges: [{ label: `impact ${i.impact}`, tone: impactTone(i.impact) }, { label: `effort ${i.effort}`, tone: "neutral" }],
  }));
  const priorities: IssueItem[] = [...report.priorityImprovements]
    .sort((a, b) => a.priority - b.priority)
    .map((i) => ({
      title: `P${i.priority} · ${i.title}`,
      description: `${i.description} → Expected: ${i.expectedOutcome}`,
      badges: [{ label: i.category, tone: "neutral" }],
    }));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="break-all text-xl font-semibold">{report.url}</h1>
          {createdAt && <p className="text-xs text-foreground/50">{new Date(createdAt).toLocaleString()}</p>}
          <p className="mt-2 max-w-2xl text-sm text-foreground/70">{report.summary}</p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <ScoreRing score={report.overallScore} />
          <div className="text-center">
            <div className="text-5xl font-bold leading-none" style={{ color: gradeColor(report.grade) }}>
              {report.grade}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wide text-foreground/40">SEO grade</div>
          </div>
        </div>
      </header>

      {report.detectedSchemaTypes?.length > 0 && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">Structured data found</h3>
          <ul className="flex flex-wrap gap-2">
            {report.detectedSchemaTypes.map((t, i) => (
              <li key={i} className="rounded-full border border-border bg-accent/10 px-3 py-1 text-xs text-foreground/80">{t}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground/60">Category scores</h3>
          <CategoryBars items={bars} />
        </div>
        <div className="flex flex-col gap-6">
          <IssueList title="Critical issues" items={critical} empty="No critical issues found." />
          <IssueList title="Quick wins" items={wins} empty="No quick wins identified." />
        </div>
      </section>

      <IssueList title="Priority improvements" items={priorities} />

      <section className="rounded-xl border border-border bg-muted/30 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">Business impact</h3>
        <p className="text-sm text-foreground/70">{report.businessImpact.summary}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-foreground/40">Potential traffic lift</div>
            <div className="text-sm text-foreground/80">{report.businessImpact.potentialTrafficLift}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-foreground/40">Risk if ignored</div>
            <div className="text-sm text-foreground/80">{report.businessImpact.riskIfIgnored}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
