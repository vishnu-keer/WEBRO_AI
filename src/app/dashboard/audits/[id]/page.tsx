import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuditReport } from "@/components/audits/audit-report";
import type { WebsiteAuditOutput } from "@/agents/website-audit/schema";

export default async function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("audits").select("id, data, created_at").eq("id", id).single();

  if (!data?.data) notFound();

  return <AuditReport audit={data.data as WebsiteAuditOutput} createdAt={data.created_at} />;
}
