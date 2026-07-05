import { describe, it, expect } from "vitest";
import { computeSeoScore, toGrade, SEO_CATEGORY_WEIGHTS } from "@/agents/seo/scoring";

const cat = (score: number) => ({ score, summary: "", findings: [] });
const uniform = (n: number) => ({
  indexability: cat(n), metadata: cat(n), contentQuality: cat(n), structuredData: cat(n),
  mobile: cat(n), performance: cat(n), links: cat(n), security: cat(n), aeoReadiness: cat(n),
});

describe("seo scoring", () => {
  it("category weights sum to 1", () => {
    const sum = Object.values(SEO_CATEGORY_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
  });
  it("uniform scores produce the same overall", () => {
    expect(computeSeoScore(uniform(70))).toBe(70);
  });
  it("grades map correctly", () => {
    expect(toGrade(91)).toBe("A");
    expect(toGrade(55)).toBe("F");
  });
});
