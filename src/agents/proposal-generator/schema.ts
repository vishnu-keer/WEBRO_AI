/** Types + Zod schemas for the Proposal Generator Agent. */
import { z } from "zod";

const BusinessContextSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string(),
});
export type BusinessContext = z.infer<typeof BusinessContextSchema>;

export const ProposalInputSchema = z.object({
  url: z.string().url(),
  scope: z.string().optional(),
  business: BusinessContextSchema,
  knowledgeBase: z.string(),
  auditSummary: z.string().optional(),
  auditFindings: z.array(z.string()).optional(),
});
export type ProposalInput = z.infer<typeof ProposalInputSchema>;

export const RunProposalRequestSchema = z.object({
  url: z.string().url(),
  scope: z.string().optional(),
  leadId: z.string().uuid().optional(),
});
export type RunProposalRequest = z.infer<typeof RunProposalRequestSchema>;

export const ProposalOutputSchema = z.object({
  url: z.string(),
  clientName: z.string().describe("The prospect's business name."),
  title: z.string().describe("Proposal title."),
  understanding: z.string().describe("The client's situation and goals, in their terms."),
  findings: z.array(z.string()).describe("Key problems (use the audit findings if provided)."),
  solution: z.string().describe("What WEBRO will build and why."),
  deliverables: z.array(z.string()),
  timeline: z.array(z.object({ phase: z.string(), duration: z.string() })),
  pricing: z.array(z.object({ item: z.string(), price: z.string() })),
  investmentNote: z.string().describe("Payment terms / total framing. Do NOT invent exact prices not in the knowledge base."),
  proof: z.string().describe("Why WEBRO — relevant portfolio/capability from the knowledge base."),
  nextStep: z.string().describe("One clear, low-pressure call-to-action."),
});
export type ProposalOutput = z.infer<typeof ProposalOutputSchema>;
