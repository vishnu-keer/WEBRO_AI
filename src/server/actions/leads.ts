"use server";

import { revalidatePath } from "next/cache";
import { getWorkspaceContext } from "@/lib/auth/context";
import { runLeadsFinder } from "@/agents/leads-finder/run";
import type { LeadsFormState } from "./types";

export async function findLeadsAction(_prev: LeadsFormState, formData: FormData): Promise<LeadsFormState> {
  const businessType = String(formData.get("businessType") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  if (businessType.length < 2 || location.length < 2) {
    return { error: "Enter a business type and a location." };
  }

  try {
    const ctx = await getWorkspaceContext();
    const res = await runLeadsFinder({ businessType, location }, ctx);
    revalidatePath("/dashboard/leads");
    return { message: `Added ${res.added} new lead${res.added === 1 ? "" : "s"} (found ${res.found}).` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Lead search failed. Please try again." };
  }
}
