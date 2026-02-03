import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { Drill } from '@/types/api';
import { Badge } from '@/components/ui/Badge';
import { Check } from 'lucide-react';
import { checkDrillEligibility, startDrillSession } from '@/lib/api';
import { useToastStore } from '@/lib/store';
import { formatSkillName } from '@/lib/dashboard-utils';

interface DrillListCardProps {
  drill: Drill;
  isCompleted?: boolean;
}

export function DrillListCard({ drill, isCompleted = false }: DrillListCardProps) {
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

      // Step 3: Navigate to drill session screen
      navigate({ to: `/drill/${session.session_id}` });
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
      className="relative w-full p-4 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-start gap-3 mb-3">
        {drill.product_logo_url && (
          <div className="w-10 h-10 rounded border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
            <img
              src={drill.product_logo_url}
              alt=""
              className="w-6 h-6 object-contain"
            />
          </div>
        )}
        <h3 className="text-sm font-normal text-white flex-1 leading-tight">
          {drill.display_title}
        </h3>
        {isCompleted && (
          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {drill.skills_tested && drill.skills_tested.length > 0 && (
          drill.skills_tested.map((skill) => (
            <Badge key={skill} variant="outline" size="sm">
              {formatSkillName(skill)}
            </Badge>
          ))
        )}
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
