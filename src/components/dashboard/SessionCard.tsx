import { useState } from 'react';
import { format } from 'date-fns';
import { Check, Clock, X, RefreshCw } from 'lucide-react';
import type { DashboardInterview, EvaluationStatus } from '@/types/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDomain, formatProblemType } from '@/lib/dashboard-utils';

interface SessionCardProps {
  interview: DashboardInterview;
  isTimedOut: boolean;
  onViewFeedback: () => void;
  onRetry: () => void;
  onRefresh: () => void;
  isInProgress?: boolean;
  showDomain?: boolean;
}

function getStatusDisplay(
  status: EvaluationStatus,
  isTimedOut: boolean
): {
  icon: React.ReactNode;
  text: string;
  canViewFeedback: boolean;
  showRetry: boolean;
  showRefresh: boolean;
} {
  if (status === 'completed') {
    return {
      icon: <Check className="w-5 h-5" />,
      text: 'Feedback Ready',
      canViewFeedback: true,
      showRetry: false,
      showRefresh: false,
    };
  }
  
  if (status === 'processing' && isTimedOut) {
    return {
      icon: <Clock className="w-5 h-5" />,
      text: 'Taking longer than expected',
      canViewFeedback: false,
      showRetry: false,
      showRefresh: true,
    };
  }
  
  if (status === 'processing') {
    return {
      icon: <Clock className="w-5 h-5" />,
      text: 'Processing...',
      canViewFeedback: false,
      showRetry: false,
      showRefresh: false,
    };
  }
  
  if (status === 'pending') {
    return {
      icon: <Clock className="w-5 h-5" />,
      text: 'Evaluation pending...',
      canViewFeedback: false,
      showRetry: false,
      showRefresh: false,
    };
  }
  
  if (status === 'failed') {
    return {
      icon: <X className="w-5 h-5" />,
      text: 'Evaluation failed',
      canViewFeedback: false,
      showRetry: true,
      showRefresh: false,
    };
  }
  
  return {
    icon: <Clock className="w-5 h-5" />,
    text: 'Status unknown',
    canViewFeedback: false,
    showRetry: false,
    showRefresh: false,
  };
}

export function SessionCard({
  interview,
  isTimedOut,
  onViewFeedback,
  onRetry,
  onRefresh,
  isInProgress = false,
  showDomain = true,
}: SessionCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const statusDisplay = getStatusDisplay(interview.evaluation_status, isTimedOut);
  const formattedDate = format(new Date(interview.completed_at), 'MMMM d, yyyy');

  if (isInProgress) {
    return (
      <div
        className="relative p-4 border border-white/10 bg-white/5 opacity-60 cursor-not-allowed"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2">
              {interview.problem_title}
            </h2>
            <p className="text-sm text-gray-400">{formattedDate}</p>
          </div>
        </div>

        {showTooltip && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-black border border-white/20 rounded text-xs text-white/80 whitespace-nowrap z-10">
            Session review in progress, please wait
          </div>
        )}

        <div className="absolute top-4 right-4">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            In Progress
          </Badge>
        </div>
      </div>
    );
  }

  const handleCardClick = () => {
    if (statusDisplay.canViewFeedback) {
      onViewFeedback();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (statusDisplay.canViewFeedback && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onViewFeedback();
    }
  };
  
  return (
    <article 
      className={`
        relative bg-white/[0.03] border-2 border-white/20 p-6 transition-all duration-200
        ${statusDisplay.canViewFeedback 
          ? 'cursor-pointer hover:border-white/40 hover:bg-white/[0.06]' 
          : ''
        }
      `}
      onClick={handleCardClick}
      onKeyDown={(e) => handleKeyDown(e)}
      tabIndex={statusDisplay.canViewFeedback ? 0 : undefined}
      role={statusDisplay.canViewFeedback ? 'button' : undefined}
      aria-label={statusDisplay.canViewFeedback ? `View feedback for ${interview.problem_title}` : undefined}
    >
      {/* Regenerate Button - Top Right */}
      {statusDisplay.showRetry && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRetry();
          }}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Regenerate feedback"
          title="Regenerate feedback"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      )}
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2">
          {interview.problem_title}
        </h2>
        <p className="text-sm text-gray-400">
          {formattedDate}
        </p>
      </div>
      
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {showDomain && (
          <Badge variant="outline">
            {formatDomain(interview.domain)}
          </Badge>
        )}
        <Badge variant="outline">
          {formatProblemType(interview.problem_type)}
        </Badge>
      </div>
      
      {/* Status */}
      <div className="flex items-center gap-2 mb-4 text-gray-300">
        {statusDisplay.icon}
        <span className="text-sm">{statusDisplay.text}</span>
      </div>
      
      {/* Score display removed - scores no longer available in dashboard (MVP scope) */}
      
      {/* Refresh Action (for timeout) */}
      {statusDisplay.showRefresh && (
        <div className="flex flex-col items-center gap-2">
          <div className="text-center w-full">
            <p className="text-sm text-gray-400 mb-2">
              Taking longer than expected. Please refresh the page.
            </p>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onRefresh();
              }}
              variant="secondary"
              className="min-h-[44px] w-full max-w-[50%] mx-auto"
            >
              Refresh
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}
