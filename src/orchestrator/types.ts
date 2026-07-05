/**
 * Master Orchestrator types. The Orchestrator composes agents into declarative
 * workflows (e.g. "Full Prospect Workup"). Full implementation lands in Phase 8,
 * once there are agents to compose — but the types are defined now so the data
 * model + job layer align with them.
 */

/** One step in a workflow: run an agent, optionally after others complete. */
export interface WorkflowStep {
  id: string;
  agent: string; // agent name from the registry
  dependsOn?: string[]; // step ids that must finish first (enables parallelism)
  /** Map prior step outputs → this step's input. Defined per workflow. */
  mapInput?: (context: Record<string, unknown>) => Record<string, unknown>;
}

export interface WorkflowDefinition {
  name: string;
  description: string;
  steps: WorkflowStep[];
}
