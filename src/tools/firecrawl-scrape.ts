/** Tool: scrape one URL → markdown. */
import { z } from "zod";
import { registerTool } from "./registry";
import { scrapePage } from "@/lib/firecrawl/client";

export const firecrawlScrapeTool = {
  name: "firecrawl_scrape",
  description: "Fetch a single web page and return clean, LLM-ready markdown.",
  inputSchema: z.object({ url: z.string().url() }),
  execute: async (input: { url: string }) => scrapePage(input.url),
};

registerTool(firecrawlScrapeTool);
