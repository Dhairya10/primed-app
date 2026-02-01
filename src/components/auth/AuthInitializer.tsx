import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * AuthInitializer Component
 *
 * Responsibilities:
 * 1. Initialize auth store (which checks for existing session)
 * 2. Set up auth state change listener (cross-tab sync, token refresh events)
 * 3. Show loading screen while checking session
 * 4. Clean up subscription on unmount
 *
 * What happens during initialization:
 * - Calls supabase.auth.getSession() to check for existing session in localStorage
 * - If session exists, fetches user profile from backend
 * - Sets up onAuthStateChange listener for cross-tab sync and token refresh events
 * - Returns cleanup function to unsubscribe listener on unmount
 */
export function AuthInitializer({ children }: AuthInitializerProps) {
  const { initialize, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    // Initialize auth store and set up listener
    const initAuth = async () => {
      cleanup = await initialize();
      setIsInitialized(true);
    };

    initAuth();

    // Cleanup subscription when component unmounts
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [initialize]);

  // Show loading screen while checking session
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
