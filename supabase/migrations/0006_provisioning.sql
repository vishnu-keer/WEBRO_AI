-- 0006_provisioning.sql — robust, service-role-independent workspace provisioning.
-- Fixes "permission denied for table workspaces" by (a) ensuring the API roles
-- can operate on our tables (RLS still governs which ROWS each user sees) and
-- (b) provisioning through a trusted SECURITY DEFINER function.

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to authenticated, service_role;
grant all on all sequences in schema public to authenticated, service_role;
alter default privileges in schema public grant all on tables to authenticated, service_role;
alter default privileges in schema public grant all on sequences to authenticated, service_role;

-- Allow a signed-in user to create their own workspace row.
drop policy if exists "create own workspace" on public.workspaces;
create policy "create own workspace" on public.workspaces
  for insert to authenticated with check (true);

-- Returns the caller's workspace, creating a workspace + profile if missing.
-- Runs as the DB owner, so it never depends on the service-role key or grants.
create or replace function public.ensure_workspace()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  ws_id uuid;
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;
  select workspace_id into ws_id from public.profiles where user_id = uid limit 1;
  if ws_id is not null then
    return ws_id;
  end if;
  insert into public.workspaces (name) values ('WEBRO') returning id into ws_id;
  insert into public.profiles (user_id, workspace_id, email)
    values (uid, ws_id, (select email from auth.users where id = uid));
  return ws_id;
end $$;

revoke all on function public.ensure_workspace() from public;
grant execute on function public.ensure_workspace() to authenticated;
