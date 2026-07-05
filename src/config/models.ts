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
};

/** Compute run cost in USD from token counts. Returns 0 for unknown models. */
export function estimateCostUsd(model: string, inputTokens: number, outputTokens: number): number {
  const p = MODEL_PRICING[model];
  if (!p) return 0;
  return (inputTokens / 1_000_000) * p.input + (outputTokens / 1_000_000) * p.output;
}
