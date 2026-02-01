interface LevelCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelNumber: number;
  totalProblems: number;
  completedProblems: number;
  isLevelComplete: boolean;
  onContinue: () => void;
}

export function LevelCompletionModal({
  isOpen,
  onClose,
  levelNumber,
  totalProblems,
  completedProblems,
  isLevelComplete,
  onContinue,
}: LevelCompletionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-white/[0.03] border-2 border-white/20 p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-semibold text-white mb-4">
            {isLevelComplete ? 'Level Complete' : 'Problem Complete'}
          </h2>
          <p className="text-white/60 text-sm">
            {isLevelComplete
              ? `Moving to Level ${levelNumber + 1}`
              : `${completedProblems}/${totalProblems} problems completed`}
          </p>
        </div>

        {!isLevelComplete && (
          <div className="mb-8">
            <div className="w-full h-1 bg-white/10 overflow-hidden mb-2">
              <div
                className="h-full bg-white transition-all duration-700"
                style={{ width: `${(completedProblems / totalProblems) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-white/[0.03] hover:bg-white/[0.06] border-2 border-white/20 hover:border-white/40 text-white font-semibold transition-all duration-200 active:scale-[0.98]"
          >
            Close
          </button>
          <button
            onClick={onContinue}
            className="flex-1 px-6 py-4 bg-white hover:bg-white/90 text-black font-semibold transition-all duration-200 active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
