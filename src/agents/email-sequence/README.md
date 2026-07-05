# Email Sequence Agent (Phase 5)

**Status:** not implemented yet — placeholder.

Designs a multi-step, personalized outreach/nurture sequence with trust-first, non-spammy messaging.

When built, this folder contains exactly four small files (per the Agent Core contract):

- `index.ts`  — the `AgentSpec` (name, model, input/output schemas, prompt) + `registerAgent`
- `prompt.ts` — the system prompt
- `schema.ts` — Zod input/output types
- `tools.ts`  — (optional) which shared tools it is granted

It plugs into `src/agents/core` (the Runner) — no bespoke Claude/DB/logging code.
