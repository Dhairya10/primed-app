import type { SearchResult } from '@/types/api';

interface SearchResultCardProps {
  result: SearchResult;
  onClick: (result: SearchResult) => void;
}

export function SearchResultCard({ result, onClick }: SearchResultCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(result)}
      className="relative w-full flex items-center gap-3 p-3 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-left group min-h-[72px]"
    >
      {/* Conditional rendering based on discriminated union */}
      {result.type === 'interview' ? (
        <>
          {/* Interview: Logo */}
          {result.product_logo_url ? (
            <div className="flex-shrink-0">
              <img
                src={result.product_logo_url}
                alt=""
                className="w-12 h-12 border border-white/20 bg-white/5 object-cover"
                onError={(e) => {
                  // Hide image if it fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-12 h-12 border border-white/20 bg-white/10" />
          )}

          {/* Interview: Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white mb-0.5 truncate group-hover:text-white/90 transition-colors">
              {result.title}
            </h3>
            <p className="text-xs text-white/60 line-clamp-1 group-hover:text-white/70 transition-colors leading-tight mb-1">
              {result.description}
            </p>
            <div className="text-xs text-white/40">
              {result.estimated_duration_minutes} min
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Drill: Just title */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white group-hover:text-white/90 transition-colors">
              {result.display_title}
            </h3>
          </div>
        </>
      )}
    </button>
  );
}
