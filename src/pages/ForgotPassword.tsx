import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export function ForgotPassword() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reset your password</h1>
          <p className="text-gray-400">We'll send you a link to reset your password</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6 md:p-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
