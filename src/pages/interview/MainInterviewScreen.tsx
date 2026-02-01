import { useEffect, useState, useRef } from 'react';
import { MoreVertical, X } from 'lucide-react';
import { Timer } from '@/components/interview/Timer';
import { AudioWaveform } from '@/components/interview/AudioWaveform';
import { MicrophoneButton } from '@/components/interview/MicrophoneButton';
import { FeedbackModal, type FeedbackData } from '@/components/interview/FeedbackModal';
import { useInterviewStore } from '@/lib/interview-store';
import { useElevenLabsConversation } from '@/hooks/useElevenLabsConversation';
import { IS_END_SCREEN_TESTING_ENABLED } from '@/lib/constants';

interface MainInterviewScreenProps {
  problemTitle: string;
  estimatedDurationMinutes: number;
  sessionId: string;
  signedUrl: string;
  onNaturalEnd: (reason: string) => void;
  onEmergencyExit: () => void;
  onError: (error: string) => void;
  onGoToEndScreen?: () => void;
}

export function MainInterviewScreen({
  problemTitle,
  estimatedDurationMinutes,
  signedUrl,
  onNaturalEnd,
  onEmergencyExit,
  onError,
  onGoToEndScreen,
}: MainInterviewScreenProps) {
  const [showExitMenu, setShowExitMenu] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const { elapsedSeconds, incrementElapsedSeconds, connectionStatus } = useInterviewStore();

  // Start elapsed timer
  useEffect(() => {
    const interval = setInterval(() => {
      incrementElapsedSeconds();
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Auto-navigate to end screen when Eleven Labs disconnects
  const previousConnectionStatus = useRef<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    // Only trigger if we transition from 'connected' to 'disconnected'
    // This ensures we don't trigger on initial mount or connection failures
    if (
      previousConnectionStatus.current === 'connected' &&
      connectionStatus === 'disconnected'
    ) {
      console.log('🔚 ElevenLabs disconnected - navigating to end screen');
      onNaturalEnd('Agent disconnected');
    }

    // Update the ref with current status
    previousConnectionStatus.current = connectionStatus;
  }, [connectionStatus, onNaturalEnd]);

  // Initialize ElevenLabs conversation
  const { endConversation, conversation, mode } = useElevenLabsConversation({
    signedUrl,
    problemTitle,
    estimatedDurationMinutes,
    onError: (error) => {
      console.error('ElevenLabs error:', error);
      onError(error.message);
    },
  });

  // Prevent accidental navigation away from interview
  useEffect(() => {
    // Warn when user tries to close/refresh browser
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    // Warn when user tries to use browser back button
    const handlePopState = () => {
      setShowExitConfirm(true);
      // Push state back to maintain current location
      window.history.pushState(null, '', window.location.href);
    };

    // Intercept navigation link clicks (Home, Dashboard, Profile)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if the click is on a navigation link
      const link = target.closest('a[href]');
      if (link && link.getAttribute('href')) {
        const href = link.getAttribute('href');
        // Only intercept navigation to other pages (not external links)
        if (href && (href === '/home' || href === '/dashboard' || href === '/profile')) {
          e.preventDefault();
          e.stopPropagation();
          setShowExitConfirm(true);
        }
      }
    };

    // Add a state to history to detect back button
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick, true); // Use capture phase to intercept early

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  const handleExitConfirm = () => {
    setShowExitConfirm(false);
    setShowExitMenu(false);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async (feedback: FeedbackData) => {
    // TODO: Send feedback to backend
    console.log('Feedback submitted:', feedback);
    setShowFeedbackModal(false);
    endConversation();
    onEmergencyExit();
  };

  const handleFeedbackSkip = () => {
    setShowFeedbackModal(false);
    endConversation();
    onEmergencyExit();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/10">
        <h1 className="text-lg md:text-xl font-semibold text-white truncate flex-1">
          {problemTitle}
        </h1>

        <div className="flex items-center gap-4">
          <Timer elapsedSeconds={elapsedSeconds} />

          {/* Three-dot menu */}
          <div className="relative">
            <button
              onClick={() => setShowExitMenu(!showExitMenu)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showExitMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50 min-w-[160px]">
                <button
                  onClick={() => {
                    setShowExitMenu(false);
                    setShowExitConfirm(true);
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors"
                >
                  Exit Interview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content - Audio waveform visualization */}
      <div className="flex-1 flex flex-col items-center justify-between px-4 py-6 md:py-12">
        {/* Waveform container - centered but doesn't consume all space */}
        <div className="flex-1 flex items-center justify-center w-full max-h-[45vh] md:max-h-none">
          <AudioWaveform conversation={conversation} mode={mode} />
        </div>

        {/* Fixed control buttons section - guaranteed space */}
        <div className="flex-shrink-0 flex items-center justify-center gap-8 md:gap-12 pt-6 md:pt-16 pb-24 md:pb-8">
          <MicrophoneButton conversation={conversation} />

          {/* Test button - only visible when IS_END_SCREEN_TESTING_ENABLED is true */}
          {IS_END_SCREEN_TESTING_ENABLED && onGoToEndScreen && (
            <button
              onClick={onGoToEndScreen}
              className="
                min-h-[44px] min-w-[44px]
                w-16 h-16
                rounded-full
                bg-blue-600
                text-white
                flex items-center justify-center
                transition-all duration-200
                hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600
                active:scale-[0.98]
                touch-manipulation
              "
              aria-label="Test end screen"
              title="Test End Screen (Dev Only)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          )}

          <button
            onClick={() => setShowExitConfirm(true)}
            className="
              min-h-[44px] min-w-[44px]
              w-16 h-16
              rounded-full
              bg-red-600
              text-white
              flex items-center justify-center
              transition-all duration-200
              hover:bg-red-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600
              active:scale-[0.98]
              touch-manipulation
            "
            aria-label="End call"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-[135deg]"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white text-black rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">Exit Interview?</h3>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to exit? Your progress will NOT be saved.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 px-4 py-2 border-2 border-black rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExitConfirm}
                className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback modal */}
      {showFeedbackModal && (
        <FeedbackModal
          onClose={handleFeedbackSkip}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
}
