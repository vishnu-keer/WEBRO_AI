/** Types + Zod schemas for the Ads Generator Agent. */
import { z } from "zod";

const BusinessContextSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string(),
});
export type BusinessContext = z.infer<typeof BusinessContextSchema>;

export const AdInputSchema = z.object({
  url: z.string().url(),
  platform: z.string(),
  objective: z.string().optional(),
  business: BusinessContextSchema,
});
export type AdInput = z.infer<typeof AdInputSchema>;

export const RunAdsRequestSchema = z.object({
  url: z.string().url(),
  platform: z.string().min(1),
  objective: z.string().optional(),
  leadId: z.string().uuid().optional(),
});
export type RunAdsRequest = z.infer<typeof RunAdsRequestSchema>;

export const AdsOutputSchema = z.object({
  url: z.string(),
  business: z.string().describe("What the business does, 1 sentence."),
  platform: z.string(),
  objective: z.string(),
  variants: z
    .array(
      z.object({
        angle: z.string().describe("The marketing angle/hook, e.g. 'convenience', 'local trust', 'results'."),
        headline: z.string(),
        primaryText: z.string().describe("The main body / primary text of the ad."),
        cta: z.string().describe("Call-to-action button text, e.g. 'Book a free class'."),
      }),
    )
    .describe("4-6 distinct A/B ad variants with different angles."),
  keywords: z.array(z.string()).describe("Suggested targeting keywords (most useful for search ads)."),
  targetingTips: z.string().describe("Short audience/targeting guidance for this platform."),
});
export type AdsOutput = z.infer<typeof AdsOutputSchema>;
