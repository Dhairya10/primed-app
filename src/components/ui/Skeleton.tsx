interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`
        bg-gradient-to-r from-white/[0.05] via-white/[0.08] to-white/[0.05]
        animate-shimmer bg-[size:200%_100%]
        ${className}
      `.trim()}
    />
  );
}
