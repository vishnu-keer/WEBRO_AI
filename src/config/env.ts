/**
 * Environment configuration — validated with Zod so a missing key fails loudly
 * with a friendly message instead of deep inside an agent.
 */
import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  FIRECRAWL_API_KEY: z.string().min(1),
  // Which AI provider agents use for reasoning.
  LLM_PROVIDER: z.enum(["anthropic", "gemini"]).default("anthropic"),
  // Provide the key for whichever provider you selected (the other can be blank).
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().min(1).optional(),
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
  if (!_serverEnv) {
    const parsed = serverSchema.safeParse(process.env);
    if (!parsed.success) {
      const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
      throw new Error(
        `Missing required environment variables in .env.local: ${missing}. ` +
          "Add them and restart the dev server (Ctrl+C, then npm run dev).",
      );
    }
    _serverEnv = parsed.data;
  }
  return _serverEnv;
}
