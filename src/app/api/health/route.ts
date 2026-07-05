import { NextResponse } from "next/server";

/** Liveness + config check. Reports which integrations are configured — no secrets. */
export async function GET() {
  const configured = {
    supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    firecrawl: Boolean(process.env.FIRECRAWL_API_KEY),
    embeddings: Boolean(process.env.VOYAGE_API_KEY),
  };
  return NextResponse.json({ ok: true, phase: 0, configured });
}
