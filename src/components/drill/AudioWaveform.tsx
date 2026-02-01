import { useEffect, useState } from 'react';

interface AudioWaveformProps {
  mode: 'listening' | 'speaking' | 'thinking';
  volume: number; // 0.0 to 1.0
}

export function AudioWaveform({ mode, volume }: AudioWaveformProps) {
  const [bars, setBars] = useState<number[]>([]);

  // Number of bars based on screen size
  const barCount = 25;

  useEffect(() => {
    // Initialize bars with random heights
    const initialBars = Array.from({ length: barCount }, () => Math.random());
    setBars(initialBars);
  }, [barCount]);

  useEffect(() => {
    if (mode === 'thinking') {
      // Gentle pulse animation for thinking mode
      const interval = setInterval(() => {
        setBars(prev => prev.map(() => 0.3 + Math.random() * 0.2));
      }, 800);
      return () => clearInterval(interval);
    }

    if (mode === 'speaking') {
      // Animated bars for agent speaking
      const interval = setInterval(() => {
        setBars(prev => prev.map(() => Math.random()));
      }, 150);
      return () => clearInterval(interval);
    }

    if (mode === 'listening') {
      // Volume-based animation when user is speaking
      const interval = setInterval(() => {
        setBars(prev => prev.map(() => {
          // Mix volume level with some randomness
          const baseHeight = volume * 0.7;
          const randomVariation = Math.random() * 0.3;
          return Math.min(baseHeight + randomVariation, 1.0);
        }));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [mode, volume]);

  const getModeStyles = () => {
    switch (mode) {
      case 'listening':
        return 'bg-white';
      case 'speaking':
        return 'bg-white/90';
      case 'thinking':
        return 'bg-white/40';
      default:
        return 'bg-white/40';
    }
  };

  return (
    <div className="w-full h-full min-h-[280px] flex items-center justify-center p-4">
      <div className="flex items-end justify-center space-x-1 h-[200px] md:h-[280px] w-full max-w-[600px]">
        {bars.map((height, index) => (
          <div
            key={index}
            className={`
              flex-1 max-w-[16px] transition-all duration-200 ease-out
              ${getModeStyles()}
            `}
            style={{
              height: `${Math.max(height * 100, 10)}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
