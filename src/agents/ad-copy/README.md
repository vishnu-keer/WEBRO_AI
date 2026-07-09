# Ads Generator Agent (Phase 4 — built)

Generates platform-ready ad copy + A/B variants for a business, grounded in that
business's own website (no RAG / Voyage key needed — works with Gemini or Claude).

**Flow:** `gatherBusiness` scrapes the site → the shared Runner sends it to the LLM
with the chosen platform + objective → structured ad set (variants, keywords,
targeting tips) → saved to `public.ad_copy`.

| File | Purpose |
|---|---|
| `schema.ts` | Zod input/output (variants, keywords, targeting). |
| `prompt.ts` | Performance-marketer/copywriter prompt. |
| `gather.ts` | Scrape the client's website. |
| `index.ts` | `AgentSpec` + input renderer + `registerAgent`. |
| `run.ts` | `runAdsGenerator` service + job handler. |

Trigger via `/dashboard/ads`.
