"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getWorkspaceContext } from "@/lib/auth/context";
import { runAdsGenerator } from "@/agents/ad-copy/run";

function normalizeUrl(input: string): string {
  const v = input.trim();
  if (!v) return v;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

export async function runAdsAction(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const url = normalizeUrl(String(formData.get("url") ?? ""));
  const platform = String(formData.get("platform") ?? "Meta (Facebook & Instagram)").trim();
  const objective = String(formData.get("objective") ?? "").trim() || undefined;
  const parsed = z.string().url().safeParse(url);
  if (!parsed.success) return { error: "Please enter a valid website URL." };

  let adId: string;
  try {
    const ctx = await getWorkspaceContext();
    const res = await runAdsGenerator({ url: parsed.data, platform, objective }, ctx);
    adId = res.adId;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Ad generation failed. Please try again." };
  }
  redirect(`/dashboard/ads/${adId}`);
}
