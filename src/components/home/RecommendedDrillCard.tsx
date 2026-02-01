import { Badge } from '@/components/ui/Badge';

interface RecommendedDrillCardProps {
  drill: {
    id: string;
    title: string;
    skillsTested: string[];
    reasoning: string;
    logoUrl?: string;
  };
  onClick: () => void;
}

export function RecommendedDrillCard({ drill, onClick }: RecommendedDrillCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full p-6 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-left group"
    >
      <div className="flex items-start gap-3 mb-4">
        {drill.logoUrl && (
          <div className="w-10 h-10 rounded border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
            <img
              src={drill.logoUrl}
              alt=""
              className="w-6 h-6 object-contain"
            />
          </div>
        )}
        <h3 className="text-lg font-semibold text-white flex-1 leading-tight">
          {drill.title}
        </h3>
      </div>

      <p className="text-sm text-white/70 mb-4 leading-relaxed">
        {drill.reasoning}
      </p>

      <div className="flex flex-wrap gap-2">
        {drill.skillsTested.map((skill) => (
          <Badge key={skill} variant="outline" size="sm">
            {skill}
          </Badge>
        ))}
      </div>
    </button>
  );
}
