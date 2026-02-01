import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { Interview } from '@/types/api';
import { useToastStore } from '@/lib/store';
import { checkInterviewEligibility, startInterviewSession } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';

interface InterviewListCardProps {
  interview: Interview;
}

export function InterviewListCard({ interview }: InterviewListCardProps) {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const [isStarting, setIsStarting] = useState(false);

  const handleInterviewClick = async () => {
    if (isStarting) return;

    setIsStarting(true);
    try {
      // Step 1: Check eligibility
      const eligibility = await checkInterviewEligibility();

      if (!eligibility.eligible) {
        // Show paywall message
        const message =
          eligibility.num_interviews === 0
            ? "You've used all your interviews. Upgrade to continue."
            : `You have ${eligibility.num_interviews} interview${
                eligibility.num_interviews === 1 ? '' : 's'
              } remaining.`;
        showToast(message, 'error');
        return;
      }

      // Step 2: Start interview session
      const session = await startInterviewSession(interview.id);

      // Step 3: Navigate to interview screen
      navigate({ to: `/interview/${session.session_id}` });
    } catch (error) {
      console.error('Failed to start interview:', error);
      showToast('Failed to start interview. Please try again.', 'error');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleInterviewClick}
      disabled={isStarting}
      className="relative w-full h-full min-h-[160px] p-4 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex flex-col justify-between"
    >
      {/* Logo at top-right */}
      {interview.product_logo_url ? (
        <div className="absolute top-4 right-4">
          <img
            src={interview.product_logo_url}
            alt=""
            className="w-12 h-12 border border-white/20 bg-white/5 object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="absolute top-4 right-4 w-12 h-12 border border-white/20 bg-white/10" />
      )}

      {/* Content - Title and Description */}
      <div className="flex-1 pr-16">
        <h3 className="text-base font-semibold text-white mb-2 group-hover:text-white/90 transition-colors line-clamp-2">
          {interview.title}
        </h3>
        <p className="text-sm text-white/60 line-clamp-2 group-hover:text-white/70 transition-colors">
          {interview.description}
        </p>
      </div>

      {/* Duration badge at bottom-left */}
      <div className="flex items-center gap-3 mt-4">
        <Badge>{interview.estimated_duration_minutes} mins</Badge>
      </div>

      {/* Loading indicator */}
      {isStarting && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-white/60">
          <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>Starting interview...</span>
        </div>
      )}
    </button>
  );
}
