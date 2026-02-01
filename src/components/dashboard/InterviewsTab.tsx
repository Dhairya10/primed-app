import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { DashboardProblem } from '@/types/api';
import { getDashboard } from '@/lib/api';
import { filterDisplayableAttempts } from '@/lib/dashboard-utils';
import { ProblemCard } from '@/components/dashboard/ProblemCard';
import { SessionCardSkeleton } from '@/components/dashboard/SessionCardSkeleton';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DEFAULT_USER_ID } from '@/lib/constants';

const POLLING_INTERVAL_MS = 60 * 1000; // 60 seconds

interface InterviewsTabProps {
  onViewFeedback: (sessionId: string) => void;
}

export function InterviewsTab({ onViewFeedback }: InterviewsTabProps) {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const limit = 20;

  // Fetch dashboard data with polling
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard', offset],
    queryFn: () => getDashboard({
      user_id: DEFAULT_USER_ID,
      limit,
      offset,
    }),
    refetchInterval: POLLING_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });

  // Use the new problem-grouped format from the API and filter displayable attempts
  const displayableProblems = useMemo<DashboardProblem[]>(() => {
    if (!data?.problems) return [];

    // Filter out pending and failed attempts
    return filterDisplayableAttempts(data.problems);
  }, [data]);

  const hasMore = data?.pagination?.has_more || false;

  const handleAttemptAgain = () => {
    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const confirmAttemptAgain = () => {
    // Navigate to interview page - will pick next problem from backend
    navigate({ to: '/interview' });
  };

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit);
  };

  return (
    <div>
      {/* Error State */}
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400">
          <p className="font-medium mb-2">Failed to load interviews</p>
          <p className="text-sm mb-4">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <Button onClick={() => refetch()} variant="secondary">
            Retry
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && displayableProblems.length === 0 && (
        <EmptyState />
      )}

      {/* Problems List - Single Column Layout */}
      {!isLoading && !error && displayableProblems.length > 0 && (
        <>
          <div className="flex flex-col gap-4 md:gap-6 mb-8">
            {displayableProblems.map((problem: DashboardProblem) => (
              <ProblemCard
                key={problem.problem_id}
                problem={problem}
                onViewFeedback={onViewFeedback}
                onAttemptAgain={handleAttemptAgain}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center">
              <Button
                onClick={handleLoadMore}
                variant="secondary"
                className="min-h-[44px]"
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Attempt Problem Again?"
        message="This will start a new interview session for this problem. Your previous attempts will be saved."
        confirmText="Start Interview"
        cancelText="Cancel"
        onConfirm={confirmAttemptAgain}
        onCancel={() => {
          setShowConfirmDialog(false);
        }}
      />
    </div>
  );
}
