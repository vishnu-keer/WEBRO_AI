/** Email Campaign Agent — the AgentSpec (plugs into the shared Runner). */
import { registerAgent, type AgentSpec } from "@/agents/core";
import { MODELS } from "@/config/models";
import { EMAIL_SYSTEM_PROMPT } from "./prompt";
import { EmailInputSchema, EmailSequenceOutputSchema, type EmailInput, type EmailSequenceOutput } from "./schema";

function renderInput(input: EmailInput): string {
  const b = input.business;
  return `Write an outreach email sequence to win this prospect as a web-design client.

Goal: ${input.goal ?? "(infer: start a conversation + book a short call)"}
Prospect website: ${input.url}
Title: ${b.title ?? "(none)"}
Description: ${b.description ?? "(none)"}

Website content:
${b.content || "(no content)"}`;
}

export const emailAgent: AgentSpec<EmailInput, EmailSequenceOutput> = {
  name: "email-sequence",
  version: "1.0.0",
  model: MODELS.reasoning,
  input: EmailInputSchema,
  output: EmailSequenceOutputSchema,
  systemPrompt: EMAIL_SYSTEM_PROMPT,
  maxTokens: 8000,
  formatInput: renderInput,
};

registerAgent(emailAgent);
