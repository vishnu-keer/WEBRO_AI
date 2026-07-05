/**
 * Ingest text into the RAG store: chunk → embed → upsert into
 * `documents` + `document_chunks`. Used by scripts/ingest-knowledge.ts.
 */
import { createAdminClient } from "@/lib/supabase/admin";
import { embed } from "./embed";

/** Naive paragraph-aware chunker. Good enough for the knowledge base. */
export function chunkText(text: string, maxChars = 1500): string[] {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";
  for (const p of paragraphs) {
    if ((current + "\n\n" + p).length > maxChars && current) {
      chunks.push(current);
      current = p;
    } else {
      current = current ? `${current}\n\n${p}` : p;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export async function ingestDocument(args: {
  workspaceId: string;
  namespace: string;
  title: string;
  content: string;
}) {
  const supabase = createAdminClient();

  const { data: doc, error: docErr } = await supabase
    .from("documents")
    .upsert(
      { workspace_id: args.workspaceId, namespace: args.namespace, title: args.title, content: args.content },
      { onConflict: "workspace_id,namespace,title" },
    )
    .select("id")
    .single();
  if (docErr) throw docErr;

  // Replace existing chunks for idempotent re-ingestion.
  await supabase.from("document_chunks").delete().eq("document_id", doc.id);

  const chunks = chunkText(args.content);
  const embeddings = await embed(chunks, "document");

  const rows = chunks.map((content, i) => ({
    document_id: doc.id,
    workspace_id: args.workspaceId,
    namespace: args.namespace,
    content,
    embedding: embeddings[i] as unknown as string,
    chunk_index: i,
  }));

  const { error: chunkErr } = await supabase.from("document_chunks").insert(rows);
  if (chunkErr) throw chunkErr;

  return { documentId: doc.id, chunks: chunks.length };
}
