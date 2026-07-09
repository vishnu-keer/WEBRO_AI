import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReportView } from "@/components/reports/report-view";
import type { MarketingReportOutput } from "@/agents/marketing-report/schema";

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("reports").select("id, data, created_at").eq("id", id).single();
  if (!data?.data) notFound();
  return <ReportView report={data.data as MarketingReportOutput} createdAt={data.created_at} />;
}
