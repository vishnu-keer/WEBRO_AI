"use client";

import { useActionState } from "react";
import { runReportAction } from "@/server/actions/report";
import type { ReportFormState } from "@/server/actions/types";
import { Button } from "@/components/ui/button";

const initial: ReportFormState = {};
const inputCls =
  "flex-1 rounded-md border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent";

export function ReportForm() {
  const [state, formAction, pending] = useActionState(runReportAction, initial);
  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input name="url" type="text" required placeholder="Prospect website (https://...)" className={inputCls} />
        <Button type="submit" disabled={pending}>
          {pending ? "Building…" : "Generate report"}
        </Button>
      </div>
      {pending && <p className="text-xs text-foreground/50">Pulling their audit/SEO/competitor findings + writing — ~20-40s.</p>}
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
