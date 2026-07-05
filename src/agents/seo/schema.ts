/**
 * Types + Zod schemas for the SEO Agent (technical + on-page + structured data +
 * AEO/AI-search readiness). Enum-first so z.enum never trips on readonly arrays.
 */
import { z } from "zod";

export const SeoCategoryEnum = z.enum([
  "indexability",
  "metadata",
  "contentQuality",
  "structuredData",
  "mobile",
  "performance",
  "links",
  "security",
  "aeoReadiness",
]);
export type SeoCategory = z.infer<typeof SeoCategoryEnum>;
export const SEO_CATEGORIES = SeoCategoryEnum.options;

export const SEO_CATEGORY_LABELS: Record<SeoCategory, string> = {
  indexability: "Indexability & Crawlability",
  metadata: "Titles & Meta",
  contentQuality: "Content & E-E-A-T",
  structuredData: "Structured Data",
  mobile: "Mobile",
  performance: "Performance (heuristic)",
  links: "Links & Architecture",
  security: "Security",
  aeoReadiness: "AI Search Readiness (AEO)",
};

// ---- Snapshot (deterministic extraction) ---------------------------------
export const SeoSnapshotSchema = z.object({
  url: z.string(),
  finalUrl: z.string().optional(),
  statusCode: z.number().optional(),
  // metadata
  title: z.string().optional(),
  titleLength: z.number(),
  metaDescription: z.string().optional(),
  metaDescriptionLength: z.number(),
  metaRobots: z.string().optional(),
  canonical: z.string().optional(),
  lang: z.string().optional(),
  // headings + content
  h1: z.array(z.string()),
  h1Count: z.number(),
  h2Count: z.number(),
  h3Count: z.number(),
  wordCount: z.number(),
  imageCount: z.number(),
  imagesMissingAlt: z.number(),
  // links
  internalLinkCount: z.number(),
  externalLinkCount: z.number(),
  // social / open graph
  openGraphCount: z.number(),
  hasTwitterCard: z.boolean(),
  // structured data
  jsonLdCount: z.number(),
  schemaTypes: z.array(z.string()),
  hasFaqSchema: z.boolean(),
  // mobile / security
  hasViewportMeta: z.boolean(),
  isHttps: z.boolean(),
  mixedContentCount: z.number(),
  // crawlability files
  robotsTxtFound: z.boolean(),
  robotsTxtHasSitemap: z.boolean(),
  sitemapFound: z.boolean(),
  sitemapUrlCount: z.number().optional(),
  // AEO / AI crawlers
  aiCrawlers: z.array(z.object({ bot: z.string(), allowed: z.boolean() })),
  // heuristic performance
  scriptCount: z.number(),
  stylesheetCount: z.number(),
  pageSpeedMeasured: z.boolean(),
  contentPreview: z.string(),
});
export type SeoSnapshot = z.infer<typeof SeoSnapshotSchema>;

// ---- Agent input ----------------------------------------------------------
export const SeoAuditInputSchema = z.object({
  url: z.string().url(),
  snapshot: SeoSnapshotSchema,
});
export type SeoAuditInput = z.infer<typeof SeoAuditInputSchema>;

export const RunSeoRequestSchema = z.object({
  url: z.string().url(),
  leadId: z.string().uuid().optional(),
});
export type RunSeoRequest = z.infer<typeof RunSeoRequestSchema>;

// ---- Agent output ---------------------------------------------------------
const CategoryScoreSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  findings: z.array(z.string()),
});

export const SeoAuditOutputSchema = z.object({
  url: z.string(),
  overallScore: z.number().min(0).max(100),
  grade: z.enum(["A", "B", "C", "D", "F"]),
  summary: z.string().describe("2-4 sentence executive summary for a business owner."),
  strengths: z.array(z.string()),
  detectedSchemaTypes: z.array(z.string()).describe("Structured-data @types found on the page."),
  categoryScores: z.object({
    indexability: CategoryScoreSchema,
    metadata: CategoryScoreSchema,
    contentQuality: CategoryScoreSchema,
    structuredData: CategoryScoreSchema,
    mobile: CategoryScoreSchema,
    performance: CategoryScoreSchema,
    links: CategoryScoreSchema,
    security: CategoryScoreSchema,
    aeoReadiness: CategoryScoreSchema,
  }),
  criticalIssues: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        category: SeoCategoryEnum,
        severity: z.enum(["critical", "high", "medium"]),
        businessImpact: z.string(),
      }),
    )
    .describe("Worst-first SEO problems."),
  quickWins: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        effort: z.enum(["low", "medium", "high"]),
        impact: z.enum(["low", "medium", "high"]),
      }),
    ),
  priorityImprovements: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        priority: z.number().int().min(1).max(5),
        category: SeoCategoryEnum,
        expectedOutcome: z.string(),
      }),
    ),
  businessImpact: z.object({
    summary: z.string(),
    potentialTrafficLift: z.string().describe("e.g. 'an estimated 20-40% more organic clicks'"),
    riskIfIgnored: z.string(),
  }),
});
export type SeoAuditOutput = z.infer<typeof SeoAuditOutputSchema>;
export type SeoCategoryScore = z.infer<typeof CategoryScoreSchema>;
