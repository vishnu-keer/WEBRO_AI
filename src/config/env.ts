/**
 * Environment configuration — validated with Zod so a missing/invalid key fails
 * loudly at boot instead of deep inside an agent at 2am.
 *
 * Split into two scopes:
 *  - `publicEnv`  : NEXT_PUBLIC_* vars, safe on the client, parsed eagerly.
 *  - `serverEnv()`: secrets, parsed lazily and ONLY on the server. Never import
 *                   the result into a Client Component.
 */
import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  FIRECRAWL_API_KEY: z.string().min(1),
  VOYAGE_API_KEY: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(1).optional(),
});

export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

let _serverEnv: z.infer<typeof serverSchema> | null = null;

/** Parse + cache server-only env. Call from server code (routes, actions, workers). */
export function serverEnv() {
  if (typeof window !== "undefined") {
    throw new Error("serverEnv() must never be called in the browser.");
  }
  if (!_serverEnv) _serverEnv = serverSchema.parse(process.env);
  return _serverEnv;
}
