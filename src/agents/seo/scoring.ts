/** Deterministic overall SEO score from fixed category weights. */
import type { SeoAuditOutput } from "./schema";

export const SEO_CATEGORY_WEIGHTS = {
  indexability: 0.16,
  contentQuality: 0.16,
  metadata: 0.12,
  aeoReadiness: 0.12,
  performance: 0.12,
  structuredData: 0.1,
  mobile: 0.08,
  links: 0.08,
  security: 0.06,
} as const; // sums to 1.00

export function computeSeoScore(categoryScores: SeoAuditOutput["categoryScores"]): number {
  let total = 0;
  for (const [key, weight] of Object.entries(SEO_CATEGORY_WEIGHTS)) {
    total += categoryScores[key as keyof typeof SEO_CATEGORY_WEIGHTS].score * weight;
  }
  return Math.round(total);
}

export function toGrade(score: number): SeoAuditOutput["grade"] {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
