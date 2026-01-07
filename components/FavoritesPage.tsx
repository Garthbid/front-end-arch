import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { AuctionItem } from '../types';
import { MOCK_AUCTIONS, COLORS } from '../constants';
import AuctionCard from './AuctionCard';

interface FavoritesPageProps {
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onItemClick: (item: AuctionItem) => void;
  isAuthenticated: boolean;
  isSubscribed: boolean;
  onAuthOpen: () => void;
  onSubscribeOpen: () => void;
  onGoHome: () => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favorites,
  onToggleFavorite,
  onItemClick,
  isAuthenticated,
  isSubscribed,
  onAuthOpen,
  onSubscribeOpen,
  onGoHome
}) => {
  const favoriteItems = MOCK_AUCTIONS.filter(item => favorites.has(item.id));

  return (
    <div
      className="min-h-screen p-4 md:p-8 lg:p-12 max-w-[1920px] mx-auto animate-in fade-in duration-500"
      style={{ background: COLORS.voidBlack }}
    >

      {/* Header */}
      <div
        className="mb-8 md:mb-12 flex items-center justify-between pb-6 md:pb-8"
        style={{ borderBottom: `1px solid ${COLORS.border}` }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: COLORS.surface1,
            }}
          >
            <Flame
              className="fill-current"
              style={{ color: COLORS.fireOrange }}
              size={28}
              strokeWidth={2}
            />
          </div>
          <div>
            <h1
              className="text-3xl md:text-5xl font-display tracking-tight leading-none"
              style={{ color: COLORS.textPrimary }}
            >
              My Favourites
            </h1>
            <p
              className="font-bold text-xs md:text-sm uppercase tracking-widest mt-1"
              style={{ color: COLORS.steelGray }}
            >
              {favoriteItems.length} {favoriteItems.length === 1 ? 'Item' : 'Items'} Watchlisted
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {favoriteItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {favoriteItems.map(item => (
            <div key={item.id} className="w-full">
              <AuctionCard
                item={item}
                isAuthenticated={isAuthenticated}
                isSubscribed={isSubscribed}
                isFavorite={true}
                onToggleFavorite={() => onToggleFavorite(item.id)}
                onAuthOpen={onAuthOpen}
                onSubscribeOpen={onSubscribeOpen}
                onClick={onItemClick}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-6 relative overflow-hidden group border"
            style={{ background: COLORS.surface1, borderColor: COLORS.border }}
          >
            <Flame
              size={40}
              className="group-hover:scale-110 transition-transform duration-300"
              style={{ color: COLORS.steelGray }}
              strokeWidth={1.5}
            />
          </div>
          <h2
            className="text-2xl md:text-3xl font-display mb-3 tracking-tight"
            style={{ color: COLORS.textPrimary }}
          >
            No favourites yet
          </h2>
          <p
            className="max-w-sm mx-auto mb-8 font-medium text-lg leading-relaxed"
            style={{ color: COLORS.textSecondary }}
          >
            Tap the fire icon on any auction to save it here for quick access.
          </p>
          <button
            onClick={onGoHome}
            className="px-8 py-4 rounded-2xl font-black text-lg text-white hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 group"
            style={{
              backgroundColor: COLORS.fireOrange,
              boxShadow: `0 10px 30px ${COLORS.fireOrange}40`
            }}
          >
            START BROWSING <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;