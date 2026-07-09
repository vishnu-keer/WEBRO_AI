"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getWorkspaceContext } from "@/lib/auth/context";
import { runMarketingReport } from "@/agents/marketing-report/run";

function normalizeUrl(input: string): string {
  const v = input.trim();
  if (!v) return v;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

export async function runReportAction(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const url = normalizeUrl(String(formData.get("url") ?? ""));
  const parsed = z.string().url().safeParse(url);
  if (!parsed.success) return { error: "Please enter a valid website URL." };

  let reportId: string;
  try {
    const ctx = await getWorkspaceContext();
    const res = await runMarketingReport({ url: parsed.data }, ctx);
    reportId = res.reportId;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Report generation failed. Please try again." };
  }
  redirect(`/dashboard/reports/${reportId}`);
}
