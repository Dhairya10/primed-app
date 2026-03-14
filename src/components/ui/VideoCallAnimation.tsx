import { useState, useEffect, useRef } from 'react';

type Speaker = 'coach' | 'user' | 'idle';

interface Turn {
  speaker: Speaker;
  caption: string;
  duration: number;
}

interface SlideItem {
  speaker: 'coach' | 'user';
  caption: string;
  id: number;
}

const TURNS: Turn[] = [
  { speaker: 'coach', caption: "How would you design a podcast recommendation system for Spotify?", duration: 3200 },
  { speaker: 'idle', caption: '', duration: 500 },
  { speaker: 'user', caption: "I'd use collaborative filtering — recommend based on what similar users listen to.", duration: 3200 },
  { speaker: 'idle', caption: '', duration: 400 },
  { speaker: 'coach', caption: "Collaborative filtering breaks down for new podcasts and niche content. How do you handle that cold-start problem?", duration: 3800 },
  { speaker: 'idle', caption: '', duration: 500 },
  { speaker: 'user', caption: "Good call. I'd layer in content signals — topic tags, host style, episode length — to bootstrap new shows.", duration: 3400 },
  { speaker: 'idle', caption: '', duration: 400 },
  { speaker: 'coach', caption: "What's your primary metric to know if a recommendation was actually good versus just clicked?", duration: 3200 },
];

const BAR_COUNTS = { coach: 12, user: 12 };
const PANEL_HEIGHT = 96;

function gaussianHeight(i: number, count: number): number {
  const center = (count - 1) / 2;
  const sigma = count / 4;
  const exponent = -((i - center) ** 2) / (2 * sigma ** 2);
  return Math.exp(exponent);
}

function WaveformBars({ active, count, colorClass }: { active: boolean; count: number; colorClass: string }) {
  const MIN_H = 2;
  const MAX_H = 8;

  return (
    <div className="flex items-center justify-center gap-[3px] h-8">
      {Array.from({ length: count }).map((_, i) => {
        const g = gaussianHeight(i, count);
        const activeHeight = MIN_H + g * (MAX_H - MIN_H);
        return (
          <div
            key={i}
            className={`w-[2px] ${colorClass}`}
            style={{
              height: `${active ? activeHeight : MIN_H}px`,
              opacity: active ? 0.55 + g * 0.35 : 0.15,
              transition: 'height 0.3s ease, opacity 0.3s ease',
              animation: active
                ? `softPulse ${0.9 + (i % 3) * 0.15}s ease-in-out ${(i * 0.04).toFixed(2)}s infinite alternate`
                : 'none',
              transformOrigin: 'center bottom',
            }}
          />
        );
      })}
    </div>
  );
}

function SpeakerLabel({ speaker }: { speaker: 'coach' | 'user' }) {
  return (
    <span className={`text-[10px] font-bold tracking-widest uppercase flex-shrink-0 mt-0.5 w-7 ${speaker === 'coach' ? 'text-paper-300' : 'text-white/60'}`}>
      {speaker === 'coach' ? 'P' : 'You'}
    </span>
  );
}

export function VideoCallAnimation() {
  const [turnIndex, setTurnIndex] = useState(0);
  const [slide, setSlide] = useState<{ current: SlideItem | null; exiting: SlideItem | null }>({ current: null, exiting: null });

  // Slide history for the scroll-to-top restart effect
  const [slideHistory, setSlideHistory] = useState<SlideItem[]>([]);
  const slideHistoryRef = useRef<SlideItem[]>([]);

  // Restart scroll state: 'idle' = normal mode, 'placed' = stack rendered at bottom position,
  // 'scrolling' = fast upward animation running
  const [restartScroll, setRestartScroll] = useState<'idle' | 'placed' | 'scrolling'>('idle');

  const slideCountRef = useRef(0);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstCycleRef = useRef(true);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const turn = TURNS[turnIndex];

    // Mark end of first cycle
    if (isFirstCycleRef.current && turnIndex === TURNS.length - 1) {
      isFirstCycleRef.current = false;
    }

    // Detect restart (turn-0 on any cycle after the first)
    const isRestart = turnIndex === 0 && !isFirstCycleRef.current;

    if (isRestart) {
      // Snapshot history via ref (avoids stale closure)
      const history = slideHistoryRef.current;

      if (history.length > 0) {
        // 1. Instantly place the stack so the last slide is visible (no transition)
        setRestartScroll('placed');

        // 2. Next two frames: apply the upward scroll transition
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = requestAnimationFrame(() => {
            setRestartScroll('scrolling');

            // 3. After animation finishes, reset to idle and clear history
            restartTimerRef.current = setTimeout(() => {
              setRestartScroll('idle');
              slideHistoryRef.current = [];
              setSlideHistory([]);
            }, 180);
          });
        });
      }
    }

    if (turn.speaker !== 'idle') {
      slideCountRef.current += 1;
      const newSlide: SlideItem = { speaker: turn.speaker, caption: turn.caption, id: slideCountRef.current };

      // Only add to history during normal (non-restart) turns
      if (!isRestart) {
        slideHistoryRef.current = [...slideHistoryRef.current, newSlide];
        setSlideHistory(slideHistoryRef.current);
      }

      setSlide(prev => ({
        current: newSlide,
        // On restart, don't carry over the exiting slide (it's shown in the scroll stack)
        exiting: isRestart ? null : prev.current,
      }));

      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (!isRestart) {
        exitTimerRef.current = setTimeout(() => {
          setSlide(prev => ({ ...prev, exiting: null }));
        }, 400);
      }
    }

    const timer = setTimeout(() => setTurnIndex(prev => (prev + 1) % TURNS.length), turn.duration);
    return () => clearTimeout(timer);
  }, [turnIndex]);

  const current = TURNS[turnIndex];
  const isScrolling = restartScroll !== 'idle';

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-ink-950 border border-white/10 overflow-hidden flex flex-col font-sans">

      {/* Problem statement header */}
      <div className="px-5 pt-4 pb-2 flex-shrink-0">
        <span className="text-white/60 text-[11px] tracking-widest uppercase font-medium">
          Design Spotify's podcast recommendation system
        </span>
      </div>

      {/* Main voice area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">

        {/* Interviewer (Primed AI) */}
        <div className={`flex-1 flex flex-col items-center justify-center gap-4 p-6 transition-all duration-500 ${current.speaker === 'coach' ? 'opacity-100' : 'opacity-30'}`}>
          <div className="flex flex-col items-center gap-1 mb-1">
            <div className="w-10 h-10 bg-paper-50 flex items-center justify-center">
              <span className="text-ink-950 text-xs font-black uppercase">P</span>
            </div>
            <span className="text-white/60 text-[10px] font-semibold tracking-widest uppercase">Interviewer</span>
          </div>
          <WaveformBars active={current.speaker === 'coach'} count={BAR_COUNTS.coach} colorClass="bg-paper-50" />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-white/5 my-8" />
        <div className="block md:hidden h-px bg-white/5 mx-8" />

        {/* Candidate (User) */}
        <div className={`flex-1 flex flex-col items-center justify-center gap-4 p-6 transition-all duration-500 ${current.speaker === 'user' ? 'opacity-100' : 'opacity-30'}`}>
          <div className="flex flex-col items-center gap-1 mb-1">
            <div className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-paper-50 text-xs font-bold uppercase">You</span>
            </div>
            <span className="text-white/60 text-[10px] font-semibold tracking-widest uppercase">Candidate</span>
          </div>
          <WaveformBars active={current.speaker === 'user'} count={BAR_COUNTS.user} colorClass="bg-paper-300" />
        </div>
      </div>

      {/* Dialogue panel */}
      <div className="border-t border-white/10 flex-shrink-0 bg-ink-900/40 relative overflow-hidden" style={{ height: `${PANEL_HEIGHT}px` }}>

        {/* Restart: scroll-to-top effect */}
        {isScrolling && slideHistory.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              // 'placed': start with last slide visible (shifted down so only last is in view)
              // 'scrolling': animate to top
              transform: restartScroll === 'placed'
                ? `translateY(-${(slideHistory.length - 1) * PANEL_HEIGHT}px)`
                : 'translateY(0)',
              transition: restartScroll === 'scrolling'
                ? 'transform 0.15s ease-in'
                : 'none',
            }}
          >
            {slideHistory.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-5 pt-4"
                style={{ height: `${PANEL_HEIGHT}px` }}
              >
                <SpeakerLabel speaker={s.speaker} />
                <p className="text-sm leading-snug text-paper-100">{s.caption}</p>
              </div>
            ))}
          </div>
        )}

        {/* Normal single-slide transitions (not during restart scroll) */}
        {!isScrolling && (
          <>
            {slide.exiting && (
              <div
                key={`exit-${slide.exiting.id}`}
                className="absolute inset-0 flex items-start gap-3 px-5 pt-4"
                style={{ animation: 'slideOutUp 0.35s ease-in forwards' }}
              >
                <SpeakerLabel speaker={slide.exiting.speaker} />
                <p className="text-sm leading-snug text-paper-100">{slide.exiting.caption}</p>
              </div>
            )}
            {slide.current && (
              <div
                key={`curr-${slide.current.id}`}
                className="absolute inset-0 flex items-start gap-3 px-5 pt-4"
                style={{ animation: 'slideInUp 0.35s ease-out forwards' }}
              >
                <SpeakerLabel speaker={slide.current.speaker} />
                <p className="text-sm leading-snug text-paper-100">{slide.current.caption}</p>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes softPulse {
          from { transform: scaleY(0.7); opacity: 0.4; }
          to   { transform: scaleY(1.15); opacity: 0.85; }
        }
        @keyframes slideOutUp {
          from { transform: translateY(0); opacity: 1; }
          to   { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes slideInUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
