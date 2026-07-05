/**
 * Ingest knowledge-base/*.md into the RAG store (documents + document_chunks).
 * Run with:  npm run ingest        (optionally WORKSPACE_ID=<uuid> npm run ingest)
 *
 * Filenames map to RAG namespaces so agents can retrieve by scope.
 */
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { createAdminClient } from "@/lib/supabase/admin";
import { ingestDocument } from "@/lib/rag/ingest";
import { RAG_NAMESPACES } from "@/config/constants";

// Load local env for standalone execution (Node 20.6+).
try {
  process.loadEnvFile(".env.local");
} catch {
  /* fall back to ambient env */
}

const FILE_TO_NAMESPACE: Record<string, string> = {
  "company_info.md": RAG_NAMESPACES.company,
  "portfolio.md": RAG_NAMESPACES.portfolio,
  "pricing.md": RAG_NAMESPACES.pricing,
  "proposal_template.md": RAG_NAMESPACES.proposalTemplate,
  "sales_scripts.md": RAG_NAMESPACES.salesScripts,
};

async function resolveWorkspaceId(): Promise<string> {
  if (process.env.WORKSPACE_ID) return process.env.WORKSPACE_ID;
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("workspaces").select("id").limit(1).single();
  if (error || !data) {
    throw new Error("No workspace found. Sign up once (creates a workspace) or set WORKSPACE_ID.");
  }
  return data.id;
}

async function main() {
  const workspaceId = await resolveWorkspaceId();
  const dir = join(process.cwd(), "knowledge-base");
  const files = await readdir(dir);

  for (const file of files) {
    const namespace = FILE_TO_NAMESPACE[file];
    if (!namespace) continue;
    const content = await readFile(join(dir, file), "utf8");
    if (!content.trim()) {
      console.log(`skip ${file} (empty)`);
      continue;
    }
    const res = await ingestDocument({ workspaceId, namespace, title: file, content });
    console.log(`ingested ${file} → ${namespace} (${res.chunks} chunks)`);
  }
  console.log("done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
