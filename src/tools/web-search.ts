/** Tool: web search (via Firecrawl's search endpoint). */
import { z } from "zod";
import { registerTool } from "./registry";
import { searchWeb } from "@/lib/firecrawl/client";

export const webSearchTool = {
  name: "web_search",
  description: "Search the web for a query and return ranked results with snippets.",
  inputSchema: z.object({ query: z.string().min(2), limit: z.number().int().min(1).max(20).optional() }),
  execute: async (input: { query: string; limit?: number }) => searchWeb(input.query, input.limit ?? 5),
};

registerTool(webSearchTool);
