import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "critical" | "high" | "medium" | "low" | "success" | "neutral";

const TONES: Record<BadgeTone, string> = {
  critical: "bg-red-500/15 text-red-400",
  high: "bg-orange-500/15 text-orange-400",
  medium: "bg-amber-500/15 text-amber-300",
  low: "bg-emerald-500/15 text-emerald-300",
  success: "bg-emerald-500/15 text-emerald-300",
  neutral: "bg-foreground/10 text-foreground/70",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
