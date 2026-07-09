-- 0007_harden_functions.sql — clears Supabase security-advisor warnings.
--
-- Two hardening moves, both safe and behaviour-preserving:
--   1. Pin search_path on our functions so a caller can't shadow objects via a
--      malicious search_path (advisor: function_search_path_mutable).
--   2. Stop exposing internal SECURITY DEFINER functions through the public REST
--      API. Trigger/provisioning functions should not be callable by anon; only
--      ensure_workspace stays callable by signed-in users (that's its purpose).

-- 1) Pin search_path. These functions only touch public / pg_catalog objects.
alter function public.set_updated_at() set search_path = public;
alter function public.match_document_chunks(uuid, vector, text[], int) set search_path = public;
alter function public.pgmq_send(text, jsonb, int) set search_path = public;
alter function public.pgmq_read(text, int, int) set search_path = public;
alter function public.pgmq_delete(text, bigint) set search_path = public;

-- 2) handle_new_user runs ONLY as the auth.users insert trigger. Triggers fire
--    regardless of EXECUTE grants, so removing API access does not break signup.
revoke all on function public.handle_new_user() from public, anon, authenticated;

--    ensure_workspace must be callable by signed-in users only — never anon.
revoke all on function public.ensure_workspace() from public, anon;
grant execute on function public.ensure_workspace() to authenticated;

--    Lock down a leftover helper if it exists on this project (it was created
--    manually earlier, not by these migrations, so guard against its absence).
do $$
begin
  revoke all on function public.rls_auto_enable() from public, anon, authenticated;
exception when undefined_function then null;
end $$;
