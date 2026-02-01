import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/auth-store';
import { Link } from '@tanstack/react-router';
import { Check } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { resetPassword, error: authError, clearError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    clearError();

    try {
      await resetPassword(data.email);
      setResetSent(true);
      startCountdown();
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Failed to send reset email',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    const email = getValues('email');
    if (!email) return;

    setIsLoading(true);
    clearError();

    try {
      await resetPassword(email);
      startCountdown();
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Failed to resend email',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white">Check your email</h3>
        <p className="text-gray-400">
          We sent a password reset link to your email. Please check your inbox and follow the instructions.
        </p>

        {countdown > 0 ? (
          <p className="text-sm text-gray-500">
            Resend available in {countdown}s
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="text-white hover:underline font-medium text-sm"
          >
            Didn't receive it? Resend
          </button>
        )}

        <Link
          to="/login"
          className="inline-block text-white hover:underline font-medium mt-4"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <p className="text-gray-400 text-sm mb-4">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        inputMode="email"
        autoCapitalize="off"
        spellCheck="false"
        error={errors.email?.message}
        disabled={isLoading}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Please enter a valid email',
          },
        })}
      />

      {(errors.root || authError) && (
        <div
          className="p-3 bg-white/5 border border-white/20 rounded text-sm text-white"
          role="alert"
        >
          {errors.root?.message || authError}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={isLoading}
      >
        Send Reset Link
      </Button>

      <div className="text-center">
        <Link
          to="/login"
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
}
