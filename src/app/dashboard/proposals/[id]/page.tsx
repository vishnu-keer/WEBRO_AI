import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProposalReport } from "@/components/proposals/proposal-report";
import type { ProposalOutput } from "@/agents/proposal-generator/schema";

export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("proposals").select("id, data, created_at").eq("id", id).single();
  if (!data?.data) notFound();
  return <ProposalReport proposal={data.data as ProposalOutput} createdAt={data.created_at} />;
}
