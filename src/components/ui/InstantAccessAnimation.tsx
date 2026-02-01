import { useState, useEffect } from 'react';
import { Check, MousePointer2 } from 'lucide-react';

export function InstantAccessAnimation() {
  const [animationState, setAnimationState] = useState<
    'idle' | 'clicking' | 'pressed' | 'loading' | 'feedback'
  >('idle');

  useEffect(() => {
    const runAnimation = () => {
      setAnimationState('idle');
      
      setTimeout(() => setAnimationState('clicking'), 1000);
      setTimeout(() => setAnimationState('pressed'), 1500);
      setTimeout(() => setAnimationState('loading'), 1900);
      setTimeout(() => setAnimationState('feedback'), 4900);
      setTimeout(() => setAnimationState('idle'), 6400);
    };

    runAnimation();
    const interval = setInterval(runAnimation, 7400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-48 md:h-64 flex items-center justify-center">
      {/* Button State - Visible during idle, clicking, and pressed states */}
      <div
        className={`
          relative transition-all duration-700 ease-in-out
          ${animationState === 'loading' || animationState === 'feedback' ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}
        `}
      >
        {/* Cursor */}
        <div
          className={`
            absolute w-8 h-8 md:w-10 md:h-10 z-20
            transition-all duration-500 ease-in-out pointer-events-none
            ${animationState === 'idle' || animationState === 'clicking' || animationState === 'pressed' ? 'opacity-100' : 'opacity-0'}
            ${animationState === 'clicking' || animationState === 'pressed' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black' : 'top-0 left-1/2 -translate-x-1/2 -translate-y-full text-white'}
          `}
        >
          <MousePointer2 className="w-full h-full" />
        </div>

        {/* Button - 200% larger, rectangular */}
        <button
          className={`
            relative px-16 py-6 md:px-20 md:py-8
            bg-white text-black font-semibold text-2xl md:text-3xl
            transition-all duration-300 ease-out
            ${animationState === 'pressed' ? 'scale-95 shadow-inner brightness-90' : animationState === 'clicking' ? 'scale-98 shadow-md' : 'scale-100 shadow-xl'}
          `}
        >
          Start Interview
        </button>
      </div>

      {/* Loading Ripple - Circling dot spinner */}
      <div 
        className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-700 ease-in-out
          ${animationState === 'loading' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
        `}
      >
        {/* Circular track */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/30">
          {/* Spinning container - 1 second rotation (doubled speed) */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '1s' }}>
            {/* Orbiting dot at top of circle */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 bg-white rounded-full shadow-2xl" />
          </div>
        </div>
      </div>

      {/* Feedback Ready State */}
      <div
        className={`
          absolute transition-all duration-500 ease-out
          ${animationState === 'feedback' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
        `}
      >
        {/* Success Circle */}
        <div className="flex items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-white rounded-full shadow-xl">
          <Check className="w-16 h-16 md:w-20 md:h-20 text-black animate-check" />
        </div>
        
        {/* Success particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-particle"
            style={{
              top: '50%',
              left: '50%',
              animationDelay: `${i * 0.05}s`,
              transform: `rotate(${i * 60}deg) translateY(-4rem)`,
            }}
          />
        ))}
        
        {/* Text */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <p className="text-white font-semibold text-base md:text-lg">
            Feedback Ready!
          </p>
        </div>
      </div>
    </div>
  );
}
