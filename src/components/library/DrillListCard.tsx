import { useNavigate } from '@tanstack/react-router';
import type { Drill } from '@/types/api';
import { Badge } from '@/components/ui/Badge';
import { Check } from 'lucide-react';

interface DrillListCardProps {
  drill: Drill;
  isCompleted?: boolean;
}

export function DrillListCard({ drill, isCompleted = false }: DrillListCardProps) {
  const navigate = useNavigate();

  const handleDrillClick = () => {
    navigate({ to: `/drill/loading/${drill.id}` });
  };

  return (
    <button
      type="button"
      onClick={handleDrillClick}
      className="relative w-full h-full min-h-[140px] p-5 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-left group flex flex-col"
    >
      <div className="flex items-start gap-3 flex-1">
        {drill.product_logo_url && (
          <div className="w-10 h-10 rounded border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
            <img
              src={drill.product_logo_url}
              alt=""
              className="w-6 h-6 object-contain"
            />
          </div>
        )}
        <h3 className="text-sm font-normal text-white flex-1 leading-tight">
          {drill.display_title}
        </h3>
        {isCompleted && (
          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {drill.skills_tested && drill.skills_tested.length > 0 && (
          drill.skills_tested.map((skill) => (
            <Badge key={skill} variant="outline" size="sm">
              {skill}
            </Badge>
          ))
        )}
      </div>
    </button>
  );
}
