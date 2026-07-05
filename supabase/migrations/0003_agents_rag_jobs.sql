-- 0003_agents_rag_jobs.sql — observability, orchestration, RAG store, job queue,
-- and the RLS + updated_at wiring for all business tables.

-- Observability -------------------------------------------------------------
create table public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  workflow_run_id uuid,
  agent text not null,
  version text,
  model text,
  input jsonb,
  output jsonb,
  input_tokens int default 0,
  output_tokens int default 0,
  cost_usd numeric(10,5) default 0,
  status text not null default 'success',
  error text,
  duration_ms int,
  created_at timestamptz not null default now()
);

-- Orchestration -------------------------------------------------------------
create table public.workflows (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  definition jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  workflow_id uuid references public.workflows(id) on delete set null,
  lead_id uuid references public.leads(id) on delete cascade,
  status text not null default 'pending',
  context jsonb not null default '{}',
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

-- RAG store -----------------------------------------------------------------
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  namespace text not null,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, namespace, title)
);

create table public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  namespace text not null,
  content text not null,
  embedding vector(1024) not null,   -- must match src/lib/rag/embed.ts EMBEDDING_DIM
  chunk_index int not null default 0,
  created_at timestamptz not null default now()
);

create index document_chunks_embedding_idx
  on public.document_chunks using hnsw (embedding vector_cosine_ops);

-- Similarity search RPC (used by src/lib/rag/retrieve.ts)
create or replace function public.match_document_chunks(
  p_workspace_id uuid,
  p_query_embedding vector(1024),
  p_namespaces text[] default null,
  p_match_count int default 6
) returns table (content text, namespace text, similarity float)
language sql stable as $$
  select dc.content, dc.namespace, 1 - (dc.embedding <=> p_query_embedding) as similarity
  from public.document_chunks dc
  where dc.workspace_id = p_workspace_id
    and (p_namespaces is null or dc.namespace = any (p_namespaces))
  order by dc.embedding <=> p_query_embedding
  limit p_match_count;
$$;

-- Job queue (pgmq) ----------------------------------------------------------
do $$ begin perform pgmq.create('agent_jobs'); exception when others then null; end $$;

-- PostgREST-callable wrappers over pgmq (called by the service-role worker).
create or replace function public.pgmq_send(queue_name text, msg jsonb, delay int default 0)
returns bigint language sql as $$ select pgmq.send(queue_name, msg, delay); $$;

create or replace function public.pgmq_read(queue_name text, vt int, qty int)
returns setof pgmq.message_record language sql as $$ select * from pgmq.read(queue_name, vt, qty); $$;

create or replace function public.pgmq_delete(queue_name text, msg_id bigint)
returns boolean language sql as $$ select pgmq.delete(queue_name, msg_id); $$;

revoke execute on function public.pgmq_send(text, jsonb, int) from anon, authenticated;
revoke execute on function public.pgmq_read(text, int, int) from anon, authenticated;
revoke execute on function public.pgmq_delete(text, bigint) from anon, authenticated;

-- RLS + updated_at for all business tables ----------------------------------
do $$
declare
  t text;
  with_updated text[] := array[
    'leads','audits','seo_reports','competitors','ad_copy','email_sequences',
    'proposals','reports','workflows','documents'
  ];
  all_tables text[] := array[
  'leads','audits','seo_reports','competitors','ad_copy','ad_variants',
  'email_sequences','email_steps','proposals','reports','agent_runs',
  'workflows','workflow_runs','documents','document_chunks'
];
begin
  foreach t in array all_tables loop
    execute format('alter table public.%I enable row level security;', t);
    execute format(
      'create policy "workspace_members_all" on public.%I for all to authenticated '
      || 'using (workspace_id in (select workspace_id from public.profiles where user_id = auth.uid())) '
      || 'with check (workspace_id in (select workspace_id from public.profiles where user_id = auth.uid()));',
      t);
  end loop;

  foreach t in array with_updated loop
    execute format(
      'create trigger t_%I_updated before update on public.%I for each row execute function public.set_updated_at();',
      t, t);
  end loop;
end $$;
