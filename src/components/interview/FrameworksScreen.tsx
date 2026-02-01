import { Card } from '@/components/ui/Card';
import type { Problem } from '@/types/api';
import { useFrameworksForProblem } from '@/lib/frameworks/selector';
import { PRACTICE_ESTIMATED_TIME } from '@/lib/interview-constants';

interface FrameworksScreenProps {
  problem: Problem;
  onStartInterview: () => void;
  onBack?: () => void;
}

export function FrameworksScreen({
  problem,
  onStartInterview,
  onBack,
}: FrameworksScreenProps) {
  // Direct framework lookup - no API call, no loading state needed
  const frameworks = useFrameworksForProblem(problem);

  // Show empty state if no frameworks available
  if (frameworks.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">No frameworks available for this problem type</p>
          {onBack && (
            <button
              onClick={onBack}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="pt-24 pb-6 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {onBack && (
            <button
              onClick={onBack}
              className="text-white/60 hover:text-white mb-4 flex items-center gap-2 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Key Frameworks
          </h1>
          <p className="text-white/60 text-lg">{problem.title}</p>
        </div>
      </div>

      {/* Scrollable Frameworks Section */}
      <div className="flex-1 overflow-y-auto pb-36 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {frameworks.map((framework, index) => (
            <Card key={framework.id} className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                {/* Number Badge */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>

                {/* Framework Content */}
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">
                    {framework.name}
                  </h3>
                  <p className="text-white/70 mb-4 leading-relaxed">
                    {framework.description}
                  </p>

                  {framework.key_points && framework.key_points.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">
                        Key Points
                      </h4>
                      <ul className="space-y-2">
                        {framework.key_points.map((point, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-white/60"
                          >
                            <span className="text-white/40 mt-1">•</span>
                            <span className="flex-1">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div
        className="fixed left-0 right-0 bottom-0 bg-gradient-to-t from-black via-black to-transparent pt-8 px-4 md:px-6"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 4.5rem)' }}
      >
        <div className="max-w-4xl mx-auto w-full flex justify-center md:justify-center">
          <button
            onClick={onStartInterview}
            className="w-full md:w-auto px-6 md:px-16 py-2 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors flex flex-col items-center gap-0.5"
          >
            <span className="text-base">Start Interview</span>
            <span className="text-xs font-normal text-black/60">~{PRACTICE_ESTIMATED_TIME} mins</span>
          </button>
        </div>
      </div>
    </div>
  );
}
