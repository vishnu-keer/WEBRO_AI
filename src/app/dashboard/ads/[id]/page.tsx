import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdsReport } from "@/components/ads/ads-report";
import type { AdsOutput } from "@/agents/ad-copy/schema";

export default async function AdsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("ad_copy").select("id, data, created_at").eq("id", id).single();
  if (!data?.data) notFound();
  return <AdsReport ads={data.data as AdsOutput} createdAt={data.created_at} />;
}
