interface AllLevelsCompletedModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalLevels: number;
  onGoToInterviewMode?: () => void;
}

export function AllLevelsCompletedModal({
  isOpen,
  onClose,
  totalLevels,
  onGoToInterviewMode,
}: AllLevelsCompletedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-white/[0.03] border-2 border-white/20 p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-semibold text-white mb-4">
            All Levels Complete
          </h2>
          <p className="text-white/60">
            You've completed all {totalLevels} levels
          </p>
        </div>

        <div className="mb-8 text-center">
          <p className="text-white/80 text-lg mb-2">
            Interview Mode Unlocked
          </p>
          <p className="text-white/60 text-sm">
            Face randomly selected problems to keep your skills sharp
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {onGoToInterviewMode && (
            <button
              onClick={onGoToInterviewMode}
              className="w-full px-6 py-4 bg-white hover:bg-white/90 text-black font-semibold transition-all duration-200 active:scale-[0.98]"
            >
              Go to Interview Mode
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full px-6 py-4 bg-white/[0.03] hover:bg-white/[0.06] border-2 border-white/20 hover:border-white/40 text-white font-semibold transition-all duration-200 active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
