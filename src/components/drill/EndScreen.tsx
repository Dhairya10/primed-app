import { CheckCircle } from 'lucide-react';

interface EndScreenProps {
  sessionId: string;
  onNavigateToDashboard: () => void;
}

export function EndScreen({
  sessionId: _sessionId,
  onNavigateToDashboard,
}: EndScreenProps) {
  return (
    <div className="min-h-screen bg-ink-950 text-paper-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-paper-50" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-paper-50">
          Interview Complete
        </h1>

        {/* Subtext */}
        <p className="text-base text-paper-200">
          Great job! Feedback will be ready in 2-3 minutes.
        </p>

        {/* Action Button */}
        <div className="pt-4">
          <button
            onClick={onNavigateToDashboard}
            className="
              w-full min-h-[44px] px-6 py-3
              bg-paper-50 text-ink-950
              hover:bg-paper-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ink-950 focus:ring-paper-50
              transition-all duration-200
              active:scale-[0.98]
            "
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
