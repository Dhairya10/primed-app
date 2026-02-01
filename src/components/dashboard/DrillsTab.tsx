import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { DashboardProblem, DashboardInterview, AttemptSummary } from '@/types/api';
import { getDashboard } from '@/lib/api';
import { SessionCard } from '@/components/dashboard/SessionCard';
import { SessionCardSkeleton } from '@/components/dashboard/SessionCardSkeleton';
import { Button } from '@/components/ui/Button';
import { DEFAULT_USER_ID } from '@/lib/constants';

const POLLING_INTERVAL_MS = 60 * 1000;

interface DrillsTabProps {
  onViewFeedback: (sessionId: string) => void;
}

export function DrillsTab({ onViewFeedback }: DrillsTabProps) {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard', offset],
    queryFn: () =>
      getDashboard({
        user_id: DEFAULT_USER_ID,
        limit,
        offset,
      }),
    refetchInterval: POLLING_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });

  const sessions = useMemo<DashboardInterview[]>(() => {
    if (!data?.problems) return [];

    return data.problems.map((problem: DashboardProblem) => {
      const latest: AttemptSummary = problem.latest_attempt;
      return {
        id: latest.session_id,
        problem_title: problem.problem_title,
        domain: problem.domain,
        problem_type: problem.problem_type,
        completed_at: latest.completed_at,
        evaluation_status: latest.evaluation_status,
        feedback_summary: latest.feedback_summary,
      };
    });
  }, [data]);

  const hasMore = data?.pagination?.has_more || false;

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit);
  };

  return (
    <div>
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400">
          <p className="font-medium mb-2">Failed to load sessions</p>
          <p className="text-sm mb-4">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <Button onClick={() => refetch()} variant="secondary">
            Retry
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && !error && sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center max-w-md">
            <h3 className="text-xl font-semibold text-white mb-3">
              No sessions completed yet
            </h3>
            <p className="text-base text-white/60 mb-6">
              Start practicing with drills to build your skills and track your progress.
            </p>
            <Button
              onClick={() => navigate({ to: '/library' })}
              variant="primary"
              className="min-h-[44px]"
            >
              Browse Drills
            </Button>
          </div>
        </div>
      )}

      {!isLoading && !error && sessions.length > 0 && (
        <>
          <div className="flex flex-col gap-4 md:gap-6 mb-8">
            {sessions.map((session) => {
              const isInProgress =
                session.evaluation_status === 'pending' ||
                session.evaluation_status === 'processing';

              return (
                <SessionCard
                  key={session.id}
                  interview={session}
                  isTimedOut={false}
                  isInProgress={isInProgress}
                  onViewFeedback={() => onViewFeedback(session.id)}
                  onRetry={() => refetch()}
                  onRefresh={() => refetch()}
                />
              );
            })}
          </div>

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
    </div>
  );
}
