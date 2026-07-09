-- 0008_drop_permissive_workspace_insert.sql
-- Removes the vestigial permissive INSERT policy on workspaces.
--
-- Workspace creation happens ONLY through SECURITY DEFINER paths — the signup
-- trigger public.handle_new_user() and the public.ensure_workspace() RPC — both
-- of which bypass RLS. No application code inserts a workspace row directly as an
-- authenticated user, so this `WITH CHECK (true)` policy was unnecessary attack
-- surface (any signed-in user could create arbitrary workspace rows via the API).
-- (Supabase advisor: rls_policy_always_true)
drop policy if exists "create own workspace" on public.workspaces;
