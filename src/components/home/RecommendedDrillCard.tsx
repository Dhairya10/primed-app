import { Badge } from '@/components/ui/Badge';
import { formatSkillName } from '@/lib/dashboard-utils';

interface RecommendedDrillCardProps {
  drill: {
    id: string;
    title: string;
    skillsTested: string[];
    reasoning: string;
    logoUrl?: string;
  };
  sessionCount: number;
  onClick: () => void;
}

export function RecommendedDrillCard({ drill, sessionCount, onClick }: RecommendedDrillCardProps) {
  // Show reasoning only when session_count >= 2
  const shouldShowReasoning = sessionCount >= 2 && drill.reasoning;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full p-8 md:p-12 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-left group"
    >
      <div className="flex items-start gap-6">
        {drill.logoUrl && (
          <div className="w-14 h-14 md:w-16 md:h-16 border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
            <img
              src={drill.logoUrl}
              alt=""
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-2xl md:text-3xl font-normal text-white leading-tight">
            {drill.title}
          </h3>

          {/* Reasoning aligned with title - only when session_count >= 2 */}
          {shouldShowReasoning && (
            <p className="text-base md:text-lg text-white/70 mt-3 leading-relaxed">
              {drill.reasoning}
            </p>
          )}
        </div>
      </div>

      {/* Skills - only show if present */}
      {drill.skillsTested.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {drill.skillsTested.map((skill) => (
            <Badge key={skill} variant="outline" size="md">
              {formatSkillName(skill)}
            </Badge>
          ))}
        </div>
      )}
    </button>
  );
}
