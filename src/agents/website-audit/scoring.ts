/**
 * Deterministic overall scoring. The model scores each category; WE compute the
 * headline /100 from fixed weights so scores are consistent and defensible
 * across audits (the model can't drift the top-line number).
 */
import type { WebsiteAuditOutput } from "./schema";

export const CATEGORY_WEIGHTS = {
  conversion: 0.18,
  cta: 0.14,
  ux: 0.14,
  trustSignals: 0.12,
  visualDesign: 0.1,
  navigation: 0.1,
  mobileResponsiveness: 0.1,
  branding: 0.07,
  pageSpeed: 0.05,
} as const; // sums to 1.00

export function computeOverallScore(
  categoryScores: WebsiteAuditOutput["categoryScores"],
): number {
  let total = 0;
  for (const [key, weight] of Object.entries(CATEGORY_WEIGHTS)) {
    total += categoryScores[key as keyof typeof CATEGORY_WEIGHTS].score * weight;
  }
  return Math.round(total);
}

export function toGrade(score: number): WebsiteAuditOutput["grade"] {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
