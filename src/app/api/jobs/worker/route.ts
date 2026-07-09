import { NextResponse } from "next/server";
import { serverEnv } from "@/config/env";
import { processBatch } from "@/lib/jobs/worker";
import "@/tools"; // register all tools
import "@/agents"; // register all agents + their job handlers

/**
 * Job worker endpoint. Drains a batch from the queue.
 *
 * Triggered two ways, both requiring the CRON_SECRET bearer token:
 *   - Vercel Cron  -> HTTP GET  (Vercel adds `Authorization: Bearer <CRON_SECRET>`)
 *   - Manual / API -> HTTP POST
 *
 * maxDuration is raised so a batch of agent jobs isn't cut off by the default
 * serverless timeout. force-dynamic keeps it from being statically optimized.
 */
export const maxDuration = 60;
export const dynamic = "force-dynamic";

async function handle(request: Request) {
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

export const GET = handle;
export const POST = handle;
