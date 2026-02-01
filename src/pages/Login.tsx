import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuthStore } from '@/lib/auth-store';

export function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check if onboarding is completed
      if (user && !user.onboarding_completed) {
        navigate({ to: '/onboarding', replace: true });
      } else {
        navigate({ to: '/home', replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  const handleSuccess = () => {
    // Check if onboarding is completed
    if (user && !user.onboarding_completed) {
      navigate({ to: '/onboarding', replace: true });
    } else {
      navigate({ to: '/home', replace: true });
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  // Don't show login form if already authenticated (prevents flash)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl p-8 md:p-10 shadow-2xl border-2 border-white/10">
        {/* Placeholder Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/20">
            <span className="text-3xl font-bold text-white">P</span>
          </div>
        </div>

        <LoginForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
