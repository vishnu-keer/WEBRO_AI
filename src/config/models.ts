/**
 * Central model routing. Every agent references a role here (never a raw model
 * string), so re-routing all agents to a new model is a one-line change.
 *
 * NOTE: confirm exact model IDs + pricing against the current Anthropic API
 * before production — they are versioned and change over time.
 */
export const MODELS = {
  /** Balanced workhorse — default for most agent reasoning. */
  reasoning: "claude-sonnet-5",
  /** Cheap + fast — bulk extraction, classification, assembly. */
  fast: "claude-haiku-4-5-20251001",
  /** Most capable — reserve for high-stakes output (e.g. big proposals). */
  deep: "claude-opus-4-8",
  /** Creative-leaning — candidate for ad/email copy (verify suitability). */
  creative: "claude-fable-5",
} as const;

export type ModelRole = keyof typeof MODELS;
export type ModelId = (typeof MODELS)[ModelRole] | (string & {});

/**
 * USD per 1M tokens. PLACEHOLDER values — replace with live pricing so the
 * cost figures written to `agent_runs` are accurate.
 */
export const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  "claude-sonnet-5": { input: 3, output: 15 },
  "claude-haiku-4-5-20251001": { input: 0.8, output: 4 },
  "claude-opus-4-8": { input: 15, output: 75 },
  "claude-fable-5": { input: 3, output: 15 },
  // Gemini free-tier models cost $0 — listed so cost logging is explicit (0), not "unknown".
  "gemini-2.0-flash": { input: 0, output: 0 },
  "gemini-2.5-flash": { input: 0, output: 0 },
};

/** Compute run cost in USD from token counts. Returns 0 for unknown models. */
export function estimateCostUsd(model: string, inputTokens: number, outputTokens: number): number {
  const p = MODEL_PRICING[model];
  if (!p) return 0;
  return (inputTokens / 1_000_000) * p.input + (outputTokens / 1_000_000) * p.output;
}

/**
 * Gemini model used when LLM_PROVIDER=gemini. Override with GEMINI_MODEL in .env.local.
 *
 * Default is `gemini-2.0-flash` on purpose:
 *  - Free tier allows ~1,500 requests/day (gemini-2.5-flash's free cap is far smaller,
 *    which is what caused the "quota exceeded" 429 on the proposal step).
 *  - It is NOT a "thinking" model, so its whole output budget goes to the JSON answer.
 *    (gemini-2.5-flash spends tokens on hidden thinking, which truncated the big audit
 *    JSON mid-string — the "Unterminated string in JSON" error.)
 */
export function geminiModel(): string {
  return process.env.GEMINI_MODEL || "gemini-2.0-flash";
}
