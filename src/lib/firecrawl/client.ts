/**
 * Firecrawl v2 client + thin wrappers. Turns prospect websites into clean,
 * LLM-ready markdown. One place to configure formats, limits, and retries.
 */
import Firecrawl from "@mendable/firecrawl-js";
import { serverEnv } from "@/config/env";
import { DEFAULT_CRAWL_LIMIT } from "@/config/constants";

let _client: Firecrawl | null = null;

export function firecrawl(): Firecrawl {
  if (!_client) _client = new Firecrawl({ apiKey: serverEnv().FIRECRAWL_API_KEY });
  return _client;
}

/** Scrape a single page → markdown (+ optional other formats). */
export async function scrapePage(url: string, formats: ("markdown" | "html")[] = ["markdown"]) {
  return firecrawl().scrape(url, { formats });
}

/** Synchronous crawl — waits for completion. Good for small sites. */
export async function crawlSite(url: string, limit: number = DEFAULT_CRAWL_LIMIT) {
  return firecrawl().crawl(url, { limit, scrapeOptions: { formats: ["markdown"] } });
}

/** Async crawl — returns a job id to poll with `crawlStatus`. Good for big sites. */
export async function startCrawl(url: string, limit: number = DEFAULT_CRAWL_LIMIT) {
  return firecrawl().startCrawl(url, { limit, scrapeOptions: { formats: ["markdown"] } });
}

export async function crawlStatus(jobId: string) {
  return firecrawl().getCrawlStatus(jobId);
}

/** Web search (used by the web-search tool). Returns ranked results. */
export async function searchWeb(query: string, limit = 5) {
  return firecrawl().search(query, { limit });
}
