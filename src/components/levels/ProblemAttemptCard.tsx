import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DOMAIN_LABELS } from '@/lib/constants';
import { formatEnumLabel } from '@/lib/utils';
import type { Problem } from '@/types/api';

interface ProblemAttemptCardProps {
  problem: Problem;
  substitutionsRemaining: number;
  canSubstitute: boolean;
  onStartInterview: () => void;
  onSubstitute: () => void;
  isLoading?: boolean;
}

export function ProblemAttemptCard({
  problem,
  substitutionsRemaining,
  canSubstitute,
  onStartInterview,
  onSubstitute,
  isLoading = false,
}: ProblemAttemptCardProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubstituteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmation(true);
  };

  const handleConfirmSubstitute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmation(false);
    onSubstitute();
  };

  const handleCancelSubstitute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmation(false);
  };

  return (
    <div className="relative">
      {/* Clickable Card */}
      <Card
        hover
        className="p-8 md:p-12 cursor-pointer"
        onClick={isLoading ? undefined : onStartInterview}
      >
        {/* Substitute Button - Top Right */}
        {canSubstitute && substitutionsRemaining > 0 && (
          <button
            onClick={handleSubstituteClick}
            disabled={isLoading}
            className="absolute top-4 right-4 p-2 text-white/40 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Substitute problem"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 2.1l4 4-4 4" />
              <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8" />
              <path d="M7 21.9l-4-4 4-4" />
              <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
            </svg>
          </button>
        )}

        {/* Problem Title */}
        <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight pr-12">
          {problem.title}
        </h2>

        {/* Badges */}
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="text-sm px-3 py-1">
            {formatEnumLabel(problem.problem_type)}
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {DOMAIN_LABELS[problem.domain] || problem.domain}
          </Badge>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">
              Are you sure you want to substitute this problem?
            </h3>
            <p className="text-white/60 mb-6">
              {substitutionsRemaining} substitutions remaining
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelSubstitute}
                className="px-4 py-2 text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubstitute}
                className="px-4 py-2 bg-white text-black hover:bg-white/90 rounded-lg transition-colors"
              >
                Substitute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
