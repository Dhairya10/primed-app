import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { Drill } from '@/types/api';
import { Badge } from '@/components/ui/Badge';
import { checkDrillEligibility, startDrillSession } from '@/lib/api';
import { useToastStore } from '@/lib/store';
import { formatEnumLabel } from '@/lib/utils';

interface DrillCardProps {
  drill: Drill;
}

export function DrillCard({ drill }: DrillCardProps) {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const [isStarting, setIsStarting] = useState(false);

  const handleDrillClick = async () => {
    if (isStarting) return;

    setIsStarting(true);
    try {
      // Step 1: Check eligibility
      const eligibility = await checkDrillEligibility();

      if (!eligibility.eligible) {
        // Show paywall message
        const message =
          eligibility.num_drills === 0
            ? "You've used all your drills. Upgrade to continue."
            : `You have ${eligibility.num_drills} drill${
                eligibility.num_drills === 1 ? '' : 's'
              } remaining.`;
        showToast(message, 'error');
        return;
      }

      // Step 2: Start drill session
      const session = await startDrillSession(drill.id);

      // Step 3: Navigate to interview screen
      navigate({ to: `/interview/${session.session_id}` });
    } catch (error) {
      console.error('Failed to start drill:', error);
      showToast('Failed to start drill. Please try again.', 'error');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDrillClick}
      disabled={isStarting}
      className="relative w-full h-full min-h-[160px] p-4 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex flex-col justify-between"
    >
      {/* Title */}
      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-white/90 transition-colors line-clamp-2">
        {drill.display_title}
      </h3>

      {/* Badge at bottom-left */}
      <div className="flex items-center gap-3">
        <Badge>{formatEnumLabel(drill.problem_type)}</Badge>
      </div>

      {/* Loading indicator */}
      {isStarting && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-white/60">
          <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>Starting drill...</span>
        </div>
      )}
    </button>
  );
}
