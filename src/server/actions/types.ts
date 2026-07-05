/** Shared types for audit server actions (kept out of the "use server" file,
 *  which may only export async functions). */
export interface AuditFormState {
  error?: string;
}

export interface SeoFormState {
  error?: string;
}
