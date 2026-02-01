import { useEffect } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';
import { DrillsTab } from '@/components/dashboard/DrillsTab';
import { SkillMap } from '@/components/dashboard/SkillMap';
import { DEFAULT_USER_ID } from '@/lib/constants';

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
          <h2 className="text-2xl font-bold text-white">Recent Sessions</h2>
        </div>

        <DrillsTab onViewFeedback={(sessionId) => navigate({ to: `/feedback/${sessionId}` })} />
      </div>
    </div>
  );
}
