/**
 * Thin wrapper over Supabase Queues (pgmq) via RPC. Keeps the rest of the app
 * ignorant of the queue implementation so we can swap to Inngest/Trigger.dev
 * later without touching callers (Design principle #4).
 */
import { createAdminClient } from "@/lib/supabase/admin";
import { AGENT_JOB_QUEUE } from "@/config/constants";
import type { Json } from "@/types/database";
import type { AgentJob, QueueMessage } from "./types";

export async function enqueueJob(job: AgentJob, delaySeconds = 0): Promise<number> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("pgmq_send", {
    queue_name: AGENT_JOB_QUEUE,
    msg: job as unknown as Json,
    delay: delaySeconds,
  });
  if (error) throw error;
  return data as number;
}

export async function readJobs(qty = 5, visibilitySeconds = 120): Promise<QueueMessage<AgentJob>[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("pgmq_read", {
    queue_name: AGENT_JOB_QUEUE,
    vt: visibilitySeconds,
    qty,
  });
  if (error) throw error;
  return ((data ?? []) as any[]).map((m) => ({
    msgId: m.msg_id,
    readCount: m.read_ct,
    enqueuedAt: m.enqueued_at,
    message: m.message as AgentJob,
  }));
}

export async function ackJob(msgId: number): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.rpc("pgmq_delete", { queue_name: AGENT_JOB_QUEUE, msg_id: msgId });
  if (error) throw error;
}
