import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/lib/auth-store';

/**
 * useAuth Hook
 *
 * Convenient access to auth state throughout the app
 *
 * Usage:
 * const { user, isAuthenticated, isLoading, error } = useAuth();
 */
export function useAuth() {
  const { user, supabaseUser, isAuthenticated, isLoading, error } = useAuthStore();

  return {
    user,
    supabaseUser,
    isAuthenticated,
    isLoading,
    error,
  };
}

/**
 * useRequireAuth Hook
 *
 * Ensures user is authenticated, redirects to login if not
 * Use this in pages/components that require authentication
 *
 * Usage:
 * const { isAuthenticated, isLoading } = useRequireAuth();
 */
export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: redirectTo, replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  return { isAuthenticated, isLoading };
}

/**
 * useLogout Hook
 *
 * Provides a logout function that signs out user and redirects to login
 *
 * Usage:
 * const logout = useLogout();
 * <button onClick={logout}>Sign Out</button>
 */
export function useLogout(redirectTo: string = '/login') {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: redirectTo, replace: true });
  };

  return handleLogout;
}
