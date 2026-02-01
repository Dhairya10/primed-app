import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/lib/auth-store';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * PublicRoute Component
 *
 * For pages that should only be accessible to unauthenticated users
 * (like login, signup, forgot password)
 * Redirects authenticated users to the app
 */
export function PublicRoute({
  children,
  redirectTo = '/home'
}: PublicRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect to onboarding if not completed, otherwise to home
      if (user && !user.onboarding_completed) {
        navigate({ to: '/onboarding', replace: true });
      } else {
        navigate({ to: redirectTo, replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate, redirectTo]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  // Don't render if authenticated (prevents flash)
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
