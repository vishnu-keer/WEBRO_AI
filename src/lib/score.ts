/** Score → colour helpers, shared across audit UI so colours stay consistent. */
export function scoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export function gradeColor(grade: string): string {
  return { A: "#22c55e", B: "#84cc16", C: "#eab308", D: "#f97316", F: "#ef4444" }[grade] ?? "#a1a1aa";
}
