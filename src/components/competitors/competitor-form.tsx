"use client";

import { useActionState } from "react";
import { runCompetitorAction } from "@/server/actions/competitor";
import type { CompetitorFormState } from "@/server/actions/types";
import { Button } from "@/components/ui/button";

const initial: CompetitorFormState = {};
const inputCls =
  "rounded-md border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent";

export function CompetitorForm() {
  const [state, formAction, pending] = useActionState(runCompetitorAction, initial);
  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input name="url" type="text" required placeholder="Prospect website (https://...)" className={inputCls} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <input name="location" type="text" placeholder="Location (optional, e.g. Hyderabad)" className={`flex-1 ${inputCls}`} />
        <input name="industry" type="text" placeholder="Business type (optional, e.g. gym)" className={`flex-1 ${inputCls}`} />
        <Button type="submit" disabled={pending}>
          {pending ? "Researching…" : "Find competitors"}
        </Button>
      </div>
      {pending && <p className="text-xs text-foreground/50">Searching + reading competitor sites — ~30-60s.</p>}
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
