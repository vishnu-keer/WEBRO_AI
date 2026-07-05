/** Shape of a job placed on the agent queue. `type` selects the handler. */
export interface AgentJob {
  type: string; // e.g. "website-audit" (registered in Phase 1+)
  workspaceId: string;
  leadId?: string;
  workflowRunId?: string;
  payload: Record<string, unknown>;
}

/** A queue message as returned by pgmq (id/read-count + our payload). */
export interface QueueMessage<T> {
  msgId: number;
  readCount: number;
  enqueuedAt: string;
  message: T;
}
