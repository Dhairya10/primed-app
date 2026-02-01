import { ChevronDown } from 'lucide-react';
import { Role } from '@/data/disciplines';

interface RoleCardProps {
  role: Role;
  isExpanded: boolean;
  onToggle: () => void;
}

export function RoleCard({
  role,
  isExpanded,
  onToggle,
}: RoleCardProps) {
  return (
    <div
      className="bg-white/5 border border-white/10 p-6 md:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-expanded={isExpanded}
    >
      {/* Header (visible in both states) */}
      <div className="flex items-start justify-between gap-4">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 md:gap-4 flex-1">
          <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center overflow-hidden">
            <img
              src={role.logoPath}
              alt={`${role.company} logo`}
              className="w-full h-full object-contain opacity-80"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base md:text-lg">
              {role.title}
            </h4>
          </div>
        </div>

        {/* Expand/Collapse Icon (only for collapsed cards) */}
        {!isExpanded && (
          <ChevronDown
            className="w-5 h-5 text-white/70 flex-shrink-0 transition-transform"
          />
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-6">
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            {role.description}
          </p>
        </div>
      )}
    </div>
  );
}
