/**
 * Embeddings for RAG. Default provider is Voyage AI (Anthropic's recommended
 * embeddings partner) called over REST — no extra SDK dependency.
 *
 * IMPORTANT: EMBEDDING_DIM must match the `vector(N)` column in the migration
 * (document_chunks.embedding). If you switch models, update BOTH.
 */
import { serverEnv } from "@/config/env";

export const EMBEDDING_MODEL = "voyage-3.5";
export const EMBEDDING_DIM = 1024;

export async function embed(
  texts: string[],
  inputType: "document" | "query" = "document",
): Promise<number[][]> {
  const key = serverEnv().VOYAGE_API_KEY;
  if (!key) {
    throw new Error(
      "VOYAGE_API_KEY is not set. Set it, or swap the provider in src/lib/rag/embed.ts.",
    );
  }

  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      input: texts,
      model: EMBEDDING_MODEL,
      input_type: inputType,
      output_dimension: EMBEDDING_DIM,
    }),
  });

  if (!res.ok) throw new Error(`Voyage embeddings failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { data: { embedding: number[] }[] };
  return json.data.map((d) => d.embedding);
}
