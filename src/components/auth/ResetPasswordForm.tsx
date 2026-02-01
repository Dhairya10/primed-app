import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/auth-store';
import { Link, useNavigate } from '@tanstack/react-router';
import { Check } from 'lucide-react';

const resetPasswordSchema = z.object({
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const { updatePassword, error: authError, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<ResetPasswordFormData>();

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

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    clearError();

    try {
      await updatePassword(data.password);
      setResetSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate({ to: '/login' });
      }, 3000);
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Failed to reset password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white">Password reset successful</h3>
        <p className="text-gray-400">
          Your password has been updated. Redirecting to login...
        </p>
        <Link
          to="/login"
          className="inline-block text-white hover:underline font-medium"
        >
          Go to login now
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <p className="text-gray-400 text-sm mb-4">
        Enter your new password below.
      </p>

      <div>
        <PasswordInput
          id="password"
          label="New Password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password?.message}
          disabled={isLoading}
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
              <div className={`h-1 flex-1 rounded ${passwordStrength === 'weak' ? 'bg-white/40' : 'bg-white/20'}`} />
              <div className={`h-1 flex-1 rounded ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-white/40' : 'bg-white/20'}`} />
              <div className={`h-1 flex-1 rounded ${passwordStrength === 'strong' ? 'bg-white/40' : 'bg-white/20'}`} />
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
        label="Confirm New Password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        disabled={isLoading}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
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
        Reset Password
      </Button>
    </form>
  );
}
