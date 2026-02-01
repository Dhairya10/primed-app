import { useState } from 'react';
import { Play, Pause } from 'lucide-react';

const INTERVIEW_TYPES = {
  product: { title: 'Product Design' },
  behavioral: { title: 'Behavioral' },
  analytical: { title: 'Analytical' },
  technical: { title: 'Technical' },
} as const;

type InterviewType = keyof typeof INTERVIEW_TYPES;

export function InterviewTypesSection() {
  const [activeInterview, setActiveInterview] =
    useState<InterviewType>('product');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-12 justify-center">
          {Object.entries(INTERVIEW_TYPES).map(([key, type]) => (
            <button
              key={key}
              onClick={() => setActiveInterview(key as InterviewType)}
              className={`
                px-3 py-2 md:px-4 text-sm font-medium transition-all min-h-[44px] touch-manipulation
                ${
                  activeInterview === key
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                }
              `}
            >
              {type.title}
            </button>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative bg-gradient-to-br from-gray-900 to-black overflow-hidden aspect-video border border-white/10">
            {!isVideoPlaying ? (
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="absolute inset-0 flex flex-col items-center justify-center group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:scale-110">
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" />
                </div>
                <p className="mt-4 text-gray-400 text-sm">
                  {INTERVIEW_TYPES[activeInterview].title} Interview Demo
                </p>
              </button>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-400">Video playing...</p>
              </div>
            )}

            <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-white/20 via-transparent to-white/20 bg-[length:200%_100%] animate-shimmer pointer-events-none"></div>
          </div>

          <div className="mt-4 flex items-center space-x-4 px-4">
            <button
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              className="text-gray-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
            >
              {isVideoPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            <div className="flex-1 h-1 bg-white/10 overflow-hidden">
              <div className="w-1/3 h-full bg-white transition-all duration-300"></div>
            </div>
            <span className="text-sm text-gray-400">0:32 / 1:45</span>
          </div>
        </div>
      </div>
    </section>
  );
}
