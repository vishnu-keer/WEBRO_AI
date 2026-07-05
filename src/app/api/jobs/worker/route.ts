import { NextResponse } from "next/server";
import { serverEnv } from "@/config/env";
import { processBatch } from "@/lib/jobs/worker";
import "@/tools"; // register all tools
import "@/agents"; // register all agents + their job handlers

/**
 * Job worker endpoint. Drains a batch from the queue. Trigger via cron
 * (Supabase pg_cron / Vercel Cron) with the CRON_SECRET bearer token.
 */
export async function POST(request: Request) {
  const secret = serverEnv().CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }
  const result = await processBatch();
  return NextResponse.json({ ok: true, ...result });
}
