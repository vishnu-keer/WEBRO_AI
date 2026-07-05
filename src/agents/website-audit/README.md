# Website Audit Agent (Phase 1 — built)

Analyzes any website and produces a professional UI/UX + conversion audit.

**Flow:** `crawlAndExtract` (Firecrawl + cheerio) builds a deterministic snapshot →
the shared Runner sends it to Claude with a forced output schema → we compute the
headline `/100` deterministically from category weights → the audit is saved to
`public.audits`.

| File | Purpose |
|---|---|
| `schema.ts` | Zod input / snapshot / output types (9 categories, issues, quick wins, priorities, business impact). |
| `prompt.ts` | The senior UI/UX + CRO auditor system prompt. |
| `extract.ts` | Crawl + `extractFromHtml` (pure, unit-tested). |
| `scoring.ts` | Category weights + deterministic overall score + grade. |
| `index.ts` | The `AgentSpec` + snapshot renderer + `registerAgent`. |
| `run.ts` | `runWebsiteAudit` service + background job handler. |

Trigger it via the dashboard (`/dashboard/audits`) or the `runAuditAction` server action.
