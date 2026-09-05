/**
 * Cloud client factory.
 *
 * Brahmi AI works in two modes:
 *  1. CLOUD MODE — when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY exist, data syncs to Supabase.
 *  2. LOCAL MODE — no keys present (e.g., prototype / demo), everything stays in localStorage.
 *
 * To enable the cloud for a real facility, set these env vars (Vercel → Project → Environment Variables):
 *   VITE_SUPABASE_URL        = https://xxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY   = eyJhbGciOi...
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

/** True when real Supabase credentials are configured. */
export const isCloudEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

/** Lazily-created Supabase client (only created when keys exist). */
let client = null

export function getSupabase() {
  if (!isCloudEnabled) return null
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  }
  return client
}
