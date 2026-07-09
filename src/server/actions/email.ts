"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getWorkspaceContext } from "@/lib/auth/context";
import { runEmailCampaign } from "@/agents/email-sequence/run";

function normalizeUrl(input: string): string {
  const v = input.trim();
  if (!v) return v;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

export async function runEmailAction(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const url = normalizeUrl(String(formData.get("url") ?? ""));
  const goal = String(formData.get("goal") ?? "").trim() || undefined;
  const parsed = z.string().url().safeParse(url);
  if (!parsed.success) return { error: "Please enter a valid website URL." };

  let sequenceId: string;
  try {
    const ctx = await getWorkspaceContext();
    const res = await runEmailCampaign({ url: parsed.data, goal }, ctx);
    sequenceId = res.sequenceId;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Email generation failed. Please try again." };
  }
  redirect(`/dashboard/emails/${sequenceId}`);
}
