# Email Campaign Agent (Phase 5 — built)

Writes a multi-step outreach sequence from WEBRO to a prospect (human, trust-first,
non-spammy), personalized from the prospect's own website.

**Flow:** `gatherBusiness` scrapes the prospect → the shared Runner sends it to the
LLM with the goal → a 4-5 email sequence (subject, body, delay, purpose) → saved to
`public.email_sequences`.

| File | Purpose |
|---|---|
| `schema.ts` | Zod input/output (steps with subject/body/delay/purpose). |
| `prompt.ts` | Trust-first outreach copywriter prompt (WEBRO voice). |
| `gather.ts` | Scrape the prospect's website. |
| `index.ts` | `AgentSpec` + input renderer + `registerAgent`. |
| `run.ts` | `runEmailCampaign` service + job handler. |

Trigger via `/dashboard/emails`.
