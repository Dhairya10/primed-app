import type { LevelProgress } from '@/types/api';

interface LevelProgressBarProps {
  progress: LevelProgress;
}

export function LevelProgressBar({ progress }: LevelProgressBarProps) {
  const { total_levels, current_level_number, level_details } = progress;

  const getLevelProgress = (levelNumber: number) => {
    if (!level_details) {
      // Fallback to previous logic if level_details not available
      if (levelNumber < current_level_number) return 1;
      if (levelNumber === current_level_number) return 0;
      return 0;
    }

    const detail = level_details.find(d => d.level_number === levelNumber);
    if (!detail || detail.total_problems === 0) return 0;
    return detail.completed_problems / detail.total_problems;
  };

  return (
    <div className="mb-12">
      {/* Game-like Progress Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-white/60 font-mono">
          LEVEL {current_level_number}/{total_levels}
        </div>
      </div>

      {/* Level Dots - color based on problem completion */}
      <div className="flex justify-between gap-1">
        {Array.from({ length: total_levels }, (_, i) => {
          const levelNumber = i + 1;
          const progressRatio = getLevelProgress(levelNumber);
          const isCurrent = levelNumber === current_level_number;

          return (
            <div
              key={levelNumber}
              className={`flex-1 h-2 rounded-sm overflow-hidden bg-white/20 transition-all duration-300 ${
                isCurrent ? 'h-3' : ''
              }`}
            >
              <div
                className="h-full bg-white transition-all duration-700"
                style={{ width: `${progressRatio * 100}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
