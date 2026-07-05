/**
 * The agent contract. An agent is just a typed spec; the shared Runner executes
 * it. This is the single most important type in the system — it's what makes
 * every agent reusable, testable, and composable (Design principle #1).
 */
import type { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ModelId } from "@/config/models";
import type { RetrievedChunk } from "@/lib/rag/retrieve";
import type { TokenUsage } from "@/lib/claude/client";

/** Runtime context threaded into every agent run. */
export interface AgentContext {
  workspaceId: string;
  leadId?: string;
  workflowRunId?: string;
  /** RLS-scoped client (server) — the Runner logs + reads through this. */
  supabase: SupabaseClient;
}

/** The definition of an agent. Concrete agents (Phase 1+) export one of these. */
export interface AgentSpec<TInput, TOutput> {
  /** Stable id, kebab-case, matches the folder + job type. e.g. "website-audit". */
  name: string;
  version: string;
  model: ModelId;
  /** Validated before the model is ever called. */
  input: z.ZodType<TInput>;
  /** The model is forced to return data matching this. */
  output: z.ZodType<TOutput>;
  systemPrompt: string;
  /** Knowledge-base scopes to retrieve before reasoning (optional). */
  ragNamespaces?: string[];
  /** Build the RAG query from the input (defaults to JSON of the input). */
  ragQuery?: (input: TInput) => string;
  /** Render the user message (defaults to pretty JSON of the input). */
  formatInput?: (input: TInput, retrieved: RetrievedChunk[]) => string;
  maxTokens?: number;
}

export interface AgentRunResult<TOutput> {
  output: TOutput;
  usage: TokenUsage;
  durationMs: number;
}
