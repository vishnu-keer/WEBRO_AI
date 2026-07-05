# Phase 0 — File Map

Every file created in Phase 0, with its purpose. Grouped by area.
(No agents — the 7 folders under `src/agents/` hold README placeholders only.)

## Root config & tooling
| File | Purpose |
|---|---|
| `package.json` | Deps + scripts (`dev`, `build`, `test`, `db:types`, `ingest`…). |
| `tsconfig.json` | TypeScript strict config + `@/*` path alias. |
| `next.config.ts` | Next.js 16 config (Server Actions limit; typedRoutes off in Phase 0). |
| `eslint.config.mjs` | Flat ESLint config (Next 16). |
| `.prettierrc` | Formatting rules. |
| `postcss.config.mjs` | Tailwind v4 PostCSS plugin. |
| `components.json` | shadcn/ui config (aliases, base color). |
| `vitest.config.ts` | Test runner + `@` alias. |
| `.env.example` | All env var names (copy to `.env.local`). |
| `.gitignore` | Ignore node_modules, .next, env, Supabase temp. |
| `README.md` | Project overview + setup steps. |

## Configuration (`src/config`)
| File | Purpose |
|---|---|
| `env.ts` | Zod-validated env — `publicEnv` (client) + `serverEnv()` (secrets, server-only). |
| `models.ts` | Model routing by role + pricing + `estimateCostUsd`. |
| `constants.ts` | Queue name, RAG namespaces, crawl cap, lead statuses. |

## Library clients (`src/lib`)
| File | Purpose |
|---|---|
| `supabase/client.ts` | Browser Supabase client. |
| `supabase/server.ts` | Server client (async cookies, Next 16). |
| `supabase/admin.ts` | Service-role client (bypasses RLS; server-only). |
| `supabase/middleware.ts` | Session-refresh helper used by `proxy.ts`. |
| `claude/client.ts` | The single Anthropic entry point (lazy). |
| `claude/tool-use.ts` | `generateObject` (typed output) + `runToolLoop` (agentic loop). |
| `firecrawl/client.ts` | Firecrawl v2 wrappers: scrape / crawl / startCrawl / status / search. |
| `rag/embed.ts` | Embeddings (Voyage AI via REST); `EMBEDDING_DIM` must match DB. |
| `rag/ingest.ts` | Chunk → embed → upsert into documents/document_chunks. |
| `rag/retrieve.ts` | pgvector similarity search via `match_document_chunks`. |
| `jobs/types.ts` | Job + queue-message types. |
| `jobs/queue.ts` | pgmq wrappers: enqueue / read / ack. |
| `jobs/worker.ts` | Queue drainer + handler registry (empty in Phase 0). |
| `utils.ts` | `cn()` Tailwind class merger. |

## Agent Core (`src/agents/core`) — the reusable Runner
| File | Purpose |
|---|---|
| `types.ts` | `AgentSpec`, `AgentContext`, `AgentRunResult` — the agent contract. |
| `runner.ts` | `runAgent()` — validate → RAG → Claude → validate → log → return. |
| `registry.ts` | Register/look-up agents by name (empty until Phase 1). |
| `telemetry.ts` | Records every run to `agent_runs` (tokens, cost, latency). |
| `index.ts` | Public barrel for the core. |

## Tools (`src/tools`) — reusable agent capabilities
| File | Purpose |
|---|---|
| `types.ts` | `Tool` + `ToolContext` interfaces. |
| `registry.ts` | Register tools + bridge to Claude tool-use. |
| `firecrawl-scrape.ts` | Tool: scrape one URL. |
| `firecrawl-crawl.ts` | Tool: crawl a site (bounded). |
| `web-search.ts` | Tool: web search (Firecrawl search). |
| `rag-retrieve.ts` | Tool: retrieve WEBRO knowledge. |
| `db-write.ts` | Tool: safe `append_lead_note` (no generic DB writes — see note in file). |
| `index.ts` | Registers all tools + barrel. |

## Orchestrator (`src/orchestrator`) — Phase 8 placeholder
| File | Purpose |
|---|---|
| `types.ts` | `WorkflowDefinition` / `WorkflowStep`. |
| `index.ts` | Placeholder surface (engine ships in Phase 8). |
| `README.md` | Why it's built last + what it will do. |

## App (`src/app`) — Next.js App Router
| File | Purpose |
|---|---|
| `layout.tsx` | Root layout + Providers. |
| `providers.tsx` | TanStack Query provider (client). |
| `globals.css` | Tailwind v4 + theme tokens. |
| `page.tsx` | Redirect to /dashboard or /login. |
| `(auth)/login/page.tsx` | Email/password auth form. |
| `(auth)/auth/callback/route.ts` | OAuth/magic-link code exchange. |
| `(dashboard)/layout.tsx` | Auth-gated shell + sidebar. |
| `(dashboard)/page.tsx` | Phase 0 status home. |
| `api/health/route.ts` | Liveness + config check. |
| `api/jobs/worker/route.ts` | Cron-triggered queue drainer. |
| `api/webhooks/firecrawl/route.ts` | Async-crawl webhook (placeholder). |
| `src/proxy.ts` | Next 16 proxy → Supabase session refresh. |

## UI (`src/components`)
| File | Purpose |
|---|---|
| `ui/button.tsx` | CVA button primitive. |
| `ui/card.tsx` | Card primitives. |
| `shared/sidebar.tsx` | Dashboard nav. |
| `leads|agents|workflows/.gitkeep` | Reserved for later-phase UI. |

## Types (`src/types`)
| File | Purpose |
|---|---|
| `database.ts` | Placeholder DB types (regenerate with `npm run db:types`). |
| `index.ts` | Shared domain types (Lead, LeadStatus). |

## Database (`supabase`)
| File | Purpose |
|---|---|
| `config.toml` | Local Supabase config. |
| `migrations/0001_init.sql` | Extensions, workspaces, profiles, signup trigger, tenancy RLS. |
| `migrations/0002_leads_and_outputs.sql` | Leads + all per-agent output tables. |
| `migrations/0003_agents_rag_jobs.sql` | agent_runs, workflows, RAG store + match fn, pgmq wrappers, RLS + updated_at. |
| `seed.sql` | Seed notes (workspaces auto-create on signup). |

## Knowledge base (`knowledge-base`) — RAG source docs (fill these in)
`company_info.md` · `portfolio.md` · `pricing.md` · `proposal_template.md` · `sales_scripts.md`

## Scripts & tests
| File | Purpose |
|---|---|
| `scripts/ingest-knowledge.ts` | Ingest knowledge-base → pgvector. |
| `scripts/gen-db-types.sh` | Regenerate DB types. |
| `tests/unit/utils.test.ts` | `cn()` test. |
| `tests/unit/models.test.ts` | `estimateCostUsd()` test. |

## Docs
| File | Purpose |
|---|---|
| `ARCHITECTURE.md` | The approved system design. |
| `docs/FILE_MAP.md` | This file. |

---

# Phase 1 — Website Audit Agent

## Agent (`src/agents/website-audit`)
| File | Purpose |
|---|---|
| `schema.ts` | Zod input / snapshot / output (9 categories, issues, quick wins, priorities, business impact) + category labels. |
| `prompt.ts` | Senior UI/UX + CRO auditor system prompt. |
| `extract.ts` | `crawlAndExtract` (Firecrawl, lazy) + pure `extractFromHtml` (cheerio) → `WebsiteSnapshot`. |
| `scoring.ts` | Category weights + deterministic `computeOverallScore` + `toGrade`. |
| `index.ts` | The `AgentSpec` + snapshot renderer + `registerAgent`. |
| `run.ts` | `runWebsiteAudit` service (crawl → Runner → score → persist) + background job handler. |
| `README.md` | Agent docs (now "built"). |
| `src/agents/index.ts` | Agent bootstrap — imports all agents so they register. |

## Supporting lib
| File | Purpose |
|---|---|
| `src/lib/auth/context.ts` | `getWorkspaceContext()` — authed user → AgentContext (reused by all agents). |
| `src/lib/score.ts` | `scoreColor` / `gradeColor` shared by audit UI. |

## Server action & UI
| File | Purpose |
|---|---|
| `src/server/actions/audit.ts` | `runAuditAction` server action (validate → run → redirect). |
| `src/app/(dashboard)/audits/page.tsx` | Audits list + run form. |
| `src/app/(dashboard)/audits/[id]/page.tsx` | Audit detail (async params). |
| `src/components/audits/audit-form.tsx` | URL form (client, `useActionState`). |
| `src/components/audits/audit-report.tsx` | Full report, composed from reusable parts. |
| `src/components/audits/category-scores.tsx` | Nine category bars + findings. |
| `src/components/audits/issue-list.tsx` | Reusable issue/win/priority list. |
| `src/components/audits/score-ring.tsx` | SVG /100 gauge. |
| `src/components/audits/audit-card.tsx` | List item. |
| `src/components/ui/badge.tsx` · `progress.tsx` | Primitives. |

## Database
| File | Purpose |
|---|---|
| `supabase/migrations/0004_audit_columns.sql` | `url` + `overall_score` columns + list index on `audits`. |

## Tests
| File | Purpose |
|---|---|
| `tests/unit/audit-scoring.test.ts` | Weights sum to 1, overall + grade. |
| `tests/unit/audit-extract.test.ts` | `extractFromHtml` against fixture HTML. |

---

# Phase 2 — SEO Agent

## Agent (`src/agents/seo`)
| File | Purpose |
|---|---|
| `schema.ts` | Zod input/snapshot/output — 9 categories incl. AI-search (AEO) readiness. |
| `prompt.ts` | Senior technical-SEO + AEO auditor prompt. |
| `extract.ts` | Homepage extraction (cheerio) + `parseRobots` (AI-crawler access) + sitemap check. |
| `scoring.ts` | Category weights + deterministic overall + grade. |
| `index.ts` | `AgentSpec` + snapshot renderer + `registerAgent`. |
| `run.ts` | `runSeoAudit` service + background job handler. |

## UI + server
| File | Purpose |
|---|---|
| `src/components/shared/category-bars.tsx` | Generic category-score bars (reusable across agents). |
| `src/components/seo/seo-report.tsx` | Full SEO report (reuses ScoreRing + IssueList + CategoryBars). |
| `src/components/seo/seo-form.tsx` · `seo-card.tsx` | Run form + list card. |
| `src/server/actions/seo.ts` | `runSeoAction` server action. |
| `src/app/(dashboard)/seo/page.tsx` · `[id]/page.tsx` | List + detail pages. |

## Database + tests
| File | Purpose |
|---|---|
| `supabase/migrations/0005_seo_columns.sql` | `url` + `summary` columns + index on `seo_reports`. |
| `tests/unit/seo-scoring.test.ts` · `seo-extract.test.ts` | Scoring + extractor/parseRobots tests. |
