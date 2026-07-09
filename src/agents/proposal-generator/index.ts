/** Proposal Generator Agent — the AgentSpec (plugs into the shared Runner). */
import { registerAgent, type AgentSpec } from "@/agents/core";
import { MODELS } from "@/config/models";
import { PROPOSAL_SYSTEM_PROMPT } from "./prompt";
import { ProposalInputSchema, ProposalOutputSchema, type ProposalInput, type ProposalOutput } from "./schema";

function renderInput(input: ProposalInput): string {
  const b = input.business;
  const audit = input.auditSummary
    ? `## Audit findings for this prospect
Summary: ${input.auditSummary}
Issues: ${(input.auditFindings ?? []).join("; ") || "(none listed)"}`
    : "## Audit findings\n(no prior audit — infer likely improvements from their site)";

  return `Write a WEBRO proposal for this prospect.

Requested scope: ${input.scope ?? "(recommend the best scope)"}
Prospect website: ${input.url}
Title: ${b.title ?? "(none)"}
Description: ${b.description ?? "(none)"}

## Prospect website content
${b.content || "(no content)"}

${audit}

## WEBRO knowledge base (company, portfolio, pricing, template, scripts)
${input.knowledgeBase}`;
}

export const proposalAgent: AgentSpec<ProposalInput, ProposalOutput> = {
  name: "proposal-generator",
  version: "1.0.0",
  model: MODELS.reasoning,
  input: ProposalInputSchema,
  output: ProposalOutputSchema,
  systemPrompt: PROPOSAL_SYSTEM_PROMPT,
  maxTokens: 8000,
  formatInput: renderInput,
};

registerAgent(proposalAgent);
