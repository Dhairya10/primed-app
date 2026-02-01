import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
}

/**
 * Supabase client for client-side rendering (CSR)
 *
 * Configuration:
 * - Uses localStorage for session persistence (standard for SPAs)
 * - Auto-refreshes tokens before expiry
 * - Detects OAuth callback URLs automatically
 * - Uses PKCE flow for enhanced security (default)
 *
 * Note: If SSR is needed in the future, migrate to @supabase/ssr with cookie-based sessions
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,      // Auto-refresh tokens before expiry
    persistSession: true,         // Persist session to localStorage
    detectSessionInUrl: true,     // Auto-detect OAuth callback URLs
    storage: window.localStorage, // Use localStorage (not cookies) for CSR
    flowType: 'pkce',            // Use PKCE flow for enhanced security (default)
  },
});
