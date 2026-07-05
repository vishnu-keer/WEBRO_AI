/**
 * Service-role Supabase client — BYPASSES Row-Level Security. Server-only.
 * Use exclusively for trusted backend work (job workers, ingestion). Never
 * import this into anything that can reach the browser.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "@/config/env";
import type { Database } from "@/types/database";

export function createAdminClient() {
  return createSupabaseClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv().SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
