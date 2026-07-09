"use client";

import { useActionState } from "react";
import { findLeadsAction } from "@/server/actions/leads";
import type { LeadsFormState } from "@/server/actions/types";
import { Button } from "@/components/ui/button";

const initial: LeadsFormState = {};
const inputCls =
  "rounded-md border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent";

export function LeadsForm() {
  const [state, formAction, pending] = useActionState(findLeadsAction, initial);
  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input name="businessType" type="text" required placeholder="Business type (e.g. gyms, dentists)" className={`flex-1 ${inputCls}`} />
        <input name="location" type="text" required placeholder="Location (e.g. Hyderabad)" className={`flex-1 ${inputCls}`} />
        <Button type="submit" disabled={pending}>
          {pending ? "Finding…" : "Find leads"}
        </Button>
      </div>
      {pending && <p className="text-xs text-foreground/50">Searching the web + building your list — ~20-40s.</p>}
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.message && <p className="text-sm text-emerald-400">{state.message}</p>}
    </form>
  );
}
