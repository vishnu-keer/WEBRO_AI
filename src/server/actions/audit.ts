"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getWorkspaceContext } from "@/lib/auth/context";
import { runWebsiteAudit } from "@/agents/website-audit/run";
import type { AuditFormState } from "./types";

function normalizeUrl(input: string): string {
  const v = input.trim();
  if (!v) return v;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

/** Runs a website audit synchronously, then redirects to the report. */
export async function runAuditAction(
  _prev: AuditFormState,
  formData: FormData,
): Promise<AuditFormState> {
  const url = normalizeUrl(String(formData.get("url") ?? ""));
  const parsed = z.string().url().safeParse(url);
  if (!parsed.success) return { error: "Please enter a valid website URL." };

  let auditId: string;
  try {
    const ctx = await getWorkspaceContext();
    const res = await runWebsiteAudit({ url: parsed.data }, ctx);
    auditId = res.auditId;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Audit failed. Please try again." };
  }
  // redirect() must live outside try/catch (it throws a control-flow signal).
  redirect(`/dashboard/audits/${auditId}`);
}
