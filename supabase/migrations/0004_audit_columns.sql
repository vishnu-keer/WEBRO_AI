-- 0004_audit_columns.sql — convenience columns on audits for listing/sorting.
-- The full typed audit still lives in audits.data (jsonb); these mirror two
-- hot fields so the audits list can query/sort without unpacking jsonb.
alter table public.audits add column if not exists url text;
alter table public.audits add column if not exists overall_score int;

create index if not exists audits_workspace_created_idx
  on public.audits (workspace_id, created_at desc);
