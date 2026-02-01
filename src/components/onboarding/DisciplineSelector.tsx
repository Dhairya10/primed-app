import { Briefcase, Palette, Settings, Megaphone } from 'lucide-react';
import type { DisciplineType } from '@/types/api';
import { DISCIPLINE_LABELS } from '@/lib/constants';

interface DisciplineSelectorProps {
  disciplines: DisciplineType[];
  selectedDiscipline: DisciplineType | null;
  onDisciplineChange: (discipline: DisciplineType) => void;
  error?: string;
}

const DISCIPLINE_ICONS: Record<DisciplineType, React.ComponentType<{ className?: string }>> = {
  product: Briefcase,
  design: Palette,
  engineering: Settings,
  marketing: Megaphone,
};

export function DisciplineSelector({
  disciplines,
  selectedDiscipline,
  onDisciplineChange,
  error,
}: DisciplineSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg md:text-xl font-semibold text-white">
          What's your primary focus? <span className="text-white/60">*</span>
        </h2>
        <p className="text-sm md:text-base text-white/60">
          This helps us personalize your experience.
        </p>
      </div>

      {/* Discipline Cards Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
        role="radiogroup"
        aria-label="Select your track"
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? 'discipline-error' : undefined}
      >
        {disciplines.map((discipline) => {
          const isSelected = selectedDiscipline === discipline;
          const Icon = DISCIPLINE_ICONS[discipline];
          const label = DISCIPLINE_LABELS[discipline];

          return (
            <label
              key={discipline}
              className={`
                relative flex flex-col items-center justify-center
                p-6 md:p-8 rounded-lg cursor-pointer
                border-2 transition-all duration-200
                min-h-[140px] md:min-h-[160px]
                group
                ${
                  isSelected
                    ? 'border-white bg-white/10 scale-[1.02]'
                    : 'border-white/20 bg-transparent hover:border-white/40 hover:bg-white/[0.04] active:scale-[0.98]'
                }
              `}
            >
              {/* Hidden Radio Input for Accessibility */}
              <input
                type="radio"
                name="discipline"
                value={discipline}
                checked={isSelected}
                onChange={() => onDisciplineChange(discipline)}
                className="sr-only"
                aria-label={label}
              />

              {/* Icon */}
              <div
                className={`
                  mb-3 transition-all duration-200
                  ${
                    isSelected
                      ? 'text-white'
                      : 'text-white/70 group-hover:text-white/90'
                  }
                `}
              >
                <Icon className="w-12 h-12 md:w-16 md:h-16" />
              </div>

              {/* Label */}
              <span
                className={`
                  text-base md:text-lg font-medium transition-all duration-200
                  ${
                    isSelected
                      ? 'text-white'
                      : 'text-white/80 group-hover:text-white'
                  }
                `}
              >
                {label}
              </span>

              {/* Selected Indicator (subtle checkmark or dot) */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white" />
              )}
            </label>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <p
          id="discipline-error"
          className="text-sm text-white/80 flex items-center"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
