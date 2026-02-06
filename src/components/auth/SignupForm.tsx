import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { GoogleSignInButton } from './GoogleSignInButton';
import { useAuthStore } from '@/lib/auth-store';
import { Link } from '@tanstack/react-router';
import { Check } from 'lucide-react';

const signupSchema = z.object({
  email: z.string()
    .email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const { signUp, signInWithGoogle, error: authError, clearError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<SignupFormData>();

  const password = watch('password');

  // Password strength indicator
  const getPasswordStrength = (pwd: string): 'weak' | 'medium' | 'strong' => {
    if (!pwd) return 'weak';
    if (pwd.length < 8) return 'weak';
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) return 'medium';
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd)) return 'strong';
    return 'weak';
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    clearError();

    try {
      await signUp(data.email, data.password);
      setSignupSuccess(true);
      onSuccess?.();
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Failed to create account',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    clearError();

    try {
      await signInWithGoogle();
      // User will be redirected to Google
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Failed to sign up with Google',
      });
      setIsGoogleLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-500/20 flex items-center justify-center mx-auto border-2 border-green-500/30">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-300">Check your email</h3>
        <p className="text-gray-400">
          We sent you a verification link. Please check your email to verify your account and complete signup.
        </p>
        <Link
          to="/login"
          className="inline-block text-gray-300 hover:text-white hover:underline font-medium"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-300 mb-2">Create your account</h2>
        <p className="text-sm text-gray-400">
          Get started with your interview preparation journey
        </p>
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
            autoComplete="new-password"
            error={errors.password?.message}
            disabled={isLoading || isGoogleLoading}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain uppercase, lowercase, and number',
              },
            })}
          />
          {password && (
            <div className="mt-2">
              <div className="flex gap-1">
                <div className={`h-1 flex-1 rounded ${passwordStrength === 'weak' ? 'bg-red-400' : 'bg-white/20'}`} />
                <div className={`h-1 flex-1 rounded ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-yellow-400' : 'bg-white/20'}`} />
                <div className={`h-1 flex-1 rounded ${passwordStrength === 'strong' ? 'bg-green-400' : 'bg-white/20'}`} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {passwordStrength === 'weak' && 'Weak password'}
                {passwordStrength === 'medium' && 'Medium strength'}
                {passwordStrength === 'strong' && 'Strong password'}
              </p>
            </div>
          )}
        </div>

        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm Password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          disabled={isLoading || isGoogleLoading}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
          })}
        />




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
          {isLoading ? 'Creating account...' : 'Get Started'}
        </Button>

        <div className="text-center text-sm text-gray-400">
          Or sign up with
        </div>

        {/* Google Sign-Up */}
        <GoogleSignInButton
          onClick={handleGoogleSignUp}
          loading={isGoogleLoading}
          disabled={isLoading}
        />

        {/* Sign in link */}
        <div className="text-center text-sm text-gray-400 pt-2">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-gray-300 hover:text-white hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
