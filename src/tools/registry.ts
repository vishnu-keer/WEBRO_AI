/**
 * Tool registry + bridge to the Claude tool-use loop. Register a tool once, then
 * grant it to any agent by name. `buildToolLoopTools` binds a ToolContext and
 * converts Zod schemas into the JSON schema Claude expects.
 */
import { zodToJsonSchema } from "zod-to-json-schema";
import type Anthropic from "@anthropic-ai/sdk";
import type { Tool, ToolContext } from "./types";
import type { ToolLoopTool } from "@/lib/claude/tool-use";

const registry = new Map<string, Tool>();

export function registerTool<I, O>(tool: Tool<I, O>): void {
  registry.set(tool.name, tool as unknown as Tool);
}

export function getTool(name: string): Tool | undefined {
  return registry.get(name);
}

export function listTools(): string[] {
  return [...registry.keys()];
}

/** Bind a context to the named tools and shape them for `runToolLoop`. */
export function buildToolLoopTools(names: string[], ctx: ToolContext): ToolLoopTool[] {
  return names.map((name) => {
    const tool = registry.get(name);
    if (!tool) throw new Error(`Unknown tool: ${name}`);
    return {
      name: tool.name,
      description: tool.description,
      input_schema: zodToJsonSchema(tool.inputSchema, {
        target: "openApi3",
        $refStrategy: "none",
      }) as Anthropic.Tool["input_schema"],
      execute: (input: unknown) => tool.execute(input, ctx),
    };
  });
}
