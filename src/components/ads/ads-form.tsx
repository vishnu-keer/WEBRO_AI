"use client";

import { useActionState } from "react";
import { runAdsAction } from "@/server/actions/ads";
import type { AdsFormState } from "@/server/actions/types";
import { Button } from "@/components/ui/button";

const initial: AdsFormState = {};
const inputCls =
  "rounded-md border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent";

export function AdsForm() {
  const [state, formAction, pending] = useActionState(runAdsAction, initial);
  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input name="url" type="text" required placeholder="Business website (https://...)" className={inputCls} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <select name="platform" defaultValue="Meta (Facebook & Instagram)" className={`flex-1 ${inputCls}`}>
          <option>Meta (Facebook &amp; Instagram)</option>
          <option>Google Search</option>
          <option>Instagram</option>
          <option>LinkedIn</option>
        </select>
        <input name="objective" type="text" placeholder="Goal (optional, e.g. more bookings)" className={`flex-1 ${inputCls}`} />
        <Button type="submit" disabled={pending}>
          {pending ? "Writing…" : "Generate ads"}
        </Button>
      </div>
      {pending && <p className="text-xs text-foreground/50">Reading the site + writing ad variants — ~15-30s.</p>}
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
