/** Search the web for candidate local businesses. */
import type { RunLeadsRequest } from "./schema";

function normalizeSearch(res: any): { title?: string; url?: string; description?: string }[] {
  const list = res?.web ?? res?.data ?? res?.results ?? (Array.isArray(res) ? res : []);
  return (Array.isArray(list) ? list : []).map((r: any) => ({
    title: r.title,
    url: r.url ?? r.link,
    description: r.description ?? r.snippet,
  }));
}

export async function discoverLeads(
  req: RunLeadsRequest,
): Promise<{ title?: string; url?: string; description?: string }[]> {
  const { searchWeb } = await import("@/lib/firecrawl/client");
  const queries = [`${req.businessType} in ${req.location}`, `${req.businessType} ${req.location} website`];
  const byUrl = new Map<string, { title?: string; url?: string; description?: string }>();
  for (const q of queries) {
    try {
      for (const r of normalizeSearch(await searchWeb(q, 10))) {
        if (r.url && !byUrl.has(r.url)) byUrl.set(r.url, r);
      }
    } catch {
      /* keep going */
    }
    if (byUrl.size >= 15) break;
  }
  return [...byUrl.values()].slice(0, 15);
}
