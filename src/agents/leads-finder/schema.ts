/** Types + Zod schemas for the Leads Finder Agent. */
import { z } from "zod";

const SearchResultSchema = z.object({
  title: z.string().optional(),
  url: z.string().optional(),
  description: z.string().optional(),
});

export const LeadsInputSchema = z.object({
  businessType: z.string(),
  location: z.string(),
  results: z.array(SearchResultSchema),
});
export type LeadsInput = z.infer<typeof LeadsInputSchema>;

export const RunLeadsRequestSchema = z.object({
  businessType: z.string().min(2),
  location: z.string().min(2),
});
export type RunLeadsRequest = z.infer<typeof RunLeadsRequestSchema>;

export const LeadsFinderOutputSchema = z.object({
  leads: z
    .array(
      z.object({
        name: z.string(),
        website: z.string().optional().describe("The business's own website, if identifiable. Omit directories."),
        location: z.string().optional(),
        websiteQuality: z
          .enum(["none", "weak", "decent", "unknown"])
          .describe("Best guess at their current website quality — 'none' or 'weak' = best WEBRO prospect."),
        whyGoodLead: z.string().describe("One line on why this is a good WEBRO prospect."),
      }),
    )
    .describe("Distinct real businesses (not directories/aggregators) WEBRO could pitch."),
});
export type LeadsFinderOutput = z.infer<typeof LeadsFinderOutputSchema>;
