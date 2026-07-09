import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SeoReport } from "@/components/seo/seo-report";
import type { SeoAuditOutput } from "@/agents/seo/schema";

export default async function SeoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("seo_reports").select("id, data, created_at").eq("id", id).single();
  if (!data?.data) notFound();
  return <SeoReport report={data.data as SeoAuditOutput} createdAt={data.created_at} />;
}
