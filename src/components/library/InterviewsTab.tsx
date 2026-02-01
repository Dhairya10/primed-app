import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Interview } from '@/types/api';
import { InterviewListCard } from './InterviewListCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { getLibraryInterviews } from '@/lib/api';
import { Search } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function InterviewsTab() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const offsetRef = useRef(0);

  // Debounced search - updates searchQuery after 300ms of no typing
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
        offsetRef.current = 0;
        setInterviews([]);
      }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    offsetRef.current = 0;
    setInterviews([]);
  };

  const fetchInterviews = useCallback(
    async (loadMore = false) => {
      try {
        if (loadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const currentOffset = loadMore ? offsetRef.current : 0;
        const response = await getLibraryInterviews({
          query: searchQuery || undefined,
          limit: ITEMS_PER_PAGE,
          offset: currentOffset,
        });

        if (loadMore) {
          setInterviews((prev) => [...prev, ...response.data]);
        } else {
          setInterviews(response.data);
        }

        setHasMore(response.has_more);
        offsetRef.current = currentOffset + response.count;
      } catch (err) {
        console.error('Failed to fetch interviews:', err);
        setError('Failed to load interviews');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchQuery]
  );

  // Fetch interviews when search query changes
  useEffect(() => {
    fetchInterviews(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchInterviews(true);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Search skeleton */}
        <Skeleton className="h-12 w-full" />

        {/* Grid skeletons - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[160px] w-full" />
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

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search interviews..."
          className="w-full h-12 pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
        />
        {searchInput && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results count */}
      {interviews.length > 0 && (
        <p className="text-sm text-white/60">
          {searchQuery
            ? `Found ${interviews.length}${hasMore ? '+' : ''} interview${interviews.length === 1 ? '' : 's'}`
            : `Showing ${interviews.length} interview${interviews.length === 1 ? '' : 's'}`}
        </p>
      )}

      {/* Empty state */}
      {interviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-white/10 bg-white/5">
          <p className="text-base text-white/70 mb-2">
            {searchQuery ? 'No interviews found' : 'No interviews available'}
          </p>
          <p className="text-sm text-white/50">
            {searchQuery ? 'Try a different search term' : 'Check back soon for new interviews'}
          </p>
        </div>
      )}

      {/* Interviews List - 2 column grid */}
      {interviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviews.map((interview) => (
            <InterviewListCard key={interview.id} interview={interview} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isLoadingMore ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Loading...
              </span>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
