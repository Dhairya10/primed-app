import { useState } from 'react';
import { Clock, RotateCcw, ChevronRight } from 'lucide-react';
import type { DashboardProblem, AttemptSummary } from '@/types/api';
import { formatAttemptTimestamp } from '@/lib/dashboard-utils';

interface ProblemCardProps {
  problem: DashboardProblem;
  onViewFeedback: (sessionId: string) => void;
  onAttemptAgain: (problemId: string) => void;
}

interface AttemptItemProps {
  attempt: AttemptSummary;
  onClick: () => void;
}

function AttemptItem({ attempt, onClick }: AttemptItemProps) {
  const isCompleted = attempt.evaluation_status === 'completed';

  return (
    <div
      onClick={() => isCompleted && onClick()}
      className={`
        p-4 bg-white/[0.02] border border-white/10
        transition-all duration-200
        ${isCompleted ? 'cursor-pointer hover:border-white/30 hover:bg-white/[0.04]' : ''}
      `}
      role={isCompleted ? 'button' : undefined}
      tabIndex={isCompleted ? 0 : undefined}
      onKeyDown={(e) => {
        if (isCompleted && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {formatAttemptTimestamp(attempt.completed_at)}
        </p>
        {isCompleted ? (
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="text-sm text-yellow-500">Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProblemCard({ problem, onViewFeedback, onAttemptAgain }: ProblemCardProps) {
  const [showAttempts, setShowAttempts] = useState(false);
  const hasPreviousAttempts = problem.previous_attempts.length > 0;

  // Get the latest attempt to check status
  const latestAttempt = problem.latest_attempt;
  const isProcessing = latestAttempt.evaluation_status === 'processing';

  const handleCardClick = () => {
    if (!hasPreviousAttempts) {
      // If only latest attempt and it's completed, open the modal directly
      if (latestAttempt.evaluation_status === 'completed') {
        onViewFeedback(latestAttempt.session_id);
      }
      // If processing, do nothing (visual indicator shows it's not ready)
    } else {
      // If previous attempts exist, toggle the expanded state
      setShowAttempts(!showAttempts);
    }
  };

  return (
    <article className="bg-white/[0.03] border-2 border-white/20 transition-all duration-200 relative">
      {/* Company Logo - Top Right */}
      {problem.logo_url && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <img
            src={problem.logo_url}
            alt=""
            className="h-10 w-10 md:h-12 md:w-12 border border-white/20 bg-white/5 object-cover shadow-sm"
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Compact Header - Always Visible */}
      <div
        className={`p-6 ${!isProcessing ? 'cursor-pointer hover:border-white/40 hover:bg-white/[0.06]' : ''}`}
        onClick={handleCardClick}
        role={!isProcessing ? 'button' : undefined}
        tabIndex={!isProcessing ? 0 : undefined}
        onKeyDown={(e) => {
          if (!isProcessing && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 pr-14 md:pr-20">
            <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2">
              {problem.problem_title}
            </h2>
            {/* Show processing indicator for single attempt in processing state */}
            {isProcessing && (
              <div className="flex items-center gap-2 text-yellow-500">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </div>

          {/* Attempt Again Button - Below Logo */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAttemptAgain(problem.problem_id);
            }}
            disabled={!problem.can_retry}
            className={`
              p-2 min-h-[44px] min-w-[44px] flex items-center justify-center
              transition-all duration-200 rounded
              flex-shrink-0
              ${problem.logo_url ? 'mt-14 md:mt-16' : ''}
              ${problem.can_retry
                ? 'text-gray-400 hover:text-white hover:bg-white/[0.06] cursor-pointer'
                : 'text-gray-600 cursor-not-allowed opacity-50'
              }
            `}
            aria-label="Attempt this problem again"
            title={!problem.can_retry ? `Maximum attempts reached (${problem.total_attempts}/5)` : 'Attempt Again'}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expanded Attempts Section - Scrollable (only for previous attempts) */}
      {hasPreviousAttempts && showAttempts && (
        <div className="border-t border-white/10 p-6 pt-4 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {/* Latest attempt at the top */}
            <AttemptItem
              attempt={latestAttempt}
              onClick={() => onViewFeedback(latestAttempt.session_id)}
            />

            {/* Previous attempts */}
            {problem.previous_attempts.map((attempt) => (
              <AttemptItem
                key={attempt.session_id}
                attempt={attempt}
                onClick={() => onViewFeedback(attempt.session_id)}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
