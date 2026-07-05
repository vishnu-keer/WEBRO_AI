import { describe, it, expect } from "vitest";
import { estimateCostUsd } from "@/config/models";

describe("estimateCostUsd", () => {
  it("computes cost from token counts", () => {
    // 1M input + 1M output on sonnet placeholder pricing (3 + 15).
    expect(estimateCostUsd("claude-sonnet-5", 1_000_000, 1_000_000)).toBeCloseTo(18, 5);
  });
  it("returns 0 for unknown models", () => {
    expect(estimateCostUsd("mystery-model", 1000, 1000)).toBe(0);
  });
});
