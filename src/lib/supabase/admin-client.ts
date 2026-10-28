import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/config/env";

let cached: { key: string; client: SupabaseClient } | null = null;

/**
 * Supabase client authenticated with the secret (service-role) key.
 * It bypasses row-level security, so it must only ever run on the server —
 * this module is marked server-only and the key is never NEXT_PUBLIC_.
 * Returns null when Supabase is not fully configured.
 */
export function supabaseAdmin() {
  const env = supabaseEnv();
  if (env.status !== "configured") return null;
  const { url, secretKey, bucket } = env.config;
  if (cached?.key !== `${url}|${secretKey}`) {
    cached = {
      key: `${url}|${secretKey}`,
      client: createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } }),
    };
  }
  return { db: cached.client, bucket };
}
