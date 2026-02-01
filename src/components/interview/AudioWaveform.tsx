import { useEffect, useState, useRef } from 'react';
import type { Conversation } from '@elevenlabs/client';

interface AudioWaveformProps {
  conversation: Conversation | null;
  mode: 'speaking' | 'listening' | 'thinking';
}

export function AudioWaveform({ conversation, mode }: AudioWaveformProps) {
  const [volume, setVolume] = useState(0.5);
  const [targetVolume, setTargetVolume] = useState(0.5);
  const [screenSize, setScreenSize] = useState({ min: 100, max: 180 });
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Update circle size on window resize
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setScreenSize({ min: 140, max: 240 });
      } else {
        setScreenSize({ min: 100, max: 180 });
      }
    };

    // Set initial size
    updateSize();

    // Listen for resize
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Smooth interpolation of volume changes
  useEffect(() => {
    const smoothingInterval = setInterval(() => {
      if (!isMountedRef.current) return;

      setVolume((currentVolume) => {
        const diff = targetVolume - currentVolume;
        const smoothingFactor = 0.15; // Lower = smoother, higher = more responsive
        return currentVolume + diff * smoothingFactor;
      });
    }, 16); // 60fps for smooth animation

    return () => clearInterval(smoothingInterval);
  }, [targetVolume]);

  // Poll volume levels
  useEffect(() => {
    if (!conversation) {
      // Gentle breathing pattern at rest - like meditation apps
      let breathingPhase = 0;
      const breathingInterval = setInterval(() => {
        if (!isMountedRef.current) return;

        breathingPhase += 0.015; // Very slow breathing
        const breathingEffect = Math.sin(breathingPhase) * 0.2 + 0.5; // Oscillate between 0.3-0.7

        setTargetVolume(breathingEffect);
      }, 50);

      return () => clearInterval(breathingInterval);
    }

    const interval = setInterval(async () => {
      if (!isMountedRef.current) return;

      try {
        // Get appropriate volume based on mode
        let vol = 0;
        if (mode === 'listening') {
          vol = await conversation.getInputVolume();
        } else if (mode === 'speaking') {
          vol = await conversation.getOutputVolume();
        }

        // Normalize volume with smooth power curve
        const normalizedVolume = Math.min(1.0, Math.pow(vol || 0, 0.5) * 1.8);

        if (isMountedRef.current) {
          setTargetVolume(normalizedVolume);
        }
      } catch (error) {
        console.error('Failed to get volume:', error);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [conversation, mode]);

  // Calculate circle size and opacity based on volume
  const isActive = mode === 'listening';

  // Use responsive sizes from state
  const { min: minSize, max: maxSize } = screenSize;
  const circleSize = minSize + volume * (maxSize - minSize);

  // Opacity: higher when active, subtle when not
  const baseOpacity = isActive ? 0.9 : 0.5;

  // Glow intensity based on volume - scaled with circle size
  const glowIntensity = (volume * 50) * (circleSize / 140);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Breathing Circle */}
      <div
        className="flex items-center justify-center"
        role="img"
        aria-label={mode === 'listening' ? 'Audio indicator showing your voice input' : 'Audio indicator showing AI response'}
      >
        <div
          className="rounded-full"
          style={{
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            background: `radial-gradient(circle at 30% 30%,
              rgba(255, 255, 255, ${baseOpacity}) 0%,
              rgba(230, 230, 230, ${baseOpacity * 0.9}) 35%,
              rgba(200, 200, 200, ${baseOpacity * 0.75}) 70%,
              rgba(160, 160, 160, ${baseOpacity * 0.6}) 100%)`,
            opacity: 1,
            boxShadow: `
              0 0 ${glowIntensity}px rgba(255, 255, 255, ${baseOpacity * 0.4}),
              0 0 ${glowIntensity * 1.5}px rgba(200, 200, 200, ${baseOpacity * 0.3}),
              inset 0 0 ${glowIntensity * 0.6}px rgba(255, 255, 255, ${baseOpacity * 0.5})
            `,
            transform: 'translateZ(0)', // GPU acceleration
          }}
        />
      </div>

      {/* Screen reader announcement for mode changes */}
      <div role="status" aria-live="polite" className="sr-only">
        {mode === 'listening' && 'Listening to your response'}
        {mode === 'speaking' && 'AI is speaking'}
        {mode === 'thinking' && 'AI is thinking'}
      </div>
    </div>
  );
}
