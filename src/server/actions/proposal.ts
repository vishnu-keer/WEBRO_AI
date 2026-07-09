"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getWorkspaceContext } from "@/lib/auth/context";
import { runProposalGenerator } from "@/agents/proposal-generator/run";

function normalizeUrl(input: string): string {
  const v = input.trim();
  if (!v) return v;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

export async function runProposalAction(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const url = normalizeUrl(String(formData.get("url") ?? ""));
  const scope = String(formData.get("scope") ?? "").trim() || undefined;
  const parsed = z.string().url().safeParse(url);
  if (!parsed.success) return { error: "Please enter a valid website URL." };

  let proposalId: string;
  try {
    const ctx = await getWorkspaceContext();
    const res = await runProposalGenerator({ url: parsed.data, scope }, ctx);
    proposalId = res.proposalId;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Proposal generation failed. Please try again." };
  }
  redirect(`/dashboard/proposals/${proposalId}`);
}
