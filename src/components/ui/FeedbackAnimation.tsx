import { useEffect, useRef, useState } from 'react';

interface SkillEvaluation {
  skill_name: string;
  evaluation: 'Demonstrated' | 'Partially' | 'Did not demonstrate';
  feedback: string;
  improvement_suggestion?: string;
}

interface FeedbackData {
  summary: string;
  skills: SkillEvaluation[];
}

const MOCK_FEEDBACK: FeedbackData = {
  summary: "Strong product thinking with clear user empathy and structured approach. However, there's room to strengthen your quantitative reasoning and explicitly discuss trade-offs when prioritizing solutions.",
  skills: [
    {
      skill_name: "Structured Thinking",
      evaluation: "Demonstrated",
      feedback: "Your answer followed a clear framework—problem definition, user needs, solutions, metrics. This made your reasoning easy to follow and showed preparation.",
    },
    {
      skill_name: "Prioritization",
      evaluation: "Partially",
      feedback: "You mentioned focusing on mobile users first, but didn't explicitly explain why or what you were choosing not to do. The reasoning felt implied rather than stated.",
      improvement_suggestion: "Use the '2-3 solutions' approach: present alternatives, evaluate tradeoffs explicitly, then justify your choice with clear reasoning about constraints and impact."
    },
    {
      skill_name: "Quantitative Reasoning",
      evaluation: "Did not demonstrate",
      feedback: "When estimating market size, you used broad assumptions without breaking them down into components or sanity-checking the numbers against known benchmarks.",
      improvement_suggestion: "Practice structuring estimations: Start with knowns (e.g., 'U.S. population ~330M'), break into segments, and validate ('Does 10M feel right for monthly active shoppers?')."
    }
  ]
};

export function FeedbackAnimation() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [opacity, setOpacity] = useState(1);

  // Helper function to get border color based on evaluation status
  const getEvaluationColor = (evaluation: SkillEvaluation['evaluation']) => {
    switch (evaluation) {
      case 'Demonstrated':
        return 'border-green-500/60';
      case 'Partially':
        return 'border-yellow-500/60';
      case 'Did not demonstrate':
        return 'border-red-500/60';
      default:
        return 'border-white/10';
    }
  };

  // Auto-scroll animation
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollInterval: number;
    let isPaused = false;
    let isAtTop = true;

    const startScrolling = () => {
      setIsScrolling(true);

      // Initial pause at top for 3.5 seconds
      setTimeout(() => {
        isAtTop = false;

        scrollInterval = window.setInterval(() => {
          if (!scrollContainer || isPaused) return;

          const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
          const currentScroll = scrollContainer.scrollTop;

          // When reaching bottom, restart from top with pause
          if (currentScroll >= maxScroll - 5) {
            isPaused = true;

            // Pause at bottom for 3.5 seconds BEFORE any animation
            setTimeout(() => {
              // Reels-style dim effect - more noticeable
              setOpacity(0.3);

              setTimeout(() => {
                if (scrollContainer) {
                  // Jump to top during dim
                  scrollContainer.scrollTop = 0;

                  // Quick fade back in
                  setTimeout(() => {
                    setOpacity(1);
                    isPaused = false;
                    isAtTop = true;

                    // Pause at top before starting next scroll
                    setTimeout(() => {
                      isAtTop = false;
                    }, 3500);
                  }, 150); // Smooth fade back
                }
              }, 200); // Noticeable dim
            }, 3500); // Full 3.5 second pause at bottom
          } else if (!isAtTop) {
            // Much faster scroll: 8px every 15ms = ~533px/second
            scrollContainer.scrollTop += 8;
          }
        }, 15);
      }, 3500); // Initial pause at top
    };

    // Start scrolling after component mounts
    const timeout = setTimeout(startScrolling, 500);

    return () => {
      clearTimeout(timeout);
      clearInterval(scrollInterval);
      setIsScrolling(false);
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-black/30 border border-white/10 overflow-hidden">
      <div
        ref={scrollRef}
        className="h-full p-6 md:p-8 overflow-auto [&::-webkit-scrollbar]:hidden transition-opacity duration-200 ease-in-out"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          pointerEvents: 'none',
          scrollBehavior: 'auto',
          opacity: opacity,
        }}
      >
        {/* Top-level Summary */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-white font-semibold text-lg md:text-xl mb-4">
            Interview Feedback
          </h3>

          {/* Summary */}
          <div className="bg-white/5 p-4 border border-white/10">
            <h4 className="text-white font-medium text-sm md:text-base mb-2">Summary</h4>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              {MOCK_FEEDBACK.summary}
            </p>
          </div>
        </div>

        {/* Skills Evaluation */}
        <div className="space-y-4">
          {MOCK_FEEDBACK.skills.map((skill, index) => (
            <div
              key={index}
              className={`bg-white/5 p-4 border-l-4 ${getEvaluationColor(skill.evaluation)}`}
            >
              {/* Skill name and evaluation status */}
              <div className="mb-2">
                <div className="font-medium text-white text-sm md:text-base">
                  {skill.skill_name}
                </div>
                <div className="text-xs text-white/50 mt-1">
                  {skill.evaluation}
                </div>
              </div>

              {/* Feedback */}
              <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                {skill.feedback}
              </p>

              {/* Improvement suggestion - only if present */}
              {skill.improvement_suggestion && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex gap-2 items-start">
                    <div className="flex-1">
                      <div className="text-white/80 font-medium text-xs md:text-sm mb-1">
                        How to improve:
                      </div>
                      <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                        {skill.improvement_suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Scroll indicator at bottom */}
        {!isScrolling && (
          <div className="text-center pt-6 text-white/40 text-xs md:text-sm animate-pulse">
            ↓ Scroll to see more ↓
          </div>
        )}
      </div>
    </div>
  );
}
