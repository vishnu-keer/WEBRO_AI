# Master Orchestrator (Phase 8 — built)

One-click **Full Prospect Workup**: runs Audit -> SEO -> Competitors -> Marketing
Report -> Email -> Proposal for a single prospect URL, in dependency order, and saves
a `workflow_runs` row with each step's status + a link to its output.

- `run.ts` — `runFullWorkup(req, ctx)` runs the sequence (each step isolated).
- `types.ts` — step-result + context types.

Synchronous today (works on localhost). Production can move it onto the background
job queue in `src/lib/jobs`. Trigger via `/dashboard/workflows`.
