/**
 * Master Orchestrator types. The orchestrator composes agents into a workflow —
 * the "Full Prospect Workup".
 */
export interface WorkflowStepResult {
  key: string;
  label: string;
  status: "done" | "error";
  outputId?: string;
  route?: string;
  error?: string;
}

export interface WorkflowContext {
  url: string;
  steps: WorkflowStepResult[];
}
