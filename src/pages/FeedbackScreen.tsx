import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { getFeedbackDetail } from '@/lib/api';
import { SkillFeedbackCard } from '@/components/dashboard/SkillFeedbackCard';
import type { SkillFeedback, SkillStatus } from '@/types/api';
import { Skeleton } from '@/components/ui/Skeleton';

export function FeedbackScreen() {
  const navigate = useNavigate();
  const { sessionId } = useParams({ strict: false }) as { sessionId: string };

  const { data, isLoading, error } = useQuery({
    queryKey: ['feedback', sessionId],
    queryFn: () => getFeedbackDetail(sessionId),
    staleTime: 5 * 60 * 1000,
  });

  const groupedSkills = data?.skills_evaluated.reduce((acc, skill) => {
    if (!acc[skill.evaluation]) {
      acc[skill.evaluation] = [];
    }
    acc[skill.evaluation].push(skill);
    return acc;
  }, {} as Record<string, SkillFeedback[]>) ?? {};

  const statusOrder: SkillStatus[] = ['Demonstrated', 'Partial', 'Missed'];
  const orderedSkills = statusOrder
    .filter((status) => groupedSkills[status]?.length)
    .flatMap((status) => groupedSkills[status] ?? []);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          type="button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {isLoading ? (
          <div className="space-y-4">
            <div className="p-4 bg-white/[0.03] border border-white/10">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-20 w-full" />
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="p-4 bg-white/[0.03] border border-white/10">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-16 w-full mt-3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-white/60">Failed to load feedback.</p>
        ) : data ? (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {data.title}
              </h1>
              <p className="text-sm text-white/60">
                {new Date(data.completed_at).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            </div>

            {data.feedback_summary && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Summary</h2>
                <p className="text-white/70 leading-relaxed">
                  {data.feedback_summary}
                </p>
              </div>
            )}

            {orderedSkills && orderedSkills.length > 0 ? (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Skills Breakdown</h2>
                <div className="space-y-4">
                  {orderedSkills.map((skill) => (
                    <SkillFeedbackCard key={skill.skill_name} skill={skill} />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-white/60">No skill breakdown available yet.</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
