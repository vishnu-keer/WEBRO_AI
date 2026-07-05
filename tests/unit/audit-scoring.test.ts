import { describe, it, expect } from "vitest";
import { computeOverallScore, toGrade, CATEGORY_WEIGHTS } from "@/agents/website-audit/scoring";

const cat = (score: number) => ({ score, summary: "", findings: [] });
const uniform = (n: number) => ({
  branding: cat(n),
  visualDesign: cat(n),
  ux: cat(n),
  mobileResponsiveness: cat(n),
  navigation: cat(n),
  pageSpeed: cat(n),
  trustSignals: cat(n),
  cta: cat(n),
  conversion: cat(n),
});

describe("audit scoring", () => {
  it("category weights sum to 1", () => {
    const sum = Object.values(CATEGORY_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
  });
  it("uniform category scores produce the same overall", () => {
    expect(computeOverallScore(uniform(80))).toBe(80);
    expect(computeOverallScore(uniform(0))).toBe(0);
  });
  it("maps grades correctly", () => {
    expect(toGrade(95)).toBe("A");
    expect(toGrade(83)).toBe("B");
    expect(toGrade(72)).toBe("C");
    expect(toGrade(61)).toBe("D");
    expect(toGrade(40)).toBe("F");
  });
});
