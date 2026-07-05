/**
 * Server Supabase client — use from Server Components, Server Actions, and Route
 * Handlers. Reads/writes the session via cookies. In Next.js 16 `cookies()` is
 * async, so this factory is async too.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicEnv } from "@/config/env";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Server Components can't set cookies; the proxy handles refresh.
          // Swallowing the error here is the documented Supabase pattern.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* called from a Server Component — safe to ignore */
          }
        },
      },
    },
  );
}
