import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { getSkillDetail } from '@/lib/api';
import { DEFAULT_USER_ID } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';
import type { SkillStatus } from '@/types/api';

export function SkillDetailScreen() {
  const navigate = useNavigate();
  const { skillId } = useParams({ strict: false }) as { skillId: string };

  const { data, isLoading, error } = useQuery({
    queryKey: ['skill-detail', skillId],
    queryFn: () => getSkillDetail(DEFAULT_USER_ID, skillId),
  });

  const getStatusBadge = (status: SkillStatus) => {
    switch (status) {
      case 'Demonstrated':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Demonstrated
          </Badge>
        );
      case 'Partial':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Partial
          </Badge>
        );
      case 'Missed':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Missed
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 w-48 bg-white/10 rounded mb-4 animate-pulse" />
          <div className="h-16 bg-white/10 rounded mb-8 animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white/10 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/60">Failed to load skill details</p>
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="mt-4 text-white/80 hover:text-white"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {data.skill_name}
          </h1>
          <p className="text-white/70 mb-4">{data.skill_description}</p>
          <p className="text-sm text-white/60">
            Tested {data.times_tested} time{data.times_tested !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {data.sessions.map((session) => (
            <button
              key={session.session_id}
              onClick={() => navigate({ to: `/feedback/${session.session_id}` })}
              className="w-full p-4 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-left"
            >
              <div className="flex items-start gap-3 mb-2">
                {session.drill_logo_url && (
                  <div className="w-10 h-10 rounded border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
                    <img
                      src={session.drill_logo_url}
                      alt=""
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-1">
                    {session.drill_title}
                  </h3>
                  <p className="text-sm text-white/60">
                    {new Date(session.completed_at).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
                {getStatusBadge(session.status)}
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/library"
            search={{ skill: data.skill_name }}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            Want to try another drill? View drills
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
