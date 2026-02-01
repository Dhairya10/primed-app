import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import type { DashboardDrill, DrillAttemptSummary } from '@/types/api';
import { Badge } from '@/components/ui/Badge';
import { formatAttemptTimestamp } from '@/lib/dashboard-utils';
import { formatEnumLabel } from '@/lib/utils';

interface DrillProblemCardProps {
  drill: DashboardDrill;
}

interface DrillAttemptItemProps {
  attempt: DrillAttemptSummary;
}

function DrillAttemptItem({ attempt }: DrillAttemptItemProps) {
  return (
    <div className="p-4 bg-white/[0.02] border border-white/10">
      <p className="text-sm text-gray-400">
        {formatAttemptTimestamp(attempt.completed_at)}
      </p>
    </div>
  );
}

export function DrillProblemCard({ drill }: DrillProblemCardProps) {
  const navigate = useNavigate();
  const [showAttempts, setShowAttempts] = useState(false);

  const handleCardClick = () => {
    // Toggle expanded state to show all attempts
    setShowAttempts(!showAttempts);
  };

  const handleReAttempt = async () => {
    // Navigate to home where user can start the drill
    navigate({ to: '/' });
  };

  return (
    <article className="bg-white/[0.03] border-2 border-white/20 transition-all duration-200">
      {/* Compact Header - Always Visible */}
      <div
        className="p-6 cursor-pointer hover:border-white/40 hover:bg-white/[0.06]"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2">
              {drill.display_title}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {drill.problem_type && (
                <Badge>
                  {formatEnumLabel(drill.problem_type)}
                </Badge>
              )}
              <span className="text-xs text-white/40">
                {drill.total_attempts} {drill.total_attempts === 1 ? 'attempt' : 'attempts'}
              </span>
            </div>
          </div>

          {/* Re-attempt Button - Top Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReAttempt();
            }}
            disabled={!drill.can_retry}
            className={`
              p-2 min-h-[44px] min-w-[44px] flex items-center justify-center
              transition-all duration-200 rounded
              flex-shrink-0
              ${drill.can_retry
                ? 'text-gray-400 hover:text-white hover:bg-white/[0.06] cursor-pointer'
                : 'text-gray-600 cursor-not-allowed opacity-50'
              }
            `}
            aria-label="Attempt this drill again"
            title={drill.can_retry ? 'Attempt Again' : 'Maximum attempts reached'}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expanded Attempts Section - Scrollable */}
      {showAttempts && (
        <div className="border-t border-white/10 p-6 pt-4 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {/* Latest attempt at the top */}
            <DrillAttemptItem attempt={drill.latest_attempt} />

            {/* Previous attempts */}
            {drill.previous_attempts.map((attempt) => (
              <DrillAttemptItem
                key={attempt.session_id}
                attempt={attempt}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
