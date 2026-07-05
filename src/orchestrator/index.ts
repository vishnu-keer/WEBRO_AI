/**
 * Master Orchestrator — Phase 8.
 *
 * Placeholder surface. The real engine will: create a `workflow_runs` row, walk
 * the step DAG, enqueue independent steps in parallel via the job queue, thread
 * each agent's output into dependents, and stream progress to the dashboard
 * over Supabase Realtime.
 */
export * from "./types";

// export async function runWorkflow(def, input, ctx) { /* Phase 8 */ }
