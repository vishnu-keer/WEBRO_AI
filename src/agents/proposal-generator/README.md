# Proposal Generator Agent (Phase 6)

**Status:** not implemented yet — placeholder.

Assembles a tailored sales proposal + pricing using RAG over WEBRO's portfolio, pricing, and proposal template.

When built, this folder contains exactly four small files (per the Agent Core contract):

- `index.ts`  — the `AgentSpec` (name, model, input/output schemas, prompt) + `registerAgent`
- `prompt.ts` — the system prompt
- `schema.ts` — Zod input/output types
- `tools.ts`  — (optional) which shared tools it is granted

It plugs into `src/agents/core` (the Runner) — no bespoke Claude/DB/logging code.
