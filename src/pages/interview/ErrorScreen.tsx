import { Button } from '@/components/ui/Button';
import { IS_API_ENABLED } from '@/lib/constants';

interface ErrorScreenProps {
  onGoToEndScreen?: () => void;
  onEndInterview?: () => void;
}

export function ErrorScreen({
  onGoToEndScreen,
  onEndInterview,
}: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
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
          <h2 className="text-2xl font-bold">Unable to Start Interview</h2>
        </div>

        {!IS_API_ENABLED && onGoToEndScreen && onEndInterview ? (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onEndInterview} fullWidth>
              End Interview
            </Button>
            <Button onClick={onGoToEndScreen} fullWidth>
              Go To End Screen
            </Button>
          </div>
        ) : (
          <Button onClick={onEndInterview} size="lg">
            Back to Home
          </Button>
        )}
      </div>
    </div>
  );
}
