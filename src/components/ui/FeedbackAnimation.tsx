import { useEffect, useRef, useState } from 'react';

export function FeedbackAnimation() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [opacity, setOpacity] = useState(1);

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
              Strong product thinking with clear user empathy. Your structured approach and ability to articulate trade-offs demonstrate interview readiness.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-4">
          {/* Strengths */}
          <div>
            <h4 className="text-white font-semibold text-base md:text-lg mb-3">Strengths</h4>

            <div className="space-y-3">
              <div className="bg-white/5 p-4 border-l-4 border-green-500/60">
                <div className="font-medium text-white text-sm md:text-base mb-2">
                  Problem Understanding
                </div>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                  Excellent grasp of user needs and pain points. You effectively identified the core problem and articulated the business context.
                </p>
              </div>

              <div className="bg-white/5 p-4 border-l-4 border-green-500/60">
                <div className="font-medium text-white text-sm md:text-base mb-2">
                  Structured Thinking
                </div>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                  Clear framework application with logical flow. You presented ideas in a coherent manner that was easy to follow.
                </p>
              </div>
            </div>
          </div>

          {/* Focus Areas */}
          <div>
            <h4 className="text-white font-semibold text-base md:text-lg mb-3">Focus Areas</h4>

            <div className="space-y-3">
              <div className="bg-white/5 p-4 border-l-4 border-yellow-500/60">
                <div className="font-medium text-white text-sm md:text-base mb-2">
                  Trade-off Analysis
                </div>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                  Consider discussing multiple solutions and comparing their pros/cons before selecting one. Practice the "2-3 solutions" approach - present alternatives, evaluate trade-offs, then justify your recommendation.
                </p>
              </div>

              <div className="bg-white/5 p-4 border-l-4 border-yellow-500/60">
                <div className="font-medium text-white text-sm md:text-base mb-2">
                  Metrics Definition
                </div>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                  Include specific success metrics earlier in your response to demonstrate outcome-oriented thinking. Use the framework "I'd measure success through [leading metric] and [lagging metric]" early in your answer.
                </p>
              </div>
            </div>
          </div>
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
