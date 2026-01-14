import React from 'react';
import { Tag, ArrowRight, ArrowLeft } from 'lucide-react';
import { AuctionItem } from '../types';
import { MOCK_AUCTIONS, COLORS } from '../constants';
import AuctionCard from './AuctionCard';

interface ListingsPageProps {
  onItemClick: (item: AuctionItem) => void;
  isAuthenticated: boolean;
  isSubscribed: boolean;
  onAuthOpen: () => void;
  onSubscribeOpen: () => void;
  onGoHome: () => void;
  onBack: () => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onMarketingResults: (item: AuctionItem) => void;
  isBidVerified?: boolean;
  onVerify?: () => void;
}

const ListingsPage: React.FC<ListingsPageProps> = ({
  onItemClick,
  isAuthenticated,
  isSubscribed,
  onAuthOpen,
  onSubscribeOpen,
  onGoHome,
  onBack,
  favorites,
  onToggleFavorite,
  onMarketingResults,
  isBidVerified,
  onVerify
}) => {
  // Mock: Assume items with ID '1', '3', and '5' are listed by the current user
  const myListingIds = ['1', '3', '5'];
  const myListings = MOCK_AUCTIONS.filter(item => myListingIds.includes(item.id));

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-[1920px] mx-auto animate-in fade-in duration-500" style={{ background: COLORS.voidBlack }}>

      {/* Header */}
      <div className="mb-8 md:mb-12 flex items-center justify-between border-b pb-6 md:pb-8" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all active:scale-95 hover:bg-slate-100"
            style={{ background: COLORS.surface1, borderColor: COLORS.border, color: COLORS.steelGray }}
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg bg-blue-50" style={{}}>
            <Tag style={{ color: COLORS.fireOrange }} size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-display tracking-tight leading-none" style={{ color: COLORS.textPrimary }}>
              My Listings
            </h1>
            <p className="font-bold text-xs md:text-sm uppercase tracking-widest mt-1" style={{ color: COLORS.steelGray }}>
              {myListings.length} {myListings.length === 1 ? 'Item' : 'Items'} Active
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {myListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {myListings.map(item => (
            <div key={item.id} className="w-full">
              <AuctionCard
                item={item}
                isAuthenticated={isAuthenticated}
                isSubscribed={isSubscribed}
                isFavorite={favorites.has(item.id)}
                onToggleFavorite={() => onToggleFavorite(item.id)}
                onAuthOpen={onAuthOpen}
                onSubscribeOpen={onSubscribeOpen}
                onClick={onItemClick}
                onMarketingResults={onMarketingResults}
                isBidVerified={isBidVerified}
                onVerify={onVerify}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden group border" style={{ background: COLORS.surface1, borderColor: COLORS.border }}>
            <Tag size={40} className="group-hover:scale-110 transition-transform duration-300" style={{ color: COLORS.steelGray }} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl md:text-3xl font-display mb-3 tracking-tight" style={{ color: COLORS.textPrimary }}>
            No listings yet
          </h2>
          <p className="max-w-sm mx-auto mb-8 font-medium text-lg leading-relaxed" style={{ color: COLORS.textSecondary }}>
            You haven't listed anything for sale yet. Start selling today with zero fees.
          </p>
          <button
            onClick={onGoHome}
            className="px-8 py-4 rounded-2xl font-black text-white text-lg shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 group"
            style={{
              backgroundColor: COLORS.fireOrange,
              boxShadow: `0 10px 30px ${COLORS.fireOrange}40`
            }}
          >
            START SELLING <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
