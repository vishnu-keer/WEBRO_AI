/**
 * The single LLM entry point. Both providers live here so switching the reasoning
 * layer is one env var (LLM_PROVIDER) — Design principle #2.
 */
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import { serverEnv } from "@/config/env";

export type LlmProvider = "anthropic" | "gemini";
export type TokenUsage = { inputTokens: number; outputTokens: number };

export function llmProvider(): LlmProvider {
  return serverEnv().LLM_PROVIDER;
}

let _anthropic: Anthropic | null = null;
export function anthropic(): Anthropic {
  const key = serverEnv().ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("LLM_PROVIDER is 'anthropic' but ANTHROPIC_API_KEY is not set in .env.local.");
  }
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: key });
  return _anthropic;
}

let _gemini: GoogleGenAI | null = null;
export function gemini(): GoogleGenAI {
  const key = serverEnv().GEMINI_API_KEY;
  if (!key) {
    throw new Error("LLM_PROVIDER is 'gemini' but GEMINI_API_KEY is not set in .env.local.");
  }
  if (!_gemini) _gemini = new GoogleGenAI({ apiKey: key });
  return _gemini;
}
