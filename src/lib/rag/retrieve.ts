/**
 * Retrieve the most relevant knowledge-base chunks for a query via pgvector
 * similarity search (RPC `match_document_chunks`, defined in the migrations).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { embed } from "./embed";

export interface RetrievedChunk {
  content: string;
  namespace: string;
  similarity: number;
}

export async function retrieve(args: {
  supabase: SupabaseClient;
  workspaceId: string;
  query: string;
  namespaces?: string[];
  limit?: number;
}): Promise<RetrievedChunk[]> {
  const [queryEmbedding] = await embed([args.query], "query");

  const { data, error } = await args.supabase.rpc("match_document_chunks", {
    p_workspace_id: args.workspaceId,
    p_query_embedding: queryEmbedding,
    p_namespaces: args.namespaces ?? null,
    p_match_count: args.limit ?? 6,
  });
  if (error) throw error;
  return (data ?? []) as RetrievedChunk[];
}
