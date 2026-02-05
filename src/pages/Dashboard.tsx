import { useEffect, useState } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { SkillMap } from '@/components/dashboard/SkillMap';
import { getDashboardDrills } from '@/lib/api';
import { formatAttemptTimestamp } from '@/lib/dashboard-utils';
import { DEFAULT_USER_ID, MIN_FEEDBACK_DURATION_MINUTES } from '@/lib/constants';
import type { DashboardSession } from '@/types/api';

function SessionsList({ onViewFeedback }: { onViewFeedback: (sessionId: string) => void }) {
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-drills', DEFAULT_USER_ID, offset],
    queryFn: () => getDashboardDrills({ user_id: DEFAULT_USER_ID, limit, offset }),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 border-2 border-white/20 bg-white/5 animate-pulse"
          >
            <div className="h-6 bg-white/10 mb-2 w-3/4" />
            <div className="h-4 bg-white/10 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border-2 border-white/20 bg-white/5">
        <p className="text-gray-400">Failed to load sessions. Please try again later.</p>
      </div>
    );
  }

  if (!data?.data.length) {
    return (
      <div className="p-12 border-2 border-white/20 bg-white/5 text-center">
        <p className="text-xl text-gray-400 mb-2">No sessions yet</p>
        <p className="text-sm text-gray-500">Start practicing to see your sessions here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.data.map((session: DashboardSession) => (
        <div
          key={session.session_id}
          onClick={() => session.has_feedback && onViewFeedback(session.session_id)}
          className={`p-6 border-2 transition-all ${session.has_feedback
            ? 'border-white/20 bg-white/5 cursor-pointer hover:border-white/40 hover:bg-white/10'
            : 'border-white/10 bg-white/[0.02] cursor-default opacity-60'
            }`}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-semibold text-white flex-1">
              {session.drill_title}
            </h3>
            {session.product_logo_url && (
              <img
                src={session.product_logo_url}
                alt=""
                className="w-8 h-8 object-contain ml-4"
              />
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{formatAttemptTimestamp(session.completed_at)}</span>

            {!session.has_feedback && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Feedback not available (session duration &lt; {MIN_FEEDBACK_DURATION_MINUTES} mins)
                </span>
              </>
            )}
          </div>
        </div>
      ))}

      {data.total > offset + limit && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setOffset(offset + limit)}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export function Dashboard() {
  const search = useSearch({ strict: false }) as { session?: string };
  const navigate = useNavigate();

  // Handle session query parameter to open feedback screen
  useEffect(() => {
    const sessionParam = search.session;
    if (sessionParam) {
      navigate({ to: `/feedback/${sessionParam}` });
    }
  }, [search.session, navigate]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 md:pb-12 px-4 md:px-6">
      <Toaster />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Your Dashboard
          </h1>
          <p className="text-base md:text-lg text-gray-400">
            Track your skill progression and review your performance.
          </p>
        </div>

        <SkillMap userId={DEFAULT_USER_ID} className="mb-8" />

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">Past Sessions</h2>
        </div>

        <SessionsList onViewFeedback={(sessionId) => navigate({ to: `/feedback/${sessionId}` })} />
      </div>
    </div>
  );
}
