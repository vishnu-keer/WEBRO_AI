/** Marketing Report Generator — the AgentSpec (plugs into the shared Runner). */
import { registerAgent, type AgentSpec } from "@/agents/core";
import { MODELS } from "@/config/models";
import { REPORT_SYSTEM_PROMPT } from "./prompt";
import { ReportInputSchema, MarketingReportOutputSchema, type ReportInput, type MarketingReportOutput } from "./schema";

function renderInput(input: ReportInput): string {
  const b = input.business;
  return `Write a marketing report for this business.

Website: ${input.url}
Title: ${b.title ?? "(none)"}
Description: ${b.description ?? "(none)"}

## Website content
${b.content || "(no content)"}

## Audit
${input.auditSummary ?? "(no audit on file — note that running one would help)"}

## SEO
${input.seoSummary ?? "(no SEO analysis on file — note that running one would help)"}

## Competitors
${input.competitorSummary ?? "(no competitor research on file — note that running it would help)"}`;
}

export const reportAgent: AgentSpec<ReportInput, MarketingReportOutput> = {
  name: "marketing-report",
  version: "1.0.0",
  model: MODELS.reasoning,
  input: ReportInputSchema,
  output: MarketingReportOutputSchema,
  systemPrompt: REPORT_SYSTEM_PROMPT,
  maxTokens: 8000,
  formatInput: renderInput,
};

registerAgent(reportAgent);
