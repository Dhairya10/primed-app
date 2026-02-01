import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/lib/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireOnboarding?: boolean;
}

/**
 * ProtectedRoute Component
 *
 * Restricts access to authenticated users only
 * Redirects unauthenticated users to login
 * Optionally enforces onboarding completion
 */
export function ProtectedRoute({
  children,
  redirectTo = '/login',
  requireOnboarding = false
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        navigate({ to: redirectTo, replace: true });
        return;
      }

      // Authenticated but onboarding not completed
      if (requireOnboarding && user && !user.onboarding_completed) {
        navigate({ to: '/onboarding', replace: true });
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, requireOnboarding, navigate, redirectTo]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  // Don't render children until auth check is complete
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if onboarding is required but not completed
  if (requireOnboarding && user && !user.onboarding_completed) {
    return null;
  }

  return <>{children}</>;
}
