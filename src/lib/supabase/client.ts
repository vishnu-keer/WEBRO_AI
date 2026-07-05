/** Browser Supabase client — use from Client Components only. */
import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/config/env";
import type { Database } from "@/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
