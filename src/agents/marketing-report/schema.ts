/** Types + Zod schemas for the Marketing Report Generator Agent. */
import { z } from "zod";

const BusinessContextSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string(),
});
export type BusinessContext = z.infer<typeof BusinessContextSchema>;

export const ReportInputSchema = z.object({
  url: z.string().url(),
  business: BusinessContextSchema,
  auditSummary: z.string().optional(),
  seoSummary: z.string().optional(),
  competitorSummary: z.string().optional(),
});
export type ReportInput = z.infer<typeof ReportInputSchema>;

export const RunReportRequestSchema = z.object({
  url: z.string().url(),
  leadId: z.string().uuid().optional(),
});
export type RunReportRequest = z.infer<typeof RunReportRequestSchema>;

export const MarketingReportOutputSchema = z.object({
  url: z.string(),
  clientName: z.string(),
  title: z.string(),
  executiveSummary: z.string(),
  currentState: z.string().describe("Where the business is today, in plain language."),
  keyFindings: z
    .array(z.object({ area: z.string(), finding: z.string() }))
    .describe("Grouped findings, e.g. area = Website, SEO, Competitors, Conversion."),
  priorities: z
    .array(z.object({ title: z.string(), why: z.string(), impact: z.string() }))
    .describe("Top prioritized recommendations."),
  expectedImpact: z.string().describe("Realistic outcome if the priorities are done."),
  recommendation: z.string().describe("The overall recommendation / what WEBRO would do."),
});
export type MarketingReportOutput = z.infer<typeof MarketingReportOutputSchema>;
