/**
 * The agent registry. Concrete agents register themselves here (Phase 1+), which
 * lets the API layer + orchestrator look them up by name. Empty in Phase 0.
 */
import type { AgentSpec } from "./types";

const registry = new Map<string, AgentSpec<unknown, unknown>>();

export function registerAgent<I, O>(spec: AgentSpec<I, O>): void {
  registry.set(spec.name, spec as AgentSpec<unknown, unknown>);
}

export function getAgent(name: string): AgentSpec<unknown, unknown> | undefined {
  return registry.get(name);
}

export function listAgents(): string[] {
  return [...registry.keys()];
}
