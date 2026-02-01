import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { GoogleSignInButton } from './GoogleSignInButton';
import { useAuthStore } from '@/lib/auth-store';
import { Link } from '@tanstack/react-router';

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn, signInWithGoogle, error: authError, clearError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    clearError();

    try {
      await signIn(data.email, data.password);
      onSuccess?.();
    } catch (error: any) {
      // Show error under form
      setError('root', {
        message: error.message || 'Invalid email or password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    clearError();

    try {
      await signInWithGoogle();
      // User will be redirected to Google
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Failed to sign in with Google',
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-300 mb-2">Sign in with email</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="Email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="off"
          spellCheck="false"
          error={errors.email?.message}
          disabled={isLoading || isGoogleLoading}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email',
            },
          })}
        />

        <div>
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Password"
            autoComplete="current-password"
            error={errors.password?.message}
            disabled={isLoading || isGoogleLoading}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
          />
          <div className="flex justify-end mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {(errors.root || authError) && (
          <div
            className="p-3 bg-red-500/10 border-2 border-red-500/30 text-sm text-red-300"
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
          disabled={isGoogleLoading}
          className="!bg-black !text-white hover:!bg-gray-900 !border-2 !border-white/20"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center text-sm text-gray-400">
          Or sign in with
        </div>

        {/* Google Sign-In */}
        <GoogleSignInButton
          onClick={handleGoogleSignIn}
          loading={isGoogleLoading}
          disabled={isLoading}
        />

        {/* Sign up link */}
        <div className="text-center text-sm text-gray-400 pt-2">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-gray-300 hover:text-white hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
