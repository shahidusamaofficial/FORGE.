// FORGE — Supabase client (lazy-initialized, env-aware)
// Returns null if env vars aren't set, so the app gracefully falls back
// to local mock data in preview environments without Supabase configured.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

/**
 * Get the browser-side Supabase client.
 * Uses NEXT_PUBLIC_* env vars (safe to expose to the browser).
 * Returns null if Supabase isn't configured — callers should fall back to local data.
 */
export function getSupabase(): SupabaseClient | null {
  if (browserClient) return browserClient;

  if (typeof window === "undefined") {
    // Server-side: don't cache, just return a fresh client or null
    return getSupabaseFromEnv();
  }

  browserClient = getSupabaseFromEnv();
  return browserClient;
}

function getSupabaseFromEnv(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url === "your-supabase-url" || anonKey === "your-supabase-anon-key") {
    // Supabase not configured — return null so callers fall back to local data
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Check if Supabase is configured (env vars present).
 * Useful for conditional UI rendering (e.g. hide auth button if no Supabase).
 */
export function isSupabaseConfigured(): boolean {
  return getSupabase() !== null;
}
