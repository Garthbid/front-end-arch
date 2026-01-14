import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Loader2, ShoppingBag } from 'lucide-react';
import { AuctionItem } from '../types';
import { MOCK_AUCTIONS, COLORS } from '../constants';
import AuctionCard from './AuctionCard';

interface SearchPageProps {
  isAuthenticated: boolean;
  isSubscribed: boolean;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onAuthOpen: () => void;
  onSubscribeOpen: () => void;
  onItemClick: (item: AuctionItem) => void;
  isBidVerified?: boolean;
  onVerify?: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({
  isAuthenticated,
  isSubscribed,
  favorites,
  onToggleFavorite,
  onAuthOpen,
  onSubscribeOpen,
  onItemClick,
  isBidVerified,
  onVerify
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<AuctionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Search execution
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    const timer = setTimeout(() => {
      const lowerQuery = debouncedQuery.toLowerCase();
      const filtered = MOCK_AUCTIONS.filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.location.toLowerCase().includes(lowerQuery) ||
        item.winningBidder.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [debouncedQuery]);

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen" style={{ background: COLORS.voidBlack }}>

      {/* Sticky Header */}
      <div
        className="sticky top-0 z-40 backdrop-blur-xl px-4 py-4 md:px-8 md:py-6 transition-all"
        style={{
          background: `${COLORS.voidBlack}cc`,
          borderBottom: `1px solid ${COLORS.border}`
        }}
      >
        <div className="max-w-3xl mx-auto relative group">
          <SearchIcon
            className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: query ? COLORS.fireOrange : COLORS.steelGray }}
            size={22}
            strokeWidth={2.5}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') handleClear();
            }}
            placeholder="Search auctions, brands, models..."
            className="w-full pl-14 pr-12 py-4 rounded-full text-lg font-medium placeholder:opacity-50 transition-all duration-300 outline-none"
            style={{
              background: COLORS.surface1,
              border: `2px solid ${query ? COLORS.fireOrange : COLORS.border}`,
              color: COLORS.textPrimary,
            }}
          />

          {/* Right Action Icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="animate-spin" style={{ color: COLORS.fireOrange }} size={20} />
            ) : query.length > 0 ? (
              <button
                onClick={handleClear}
                className="p-1 rounded-full transition-all hover:bg-slate-100"
                style={{ color: COLORS.textMuted }}
              >
                <X size={20} />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-8">

        {/* State: Initial */}
        {!hasSearched && query.length < 2 && (
          <div className="flex flex-col items-center justify-center pt-20 md:pt-32 opacity-50 animate-in fade-in duration-700">
            <SearchIcon size={48} style={{ color: COLORS.surface2 }} className="mb-4" strokeWidth={1.5} />
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: COLORS.textMuted }}>Start typing to search</p>
          </div>
        )}

        {/* State: Loading */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-[20px] aspect-[5/4] w-full" style={{ background: COLORS.surface1 }} />
            ))}
          </div>
        )}

        {/* State: Results Found */}
        {!isLoading && hasSearched && results.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 px-1">
              <p className="text-sm font-medium" style={{ color: COLORS.textMuted }}>
                Showing <span className="font-bold" style={{ color: COLORS.textPrimary }}>{results.length}</span> results for "<span style={{ color: COLORS.fireOrange }}>{debouncedQuery}</span>"
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {results.map((item) => (
                <AuctionCard
                  key={item.id}
                  item={item}
                  isAuthenticated={isAuthenticated}
                  isSubscribed={isSubscribed}
                  isFavorite={favorites.has(item.id)}
                  onToggleFavorite={() => onToggleFavorite(item.id)}
                  onAuthOpen={onAuthOpen}
                  onSubscribeOpen={onSubscribeOpen}
                  onClick={onItemClick}
                  isBidVerified={isBidVerified}
                  onVerify={onVerify}
                />
              ))}
            </div>
          </div>
        )}

        {/* State: No Results */}
        {!isLoading && hasSearched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-16 md:pt-24 text-center animate-in fade-in zoom-in-95 duration-300">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm border"
              style={{ background: COLORS.surface1, borderColor: COLORS.border }}
            >
              <ShoppingBag size={32} style={{ color: COLORS.steelGray }} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-display mb-2" style={{ color: COLORS.textPrimary }}>
              No results for "{debouncedQuery}"
            </h3>
            <p className="max-w-xs mx-auto mb-8 font-medium" style={{ color: COLORS.textMuted }}>
              We couldn't find any auctions matching your search.
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {['Rolex', 'Ferrari', 'Jordan', 'Vintage', 'Art'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-4 py-2 rounded-full text-sm font-bold transition-all hover:shadow-sm"
                  style={{
                    background: 'transparent',
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.textSecondary
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.fireOrange;
                    e.currentTarget.style.color = COLORS.fireOrange;
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.border;
                    e.currentTarget.style.color = COLORS.textSecondary;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchPage;