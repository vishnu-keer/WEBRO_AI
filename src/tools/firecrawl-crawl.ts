/** Tool: crawl a whole site (bounded) → markdown pages. */
import { z } from "zod";
import { registerTool } from "./registry";
import { crawlSite } from "@/lib/firecrawl/client";
import { DEFAULT_CRAWL_LIMIT } from "@/config/constants";

export const firecrawlCrawlTool = {
  name: "firecrawl_crawl",
  description: "Crawl a website starting from a URL and return markdown for each page (page-capped).",
  inputSchema: z.object({ url: z.string().url(), limit: z.number().int().min(1).max(100).optional() }),
  execute: async (input: { url: string; limit?: number }) =>
    crawlSite(input.url, input.limit ?? DEFAULT_CRAWL_LIMIT),
};

registerTool(firecrawlCrawlTool);
