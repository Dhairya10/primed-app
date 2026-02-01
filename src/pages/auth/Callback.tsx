import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/lib/auth-store';

/**
 * OAuth Callback Page
 *
 * Handles OAuth redirects from Supabase after Google authentication
 *
 * Flow:
 * 1. User clicks "Sign in with Google"
 * 2. Redirected to Google for authentication
 * 3. Google redirects to Supabase (/auth/v1/callback)
 * 4. Supabase processes OAuth code and redirects here
 * 5. Supabase client auto-detects session from URL (via detectSessionInUrl: true)
 * 6. This page shows loading state while session is established
 * 7. Redirects to dashboard/onboarding once authenticated
 */
export function OAuthCallback() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    // Wait for Supabase to process the callback
    if (!isLoading) {
      if (isAuthenticated) {
        // Check if user needs onboarding
        if (user && !user.onboarding_completed) {
          navigate({ to: '/onboarding', replace: true });
        } else {
          navigate({ to: '/home', replace: true });
        }
      } else {
        // OAuth failed or was cancelled
        navigate({ to: '/login', replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
        <p className="text-lg text-white">Completing sign in...</p>
      </div>
    </div>
  );
}
