import { useState, useEffect } from 'react';
import { DISCIPLINES } from '@/data/disciplines';
import { RoleCard } from './RoleCard';

export function DisciplineFilter() {
  const [selectedDiscipline, setSelectedDiscipline] = useState(DISCIPLINES[0].id);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const currentDiscipline = DISCIPLINES.find(d => d.id === selectedDiscipline);

  // Show exactly top 3 roles
  const topRoles = currentDiscipline?.roles.slice(0, 3) || [];

  // Reset accordion when discipline changes & expand first card
  useEffect(() => {
    if (topRoles.length > 0) {
      setExpandedCardId(topRoles[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDiscipline]);

  const handleCardToggle = (roleId: string) => {
    // Toggle: if already expanded, collapse it (null), otherwise expand it
    setExpandedCardId(expandedCardId === roleId ? null : roleId);
  };

  return (
    <div className="w-full space-y-6 md:space-y-8">
      {/* Discipline Filter Tabs - NO ROUNDED CORNERS */}
      <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
        {DISCIPLINES.map((discipline) => (
          <button
            key={discipline.id}
            onClick={() => setSelectedDiscipline(discipline.id)}
            className={`
              px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-medium
              transition-all duration-300 min-h-[44px] touch-manipulation
              ${
                selectedDiscipline === discipline.id
                  ? 'bg-white text-black border-2 border-white'
                  : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/30'
              }
            `}
          >
            {discipline.name}
          </button>
        ))}
      </div>

      {/* Role Cards Container - Accordion */}
      <div className="space-y-3 md:space-y-4 max-w-3xl mx-auto">
        {topRoles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            isExpanded={expandedCardId === role.id}
            onToggle={() => handleCardToggle(role.id)}
          />
        ))}
      </div>
    </div>
  );
}
