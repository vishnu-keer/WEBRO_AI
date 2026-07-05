/**
 * Reusable agent tools. A tool is a named, schema-validated capability an agent
 * can be granted (scrape a page, search the web, retrieve context). Tools are
 * defined once and shared across all agents.
 */
import type { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface ToolContext {
  workspaceId: string;
  leadId?: string;
  supabase: SupabaseClient;
}

export interface Tool<TInput = unknown, TOutput = unknown> {
  name: string;
  description: string;
  inputSchema: z.ZodType<TInput>;
  execute: (input: TInput, ctx: ToolContext) => Promise<TOutput>;
}
