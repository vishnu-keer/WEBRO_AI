/** Shared domain types used across UI + server. */
export type { LeadStatus } from "@/config/constants";

export interface Lead {
  id: string;
  workspace_id: string;
  business_name: string;
  website: string | null;
  industry: string | null;
  location: string | null;
  contact_email: string | null;
  status: string;
  source: string | null;
  notes: string | null;
  created_at: string;
}
