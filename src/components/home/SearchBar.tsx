import { useState, useCallback, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  className?: string;
}

export function SearchBar({
  onSearch,
  onClear,
  isLoading = false,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    } else if (query === '') {
      // If query is cleared, trigger clear
      onClear();
    }
  }, [debouncedQuery, query, onSearch, onClear]);

  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    onClear();
  }, [onClear]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
          <Search className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a role or a product"
          className="w-full min-h-[44px] pl-12 pr-12 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
          aria-label="Search interview problems"
          role="search"
        />

        {/* Loading Spinner or Clear Button */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-white/60 animate-spin" aria-hidden="true" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-white/60 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -mr-3"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
