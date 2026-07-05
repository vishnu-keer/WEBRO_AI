import { NextResponse } from "next/server";

/**
 * Firecrawl async-crawl webhook. When a large crawl finishes, Firecrawl POSTs
 * here; a later phase will enqueue the follow-up agent job. Placeholder for now.
 * TODO(Phase 1+): verify signature, then enqueue the audit continuation.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  console.log("[firecrawl webhook]", body?.type ?? "unknown-event");
  return NextResponse.json({ received: true });
}
