import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EmailReport } from "@/components/emails/email-report";
import type { EmailSequenceOutput } from "@/agents/email-sequence/schema";

export default async function EmailDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("email_sequences").select("id, data, created_at").eq("id", id).single();
  if (!data?.data) notFound();
  return <EmailReport sequence={data.data as EmailSequenceOutput} createdAt={data.created_at} />;
}
