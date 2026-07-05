/**
 * Types + Zod schemas for the Website Audit Agent.
 *
 * Enums are defined enum-first (z.enum on an inline literal) and the iteration
 * arrays are derived via `.options`. This avoids the "readonly const array is not
 * assignable to [string, ...string[]]" error some zod/TS combinations produce.
 */
import { z } from "zod";

/** The nine audit categories — fixed so every audit is comparable. */
export const AuditCategoryEnum = z.enum([
  "branding",
  "visualDesign",
  "ux",
  "mobileResponsiveness",
  "navigation",
  "pageSpeed",
  "trustSignals",
  "cta",
  "conversion",
]);
export type AuditCategory = z.infer<typeof AuditCategoryEnum>;
export const AUDIT_CATEGORIES = AuditCategoryEnum.options;

/** Human labels for the UI. */
export const CATEGORY_LABELS: Record<AuditCategory, string> = {
  branding: "Branding",
  visualDesign: "Visual Design",
  ux: "User Experience",
  mobileResponsiveness: "Mobile Responsiveness",
  navigation: "Navigation",
  pageSpeed: "Page Speed",
  trustSignals: "Trust Signals",
  cta: "Calls-to-Action",
  conversion: "Conversion Optimization",
};

// ---- Snapshot (deterministic extraction) ---------------------------------
export const WebsiteSnapshotSchema = z.object({
  url: z.string(),
  finalUrl: z.string().optional(),
  statusCode: z.number().optional(),
  title: z.string().optional(),
  metaDescription: z.string().optional(),
  hasViewportMeta: z.boolean(),
  h1: z.array(z.string()),
  h2: z.array(z.string()),
  navLinks: z.array(z.object({ text: z.string(), href: z.string() })),
  ctas: z.array(z.string()),
  forms: z.array(z.object({ fields: z.number(), hasEmail: z.boolean() })),
  imageCount: z.number(),
  imagesMissingAlt: z.number(),
  internalLinks: z.array(z.string()),
  externalLinkCount: z.number(),
  scriptCount: z.number(),
  wordCount: z.number(),
  socialLinks: z.array(z.string()),
  detectedTrustSignals: z.array(z.string()),
  pageSpeedMeasured: z.boolean(),
  contentPreview: z.string(),
});
export type WebsiteSnapshot = z.infer<typeof WebsiteSnapshotSchema>;

// ---- Agent input ----------------------------------------------------------
export const WebsiteAuditInputSchema = z.object({
  url: z.string().url(),
  snapshot: WebsiteSnapshotSchema,
});
export type WebsiteAuditInput = z.infer<typeof WebsiteAuditInputSchema>;

/** What the caller (UI/service) passes — the snapshot is derived internally. */
export const RunAuditRequestSchema = z.object({
  url: z.string().url(),
  leadId: z.string().uuid().optional(),
});
export type RunAuditRequest = z.infer<typeof RunAuditRequestSchema>;

// ---- Agent output ---------------------------------------------------------
const CategoryScoreSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  findings: z.array(z.string()),
});

export const WebsiteAuditOutputSchema = z.object({
  url: z.string(),
  overallScore: z.number().min(0).max(100),
  grade: z.enum(["A", "B", "C", "D", "F"]),
  summary: z.string().describe("2-4 sentence executive summary for a business owner."),
  strengths: z.array(z.string()).describe("What the site already does well."),
  categoryScores: z.object({
    branding: CategoryScoreSchema,
    visualDesign: CategoryScoreSchema,
    ux: CategoryScoreSchema,
    mobileResponsiveness: CategoryScoreSchema,
    navigation: CategoryScoreSchema,
    pageSpeed: CategoryScoreSchema,
    trustSignals: CategoryScoreSchema,
    cta: CategoryScoreSchema,
    conversion: CategoryScoreSchema,
  }),
  criticalIssues: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        category: AuditCategoryEnum,
        severity: z.enum(["critical", "high", "medium"]),
        businessImpact: z.string(),
      }),
    )
    .describe("The most damaging problems, worst first."),
  quickWins: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        effort: z.enum(["low", "medium", "high"]),
        impact: z.enum(["low", "medium", "high"]),
      }),
    )
    .describe("High-impact, low-effort fixes."),
  priorityImprovements: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        priority: z.number().int().min(1).max(5),
        category: AuditCategoryEnum,
        expectedOutcome: z.string(),
      }),
    )
    .describe("Ordered roadmap of the biggest improvements."),
  businessImpact: z.object({
    summary: z.string(),
    potentialConversionLift: z.string().describe("e.g. 'an estimated 15-25% more enquiries'"),
    riskIfIgnored: z.string(),
  }),
});
export type WebsiteAuditOutput = z.infer<typeof WebsiteAuditOutputSchema>;
export type CategoryScore = z.infer<typeof CategoryScoreSchema>;
