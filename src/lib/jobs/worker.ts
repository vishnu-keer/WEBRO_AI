/**
 * The queue drainer. Reads jobs and dispatches each to a handler registered by
 * type. In Phase 0 the handler map is EMPTY — agents register themselves in
 * their own phases. Unknown jobs are logged and acked so the queue never jams.
 */
import { readJobs, ackJob } from "./queue";
import type { AgentJob } from "./types";

export type JobHandler = (job: AgentJob) => Promise<void>;

const handlers = new Map<string, JobHandler>();

/** Agents call this (in later phases) to wire their job type to their runner. */
export function registerJobHandler(type: string, handler: JobHandler) {
  handlers.set(type, handler);
}

export async function processBatch(qty = 5): Promise<{ processed: number; skipped: number }> {
  const messages = await readJobs(qty);
  let processed = 0;
  let skipped = 0;

  for (const msg of messages) {
    const handler = handlers.get(msg.message.type);
    if (!handler) {
      console.warn(`[worker] no handler for job type "${msg.message.type}" — acking (Phase 0).`);
      await ackJob(msg.msgId);
      skipped++;
      continue;
    }
    try {
      await handler(msg.message);
      await ackJob(msg.msgId);
      processed++;
    } catch (err) {
      // Leave the message on the queue; pgmq visibility timeout will retry it.
      console.error(`[worker] job "${msg.message.type}" failed:`, err);
    }
  }
  return { processed, skipped };
}
