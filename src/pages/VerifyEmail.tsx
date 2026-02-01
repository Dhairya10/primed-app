import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/lib/auth-store';
import { Check, AlertCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function VerifyEmail() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // Check if user is authenticated after email verification
    if (isAuthenticated) {
      setStatus('success');
      // Redirect to onboarding or home after 2 seconds
      setTimeout(() => {
        if (user && !user.onboarding_completed) {
          navigate({ to: '/onboarding', replace: true });
        } else {
          navigate({ to: '/home', replace: true });
        }
      }, 2000);
    }
  }, [isAuthenticated, user, navigate]);

  // Supabase automatically verifies email when user clicks link
  // The auth state change listener in auth-store will handle the rest

  const handleResendVerification = async () => {
    setResending(true);
    try {
      // TODO: Implement resend verification email
      // This would require storing the email temporarily or asking user to re-enter
      setErrorMessage('Please contact support to resend verification email');
    } catch (error) {
      setErrorMessage('Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Email verified!</h1>
          <p className="text-gray-400">
            Your email has been verified successfully. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Verification failed</h1>
          <p className="text-gray-400">{errorMessage}</p>
          <button
            onClick={handleResendVerification}
            disabled={resending}
            className="text-white hover:underline font-medium"
          >
            {resending ? 'Sending...' : 'Resend verification email'}
          </button>
          <div>
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto" />
        <h1 className="text-2xl font-bold text-white">Verifying your email...</h1>
        <p className="text-gray-400">Please wait while we verify your email address</p>
      </div>
    </div>
  );
}
