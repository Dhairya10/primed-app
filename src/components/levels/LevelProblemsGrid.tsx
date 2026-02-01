import type { LevelProblem } from '@/types/api';

interface LevelProblemsGridProps {
  problems: LevelProblem[];
  levelNumber: number;
  onProblemClick: (problem: LevelProblem) => void;
}

const STATUS_STYLES = {
  locked: 'bg-gray-900 border-gray-800 opacity-60 cursor-not-allowed',
  available: 'bg-gray-900 border-blue-500/50 hover:border-blue-500 cursor-pointer hover:scale-[1.02]',
  in_progress: 'bg-blue-900/20 border-blue-500 ring-2 ring-blue-500/30 cursor-pointer',
  completed: 'bg-green-900/20 border-green-500 cursor-default',
  failed: 'bg-red-900/20 border-red-500 cursor-default',
};

const STATUS_ICONS = {
  locked: '🔒',
  available: '📝',
  in_progress: '⏳',
  completed: '✅',
  failed: '❌',
};

export function LevelProblemsGrid({ problems, levelNumber, onProblemClick }: LevelProblemsGridProps) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-white mb-4">
        Level {levelNumber} Problems
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {problems.map((levelProblem, index) => {
          const { problem, status, is_current, attempt_count } = levelProblem;
          const isClickable = status === 'available' || status === 'in_progress';

          return (
            <div
              key={problem.id}
              onClick={() => isClickable && onProblemClick(levelProblem)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                STATUS_STYLES[status]
              } ${is_current ? 'ring-4 ring-purple-500/50' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{STATUS_ICONS[status]}</span>
                <span className="text-xs text-gray-500 font-mono">#{index + 1}</span>
              </div>

              <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2">
                {problem.title}
              </h4>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">
                  {problem.domain.replace('_', ' ')}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">
                  {problem.problem_type.replace('_', ' ')}
                </span>
              </div>

              {attempt_count > 0 && (
                <div className="text-xs text-gray-500 mb-2">
                  Attempts: {attempt_count}
                </div>
              )}

              <div className="text-xs font-medium">
                {status === 'locked' && <span className="text-gray-500">Locked</span>}
                {status === 'available' && is_current && (
                  <span className="text-blue-400">Current - Click to Start</span>
                )}
                {status === 'available' && !is_current && (
                  <span className="text-gray-400">Available</span>
                )}
                {status === 'in_progress' && (
                  <span className="text-blue-400">In Progress</span>
                )}
                {status === 'completed' && (
                  <span className="text-green-400">Completed</span>
                )}
                {status === 'failed' && <span className="text-red-400">Failed</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
