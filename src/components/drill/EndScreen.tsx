import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface EndScreenProps {
  sessionId: string;
  onNavigateToFeedback: () => void;
  onNavigateToDashboard: () => void;
}

export function EndScreen({
  sessionId: _sessionId,
  onNavigateToFeedback,
  onNavigateToDashboard,
}: EndScreenProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onNavigateToFeedback();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onNavigateToFeedback]);

  return (
    <div className="min-h-screen bg-ink-950 text-paper-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-paper-50" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-paper-50">
          Interview Complete!
        </h1>

        {/* Subtext */}
        <p className="text-base text-paper-200">
          Great job! Your feedback will be ready in 2-3 minutes.
        </p>

        {/* Countdown */}
        <p className="text-sm text-paper-400">
          Redirecting to feedback in {countdown} seconds...
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {/* Primary: View Feedback */}
          <button
            onClick={onNavigateToFeedback}
            className="
              flex-1 min-h-[44px] px-6 py-3
              bg-paper-50 text-ink-950
              hover:bg-paper-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ink-950 focus:ring-paper-50
              transition-all duration-200
              active:scale-[0.98]
            "
          >
            View Feedback
          </button>

          {/* Secondary: Back to Dashboard */}
          <button
            onClick={onNavigateToDashboard}
            className="
              flex-1 min-h-[44px] px-6 py-3
              bg-transparent text-paper-50
              border-2 border-paper-50
              hover:bg-paper-50/10
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ink-950 focus:ring-paper-50
              transition-all duration-200
              active:scale-[0.98]
            "
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
