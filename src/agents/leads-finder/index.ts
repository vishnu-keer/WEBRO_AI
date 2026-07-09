/** Leads Finder Agent — the AgentSpec (plugs into the shared Runner). */
import { registerAgent, type AgentSpec } from "@/agents/core";
import { MODELS } from "@/config/models";
import { LEADS_SYSTEM_PROMPT } from "./prompt";
import { LeadsInputSchema, LeadsFinderOutputSchema, type LeadsInput, type LeadsFinderOutput } from "./schema";

function renderInput(input: LeadsInput): string {
  const rows = input.results
    .map((r, i) => `${i + 1}. ${r.title ?? "(no title)"} — ${r.url ?? "(no url)"}\n   ${r.description ?? ""}`)
    .join("\n");
  return `Find WEBRO prospects: ${input.businessType} in ${input.location}.

Search results:
${rows || "(no results)"}`;
}

export const leadsAgent: AgentSpec<LeadsInput, LeadsFinderOutput> = {
  name: "leads-finder",
  version: "1.0.0",
  model: MODELS.reasoning,
  input: LeadsInputSchema,
  output: LeadsFinderOutputSchema,
  systemPrompt: LEADS_SYSTEM_PROMPT,
  maxTokens: 6000,
  formatInput: renderInput,
};

registerAgent(leadsAgent);
