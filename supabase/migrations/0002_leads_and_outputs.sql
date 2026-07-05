-- 0002_leads_and_outputs.sql — the lead + per-agent output tables.
-- Every table carries workspace_id (denormalized) so RLS is uniform + simple.

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  business_name text not null,
  website text,
  industry text,
  location text,
  contact_email text,
  contact_phone text,
  status text not null default 'new',
  source text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audits (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  summary text,
  scores jsonb,            -- { design, speed, ux, mobile, trust }
  issues jsonb,            -- structured, prioritized findings
  data jsonb,              -- full typed agent output
  model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.seo_reports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  score int,
  recommendations jsonb,
  data jsonb,
  model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.competitors (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  name text,
  website text,
  comparison jsonb,
  data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ad_copy (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  platform text,
  objective text,
  data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ad_variants (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  ad_copy_id uuid references public.ad_copy(id) on delete cascade,
  headline text,
  body text,
  cta text,
  created_at timestamptz not null default now()
);

create table public.email_sequences (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  goal text,
  data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.email_steps (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  sequence_id uuid references public.email_sequences(id) on delete cascade,
  step_index int not null,
  subject text,
  body text,
  delay_days int not null default 0,
  created_at timestamptz not null default now()
);

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  title text,
  status text not null default 'draft',
  pricing jsonb,
  content jsonb,
  data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  title text,
  content jsonb,
  data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
