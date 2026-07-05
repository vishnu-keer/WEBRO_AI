/**
 * The single Anthropic entry point. Everything that talks to Claude goes through
 * here, so switching models/providers touches one file (Design principle #2).
 */
import Anthropic from "@anthropic-ai/sdk";
import { serverEnv } from "@/config/env";

let _client: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (!_client) _client = new Anthropic({ apiKey: serverEnv().ANTHROPIC_API_KEY });
  return _client;
}

export type TokenUsage = { inputTokens: number; outputTokens: number };
