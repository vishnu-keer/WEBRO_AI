"use client";

import { useActionState } from "react";
import { runAuditAction } from "@/server/actions/audit";
import type { AuditFormState } from "@/server/actions/types";
import { Button } from "@/components/ui/button";

const initial: AuditFormState = {};

/** URL input that runs an audit via the server action. Shows pending + errors. */
export function AuditForm() {
  const [state, formAction, pending] = useActionState(runAuditAction, initial);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name="url"
          type="text"
          required
          placeholder="https://example.com"
          className="flex-1 rounded-md border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Auditing…" : "Run audit"}
        </Button>
      </div>
      {pending && <p className="text-xs text-foreground/50">Crawling + analyzing — this can take ~15-30s.</p>}
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
