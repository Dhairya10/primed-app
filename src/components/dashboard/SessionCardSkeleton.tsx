import { Skeleton } from '@/components/ui/Skeleton';

export function SessionCardSkeleton() {
  return (
    <div className="bg-white/[0.03] border-2 border-white/20 p-6 relative">
      {/* Optional logo area - top right */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <Skeleton className="h-10 w-10 md:h-12 md:w-12" />
      </div>

      {/* Main content area */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 pr-14 md:pr-20">
          {/* Title */}
          <Skeleton className="h-6 w-3/4 mb-3" />

          {/* Optional badge/metadata area */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Action button - top right (below logo) */}
        <Skeleton className="h-11 w-11 flex-shrink-0 mt-14 md:mt-16" />
      </div>
    </div>
  );
}
