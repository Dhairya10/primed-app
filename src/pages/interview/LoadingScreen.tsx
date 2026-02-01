import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { checkInterviewEligibility, startInterviewSession } from '@/lib/api';
import type { SessionStartResponse } from '@/types/interview';

interface AttemptLimitError {
  status: number;
  error: string;
  message: string;
  attempts_used?: number;
  max_attempts?: number;
}

interface LoadingScreenProps {
  problemId: string;
  problemTitle: string;
  onCountdownComplete: (sessionData: SessionStartResponse) => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

export function LoadingScreen({
  problemId,
  problemTitle,
  onCountdownComplete,
  onCancel,
  onError,
}: LoadingScreenProps) {
  const [countdown, setCountdown] = useState(3);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isInitializingSession, setIsInitializingSession] = useState(false);
  const [attemptLimitError, setAttemptLimitError] = useState<AttemptLimitError | null>(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);
  const [eligibilityError, setEligibilityError] = useState<{ message: string; numInterviews: number } | null>(null);

  // Check eligibility first before starting countdown (background check)
  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const eligibility = await checkInterviewEligibility();

        if (!eligibility.eligible) {
          // User is not eligible, show error
          setEligibilityError({
            message: eligibility.message,
            numInterviews: eligibility.num_interviews,
          });
          setIsCheckingEligibility(false);
          return;
        }

        // User is eligible, start countdown
        setIsCheckingEligibility(false);
      } catch (err) {
        console.error('Failed to check eligibility:', err);
        // On error, show a generic error
        setEligibilityError({
          message: 'Failed to verify eligibility. Please try again.',
          numInterviews: 0,
        });
        setIsCheckingEligibility(false);
      }
    };

    checkEligibility();
  }, []);

  useEffect(() => {
    // Don't start countdown if still checking eligibility or if there's an eligibility error
    if (isCheckingEligibility || eligibilityError) {
      return;
    }

    if (countdown === 0) {
      // Start API call when countdown reaches 0
      initializeSession();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, isCheckingEligibility, eligibilityError]);

  const initializeSession = async () => {
    setIsInitializingSession(true);
    try {
      const sessionData = await startInterviewSession(problemId);
      onCountdownComplete(sessionData);
    } catch (err) {
      console.error('Failed to initialize session:', err);

      // Check if this is a 429 (attempt limit exceeded) error
      if (err && typeof err === 'object' && 'status' in err && (err as any).status === 429) {
        setAttemptLimitError({
          status: 429,
          error: (err as any).error || 'attempt_limit_exceeded',
          message: (err as any).message || 'You have reached the maximum number of attempts for this problem.',
          attempts_used: (err as any).attempts_used,
          max_attempts: (err as any).max_attempts,
        });
        return;
      }

      // Handle as regular error
      onError(err instanceof Error ? err.message : 'Failed to start interview');
    }
  };

  const handleRetry = () => {
    setPermissionError(null);
    setCountdown(3);
  };

  // Don't render anything while checking eligibility (background check)
  if (isCheckingEligibility) {
    return null;
  }

  // Show eligibility error if user is not eligible
  if (eligibilityError) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Not Eligible</h2>
            <p className="text-white/70 text-sm">
              {eligibilityError.message}
            </p>
          </div>

          <Button onClick={onCancel} fullWidth>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Show attempt limit error modal
  if (attemptLimitError) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Attempt Limit Reached</h2>
            <p className="text-white/70 text-sm">
              {attemptLimitError.message}
            </p>
          </div>

          {attemptLimitError.attempts_used !== undefined && attemptLimitError.max_attempts !== undefined && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <p className="text-sm text-white/80">
                <span className="font-semibold text-red-400">{attemptLimitError.attempts_used}</span>
                <span className="text-white/60"> / {attemptLimitError.max_attempts} attempts used</span>
              </p>
            </div>
          )}

          <p className="text-sm text-white/60">
            You can explore other problems or review your performance on previous attempts.
          </p>

          <Button onClick={onCancel} fullWidth>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (permissionError) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Microphone Access Required</h2>
            <p className="text-white/70 text-sm">
              Please enable microphone access in your browser settings to start the
              interview.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-left space-y-2">
            <p className="text-xs font-medium text-white/80">Browser Instructions:</p>
            <ul className="text-xs text-white/60 space-y-1">
              <li>• Chrome: Settings → Privacy → Site Settings → Microphone</li>
              <li>• Safari: Settings → Websites → Microphone</li>
              <li>• Firefox: Permissions → Microphone</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={onCancel} fullWidth>
              Cancel
            </Button>
            <Button onClick={handleRetry} fullWidth>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state when initializing session
  if (isInitializingSession) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-white px-4">
            {problemTitle}
          </h1>

          <div className="flex flex-col items-center gap-6">
            <div className="animate-spin w-16 h-16 border-4 border-white border-t-transparent rounded-full" />
            <p className="text-sm text-white/60">Connecting to server...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-12">
        {/* Header */}
        <h1 className="text-5xl md:text-6xl font-semibold text-white px-4">
          Let's do this
        </h1>

        {/* Countdown */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 rounded-full border-4 border-white/20 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-white/5 animate-ping" style={{ animationDuration: '1.5s' }} />
            <span className="text-8xl font-bold text-white relative z-10 animate-[scale_1.5s_ease-in-out_infinite]" style={{ animation: 'scaleAnimation 1.5s ease-in-out infinite' }}>
              {countdown}
            </span>
          </div>
        </div>
        <style>{`
          @keyframes scaleAnimation {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.15); opacity: 0.8; }
          }
        `}</style>
      </div>
    </div>
  );
}
