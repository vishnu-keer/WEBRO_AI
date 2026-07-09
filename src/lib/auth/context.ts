/**
 * Resolve the authenticated user's workspace into an AgentContext.
 *
 * Provisioning is delegated to the `ensure_workspace()` SQL function (SECURITY
 * DEFINER), which runs with the database's own privileges — so it works
 * regardless of the service-role key format or per-role table grants. It returns
 * the caller's workspace id, creating a workspace + profile if they have none.
 */
import { createClient } from "@/lib/supabase/server";
import type { AgentContext } from "@/agents/core";

export async function getWorkspaceContext(): Promise<AgentContext & { userId: string }> {
  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) throw new Error("Not authenticated. Please sign in again.");

  const { data, error: wErr } = await supabase.rpc("ensure_workspace" as never);
  const workspaceId = data as unknown as string | null;
  if (wErr || !workspaceId) {
    throw new Error(`Could not resolve workspace: ${wErr?.message ?? "no workspace returned"}`);
  }

  return { supabase, workspaceId, userId: userData.user.id };
}
