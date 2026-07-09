/** Competitor Research Agent — the AgentSpec (plugs into the shared Runner). */
import { registerAgent, type AgentSpec } from "@/agents/core";
import { MODELS } from "@/config/models";
import { COMPETITOR_SYSTEM_PROMPT } from "./prompt";
import {
  CompetitorInputSchema,
  CompetitorAnalysisOutputSchema,
  type CompetitorInput,
  type CompetitorAnalysisOutput,
} from "./schema";

function renderSite(label: string, s: { url: string; title?: string; description?: string; content: string }): string {
  return `### ${label}: ${s.url}
Title: ${s.title ?? "(none)"}
Description: ${s.description ?? "(none)"}
Content:
${s.content || "(no content)"}`;
}

function renderInput(input: CompetitorInput): string {
  const r = input.research;
  const ctx = [
    `Prospect (target): ${input.url}`,
    input.location ? `Location: ${input.location}` : "",
    input.industry ? `Industry: ${input.industry}` : "",
    "",
    renderSite("PROSPECT", r.target),
    "",
    "## Candidate competitors (from web search):",
    ...r.candidates.map((c, i) => renderSite(`CANDIDATE ${i + 1}`, c)),
  ]
    .filter(Boolean)
    .join("\n");
  return ctx;
}

export const competitorAgent: AgentSpec<CompetitorInput, CompetitorAnalysisOutput> = {
  name: "competitor-research",
  version: "1.0.0",
  model: MODELS.reasoning,
  input: CompetitorInputSchema,
  output: CompetitorAnalysisOutputSchema,
  systemPrompt: COMPETITOR_SYSTEM_PROMPT,
  maxTokens: 8000,
  formatInput: renderInput,
};

registerAgent(competitorAgent);
