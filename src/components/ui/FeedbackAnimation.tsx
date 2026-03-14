import { useEffect, useState } from 'react';

const segments = [
  {
    label: 'Quantitative Reasoning',
    status: 'missed' as const,
    description: 'When estimating market size, broad assumptions were made without breaking them into components or sanity-checking against known benchmarks.',
  },
  {
    label: 'Prioritization',
    status: 'partial' as const,
    description: "You mentioned focusing on mobile users first, but didn't explain the tradeoff — what you were choosing not to do, and why.",
  },
  {
    label: 'Structured Thinking',
    status: 'demonstrated' as const,
    description: 'Your answer followed a clear framework — problem definition, user needs, solutions, metrics — making your reasoning easy to follow.',
  },
];

type Status = 'demonstrated' | 'partial' | 'missed';

const STATUS_CONFIG: Record<Status, { label: string; color: string; bgTint: string; borderColor: string; dotColor: string; trackColor: string }> = {
  demonstrated: {
    label: 'Demonstrated',
    color: 'text-green-400',
    bgTint: 'bg-green-500/8',
    borderColor: 'border-green-500/50',
    dotColor: 'bg-green-500',
    trackColor: '#22c55e',
  },
  partial: {
    label: 'Partially Demonstrated',
    color: 'text-yellow-400',
    bgTint: 'bg-yellow-500/8',
    borderColor: 'border-yellow-500/50',
    dotColor: 'bg-yellow-400',
    trackColor: '#eab308',
  },
  missed: {
    label: 'Not Demonstrated',
    color: 'text-red-400',
    bgTint: 'bg-red-500/8',
    borderColor: 'border-red-500/50',
    dotColor: 'bg-red-500',
    trackColor: '#ef4444',
  },
};

export function FeedbackAnimation() {
  const [activeSegment, setActiveSegment] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSegment((prev) => (prev + 1) % segments.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-ink-950 border border-white/10 flex flex-col p-6 font-sans overflow-hidden">
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">

        {/* CSS-based Timeline — avoids SVG circle distortion from preserveAspectRatio="none" */}
        <div className="relative h-12 w-full mb-10">
          {/* Base track */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />

          {segments.map((segment, index) => {
            const isActive = index === activeSegment;
            const isPast = index < activeSegment;
            const sConfig = STATUS_CONFIG[segment.status];
            const pct = (index / (segments.length - 1)) * 100;

            return (
              <div
                key={index}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-700"
                style={{ left: `${pct}%` }}
              >
                {/* Glow ring for active */}
                {isActive && (
                  <div
                    className="absolute w-8 h-8 rounded-full animate-pulse"
                    style={{ backgroundColor: sConfig.trackColor, opacity: 0.15 }}
                  />
                )}
                {/* Dot */}
                <div
                  className="rounded-full transition-all duration-500 bg-paper-50"
                  style={{
                    width: isActive ? 12 : 6,
                    height: isActive ? 12 : 6,
                    opacity: isActive ? 1 : isPast ? 0.5 : 0.2,
                  }}
                />
              </div>
            );
          })}

          {/* Filled track segment up to active */}
          <div
            className="absolute top-1/2 left-0 h-px -translate-y-1/2 transition-all duration-700"
            style={{
              width: `${(activeSegment / (segments.length - 1)) * 100}%`,
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              opacity: 0.6,
            }}
          />
        </div>

        {/* Content slides */}
        <div className="h-52 relative">
          {segments.map((segment, index) => {
            const sConfig = STATUS_CONFIG[segment.status];
            const isActive = index === activeSegment;
            const isPast = index < activeSegment;

            return (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive
                    ? 'opacity-100 translate-y-0 scale-100'
                    : isPast
                      ? 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
                      : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                  }`}
              >
                <div className={`border p-5 flex-1 flex flex-col justify-between ${sConfig.bgTint} ${sConfig.borderColor}`}>
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-paper-50 text-xl md:text-2xl font-bold tracking-tight leading-tight">
                      {segment.label}
                    </h4>
                    <span className={`text-xs font-bold tracking-widest uppercase whitespace-nowrap mt-0.5 ${sConfig.color}`}>
                      {sConfig.label}
                    </span>
                  </div>
                  <p className="text-ink-500 text-sm leading-relaxed mt-4">
                    {segment.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
