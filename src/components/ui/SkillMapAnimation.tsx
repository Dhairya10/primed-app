import { useEffect, useState } from 'react';

export function SkillMapAnimation() {
  const [position, setPosition] = useState<'yellow' | 'green'>('yellow');
  // isResetting: when true, opacity is 0 so we can invisibly teleport back to yellow
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    // One full cycle: yellow → (2.2s travel) → green (hold 3s) → invisible reset back to yellow → repeat
    const runCycle = () => {
      // 1. Move to green
      setPosition('green');

      // 2. After green settle time (travel 2.2s + hold 2.8s = 5s), start invisible reset
      const resetTimer = setTimeout(() => {
        setIsResetting(true); // fade out
        setTimeout(() => {
          setPosition('yellow'); // teleport to yellow while invisible
          setTimeout(() => {
            setIsResetting(false); // fade back in at yellow
          }, 80);
        }, 300); // wait for fade-out before teleporting
      }, 5000);

      return resetTimer;
    };

    // Start first cycle after small initial delay
    const initialTimer = setTimeout(() => {
      const resetTimer = runCycle();
      // Loop every 5600ms (5000ms hold + 300ms fade + 80ms settle + 220ms buffer)
      const interval = setInterval(runCycle, 5600);
      return () => {
        clearTimeout(resetTimer);
        clearInterval(interval);
      };
    }, 1000);

    return () => clearTimeout(initialTimer);
  }, []);

  const dotLeft = position === 'yellow' ? '50%' : '83.333%';
  const dotTop = position === 'yellow' ? '35%' : '25%';

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-ink-950 border border-white/10 overflow-hidden flex flex-col font-sans">
      <div className="flex-1 flex relative">

        {/* SVG Grid */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="skillGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#262626" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#skillGrid)" />
          </svg>
        </div>

        {/* Zone backgrounds */}
        <div className="flex-1 border-r border-white/5 bg-red-500/15 h-full relative z-10" />
        <div className="flex-1 border-r border-white/5 bg-yellow-500/15 h-full relative z-10" />
        <div className="flex-1 bg-green-500/15 h-full relative z-10" />

        {/* Technical Awareness — Red */}
        <div className="absolute top-[65%] left-[16.666%] -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/70 text-xs font-medium bg-black/30 px-2 py-1 whitespace-nowrap">Technical Awareness</span>
            <div className="w-3 h-3 bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.7)]" />
          </div>
        </div>

        {/* User Segmentation — Yellow */}
        <div className="absolute top-[65%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/70 text-xs font-medium bg-black/30 px-2 py-1 whitespace-nowrap">User Segmentation</span>
            <div className="w-3 h-3 bg-yellow-400 shadow-[0_0_14px_rgba(234,179,8,0.7)]" />
          </div>
        </div>

        {/* Prioritization — Green */}
        <div className="absolute top-[65%] left-[83.333%] -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/70 text-xs font-medium bg-black/30 px-2 py-1 whitespace-nowrap">Prioritization</span>
            <div className="w-3 h-3 bg-green-400 shadow-[0_0_14px_rgba(74,222,128,0.7)]" />
          </div>
        </div>

        {/* Structured Thinking — moving dot */}
        <div
          className="absolute z-30"
          style={{
            left: dotLeft,
            top: dotTop,
            transform: 'translate(-50%, -50%)',
            transition: isResetting
              ? 'opacity 0.3s ease'
              : 'left 2.2s cubic-bezier(0.25, 1, 0.5, 1), top 2.2s cubic-bezier(0.25, 1, 0.5, 1)',
            opacity: isResetting ? 0 : 1,
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="bg-paper-50 px-2.5 py-1 shadow-lg shadow-black/40">
              <span className="text-ink-950 text-xs font-bold whitespace-nowrap tracking-wide">Structured Thinking</span>
            </div>
            <div className="relative flex items-center justify-center">
              <div className={`absolute w-6 h-6 border animate-ping opacity-40 transition-colors duration-700 ${position === 'green' ? 'border-green-400' : 'border-yellow-400'}`} />
              <div className={`absolute w-4 h-4 blur-sm animate-pulse transition-colors duration-700 ${position === 'green' ? 'bg-green-400/80' : 'bg-yellow-400/80'}`} />
              <div className={`w-3 h-3 relative z-10 transition-colors duration-500 ${position === 'green' ? 'bg-green-400' : 'bg-yellow-400'}`} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
