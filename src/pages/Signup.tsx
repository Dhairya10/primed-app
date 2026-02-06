import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuthStore } from '@/lib/auth-store';
import { Logo } from '@/components/ui/Logo';

export function Signup() {
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
    // After signup, user needs to verify email
    // SignupForm already shows success message
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  // Don't show signup form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl p-8 md:p-10 shadow-2xl border-2 border-white/10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="lg" className="text-white" />
        </div>

        <SignupForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
