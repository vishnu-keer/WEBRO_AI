/**
 * Deterministic competitor discovery: scrape the prospect, web-search for rivals,
 * scrape the top few. No agentic loop — works with any LLM provider.
 */
import type { ResearchContext, RunCompetitorRequest, Site } from "./schema";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function normalizeSite(url: string, raw: any, hint?: { title?: string; description?: string }): Site {
  const doc = raw?.data ?? raw ?? {};
  const md = doc.metadata ?? {};
  const markdown: string = doc.markdown ?? "";
  return {
    url,
    title: md.title ?? md.ogTitle ?? hint?.title,
    description: md.description ?? md.ogDescription ?? hint?.description,
    content: (markdown || "").slice(0, 3000),
  };
}

function normalizeSearch(res: any): { url: string; title?: string; description?: string }[] {
  const list = res?.web ?? res?.data ?? res?.results ?? (Array.isArray(res) ? res : []);
  return (Array.isArray(list) ? list : [])
    .map((r: any) => ({ url: r.url ?? r.link, title: r.title, description: r.description ?? r.snippet }))
    .filter((r: { url?: string }) => typeof r.url === "string");
}

function buildQueries(req: RunCompetitorRequest, target: Site): string[] {
  const kw = req.industry || target.title || "local business";
  if (req.location) return [`${kw} in ${req.location}`, `best ${kw} ${req.location}`];
  return [`${kw} competitors`, `alternatives to ${target.title ?? req.url}`];
}

export async function discoverCompetitors(req: RunCompetitorRequest): Promise<ResearchContext> {
  const { scrapePage, searchWeb } = await import("@/lib/firecrawl/client");

  const targetRaw = await scrapePage(req.url, ["markdown"]);
  const target = normalizeSite(req.url, targetRaw);

  const targetHost = hostOf(req.url);
  const found = new Map<string, { url: string; title?: string; description?: string }>();
  for (const q of buildQueries(req, target)) {
    try {
      const results = normalizeSearch(await searchWeb(q, 8));
      for (const r of results) {
        const host = hostOf(r.url);
        if (!host || host === targetHost) continue;
        if (!found.has(host)) found.set(host, r);
      }
    } catch {
      /* a failing query shouldn't kill the run */
    }
    if (found.size >= 6) break;
  }

  const candidates: Site[] = [];
  for (const c of [...found.values()].slice(0, 4)) {
    try {
      candidates.push(normalizeSite(c.url, await scrapePage(c.url, ["markdown"]), c));
    } catch {
      candidates.push({ url: c.url, title: c.title, description: c.description, content: "" });
    }
  }

  return { target, candidates, location: req.location, industry: req.industry };
}
