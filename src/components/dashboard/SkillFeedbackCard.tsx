import { Badge } from '@/components/ui/Badge';
import type { SkillFeedback } from '@/types/api';

interface SkillFeedbackCardProps {
  skill: SkillFeedback;
}

export function SkillFeedbackCard({ skill }: SkillFeedbackCardProps) {
  const getStatusBadge = () => {
    switch (skill.evaluation) {
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

  return (
    <div className="border border-white/10 rounded bg-white/5 p-4">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-base font-semibold text-white">
          {skill.skill_name}
        </h4>
        {getStatusBadge()}
      </div>

      <p className="text-sm text-white/70 leading-relaxed mb-3">
        {skill.feedback}
      </p>

      {skill.improvement_suggestion && (
        <div className="bg-white/5 rounded p-3 border border-white/10">
          <p className="text-xs font-semibold text-white/80 mb-1 flex items-center gap-1">
           Improvement Suggestion
          </p>
          <p className="text-sm text-white/70 leading-relaxed">
            {skill.improvement_suggestion}
          </p>
        </div>
      )}
    </div>
  );
}
