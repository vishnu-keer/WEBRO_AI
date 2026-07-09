"use client";

import { useActionState } from "react";
import { runProposalAction } from "@/server/actions/proposal";
import type { ProposalFormState } from "@/server/actions/types";
import { Button } from "@/components/ui/button";

const initial: ProposalFormState = {};
const inputCls =
  "rounded-md border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent";

export function ProposalForm() {
  const [state, formAction, pending] = useActionState(runProposalAction, initial);
  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input name="url" type="text" required placeholder="Prospect website (https://...)" className={inputCls} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <input name="scope" type="text" placeholder="Scope (optional, e.g. new 5-page site + booking)" className={`flex-1 ${inputCls}`} />
        <Button type="submit" disabled={pending}>
          {pending ? "Writing…" : "Generate proposal"}
        </Button>
      </div>
      {pending && <p className="text-xs text-foreground/50">Reading the site + your knowledge base — ~20-40s.</p>}
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
