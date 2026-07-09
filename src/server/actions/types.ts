/** Shared types for audit server actions (kept out of the "use server" file,
 *  which may only export async functions). */
export interface AuditFormState {
  error?: string;
}

export interface SeoFormState {
  error?: string;
}

export interface CompetitorFormState {
  error?: string;
}

export interface AdsFormState {
  error?: string;
}

export interface EmailFormState {
  error?: string;
}

export interface ProposalFormState {
  error?: string;
}

export interface LeadsFormState {
  error?: string;
  message?: string;
}

export interface ReportFormState {
  error?: string;
}

export interface WorkflowFormState {
  error?: string;
}
