# WEBRO AI Marketing OS

A multi-agent client-acquisition system for WEBRO — finds prospects, audits their
websites, researches competitors, and generates outreach, proposals, and reports.

> **Status: Phase 1.** Foundation is in place and the **Website Audit Agent** is
> live. The other six agent folders under `src/agents/` are documented placeholders.
> See `ARCHITECTURE.md` for the design and `docs/ROADMAP.md` for the build order.

## Stack

- **Next.js 16** (App Router, TypeScript strict) — UI + agent-trigger endpoints
- **Supabase** — Postgres, Auth, Storage, Realtime, `pgvector` (RAG), `pgmq` (jobs)
- **Claude** (`@anthropic-ai/sdk`, Messages API) — the reasoning layer
- **Firecrawl v2** — website scraping / crawling / search
- **Voyage AI** — embeddings for RAG (only needed by later agents)

## Requirements

- **Node.js 20.9 or newer** (Next.js 16 requirement). Check with `node -v`.
- **Docker Desktop** running (the local Supabase database runs in Docker).
- **Supabase CLI** — Mac: `brew install supabase/tap/supabase` (runs the local DB).
- API keys: **Anthropic** and **Firecrawl** (Voyage is optional, for later).

> New to all this? Follow **`docs/GETTING_STARTED.md`** — a zero-assumptions,
> step-by-step guide written for a first-time Next.js user on a Mac.

## Quick start

```bash
npm install                  # install dependencies
cp .env.example .env.local    # then fill in the keys

npm run db:start              # start the local Supabase stack (needs Docker running)
# copy the printed API URL + anon key + service_role key into .env.local

npm run db:reset             # create all tables (runs supabase/migrations)
npm run db:types             # generate precise TypeScript DB types
npm run dev                  # start the app at http://localhost:3000
```

Then sign up, open **Audits**, and run your first website audit.

## Project layout

| Path | What lives here |
|---|---|
| `src/app` | Next.js routes: `(auth)`, `(dashboard)`, and `api/` handlers |
| `src/agents/core` | The reusable **Agent Runner** every agent plugs into |
| `src/agents/website-audit` | The Website Audit Agent (Phase 1) |
| `src/agents/<name>` | Other agents (placeholders until their phase) |
| `src/orchestrator` | Master Orchestrator (workflow composition — later phase) |
| `src/tools` | Reusable agent tools (Firecrawl, RAG, web search, DB) |
| `src/lib` | Thin clients: Supabase, Claude, Firecrawl, RAG, jobs, auth |
| `src/config` | Validated env, model routing, constants |
| `supabase/migrations` | Schema, RLS, pgvector, pgmq |
| `knowledge-base/` | WEBRO source docs → embedded into RAG |
| `scripts/` | Ingestion + codegen utilities |

## Conventions

- Every agent has a Zod **input** and **output** schema — no untyped I/O.
- Claude is only ever called through `src/lib/claude` (swap models in one file).
- Long-running work goes through the **job queue**, never a raw HTTP request.
- Every table has **Row-Level Security** scoped to the workspace.

## Scripts

`dev` · `build` · `start` · `lint` · `format` · `typecheck` · `test` · `test:watch`
· `db:start` · `db:stop` · `db:reset` · `db:types` · `ingest`

> **Reproducible installs:** commit the `package-lock.json` created by your first
> `npm install` — it pins exact dependency versions for everyone.
