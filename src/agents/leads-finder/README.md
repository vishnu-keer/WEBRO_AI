# Leads Finder Agent (built)

Finds local businesses to pitch. Given a business type + location, it web-searches
(Firecrawl), the LLM turns the results into distinct real businesses (flagging weak/no
websites), and they're saved to `public.leads` (deduped by website).

| File | Purpose |
|---|---|
| `schema.ts` | Zod input/output. |
| `prompt.ts` | Lead-research prompt (exclude directories; prioritize weak/no sites). |
| `discover.ts` | Firecrawl web search. |
| `index.ts` | `AgentSpec` + input renderer + `registerAgent`. |
| `run.ts` | `runLeadsFinder` service (insert deduped leads) + job handler. |

Trigger via `/dashboard/leads`.
