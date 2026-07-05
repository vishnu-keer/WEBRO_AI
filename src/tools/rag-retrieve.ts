/** Tool: retrieve relevant WEBRO knowledge-base chunks (pgvector). */
import { z } from "zod";
import { registerTool } from "./registry";
import { retrieve } from "@/lib/rag/retrieve";
import type { ToolContext } from "./types";

export const ragRetrieveTool = {
  name: "rag_retrieve",
  description: "Retrieve relevant WEBRO knowledge (company info, portfolio, pricing, scripts) for a query.",
  inputSchema: z.object({
    query: z.string().min(2),
    namespaces: z.array(z.string()).optional(),
    limit: z.number().int().min(1).max(20).optional(),
  }),
  execute: async (
    input: { query: string; namespaces?: string[]; limit?: number },
    ctx: ToolContext,
  ) =>
    retrieve({
      supabase: ctx.supabase,
      workspaceId: ctx.workspaceId,
      query: input.query,
      namespaces: input.namespaces,
      limit: input.limit,
    }),
};

registerTool(ragRetrieveTool);
