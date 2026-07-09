/** Ads Generator Agent — the AgentSpec (plugs into the shared Runner). */
import { registerAgent, type AgentSpec } from "@/agents/core";
import { MODELS } from "@/config/models";
import { ADS_SYSTEM_PROMPT } from "./prompt";
import { AdInputSchema, AdsOutputSchema, type AdInput, type AdsOutput } from "./schema";

function renderInput(input: AdInput): string {
  const b = input.business;
  return `Write ads for this business.

Platform: ${input.platform}
Objective: ${input.objective ?? "(infer the best objective)"}
Website: ${input.url}
Title: ${b.title ?? "(none)"}
Description: ${b.description ?? "(none)"}

Website content:
${b.content || "(no content)"}`;
}

export const adsAgent: AgentSpec<AdInput, AdsOutput> = {
  name: "ad-copy",
  version: "1.0.0",
  model: MODELS.reasoning,
  input: AdInputSchema,
  output: AdsOutputSchema,
  systemPrompt: ADS_SYSTEM_PROMPT,
  maxTokens: 8000,
  formatInput: renderInput,
};

registerAgent(adsAgent);
