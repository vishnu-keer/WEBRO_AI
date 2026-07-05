# WEBRO AI Marketing OS — Build Roadmap

**The rule:** we build **one phase at a time**. A phase is not "done" until it is
tested and you approve it. Only then do we start the next. No skipping ahead.

**Why this order:** each agent reuses the same core (Runner, tools, telemetry) and
writes to tables that **already exist** from Phase 0, so most phases need *no*
database changes. We finish the money-making agents first, then compose them
(Orchestrator), then polish the Dashboard, then Deploy.

**The shared pattern (every agent phase looks like this):**
`schema.ts` (Zod in/out) → `prompt.ts` → optional `extract.ts` (data gathering) →
`index.ts` (AgentSpec + `registerAgent`) → `run.ts` (service + job handler) →
register in `src/agents/index.ts` → reusable UI in `src/components/<agent>/` →
a page under `src/app/(dashboard)/<agent>/`. Tested via the dashboard + `npm test`.

Status: ✅ done · ⏳ next · ⬜ planned

---

## Phase 1 — Website Audit Agent ✅ (done)

- **Goal:** analyze any URL → UI/UX + conversion audit with scores, issues, quick
  wins, priorities, business impact.
- **Status:** built, statically verified. Test it live per `docs/GETTING_STARTED.md`.

---

## Phase 2 — SEO Agent ⏳ (next)

- **Goal:** analyze a site's on-page + technical SEO and content gaps, and return a
  prioritized, scored SEO report.
- **Files to create:** `src/agents/seo/{schema,prompt,extract,index,run}.ts`;
  `src/components/seo/*` (reuse `score-ring`, `issue-list`, `category-scores`);
  `src/app/(dashboard)/seo/{page,[id]/page}.tsx`; register in `src/agents/index.ts`.
- **Dependencies:** none new (reuses cheerio + Firecrawl + the Runner).
- **APIs required:** Claude, Firecrawl.
- **Database changes:** none — `seo_reports` already exists. (Optional: add `url` +
  `score` columns like we did for audits, for easy listing.)
- **How to test:** run an SEO report on a URL from `/dashboard/seo`; add a unit test
  for the SEO extraction (title/meta/headings/canonical/robots). `npm test`.
- **Expected output:** a saved `seo_reports` row + a report page showing an SEO
  score, technical findings (meta, headings, alt text, canonical, sitemap/robots),
  content-gap suggestions, and prioritized fixes.

---

## Phase 3 — Competitor Research Agent ⬜

- **Goal:** given a lead's site + industry/location, find nearby/again-industry
  competitors and compare positioning, offerings, pricing signals, strengths/weaknesses.
- **Files to create:** `src/agents/competitor-research/{schema,prompt,index,run}.ts`
  (uses the `web_search` + `firecrawl_scrape` tools via the tool-loop);
  `src/components/competitors/*`; `src/app/(dashboard)/competitors/*`.
- **Dependencies:** none new.
- **APIs required:** Claude, Firecrawl (search + scrape).
- **Database changes:** none — `competitors` exists.
- **How to test:** run against a known local business; confirm 3–5 real competitors
  with evidence-based comparisons (no hallucinated names — they must come from search).
- **Expected output:** `competitors` rows + a comparison view (competitor, site,
  strengths, weaknesses, what WEBRO can beat them on).

---

## Phase 4 — Ads Generator Agent ⬜

- **Goal:** generate platform-ready ad copy + A/B variants grounded in the audit and
  WEBRO's voice.
- **Files to create:** `src/agents/ad-copy/{schema,prompt,index,run}.ts`;
  `src/components/ads/*`; `src/app/(dashboard)/ads/*`.
- **Dependencies:** none new.
- **APIs required:** Claude; **Voyage** (RAG over WEBRO voice/portfolio) — set
  `VOYAGE_API_KEY` and run `npm run ingest` first.
- **Database changes:** none — `ad_copy` + `ad_variants` exist.
- **How to test:** generate ads for a lead+platform (e.g. Google/Meta); confirm
  multiple variants with headline/body/CTA and no spammy claims.
- **Expected output:** `ad_copy` + `ad_variants` rows + a UI showing variants side by side.

---

## Phase 5 — Email Campaign Agent ⬜

- **Goal:** design a multi-step, personalized outreach/nurture sequence (trust-first,
  non-spammy) tuned to the lead and the audit findings.
- **Files to create:** `src/agents/email-sequence/{schema,prompt,index,run}.ts`;
  `src/components/emails/*`; `src/app/(dashboard)/emails/*`.
- **Dependencies:** none new.
- **APIs required:** Claude; Voyage (RAG over sales scripts/voice).
- **Database changes:** none — `email_sequences` + `email_steps` exist.
- **How to test:** generate a 3–5 step sequence for a lead; confirm each step has a
  subject, body, and send-delay, and reads human.
- **Expected output:** `email_sequences` + ordered `email_steps` rows + a sequence view.

---

## Phase 6 — Proposal Generator Agent ⬜

- **Goal:** assemble a tailored sales proposal + pricing from the audit + report,
  grounded in WEBRO's portfolio, pricing, and proposal template (RAG).
- **Files to create:** `src/agents/proposal-generator/{schema,prompt,index,run}.ts`;
  `src/components/proposals/*`; `src/app/(dashboard)/proposals/*`;
  optional export to PDF later.
- **Dependencies:** none new (PDF export optional, later).
- **APIs required:** Claude (escalate to a stronger model for high-value deals);
  **Voyage** (RAG is central here — fill in `knowledge-base/` first, then `npm run ingest`).
- **Database changes:** none — `proposals` exists.
- **How to test:** generate a proposal for a lead that already has an audit; confirm
  it cites real pricing/portfolio from the knowledge base (not invented).
- **Expected output:** a `proposals` row + a proposal view following the WEBRO template.

---

## Phase 7 — Marketing Report Agent ⬜

- **Goal:** aggregate prior agent outputs (audit, SEO, competitors) into one polished,
  client-facing marketing report.
- **Files to create:** `src/agents/marketing-report/{schema,prompt,index,run}.ts`;
  `src/components/reports/*`; `src/app/(dashboard)/reports/*`.
- **Dependencies:** none new.
- **APIs required:** Claude (Haiku for cheap assembly + Sonnet for synthesis).
- **Database changes:** none — `reports` exists.
- **How to test:** run for a lead with an audit already saved; confirm it pulls the
  real audit data (not re-crawled) into a cohesive narrative.
- **Expected output:** a `reports` row + a shareable report page.

---

## Phase 8 — Master Orchestrator ⬜

- **Goal:** compose the agents into **workflows** (e.g. *Full Prospect Workup*:
  Audit → Competitor ∥ SEO → Report → Proposal), running steps in dependency order,
  in the background, with live progress.
- **Files to create:** flesh out `src/orchestrator/{workflows,planner,state}.ts`;
  a worker/cron wiring for `/api/jobs/worker`; `src/app/(dashboard)/workflows/*`.
- **Dependencies:** none new (pgmq + Runner already exist).
- **APIs required:** Claude (only if using the optional LLM planner).
- **Database changes:** none — `workflows` + `workflow_runs` + `jobs` exist. (Add a
  cron: Supabase `pg_cron` or Vercel Cron hitting `/api/jobs/worker`.)
- **How to test:** start a workflow for a lead; watch steps complete via Supabase
  Realtime; confirm parallel steps run and dependents wait.
- **Expected output:** a `workflow_runs` row progressing to completion, producing all
  child outputs, shown live on the workflows page.

---

## Phase 9 — Dashboard ⬜

- **Goal:** turn the functional pages into a real operations cockpit — leads pipeline,
  per-lead timeline of all agent outputs, cost/usage from `agent_runs`, search/filter.
- **Files to create:** `src/app/(dashboard)/leads/*` (list + detail timeline);
  a cost/usage view over `agent_runs`; shared table/empty-state components; optionally
  a **live artifact** dashboard.
- **Dependencies:** none required (optional: TanStack Table for data grids).
- **APIs required:** none (reads your own DB).
- **Database changes:** none (optional views/indexes for reporting).
- **How to test:** create a lead, run several agents on it, confirm everything appears
  on the lead's timeline and totals match `agent_runs`.
- **Expected output:** a lead-centric dashboard tying every agent's output together.

---

## Phase 10 — Deployment ⬜

- **Goal:** ship to production safely.
- **Files to create:** production env config; CI (typecheck + lint + test + build);
  cron config for the worker; `vercel.json` if needed.
- **Dependencies:** a Vercel account + a **hosted** Supabase project (move off local
  Docker); domain optional.
- **APIs required:** production keys for Claude, Firecrawl, Voyage.
- **Database changes:** run all migrations on the hosted Supabase (`supabase db push`)
  and enable `pg_cron`/scheduled worker.
- **How to test:** deploy a preview, run one audit end-to-end in production, verify RLS
  (users only see their workspace) and that secrets aren't exposed to the browser.
- **Expected output:** a live URL where signup → run audit works, with monitoring and
  a green CI pipeline.

---

### Definition of Done (every phase)

1. `npm run typecheck` — no TypeScript errors.
2. `npm run lint` — no ESLint errors.
3. `npm run test` — unit tests pass.
4. `npm run build` — production build succeeds.
5. The feature works when you click through it in the browser.
6. You've reviewed and approved it.

Only then do we start the next phase.
