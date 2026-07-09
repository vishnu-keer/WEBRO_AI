import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CompetitorReport } from "@/components/competitors/competitor-report";
import type { CompetitorAnalysisOutput } from "@/agents/competitor-research/schema";

export default async function CompetitorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("competitors").select("id, data, created_at").eq("id", id).single();
  if (!data?.data) notFound();
  return <CompetitorReport analysis={data.data as CompetitorAnalysisOutput} createdAt={data.created_at} />;
}
