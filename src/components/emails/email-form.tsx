"use client";

import { useActionState } from "react";
import { runEmailAction } from "@/server/actions/email";
import type { EmailFormState } from "@/server/actions/types";
import { Button } from "@/components/ui/button";

const initial: EmailFormState = {};
const inputCls =
  "rounded-md border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent";

export function EmailForm() {
  const [state, formAction, pending] = useActionState(runEmailAction, initial);
  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input name="url" type="text" required placeholder="Prospect website (https://...)" className={inputCls} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <input name="goal" type="text" placeholder="Goal (optional, e.g. book a call about their website)" className={`flex-1 ${inputCls}`} />
        <Button type="submit" disabled={pending}>
          {pending ? "Writing…" : "Write sequence"}
        </Button>
      </div>
      {pending && <p className="text-xs text-foreground/50">Reading the site + writing the emails — ~15-30s.</p>}
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
