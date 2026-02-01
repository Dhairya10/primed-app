import { useEffect, useState } from 'react';

interface TimerProps {
  startTime: Date;
  maxDuration?: number; // in seconds (default: 25 minutes)
}

export function Timer({ startTime, maxDuration = 25 * 60 }: TimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Show warning when approaching max duration (90%)
  const isApproachingMax = elapsedSeconds >= maxDuration * 0.9;

  return (
    <div
      className={`
        font-mono text-sm text-paper-50
        ${isApproachingMax ? 'opacity-100' : 'opacity-70'}
      `}
      aria-live="polite"
      aria-label={`Session duration: ${formatTime(elapsedSeconds)}`}
    >
      {formatTime(elapsedSeconds)}
    </div>
  );
}
