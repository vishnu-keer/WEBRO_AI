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
  "gemini-flash-latest": { input: 0, output: 0 },
  "gemini-flash-lite-latest": { input: 0, output: 0 },
  "gemini-2.5-flash-lite": { input: 0, output: 0 },
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
 * Gemini model used when LLM_PROVIDER=gemini. Override with GEMINI_MODEL in .env.local
 * (or in Vercel's Environment Variables in production).
 *
 * Default is the alias `gemini-flash-latest` on purpose:
 *  - It is an ALIAS Google keeps pointed at the current stable Flash model, so it never
 *    "expires". (Pinning a specific version — 2.0-flash, 2.5-flash-lite — kept breaking:
 *    Google deprecates old models and blocks them for new accounts. An alias sidesteps
 *    that permanently.)
 *  - Flash tier = fast + the cheapest option if you later enable billing.
 *  - Big output budget (65k tokens), and generateObjectGemini raises maxOutputTokens so
 *    a "thinking" model's hidden tokens can't truncate the JSON answer.
 *
 * If you ever want the smaller/cheaper variant, set GEMINI_MODEL=gemini-flash-lite-latest.
 */
export function geminiModel(): string {
  return process.env.GEMINI_MODEL || "gemini-flash-latest";
}
