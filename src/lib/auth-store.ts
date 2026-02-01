import { create } from 'zustand';
import { supabase } from './supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { API_BASE_URL, IS_AUTH_ENABLED } from './constants';
import type { DisciplineType } from '@/types/api';

/**
 * User profile from our backend database
 * Matches UserProfileResponse from backend API
 */
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  discipline?: DisciplineType;
  avatar_url?: string;
  email_verified: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at?: string;
}

interface AuthStore {
  // State
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<() => void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  supabaseUser: null,
  session: null,
  isAuthenticated: false,
  isLoading: IS_AUTH_ENABLED, // Only show loading when auth is enabled
  error: null,

  initialize: async () => {
    try {
      // Get initial session (required before setting up listener)
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Fetch user profile from our database, pass session to avoid race condition
        const user = await fetchUserProfile(session.user.id, session);
        set({
          user,
          supabaseUser: session.user,
          session,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }

      // Listen for auth state changes (SIGN_IN, SIGN_OUT, TOKEN_REFRESHED, etc.)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth event:', event);

          if (session?.user) {
            try {
              // Pass the session to avoid race condition
              const user = await fetchUserProfile(session.user.id, session);
              set({
                user,
                supabaseUser: session.user,
                session,
                isAuthenticated: true,
              });
            } catch (error) {
              console.error('Failed to fetch user profile:', error);
              // If profile fetch fails, still set auth state but without user profile
              set({
                user: null,
                supabaseUser: session.user,
                session,
                isAuthenticated: true,
              });
            }
          } else {
            set({
              user: null,
              supabaseUser: null,
              session: null,
              isAuthenticated: false,
            });
          }
        }
      );

      // Return cleanup function
      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
      return () => {}; // Return empty cleanup function
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && data.session) {
        // Pass the session we just got to avoid race condition
        const user = await fetchUserProfile(data.user.id, data.session);
        set({
          user,
          supabaseUser: data.user,
          session: data.session,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign in',
        isLoading: false,
      });
      throw error;
    }
  },

  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (error) throw error;

      // User will need to verify email before accessing app
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign up',
        isLoading: false,
      });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Redirect back to your app after OAuth completes
          redirectTo: `${window.location.origin}/auth/callback`,
          // Request specific scopes
          scopes: 'openid email profile',
        },
      });

      if (error) throw error;
      // User will be redirected to Google for authentication
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign in with Google',
        isLoading: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        supabaseUser: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      set({ isLoading: false });
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to send reset email',
        isLoading: false,
      });
      throw error;
    }
  },

  updatePassword: async (newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update password',
        isLoading: false,
      });
      throw error;
    }
  },

  refreshUser: async () => {
    const { session } = get();
    if (!session?.user) return;

    try {
      // Pass the session from store
      const user = await fetchUserProfile(session.user.id, session);
      set({ user });
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

/**
 * Helper function to fetch user profile from our backend
 * This fetches the full user profile data from our database
 *
 * Note: user_id is extracted from JWT token on backend, not passed as query param
 * @param _userId - User ID (not used in API call, kept for backward compatibility)
 * @param session - Optional session to use for authentication
 */
async function fetchUserProfile(_userId: string, session?: Session | null): Promise<User> {
  const headers = await getAuthHeaders(session);

  // Backend extracts user_id from JWT token's 'sub' claim
  const response = await fetch(`${API_BASE_URL}/api/v1/profile/me`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  const data = await response.json();

  // Transform backend response to match our User interface
  return {
    id: data.user_id,
    email: data.email || '',
    first_name: data.first_name,
    last_name: data.last_name,
    discipline: data.discipline,
    avatar_url: data.avatar_url,
    email_verified: true, // Supabase handles email verification
    onboarding_completed: data.onboarding_completed || false,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/**
 * Helper function to get auth headers with JWT token
 * Attaches Bearer token to requests for authenticated API calls
 * @param session - Optional session to use instead of fetching from Supabase
 */
export async function getAuthHeaders(session?: Session | null): Promise<HeadersInit> {
  // Use provided session or fetch from Supabase
  let authSession = session;
  if (!authSession) {
    const { data: { session: fetchedSession } } = await supabase.auth.getSession();
    authSession = fetchedSession;
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (authSession?.access_token) {
    headers['Authorization'] = `Bearer ${authSession.access_token}`;
  }

  return headers;
}
