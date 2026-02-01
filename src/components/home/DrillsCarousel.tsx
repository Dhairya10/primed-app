import { useEffect, useState } from 'react';
import type { Drill } from '@/types/api';
import { DrillCard } from './DrillCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { getRecommendedDrills } from '@/lib/api';

export function DrillsCarousel() {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrills = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getRecommendedDrills();
        setDrills(response.data);
      } catch (err) {
        console.error('Failed to fetch recommended drills:', err);
        setError('Failed to load drills');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrills();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="-mx-4">
        <div className="flex gap-4 overflow-x-auto px-4 scrollbar-dark">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[calc(83.33%-8px)] md:w-[calc(33.33%-11px)] min-w-[280px]"
            >
              <Skeleton className="h-[160px] w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-white/10 bg-white/5">
        <p className="text-base text-white/70 mb-2">{error}</p>
        <p className="text-sm text-white/50">Please try again later</p>
      </div>
    );
  }

  // Empty state
  if (drills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-white/10 bg-white/5">
        <p className="text-base text-white/70 mb-2">No drills available</p>
        <p className="text-sm text-white/50">Check back soon for new practice drills</p>
      </div>
    );
  }

  // Carousel with CSS scroll-snap
  return (
    <div className="-mx-4">
      <div
        className="flex gap-4 overflow-x-auto px-4 scroll-smooth scrollbar-dark"
        style={{
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: '1rem',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {drills.map((drill) => (
          <div
            key={drill.id}
            className="flex-shrink-0 w-[calc(83.33%-8px)] md:w-[calc(33.33%-11px)] lg:w-[calc(25%-12px)] min-w-[280px]"
            style={{
              scrollSnapAlign: 'start',
              scrollSnapStop: 'normal'
            }}
          >
            <DrillCard drill={drill} />
          </div>
        ))}
      </div>
    </div>
  );
}
