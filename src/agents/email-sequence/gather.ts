/** Scrape the prospect's website into a small context for personalization. */
import type { BusinessContext } from "./schema";

export async function gatherBusiness(url: string): Promise<BusinessContext> {
  const { scrapePage } = await import("@/lib/firecrawl/client");
  const raw: any = await scrapePage(url, ["markdown"]);
  const doc = raw?.data ?? raw ?? {};
  const md = doc.metadata ?? {};
  const content: string = doc.markdown ?? "";
  if (!content && !md.title) throw new Error(`Could not read ${url}. Is the URL reachable?`);
  return {
    url,
    title: md.title ?? md.ogTitle,
    description: md.description ?? md.ogDescription,
    content: content.slice(0, 4000),
  };
}
