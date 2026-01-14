import React, { useState, useEffect } from 'react';
import { Timer, MapPin, Flame, Lock } from 'lucide-react';
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
    isBidVerified?: boolean; // New prop
    isSubscribed?: boolean;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onAuthOpen?: () => void;
    onSubscribeOpen?: () => void;
    onClick?: (item: AuctionItem) => void;
    onMarketingResults?: (item: AuctionItem) => void;
    onMaxBid?: (item: AuctionItem) => void;
    // Financing props
    financingState?: {
        unlocked: boolean;
        preapproved: boolean;
        apr: number | null;
    };
    onUnlockBiWeekly?: () => void;
    onPreApprovalClick?: () => void;
    onVerify?: () => void;
}

const AuctionCard: React.FC<AuctionCardProps> = ({
    item,
    isAuthenticated,
    isBidVerified = false, // Default to false if not provided
    isSubscribed,
    isFavorite = false,
    onToggleFavorite,
    onAuthOpen,
    onSubscribeOpen,
    onClick,
    onMarketingResults,
    onMaxBid,
    financingState,
    onUnlockBiWeekly,
    onPreApprovalClick,
    onVerify
}) => {

    // Calculate Bi-Weekly Payment if unlocked
    const calculateBiWeekly = () => {
        if (!financingState?.unlocked || !financingState?.apr) return null;

        const principal = item.currentBid;
        const rate = financingState.apr / 100;
        const years = 5;
        // Simple interest approximation for MVP or standard loan formula
        // Monthly Rate = rate / 12
        // Num Payments = years * 12
        // Monthly Payment = P * (r(1+r)^n) / ((1+r)^n - 1)
        // Bi-weekly = Monthly * 12 / 26

        const r = rate / 12;
        const n = years * 12;

        const monthlyPayment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const biWeeklyPayment = (monthlyPayment * 12) / 26;

        return Math.round(biWeeklyPayment);
    };

    const biWeeklyPayment = calculateBiWeekly();
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

        // If not verified, trigger the same onClick which will be handled by parent (App.tsx routes to verify)
        // OR we can explicitly call a verify handler if passed.
        // For now, relies on parent onClick handling or local if we handle it here?
        // Actually, App.tsx passes `onClick` which navigates to Detail.
        // The BID BUTTON inside the card should trigger bid attempt.
        // But previously valid bid click just did animation `setIsBidding`.
        // Real logic is usually in ItemDetail, but here we have a Bid Button.
        // Wait, `AuctionCard` bid button usually just opens item detail or does a quick bid?
        // Looking at App.tsx `handleBidAttempt` is passed to `ItemDetail`, but NOT `AuctionCard`.
        // `AuctionCard` has `onClick` which goes to detail.
        // The button inside `AuctionCard` (line 316) calls `handleBidClick`.
        // `handleBidClick` just does animation. It doesn't bubble up a "bid" event?
        // Ah, `AuctionCard` is usually just a link to detail.
        // The button says "BID NOW", but it stops propagation and... just animates?
        // If I look at `App.tsx`, `AuctionCard` takes `onClick` -> `handleItemClick` -> Detail.
        // It DOES NOT take `onBid`.
        // So `handleBidClick` in `AuctionCard` is purely visual or incomplete in this mock?
        // "Clicking it routes to /onboarding/verify-to-bid (preferred) OR opens the Identity Check modal"
        // Since `AuctionCard` doesn't seem to have a real onBid handler prop that executes a bid logic in App.tsx (it only has onClick for item nav),
        // I should probably assume clicking "Verify to Bid" should somehow signal the app.
        // But `AuctionCard` is a child.
        // For this task, I will make the button "Verify to Bid" if unverified, 
        // and if clicked, it should probably call `onClick` (go to detail) OR I need to add an `onBid` prop to `AuctionCard` if I want it to trigger verification directly from card.
        // OR better: The user requirement says "Clicking it routes to /onboarding/verify-to-bid".
        // I will add `onVerify` callback.

        if (!isBidVerified && onVerify) {
            onVerify();
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

                    {/* Timer + First Row Info */}
                    <div className="flex items-center justify-between">
                        {/* Timer (Left) */}
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

                        {/* Right Side: Label for Bi-Weekly (if unlocked) OR Current Bid (if locked) */}
                        {item.loanStructure && financingState?.unlocked && biWeeklyPayment ? (
                            onMaxBid ? (
                                <span className="font-bold text-[11px] text-right" style={{ color: COLORS.textSecondary }}>
                                    Bi-Weekly Payment
                                </span>
                            ) : (
                                <span className="font-bold text-xs tabular-nums" style={{ color: COLORS.textPrimary }}>
                                    ${biWeeklyPayment}
                                </span>
                            )
                        ) : (
                            <span className="font-bold text-xs tabular-nums" style={{ color: COLORS.textPrimary }}>
                                ${item.currentBid.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Winner Username + Bid/Payment Row */}
                    <div className="flex items-center justify-between mt-0.5">
                        {/* Winner Username (Left) */}
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-[10px] font-bold">W</span>
                            </div>
                            <span className="text-xs font-semibold truncate" style={{ color: COLORS.textSecondary }}>
                                @{item.winningBidder?.replace('@', '') || 'no_bids'}
                            </span>
                        </div>

                        {/* Right Side: Bi-Weekly Value (if unlocked) - ONLY SHOW ON FAVS (onMaxBid) */}
                        {item.loanStructure && financingState?.unlocked && biWeeklyPayment && onMaxBid && (
                            <span className="font-bold text-xs tabular-nums flex items-center gap-1" style={{ color: COLORS.textPrimary }}>
                                ${biWeeklyPayment}
                                <span className="text-[9px] font-normal text-gray-400">({financingState.apr}% APR · 5y)</span>
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-1">
                    {/* CTA Button - Compact Blue */}
                    <button
                        onClick={handleBidClick}
                        className="w-full py-2 rounded-lg font-bold text-[13px] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center whitespace-nowrap px-1 text-white shadow-md"
                        style={{
                            backgroundColor: COLORS.fireOrange,
                        }}
                    >
                        {/* Locked / Verify State */}
                        {!isBidVerified ? (
                            <span className="flex items-center gap-1.5">
                                <span className="text-base leading-none">👋</span>
                                SIGN UP TO BID
                            </span>
                        ) : (
                            item.loanStructure && financingState?.unlocked && biWeeklyPayment
                                ? (onMaxBid ? `BID NOW: $${biWeeklyPayment} BI-WEEKLY` : `BID $${biWeeklyPayment} BI-WEEKLY`)
                                : `BID NOW: $${nextBid.toLocaleString()}`
                        )}
                    </button>

                    {onMarketingResults && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onMarketingResults(item);
                            }}
                            className="w-full py-2 rounded-lg font-bold text-[13px] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center whitespace-nowrap px-1 text-white shadow-md relative z-30"
                            style={{
                                backgroundColor: '#000000',
                            }}
                        >
                            VIEW BIDDING DASHBOARD
                        </button>
                    )}

                    {/* Favourites Financing Flow */}
                    {/* Favourites Financing Flow */}
                    {isFavorite && onMaxBid && !onMarketingResults && (
                        <div className="flex items-center justify-between gap-3 pt-1">
                            {/* Primary: Set Max Bid - NEUTRAL OUTLINE BUTTON */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isBidVerified && onVerify) {
                                        onVerify();
                                        return;
                                    }
                                    onMaxBid && onMaxBid(item);
                                }}
                                className={`py-2.5 rounded-lg font-bold text-[12px] hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center whitespace-nowrap px-1 shadow-sm border border-slate-300 text-slate-700 bg-white ${item.loanStructure && financingState ? 'flex-1' : 'w-full'} ${!isBidVerified ? 'opacity-70' : ''}`}
                            >
                                {!isBidVerified && <Lock size={12} className="mr-1.5" />}
                                SET MY MAX BID
                            </button>

                            {/* Secondary: Financing Action - LINK BUTTON or PILL */}
                            {item.loanStructure && financingState && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Logic for click handling
                                        if (financingState) {
                                            if (!financingState.unlocked && onUnlockBiWeekly) {
                                                onUnlockBiWeekly();
                                            } else if (financingState.unlocked && !financingState.preapproved && onPreApprovalClick) {
                                                onPreApprovalClick();
                                            } else if (financingState.preapproved && onPreApprovalClick) {
                                                onPreApprovalClick();
                                            }
                                        }
                                    }}
                                    className={`flex-1 flex items-center justify-end h-[44px] transition-all ${financingState?.preapproved ? 'cursor-default' : 'hover:opacity-80 active:scale-[0.98]'
                                        }`}
                                    style={{ background: 'transparent' }}
                                >
                                    {financingState?.preapproved ? (
                                        // PRE-APPROVED: Green Pill/Badge
                                        <div className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[12px] flex items-center gap-1.5 border border-emerald-200">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Your rate · {financingState.apr}%
                                        </div>
                                    ) : (
                                        // NOT PRE-APPROVED: Link Button Style
                                        <span className={`text-[13px] font-medium flex items-center gap-1 ${financingState?.unlocked ? 'text-slate-900' : 'text-slate-700'
                                            } hover:underline`}>
                                            {financingState?.unlocked
                                                ? 'Get pre-approved'
                                                : 'Unlock bi-weekly'}
                                            <span className="text-lg leading-none mb-0.5">→</span>
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {financingState?.unlocked && (
                    <div className="absolute top-2 right-2 z-20">
                        {/* Marketing / Status chips could go here */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuctionCard;
