import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkflowView } from "@/components/workflows/workflow-view";
import type { WorkflowContext } from "@/orchestrator/types";

export default async function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("workflow_runs").select("id, status, context, created_at").eq("id", id).single();
  if (!data) notFound();
  return (
    <WorkflowView
      context={data.context as unknown as WorkflowContext}
      status={data.status as string}
      createdAt={data.created_at as string}
    />
  );
}
