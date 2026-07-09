"use client";

import { useActionState } from "react";
import { runWorkflowAction } from "@/server/actions/workflow";
import type { WorkflowFormState } from "@/server/actions/types";
import { Button } from "@/components/ui/button";

const initial: WorkflowFormState = {};
const inputCls =
  "rounded-md border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent";

export function WorkflowForm() {
  const [state, formAction, pending] = useActionState(runWorkflowAction, initial);
  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input name="url" type="text" required placeholder="Prospect website (https://...)" className={inputCls} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <input name="location" type="text" placeholder="Location (optional, for competitors)" className={`flex-1 ${inputCls}`} />
        <input name="industry" type="text" placeholder="Business type (optional)" className={`flex-1 ${inputCls}`} />
        <Button type="submit" disabled={pending}>
          {pending ? "Running…" : "Run full workup"}
        </Button>
      </div>
      {pending && (
        <p className="text-xs text-foreground/50">
          Running 6 agents in sequence — this takes ~2-4 minutes. Keep this tab open.
        </p>
      )}
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
