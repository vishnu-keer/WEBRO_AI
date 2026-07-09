"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getWorkspaceContext } from "@/lib/auth/context";
import { runFullWorkup } from "@/orchestrator/run";

function normalizeUrl(input: string): string {
  const v = input.trim();
  if (!v) return v;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

export async function runWorkflowAction(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const url = normalizeUrl(String(formData.get("url") ?? ""));
  const location = String(formData.get("location") ?? "").trim() || undefined;
  const industry = String(formData.get("industry") ?? "").trim() || undefined;
  const parsed = z.string().url().safeParse(url);
  if (!parsed.success) return { error: "Please enter a valid website URL." };

  let workflowId: string;
  try {
    const ctx = await getWorkspaceContext();
    workflowId = await runFullWorkup({ url: parsed.data, location, industry }, ctx);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Workflow failed to start. Please try again." };
  }
  redirect(`/dashboard/workflows/${workflowId}`);
}
