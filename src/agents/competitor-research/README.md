# Competitor Research Agent (Phase 3 — built)

Given a prospect's website (+ optional location/industry), it finds their real
competitors and produces sales intelligence for WEBRO.

**Flow (deterministic, provider-agnostic):** `discoverCompetitors` scrapes the
prospect, web-searches for rivals (Firecrawl), and scrapes the top few → the shared
Runner sends everything to the LLM (Gemini or Claude) for a structured comparison →
saved to `public.competitors`.

| File | Purpose |
|---|---|
| `schema.ts` | Zod input/research-context/output. |
| `prompt.ts` | Competitive-analyst prompt (WEBRO sales angle). |
| `discover.ts` | Scrape target + Firecrawl search + scrape competitors. |
| `index.ts` | `AgentSpec` + input renderer + `registerAgent`. |
| `run.ts` | `runCompetitorResearch` service + job handler. |

Trigger via `/dashboard/competitors`.
