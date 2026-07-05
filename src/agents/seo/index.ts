/** SEO Agent — the AgentSpec. Plugs into the shared Runner. */
import { registerAgent, type AgentSpec } from "@/agents/core";
import { MODELS } from "@/config/models";
import { SEO_SYSTEM_PROMPT } from "./prompt";
import {
  SeoAuditInputSchema,
  SeoAuditOutputSchema,
  type SeoAuditInput,
  type SeoAuditOutput,
} from "./schema";

function renderSnapshot(input: SeoAuditInput): string {
  const s = input.snapshot;
  const crawlers = s.aiCrawlers.map((c) => `${c.bot}:${c.allowed ? "allowed" : "BLOCKED"}`).join(", ");
  return `SEO audit for: ${input.url}

## Indexability
Meta robots: ${s.metaRobots ?? "(none)"} | Canonical: ${s.canonical ?? "(none)"} | Lang: ${s.lang ?? "(none)"}
robots.txt found: ${s.robotsTxtFound} | declares sitemap: ${s.robotsTxtHasSitemap} | sitemap.xml found: ${s.sitemapFound}${s.sitemapUrlCount != null ? ` (${s.sitemapUrlCount} urls)` : ""}

## Metadata
Title: ${s.title ?? "(none)"} (${s.titleLength} chars)
Meta description: ${s.metaDescription ?? "(none)"} (${s.metaDescriptionLength} chars)
Open Graph tags: ${s.openGraphCount} | Twitter card: ${s.hasTwitterCard}

## Content
H1 (${s.h1Count}): ${s.h1.join(" | ") || "(none)"} | H2: ${s.h2Count} | H3: ${s.h3Count}
Words: ${s.wordCount} | Images: ${s.imageCount} (missing alt: ${s.imagesMissingAlt})
Internal links: ${s.internalLinkCount} | External links: ${s.externalLinkCount}

## Structured data
JSON-LD blocks: ${s.jsonLdCount} | Types: ${s.schemaTypes.join(", ") || "(none)"} | FAQ schema: ${s.hasFaqSchema}

## Mobile / Security / Performance
Viewport meta: ${s.hasViewportMeta} | HTTPS: ${s.isHttps} | Mixed content: ${s.mixedContentCount}
Scripts: ${s.scriptCount} | Stylesheets: ${s.stylesheetCount} | Page speed measured: ${s.pageSpeedMeasured} (heuristic only)

## AI Search Readiness (AEO)
AI crawler access: ${crawlers || "(unknown)"}

## Homepage content preview
${s.contentPreview}`;
}

export const seoAgent: AgentSpec<SeoAuditInput, SeoAuditOutput> = {
  name: "seo",
  version: "1.0.0",
  model: MODELS.reasoning,
  input: SeoAuditInputSchema,
  output: SeoAuditOutputSchema,
  systemPrompt: SEO_SYSTEM_PROMPT,
  maxTokens: 8000,
  formatInput: renderSnapshot,
};

registerAgent(seoAgent);
