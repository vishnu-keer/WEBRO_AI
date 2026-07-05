/** App-wide constants. Keep magic numbers/strings here, not scattered in code. */

/** pgmq queue name the orchestrator enqueues agent jobs onto. */
export const AGENT_JOB_QUEUE = "agent_jobs";

/** RAG namespaces — logical scopes within the knowledge base. */
export const RAG_NAMESPACES = {
  company: "company",
  portfolio: "portfolio",
  pricing: "pricing",
  proposalTemplate: "proposal_template",
  salesScripts: "sales_scripts",
} as const;

/** Default Firecrawl crawl page cap (keeps cost + latency bounded). */
export const DEFAULT_CRAWL_LIMIT = 25;

/** Lead lifecycle stages surfaced in the dashboard. */
export const LEAD_STATUSES = [
  "new",
  "researching",
  "qualified",
  "contacted",
  "proposal_sent",
  "won",
  "lost",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
