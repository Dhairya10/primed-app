interface TimerProps {
  elapsedSeconds: number;
}

export function Timer({ elapsedSeconds }: TimerProps) {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return (
    <div className="text-white text-sm font-medium">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}
