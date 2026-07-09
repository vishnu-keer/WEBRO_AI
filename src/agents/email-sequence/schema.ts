/** Types + Zod schemas for the Email Campaign Agent. */
import { z } from "zod";

const BusinessContextSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string(),
});
export type BusinessContext = z.infer<typeof BusinessContextSchema>;

export const EmailInputSchema = z.object({
  url: z.string().url(),
  goal: z.string().optional(),
  business: BusinessContextSchema,
});
export type EmailInput = z.infer<typeof EmailInputSchema>;

export const RunEmailRequestSchema = z.object({
  url: z.string().url(),
  goal: z.string().optional(),
  leadId: z.string().uuid().optional(),
});
export type RunEmailRequest = z.infer<typeof RunEmailRequestSchema>;

export const EmailSequenceOutputSchema = z.object({
  url: z.string(),
  business: z.string().describe("What the prospect's business does, 1 sentence."),
  goal: z.string(),
  steps: z
    .array(
      z.object({
        stepNumber: z.number().int().min(1),
        delayDays: z.number().int().min(0).describe("Days to wait after the previous email (0 for the first)."),
        subject: z.string(),
        body: z.string().describe("The email body. Use [First name] where a name would go."),
        purpose: z.string().describe("What this email is for, e.g. 'intro', 'value', 'proof', 'soft CTA', 'break-up'."),
      }),
    )
    .describe("A 4-5 step outreach/nurture sequence, first-to-last."),
});
export type EmailSequenceOutput = z.infer<typeof EmailSequenceOutputSchema>;
