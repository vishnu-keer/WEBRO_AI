import { createClient } from "@/lib/supabase/server";
import { AdsForm } from "@/components/ads/ads-form";
import { AdsCard } from "@/components/ads/ads-card";
import type { AdsOutput } from "@/agents/ad-copy/schema";

export default async function AdsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("ad_copy")
    .select("id, platform, data, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Ads Generator</h1>
        <p className="text-sm text-foreground/60">Generate platform-ready ad copy + A/B variants for any business.</p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <AdsForm />
      </div>

      {!rows || rows.length === 0 ? (
        <p className="text-sm text-foreground/40">No ad sets yet. Generate your first above.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => {
            const d = r.data as unknown as AdsOutput | null;
            return <AdsCard key={r.id} id={r.id} platform={r.platform} url={d?.url ?? null} createdAt={r.created_at} />;
          })}
        </div>
      )}
    </div>
  );
}

// This page triggers an AI agent via a server action; allow up to Vercel's
// 60s function limit so long Gemini calls are not cut off in production.
export const maxDuration = 60;
