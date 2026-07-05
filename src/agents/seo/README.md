# SEO Agent (Phase 2 — built)

Analyzes any website's technical + on-page SEO, structured data, and **AI-search
(AEO) readiness**, and produces a scored, prioritized SEO report.

**Flow:** `crawlAndExtractSeo` (Firecrawl homepage + robots.txt + sitemap.xml) builds
a deterministic snapshot → the shared Runner sends it to Claude with a forced output
schema → we compute the headline `/100` from category weights → saved to `seo_reports`.

| File | Purpose |
|---|---|
| `schema.ts` | Zod input / snapshot / output (9 categories incl. AEO). |
| `prompt.ts` | Senior technical-SEO + AEO auditor prompt. |
| `extract.ts` | Homepage extraction + `parseRobots` (AI-crawler access) + sitemap check. |
| `scoring.ts` | Category weights + deterministic overall + grade. |
| `index.ts` | The `AgentSpec` + snapshot renderer + `registerAgent`. |
| `run.ts` | `runSeoAudit` service + background job handler. |

Trigger via `/dashboard/seo` or the `runSeoAction` server action.
