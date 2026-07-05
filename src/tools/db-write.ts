/**
 * Tool: append a timestamped note to a lead.
 *
 * DESIGN NOTE: agents do NOT get a generic "write anything to the DB" tool —
 * that's an anti-pattern (unbounded, unsafe). Each agent's *primary* typed
 * output is persisted by the Runner, not by a tool. This narrow, safe tool
 * exists only for incidental annotations during a tool-loop.
 */
import { z } from "zod";
import { registerTool } from "./registry";
import type { ToolContext } from "./types";

export const appendLeadNoteTool = {
  name: "append_lead_note",
  description: "Append a short timestamped note to a lead's notes field.",
  inputSchema: z.object({ leadId: z.string().uuid(), note: z.string().min(1).max(2000) }),
  execute: async (input: { leadId: string; note: string }, ctx: ToolContext) => {
    const stamp = new Date().toISOString();
    const { data: lead } = await ctx.supabase
      .from("leads")
      .select("notes")
      .eq("id", input.leadId)
      .single();
    const next = `${lead?.notes ?? ""}\n[${stamp}] ${input.note}`.trim();
    const { error } = await ctx.supabase.from("leads").update({ notes: next }).eq("id", input.leadId);
    if (error) throw error;
    return { ok: true };
  },
};

registerTool(appendLeadNoteTool);
