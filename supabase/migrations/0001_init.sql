-- 0001_init.sql — extensions, tenancy (workspaces/profiles), shared helpers.

create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists vector;      -- pgvector (RAG)
create extension if not exists pgmq;        -- Supabase Queues (jobs)

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- Tenancy -------------------------------------------------------------------
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'WEBRO',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create trigger t_workspaces_updated before update on public.workspaces
  for each row execute function public.set_updated_at();

-- Create a workspace + profile automatically when a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare ws_id uuid;
begin
  insert into public.workspaces (name)
    values (coalesce(new.raw_user_meta_data->>'workspace_name', 'WEBRO'))
    returning id into ws_id;
  insert into public.profiles (user_id, workspace_id, email)
    values (new.id, ws_id, new.email);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS for tenancy tables
alter table public.workspaces enable row level security;
alter table public.profiles enable row level security;

create policy "own profile" on public.profiles
  for select to authenticated using (user_id = auth.uid());
create policy "insert own profile" on public.profiles
  for insert to authenticated with check (user_id = auth.uid());

create policy "member workspaces" on public.workspaces
  for select to authenticated
  using (id in (select workspace_id from public.profiles where user_id = auth.uid()));
