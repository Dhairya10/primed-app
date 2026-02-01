import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import type { Drill, ProblemType } from '@/types/api';
import { DrillListCard } from './DrillListCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { getLibraryDrills, getLibraryMetadata } from '@/lib/api';
import { Search, Filter } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';

const ITEMS_PER_PAGE = 20;

// Debounce utility
function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number
): (...args: Args) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function DrillsTab() {
  const search = useSearch({ strict: false }) as { skill?: string };
  const navigate = useNavigate();
  const [drills, setDrills] = useState<Drill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedProblemType, setSelectedProblemType] = useState<ProblemType | undefined>();
  const [selectedSkill, setSelectedSkill] = useState<string | undefined>(search.skill);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [showOnlyUnattempted, setShowOnlyUnattempted] = useState(false);
  const [availableProblemTypes, setAvailableProblemTypes] = useState<ProblemType[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterDropdownRef = useClickOutside<HTMLDivElement>(() => setIsFilterOpen(false));

  // Fetch available problem types on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await getLibraryMetadata();
        setAvailableProblemTypes(response.data.problem_types);
        setAvailableSkills(response.data.skills || []);
      } catch (err) {
        console.error('Failed to fetch metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    setSelectedSkill(search.skill || undefined);
    setOffset(0);
    setDrills([]);
  }, [search.skill]);

  // Debounced search - updates searchQuery after 300ms of no typing
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
        setOffset(0);
        setDrills([]);
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
    setOffset(0);
    setDrills([]);
  };

  const handleFilterChange = (problemType: ProblemType | undefined) => {
    setSelectedProblemType(problemType);
    setOffset(0);
    setDrills([]);
    setIsFilterOpen(false);
  };

  const fetchDrills = useCallback(
    async (loadMore = false) => {
      try {
        if (loadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const currentOffset = loadMore ? offset : 0;
        const response = await getLibraryDrills({
          query: searchQuery || undefined,
          problem_type: selectedProblemType,
          skill: selectedSkill,
          unattempted_only: showOnlyUnattempted,
          limit: ITEMS_PER_PAGE,
          offset: currentOffset,
        });

        if (loadMore) {
          setDrills((prev) => [...prev, ...response.data]);
        } else {
          setDrills(response.data);
        }

        setHasMore(response.has_more);
        if (loadMore) {
          setOffset(currentOffset + response.count);
        } else {
          setOffset(response.count);
        }
      } catch (err) {
        console.error('Failed to fetch drills:', err);
        setError('Failed to load drills');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchQuery, selectedProblemType, selectedSkill, showOnlyUnattempted, offset]
  );

  // Fetch drills when search query or filter changes
  useEffect(() => {
    fetchDrills(false);
  }, [fetchDrills, searchQuery, selectedProblemType, selectedSkill, showOnlyUnattempted]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchDrills(true);
    }
  };

  // Format problem type for display
  const formatProblemType = (type: ProblemType) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const hasActiveFilters = Boolean(
    selectedProblemType || selectedSkill || showOnlyUnattempted
  );
  const isFiltered = Boolean(
    searchQuery || selectedProblemType || selectedSkill || showOnlyUnattempted
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Search and filter skeleton */}
        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-32" />
        </div>

        {/* Grid skeletons - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      {/* Search Bar and Filter */}
      <div className="flex gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search drills..."
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

        {/* Filter Dropdown */}
        <div ref={filterDropdownRef} className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center justify-center gap-2 h-12 px-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 ${
              hasActiveFilters ? 'border-white/30' : ''
            }`}
            aria-label="Filter drills"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">
              {hasActiveFilters ? 'Filters' : 'Filter'}
            </span>
          </button>

          {/* Dropdown Menu */}
          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-black border border-white/20 shadow-xl z-50 p-4 space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyUnattempted}
                  onChange={(e) => {
                    setShowOnlyUnattempted(e.target.checked);
                    setOffset(0);
                    setDrills([]);
                  }}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-white checked:border-white"
                />
                <span className="text-sm text-white/70">Show only unattempted</span>
              </label>

              <div>
                <label className="text-xs text-white/60 mb-2 block">Problem Type</label>
                <select
                  value={selectedProblemType || ''}
                  onChange={(e) => handleFilterChange(e.target.value as ProblemType || undefined)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-sm rounded"
                >
                  <option value="">All</option>
                  {availableProblemTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatProblemType(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-white/60 mb-2 block">Skills</label>
                <select
                  value={selectedSkill || ''}
                  onChange={(e) => {
                    const nextSkill = e.target.value || undefined;
                    setSelectedSkill(nextSkill);
                    setOffset(0);
                    setDrills([]);
                    setIsFilterOpen(false);
                    navigate({
                      to: '/library',
                      search: nextSkill ? { skill: nextSkill } : {},
                    });
                  }}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-sm rounded"
                >
                  <option value="">All</option>
                  {availableSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      {drills.length > 0 && (
        <p className="text-sm text-white/60">
          {isFiltered
            ? `Found ${drills.length}${hasMore ? '+' : ''} drill${drills.length === 1 ? '' : 's'}`
            : `Showing ${drills.length} drill${drills.length === 1 ? '' : 's'}`}
        </p>
      )}

      {/* Empty state */}
      {drills.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-white/10 bg-white/5">
          <p className="text-base text-white/70 mb-2">
            {isFiltered ? 'No drills found' : 'No drills available'}
          </p>
          <p className="text-sm text-white/50">
            {isFiltered
              ? 'Try adjusting your search or filter'
              : 'Check back soon for new drills'}
          </p>
        </div>
      )}

      {/* Drills List - 3 column grid */}
      {drills.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drills.map((drill) => (
            <DrillListCard
              key={drill.id}
              drill={drill}
              isCompleted={Boolean(drill.is_attempted)}
            />
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
