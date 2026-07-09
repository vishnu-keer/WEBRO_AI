/** Gather everything the proposal writer needs: the prospect's site + WEBRO's KB. */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { BusinessContext } from "./schema";

const KB_FILES = [
  "company_info.md",
  "portfolio.md",
  "pricing.md",
  "proposal_template.md",
  "sales_scripts.md",
];

async function loadKnowledgeBase(): Promise<string> {
  const parts: string[] = [];
  for (const f of KB_FILES) {
    try {
      const txt = await readFile(join(process.cwd(), "knowledge-base", f), "utf8");
      if (txt.trim()) parts.push(`--- ${f} ---\n${txt.slice(0, 2500)}`);
    } catch {
      /* file missing — skip */
    }
  }
  return parts.join("\n\n") || "(knowledge base is empty — use clearly-labeled estimates)";
}

export async function gatherProposalContext(
  url: string,
): Promise<{ business: BusinessContext; knowledgeBase: string }> {
  const { scrapePage } = await import("@/lib/firecrawl/client");
  const raw: any = await scrapePage(url, ["markdown"]);
  const doc = raw?.data ?? raw ?? {};
  const md = doc.metadata ?? {};
  const content: string = doc.markdown ?? "";
  if (!content && !md.title) throw new Error(`Could not read ${url}. Is the URL reachable?`);

  const business: BusinessContext = {
    url,
    title: md.title ?? md.ogTitle,
    description: md.description ?? md.ogDescription,
    content: content.slice(0, 4000),
  };
  return { business, knowledgeBase: await loadKnowledgeBase() };
}
