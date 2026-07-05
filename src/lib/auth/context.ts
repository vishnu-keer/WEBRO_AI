/**
 * Resolve the authenticated user's workspace into an AgentContext. Reused by
 * every server action that runs an agent (not just audits).
 */
import { createClient } from "@/lib/supabase/server";
import type { AgentContext } from "@/agents/core";

export async function getWorkspaceContext(): Promise<AgentContext & { userId: string }> {
  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) throw new Error("Not authenticated.");

  const { data: profile, error: pErr } = await supabase
    .from("profiles")
    .select("workspace_id")
    .eq("user_id", userData.user.id)
    .single();
  if (pErr || !profile) throw new Error("No workspace found for this user.");

  return { supabase, workspaceId: profile.workspace_id, userId: userData.user.id };
}
