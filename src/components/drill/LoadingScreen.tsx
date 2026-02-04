import { useEffect, useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { checkDrillEligibility, startDrillSession } from '@/lib/api';

interface LoadingScreenProps {
  problemId: string;
  onCancel: () => void;
}

type LoadingStatus = 'checking' | 'countdown' | 'starting' | 'error';

const COUNTDOWN_START = 3;

export function LoadingScreen({ problemId, onCancel }: LoadingScreenProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<LoadingStatus>('checking');
  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [eligibilityMessage, setEligibilityMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const runEligibilityCheck = async () => {
      setStatus('checking');
      try {
        const eligibility = await checkDrillEligibility();
        if (!isMounted) return;

        setEligibilityMessage(eligibility.message || null);

        if (!eligibility.eligible) {
          setErrorMessage(
            eligibility.message || 'You are not eligible to start this drill.'
          );
          setStatus('error');
          return;
        }

        setStatus('countdown');
      } catch (err) {
        if (!isMounted) return;
        setErrorMessage('Unable to check eligibility. Please try again.');
        setStatus('error');
      }
    };

    runEligibilityCheck();

    return () => {
      isMounted = false;
    };
  }, [problemId]);

  useEffect(() => {
    if (status !== 'countdown') return;

    setCountdown(COUNTDOWN_START);

    const interval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [status]);

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (status !== 'countdown' || countdown !== 0) return;

    const startSession = async () => {
      setStatus('starting');
      try {
        const session = await startDrillSession(problemId);
        if (mountedRef.current) {
          await navigate({ to: `/drill/${session.session_id}` });
        }
      } catch (err) {
        if (mountedRef.current) {
          setErrorMessage('Failed to start session. Please try again.');
          setStatus('error');
        }
      }
    };

    startSession();
  }, [countdown, navigate, problemId, status]);

  const renderContent = () => {
    if (status === 'error') {
      return (
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold text-paper-50">
            Unable to start
          </h1>
          <p className="text-base text-paper-200">{errorMessage}</p>
          <button
            onClick={onCancel}
            className="min-h-[44px] px-6 py-3 bg-paper-50 text-ink-950 border-2 border-ink-950 hover:bg-paper-200 transition-all duration-200 active:scale-[0.98]"
          >
            Back to Library
          </button>
        </div>
      );
    }

    if (status === 'starting') {
      return (
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-paper-300 border-t-paper-50 animate-spin" />
          </div>
          <p className="text-base text-paper-200">Setting up your session...</p>
        </div>
      );
    }

    if (status === 'checking') {
      return (
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-paper-300 border-t-paper-50 animate-spin" />
          </div>
          <p className="text-base text-paper-200">Checking eligibility...</p>
        </div>
      );
    }

    return (
      <div className="space-y-8 text-center">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-paper-300">
            Get ready
          </p>
          <h1 className="text-4xl font-semibold text-paper-50">
            Let&apos;s do this
          </h1>
          {eligibilityMessage && (
            <p className="text-sm text-paper-300">
              {eligibilityMessage}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48 rounded-full border-4 border-paper-300 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full bg-paper-50/5 animate-ping"
              style={{ animationDuration: '1.5s' }}
            />
            <span className="text-7xl font-bold text-paper-50 relative z-10">
              {countdown}
            </span>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="min-h-[44px] px-6 py-3 bg-transparent text-paper-50 border-2 border-paper-50 hover:bg-paper-50/10 transition-all duration-200 active:scale-[0.98]"
        >
          Cancel
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-ink-950 text-paper-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">{renderContent()}</div>
    </div>
  );
}
