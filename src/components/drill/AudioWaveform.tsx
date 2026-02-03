import { useEffect, useMemo, useRef } from 'react';

interface AudioWaveformProps {
  mode: 'listening' | 'speaking' | 'thinking';
  volume: number; // 0.0 to 1.0
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function AudioWaveform({ mode, volume }: AudioWaveformProps) {
  const blobRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef(volume);
  const modeRef = useRef(mode);
  const sizeRef = useRef({ min: 140, max: 240 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const updateSizes = () => {
      const isMobile = window.innerWidth < 768;
      sizeRef.current = isMobile
        ? { min: 100, max: 180 }
        : { min: 140, max: 240 };

      if (blobRef.current) {
        blobRef.current.style.width = `${sizeRef.current.min}px`;
        blobRef.current.style.height = `${sizeRef.current.min}px`;
      }
    };

    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  useEffect(() => {
    let lastTime = performance.now();
    let currentScale = 1;

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      const { min, max } = sizeRef.current;
      const maxScale = max / min;

      const rawVolume = clamp(volumeRef.current, 0, 1);
      const breathing = Math.sin(time / 900) * 0.04;

      let target = 0.3;
      if (modeRef.current === 'thinking') {
        target = 0.35 + breathing;
      } else if (modeRef.current === 'speaking') {
        target = 0.4 + rawVolume * 0.6 + breathing * 0.5;
      } else {
        target = 0.25 + rawVolume * 0.7 + breathing * 0.3;
      }

      target = clamp(target, 0.2, 1);
      const targetScale = 1 + target * (maxScale - 1);
      const smoothing = 0.12 + Math.min(delta / 1000, 0.1);
      currentScale += (targetScale - currentScale) * smoothing;

      const glowStrength = 12 + target * 28;
      const glowOpacity = 0.12 + target * 0.25;

      if (blobRef.current) {
        blobRef.current.style.transform = `translateZ(0) scale(${currentScale.toFixed(3)})`;
        blobRef.current.style.boxShadow = `0 0 ${glowStrength}px rgba(255, 255, 255, ${glowOpacity.toFixed(3)})`;
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const gradient = useMemo(() => {
    if (mode === 'speaking') {
      return 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(255,255,255,0.22) 55%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0) 100%)';
    }

    if (mode === 'thinking') {
      return 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.45), rgba(255,255,255,0.18) 55%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0) 100%)';
    }

    return 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(255,255,255,0.2) 55%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0) 100%)';
  }, [mode]);

  return (
    <div className="w-full h-full min-h-[280px] flex items-center justify-center p-6">
      <div
        ref={blobRef}
        className="rounded-full"
        style={{
          background: gradient,
          width: '140px',
          height: '140px',
          transform: 'translateZ(0) scale(1)',
          willChange: 'transform, box-shadow',
        }}
      />
    </div>
  );
}
