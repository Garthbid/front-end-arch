import React, { useState, useEffect } from 'react';
import { Timer, MapPin, Flame } from 'lucide-react';
import { AuctionItem } from '../types';
import { COLORS } from '../constants';
import CardLocationRow from './CardLocationRow';

// Status badge config
const STATUS_BADGE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    'FEATURED': { label: 'LIVE', color: 'white', bg: '#ef4444' }, // warRed
    'UNRESERVED': { label: 'UNRESERVED', color: COLORS.textPrimary, bg: 'transparent' },
    'LIVE': { label: 'LIVE', color: 'white', bg: '#ef4444' }, // warRed
    'PENDING': { label: 'RESERVED', color: COLORS.textMuted, bg: COLORS.surface2 },
    'SOLD': { label: 'SOLD', color: COLORS.textMuted, bg: COLORS.surface2 },
    'NOT_SOLD': { label: 'ENDED', color: COLORS.textMuted, bg: COLORS.surface2 },
    'ENDED': { label: 'ENDED', color: COLORS.textMuted, bg: COLORS.surface2 }
};


interface AuctionCardProps {
    item: AuctionItem;
    isAuthenticated?: boolean;
    isSubscribed?: boolean;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onAuthOpen?: () => void;
    onSubscribeOpen?: () => void;
    onClick?: (item: AuctionItem) => void;
    onMarketingResults?: (item: AuctionItem) => void;
}

const AuctionCard: React.FC<AuctionCardProps> = ({
    item,
    isAuthenticated,
    isSubscribed,
    isFavorite = false,
    onToggleFavorite,
    onAuthOpen,
    onSubscribeOpen,
    onClick,
    onMarketingResults
}) => {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isEndingSoon, setIsEndingSoon] = useState<boolean>(false);
    const [isBidding, setIsBidding] = useState<boolean>(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = item.endsAt.getTime() - new Date().getTime();

            if (difference <= 0) {
                setTimeLeft('Ended');
                return;
            }

            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setIsEndingSoon(difference < 1000 * 60 * 60);

            if (difference > 1000 * 60 * 60 * 24) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                setTimeLeft(`${days}d ${hours}h`);
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`);
            } else {
                setTimeLeft(`${minutes}m ${seconds}s`);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [item.endsAt]);

    const handleBidClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated && onAuthOpen) {
            onAuthOpen();
            return;
        }

        if (!isSubscribed && onSubscribeOpen) {
            onSubscribeOpen();
            return;
        }

        setIsBidding(true);
        setTimeout(() => setIsBidding(false), 600);
    };

    const [showSavedLabel, setShowSavedLabel] = useState<boolean>(false);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleFavorite) {
            if (!isFavorite) {
                setShowSavedLabel(true);
                setTimeout(() => setShowSavedLabel(false), 800);
            }
            onToggleFavorite();
        }
    };

    const nextBid = item.currentBid + 5;
    const statusConfig = item.status ? STATUS_BADGE_CONFIG[item.status] : null;


    return (
        <div
            onClick={() => onClick && onClick(item)}
            className="flex flex-col rounded-[20px] overflow-hidden transition-all duration-300 h-full group relative cursor-pointer hover:-translate-y-1"
            style={{
                background: COLORS.surface1,
                border: `1px solid ${COLORS.border}`,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
        >
            {/* Image Section - 5:4 Aspect Ratio */}
            <div className="relative aspect-[5/4] overflow-hidden" style={{ background: COLORS.surface2 }}>

                {/* Heart Button */}
                <div className="absolute top-3 left-3 z-20">
                    <div className="relative">
                        <button
                            onClick={handleFavoriteClick}
                            className="group/heart w-10 h-10 backdrop-blur-[4px] rounded-[14px] flex items-center justify-center hover:scale-[1.06] hover:-rotate-6 transition-all duration-160 active:scale-95 relative z-10 shadow-sm"
                            style={{
                                background: 'rgba(255,255,255,0.7)',
                                border: `1px solid ${COLORS.border}`,
                            }}
                            role="button"
                            aria-pressed={isFavorite}
                            aria-label="Save listing"
                        >
                            {isFavorite && (
                                <div
                                    className="absolute inset-0 blur-[12px] rounded-full animate-[glow-pulse_2s_ease-in-out_infinite] pointer-events-none"
                                    style={{ background: `${COLORS.fireOrange}40` }}
                                />
                            )}

                            <Flame
                                size={18}
                                className={`transition-all duration-300 relative z-10 ${isFavorite ? 'animate-[heart-pop_0.4s_ease-out]' : ''}`}
                                style={{
                                    fill: isFavorite ? COLORS.fireOrange : 'transparent',
                                    color: isFavorite ? COLORS.fireOrange : COLORS.steelGray
                                }}
                                strokeWidth={2.25}
                            />
                        </button>

                        {showSavedLabel && (
                            <div
                                className="absolute top-0 left-full ml-2 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md whitespace-nowrap z-20 animate-[fade-up-out_0.8s_ease-in-out_forwards] text-white"
                                style={{ background: COLORS.fireOrange }}
                            >
                                Saved
                            </div>
                        )}
                    </div>
                </div>

                <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />

            </div>

            {/* Location Row */}
            <CardLocationRow location={item.location} />

            {/* Content Section */}
            <div className="p-3 flex flex-col gap-2.5 flex-grow">

                {/* Title */}
                <h3
                    className="font-bold text-[15px] leading-tight line-clamp-1 truncate"
                    style={{ color: COLORS.textPrimary }}
                    title={item.title}
                >
                    {item.title}
                </h3>

                {/* Timer + Username Row */}
                <div className="flex flex-col gap-1.5">
                    <style>{`
                    @keyframes tick {
                        0%, 100% { transform: rotate(-12deg); }
                        50% { transform: rotate(12deg); }
                    }
                    @keyframes heart-pop {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.25); }
                        100% { transform: scale(1); }
                    }
                    @keyframes glow-pulse {
                        0% { opacity: 0.18; transform: scale(0.9); }
                        50% { opacity: 0.35; transform: scale(1.1); }
                        100% { opacity: 0.18; transform: scale(0.9); }
                    }
                    @keyframes fade-up-out {
                        0% { opacity: 0; transform: translateY(0); }
                        20% { opacity: 1; transform: translateY(-4px); }
                        80% { opacity: 1; transform: translateY(-4px); }
                        100% { opacity: 0; transform: translateY(-10px); }
                    }
                    `}</style>

                    {/* Timer + Current Bid Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <div
                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: isEndingSoon ? `#ef444420` : `${COLORS.fireOrange}15` }}
                            >
                                <Timer
                                    size={11}
                                    style={{
                                        color: isEndingSoon ? '#ef4444' : COLORS.fireOrange,
                                        animation: 'tick 1.5s ease-in-out infinite'
                                    }}
                                    strokeWidth={2.5}
                                />
                            </div>
                            <span
                                className="font-bold text-xs tabular-nums whitespace-nowrap"
                                style={{ color: isEndingSoon ? '#ef4444' : COLORS.fireOrange }}
                            >
                                {timeLeft}
                            </span>
                        </div>
                        <span className="font-bold text-xs tabular-nums" style={{ color: COLORS.textPrimary }}>
                            ${item.currentBid.toLocaleString()}
                        </span>
                    </div>

                    {/* Winner Username with Green W */}
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[10px] font-bold">W</span>
                        </div>
                        <span className="text-xs font-semibold truncate" style={{ color: COLORS.textSecondary }}>
                            @{item.winningBidder?.replace('@', '') || 'no_bids'}
                        </span>
                    </div>
                </div>

                {/* CTA Button - Compact Blue */}
                <button
                    onClick={handleBidClick}
                    className="w-full py-2 rounded-lg font-bold text-[13px] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center mt-1 whitespace-nowrap px-1 text-white shadow-md"
                    style={{
                        backgroundColor: COLORS.fireOrange,
                    }}
                >
                    BID NOW: ${nextBid.toLocaleString()}
                </button>

                {onMarketingResults && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMarketingResults(item);
                        }}
                        className="w-full py-2.5 rounded-lg font-bold text-[15px] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center mt-1.5 whitespace-nowrap px-1 text-white shadow-lg ring-1 ring-orange-100"
                        style={{
                            backgroundColor: '#ff5800',
                        }}
                    >
                        MARKETING RESULTS
                    </button>
                )}

            </div>
        </div>
    );
};

export default AuctionCard;
