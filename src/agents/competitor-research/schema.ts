/** Types + Zod schemas for the Competitor Research Agent. */
import { z } from "zod";

const SiteSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string(),
});
export type Site = z.infer<typeof SiteSchema>;

export const ResearchContextSchema = z.object({
  target: SiteSchema,
  candidates: z.array(SiteSchema),
  location: z.string().optional(),
  industry: z.string().optional(),
});
export type ResearchContext = z.infer<typeof ResearchContextSchema>;

export const CompetitorInputSchema = z.object({
  url: z.string().url(),
  location: z.string().optional(),
  industry: z.string().optional(),
  research: ResearchContextSchema,
});
export type CompetitorInput = z.infer<typeof CompetitorInputSchema>;

/** What the UI/service passes in. */
export const RunCompetitorRequestSchema = z.object({
  url: z.string().url(),
  location: z.string().optional(),
  industry: z.string().optional(),
  leadId: z.string().uuid().optional(),
});
export type RunCompetitorRequest = z.infer<typeof RunCompetitorRequestSchema>;

export const CompetitorAnalysisOutputSchema = z.object({
  targetUrl: z.string(),
  targetSummary: z.string().describe("What the prospect's business does, in 1-2 sentences."),
  positioning: z.string().describe("How the prospect is positioned versus the competitors."),
  competitors: z
    .array(
      z.object({
        name: z.string(),
        website: z.string(),
        summary: z.string(),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        websiteComparison: z
          .string()
          .describe("How this competitor's WEBSITE compares to the prospect's."),
      }),
    )
    .describe("The real competitors found, worst-to-best or as ranked."),
  opportunities: z
    .array(z.string())
    .describe("Concrete openings where the prospect can win, especially via a better website."),
  webroPitch: z
    .string()
    .describe("A short, human, trust-first angle WEBRO can use to open a conversation with the prospect."),
});
export type CompetitorAnalysisOutput = z.infer<typeof CompetitorAnalysisOutputSchema>;
