import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Flame, ShieldCheck,
    MessageCircle, Lock, ArrowRight,
    Sparkles, MapPin, Eye, Clock,
    Tag, CheckCircle, AlertCircle, Phone, User, Camera, Play
} from 'lucide-react';
import { AuctionItem, AuctionStatus } from '../types';
import { COLORS, MOCK_AUCTIONS } from '../constants';
import AuctionCard from './AuctionCard';
import PredictionMarket from './PredictionMarket';
import ChaoticComments from './ChaoticComments';

interface ItemDetailProps {
    item: AuctionItem;
    onBack: () => void;
    isAuthenticated: boolean;
    isBidVerified?: boolean;
    onVerify?: () => void;
    onBid: () => void;
    onSubscribeOpen: () => void;
    favorites: Set<string>;
    onToggleFavorite: (id: string) => void;
    onAIClick?: (itemTitle: string) => void;
    onContactSeller?: () => void;
    onMaxBid?: (item: AuctionItem) => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({
    item,
    onBack,
    isAuthenticated,
    isBidVerified = false,
    onVerify,
    onBid,
    onSubscribeOpen,
    favorites,
    onToggleFavorite,
    onAIClick,
    onContactSeller,
    onMaxBid
}) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [timeProgress, setTimeProgress] = useState(100);
    const [urgencyLevel, setUrgencyLevel] = useState<'normal' | 'warning' | 'critical'>('normal');

    const images = [
        item.imageUrl,
        `${item.imageUrl}&v=2`,
        `${item.imageUrl}&v=3`,
        `${item.imageUrl}&v=4`
    ];

    // Mock Bid History
    const bidHistory = [
        { user: '@sniper_elite', amount: item.currentBid, time: '2m ago' },
        { user: '@farm_king_88', amount: item.currentBid - 5, time: '15m ago' },
        { user: '@casual_bidder', amount: item.currentBid - 10, time: '1h ago' },
        { user: '@deal_hunter', amount: item.currentBid - 15, time: '2h ago' },
        { user: '@early_bird', amount: item.currentBid - 20, time: '3h ago' },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = item.endsAt.getTime();
            const difference = end - now;

            // Calculate progress (assuming 24h auction)
            const totalDuration = 24 * 60 * 60 * 1000;
            const elapsed = totalDuration - difference;
            const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
            setTimeProgress(progress);

            // Set urgency level
            const minutesLeft = difference / (1000 * 60);
            if (minutesLeft < 2) setUrgencyLevel('critical');
            else if (minutesLeft < 10) setUrgencyLevel('warning');
            else setUrgencyLevel('normal');

            if (difference <= 0) {
                setTimeLeft('ENDED');
                return;
            }
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            if (days > 0) setTimeLeft(`${days}d ${hours}h`);
            else setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);
        return () => clearInterval(timer);
    }, [item.endsAt]);

    const relatedItems = MOCK_AUCTIONS.filter(i => i.id !== item.id).slice(0, 4);
    const nextBid = item.currentBid + 5;
    const isCurrentItemFavorite = favorites.has(item.id);

    // Urgency color mapping
    const urgencyColors = {
        normal: COLORS.primary,
        warning: '#f59e0b',
        critical: COLORS.warRed
    };

    return (
        <div className="min-h-screen pb-28 md:pb-0 animate-in fade-in duration-500" style={{ background: COLORS.voidBlack }}>

            {/* Header - Mobile only (fixed) */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 pointer-events-none">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-start">
                    <button
                        onClick={onBack}
                        className="pointer-events-auto backdrop-blur-xl hover:bg-white/90 w-11 h-11 rounded-tight flex items-center justify-center transition-all border shadow-sm"
                        style={{ background: 'rgba(255,255,255,0.9)', borderColor: COLORS.border, color: COLORS.textSecondary }}
                    >
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </button>

                    <div className="flex gap-2 pointer-events-auto">
                        <button
                            onClick={() => onToggleFavorite(item.id)}
                            className={`backdrop-blur-xl w-10 h-10 rounded-tight flex items-center justify-center transition-all border shadow-sm ${isCurrentItemFavorite ? 'bg-blue-50 border-blue-200 text-[#2238ff]' : 'bg-white/90 border-slate-200 text-slate-400'}`}
                        >
                            <Flame size={18} strokeWidth={2} fill={isCurrentItemFavorite ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto md:px-8 md:pt-6">
                {/* Desktop Header Bar */}
                <div className="hidden md:flex items-center justify-between mb-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                        style={{ color: COLORS.textSecondary }}
                    >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <button
                        onClick={() => onToggleFavorite(item.id)}
                        className={`w-10 h-10 rounded-tight flex items-center justify-center transition-all border shadow-sm ${isCurrentItemFavorite ? 'bg-blue-50 border-blue-200 text-[#2238ff]' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                    >
                        <Flame size={18} strokeWidth={2} fill={isCurrentItemFavorite ? 'currentColor' : 'none'} />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row lg:gap-12">

                    {/* LEFT COLUMN: Image Gallery */}
                    <div className="w-full lg:w-3/5 relative">
                        {/* Desktop: Thumbnails + Main Image side by side */}
                        <div className="hidden md:flex gap-4">
                            {/* Vertical Thumbnails */}
                            <div className="flex flex-col gap-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-200 ${activeImageIndex === idx
                                            ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white scale-105 shadow-lg'
                                            : 'opacity-60 hover:opacity-100 border border-slate-200'
                                            }`}
                                    >
                                        <img src={img} loading="lazy" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                                <button className="w-16 h-16 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-500 transition-colors">
                                    <Camera size={16} />
                                </button>
                            </div>

                            {/* Main Image */}
                            <div className="relative flex-1 aspect-[4/3] md:aspect-auto md:h-[420px] rounded-2xl overflow-hidden shadow-xl border" style={{ background: COLORS.surface1, borderColor: COLORS.border }}>
                                <img
                                    src={images[activeImageIndex]}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Views badge - muted */}
                                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 text-white/80">
                                    <Eye size={11} /> 50,000 views
                                </div>
                            </div>
                        </div>

                        {/* Mobile: Main Image only */}
                        <div className="md:hidden relative aspect-[4/3] rounded-none overflow-hidden shadow-xl border-b" style={{ background: COLORS.surface1, borderColor: COLORS.border }}>
                            <img
                                src={images[activeImageIndex]}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Views badge - muted */}
                            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 text-white/80">
                                <Eye size={11} /> 50,000 views
                            </div>
                        </div>

                        {/* Desktop Left Column - CTAs and Description */}
                        <div className="hidden lg:block mt-6 px-4 md:px-0">
                            {/* CTA Buttons - Grouped together */}
                            <div className="space-y-2 mb-8">
                                {/* View Walkaround CTA - Primary */}
                                <button
                                    className="group flex items-center gap-4 w-full p-4 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.03), rgba(255, 107, 0, 0.08))',
                                        borderColor: 'rgba(255, 107, 0, 0.25)'
                                    }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF6B00, #FF9500)',
                                            boxShadow: '0 4px 16px rgba(255, 107, 0, 0.35)'
                                        }}
                                    >
                                        <Play size={20} className="text-white ml-0.5" fill="white" />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-base font-bold block" style={{ color: COLORS.textPrimary }}>View Walkaround</span>
                                        <span className="text-xs" style={{ color: COLORS.textMuted }}>AI-assisted visual walkthrough & context review</span>
                                    </div>
                                    <ArrowRight size={18} className="ml-auto text-orange-500 group-hover:translate-x-1 transition-transform" />
                                </button>

                                {/* GarthAI Intelligence Report CTA - Secondary */}
                                <button
                                    onClick={() => onAIClick?.(item.title)}
                                    className="group flex items-center gap-4 w-full p-4 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(34, 56, 255, 0.03), rgba(34, 56, 255, 0.08))',
                                        borderColor: 'rgba(34, 56, 255, 0.2)'
                                    }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
                                        style={{
                                            background: 'linear-gradient(135deg, #2238ff, #4a6fff)',
                                            boxShadow: '0 4px 16px rgba(34, 56, 255, 0.35)'
                                        }}
                                    >
                                        <Sparkles size={20} className="text-white" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <span className="text-base font-bold block" style={{ color: COLORS.textPrimary }}>GarthAI Intelligence Report</span>
                                        <span className="text-xs" style={{ color: COLORS.textMuted }}>Price intelligence, market comps, longevity outlook, and risk signals</span>
                                    </div>
                                    <ArrowRight size={18} className="ml-auto text-blue-500 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            {/* Description Section */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: COLORS.steelGray }}>Description</h3>
                                <p className="text-base leading-relaxed" style={{ color: COLORS.textSecondary }}>
                                    Mint condition with original packaging. Recently serviced. Inspected and guaranteed authentic by our team.
                                </p>
                            </div>

                            {/* Bid History - Desktop */}
                            <div className="border-t pt-6" style={{ borderColor: COLORS.border }}>
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: COLORS.steelGray }}>Recent Bids</h3>
                                <div className="space-y-3">
                                    {bidHistory.slice(0, 3).map((bid, i) => (
                                        <div key={i} className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${i === 0 ? '' : 'bg-slate-300'}`} style={i === 0 ? { background: COLORS.primary } : {}} />
                                                <span className="text-sm font-medium" style={{ color: i === 0 ? COLORS.textPrimary : COLORS.textMuted }}>{bid.user}</span>
                                                <span className="text-xs" style={{ color: COLORS.textMuted }}>{bid.time}</span>
                                            </div>
                                            <span className="text-sm font-bold" style={{ color: COLORS.textSecondary }}>${bid.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-4 text-xs font-bold hover:underline transition-colors" style={{ color: COLORS.primary }}>
                                    View more →
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT COLUMN: Bid Console */}
                    <div className="w-full lg:w-2/5 px-5 md:px-0 mt-5 lg:mt-0">

                        {/* Title - Display font, slightly smaller */}
                        <h1 className="text-2xl md:text-3xl font-display leading-[0.95] mb-3" style={{ color: COLORS.textPrimary }}>
                            {item.title}
                        </h1>

                        {/* Location & Seller Rating - Muted */}
                        <div className="flex items-center gap-3 text-xs font-medium mb-6" style={{ color: COLORS.steelGray }}>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-400" />
                            <span className="flex items-center gap-1">
                                17 Seller Reviews
                                <span className="flex items-center text-amber-400 ml-0.5">
                                    ★★★★★
                                </span>
                            </span>
                        </div>

                        {/* === BID CONSOLE CARD === */}
                        <div className="hidden lg:block sticky top-6">
                            <div className="rounded-2xl p-6 border shadow-lg" style={{ background: COLORS.surface1, borderColor: COLORS.border }}>

                                {/* Timer Section with Progress */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: urgencyColors[urgencyLevel] }}>
                                            Time Remaining
                                        </span>
                                        <Clock size={14} style={{ color: urgencyColors[urgencyLevel] }} />
                                    </div>
                                    <div className="text-2xl font-bold tracking-tight mb-2" style={{ color: urgencyColors[urgencyLevel] }}>
                                        {timeLeft}
                                    </div>
                                    {/* Progress Bar */}
                                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: COLORS.surface2 }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${timeProgress}%`,
                                                background: urgencyColors[urgencyLevel]
                                            }}
                                        />
                                    </div>
                                    <p className="text-[10px] mt-2" style={{ color: COLORS.textMuted }}>
                                        Bids in final moments may extend time.
                                    </p>
                                </div>


                                {/* === DYNAMIC BIDDING INTERFACE === */}
                                {item.loanStructure ? (
                                    <FinancingBidConsole
                                        item={item}
                                        onBid={onBid}
                                        onSubscribeOpen={onSubscribeOpen}
                                        nextBid={nextBid}
                                    />
                                ) : (
                                    <>
                                        {/* Price Section */}
                                        <div className="mb-6">
                                            <span className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: COLORS.steelGray }}>Next Bid</span>
                                            <div className="text-5xl font-bold tracking-tighter leading-none mb-1" style={{ color: COLORS.textPrimary }}>
                                                ${nextBid.toLocaleString()}
                                            </div>
                                            <span className="text-sm font-medium" style={{ color: COLORS.textMuted }}>
                                                Current: ${item.currentBid.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* CTA Buttons - Equal Weight */}
                                        <div className="flex gap-3 mb-2">
                                            <button
                                                onClick={!isBidVerified ? onVerify : onBid}
                                                className="flex-1 py-4 rounded-xl font-bold text-white text-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                                                style={{
                                                    background: COLORS.primary,
                                                    boxShadow: `0 8px 24px ${COLORS.primary}40`
                                                }}
                                            >
                                                BID NOW
                                            </button>
                                            <button
                                                onClick={!isBidVerified ? onVerify : () => onMaxBid && onMaxBid(item)}
                                                className="flex-1 py-4 rounded-xl font-bold text-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all flex items-center justify-center gap-2 border-2"
                                                style={{
                                                    borderColor: !isBidVerified ? COLORS.steelGray : COLORS.textPrimary,
                                                    color: !isBidVerified ? COLORS.steelGray : COLORS.textPrimary,
                                                    opacity: !isBidVerified ? 0.7 : 1
                                                }}
                                            >
                                                {!isBidVerified ? <Lock size={20} /> : 'MAX BID'}
                                            </button>
                                        </div>

                                        {!item.isUnreserved && (
                                            <button
                                                onClick={onSubscribeOpen}
                                                className="w-full flex items-center justify-between p-3 rounded-xl border transition-colors hover:bg-slate-50"
                                                style={{ borderColor: COLORS.border }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Lock size={16} style={{ color: COLORS.steelGray }} />
                                                    <div className="text-left">
                                                        <span className="text-xs font-medium block" style={{ color: COLORS.textPrimary }}>Reveal Price</span>
                                                        <span className="text-[10px]" style={{ color: COLORS.textMuted }}>Members only</span>
                                                    </div>
                                                </div>
                                                <ArrowRight size={14} style={{ color: COLORS.steelGray }} />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Trust Signals - Unified */}
                            <div className="mt-4 p-4 rounded-xl border" style={{ background: COLORS.surface1, borderColor: COLORS.border }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={`https://i.pravatar.cc/150?u=${item.winningBidder}`} alt="Seller" loading="lazy" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <div className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{item.winningBidder}</div>
                                            <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: COLORS.steelGray }}>
                                                <ShieldCheck size={10} className="text-green-500" /> Trusted Seller
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={onContactSeller}
                                            className="w-8 h-8 rounded-tight border flex items-center justify-center transition-colors hover:bg-slate-50"
                                            style={{ borderColor: COLORS.border, color: COLORS.steelGray }}
                                        >
                                            <Phone size={14} />
                                        </button>
                                        <button onClick={onContactSeller} className="w-8 h-8 rounded-tight border flex items-center justify-center transition-colors hover:bg-slate-50" style={{ borderColor: COLORS.border, color: COLORS.steelGray }}>
                                            <User size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Price Prophet - Prediction Market */}
                            <div className="mt-4">
                                <PredictionMarket item={item} />
                            </div>
                        </div>

                        {/* Mobile: Description */}
                        <div className="lg:hidden mt-6">
                            {/* CTA Buttons - Grouped together */}
                            <div className="space-y-2 mb-6">
                                {/* View Walkaround CTA - Primary */}
                                <button
                                    className="group flex items-center gap-3 w-full p-3 rounded-xl border transition-all active:scale-[0.98]"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.03), rgba(255, 107, 0, 0.08))',
                                        borderColor: 'rgba(255, 107, 0, 0.25)'
                                    }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF6B00, #FF9500)',
                                            boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)'
                                        }}
                                    >
                                        <Play size={16} className="text-white ml-0.5" fill="white" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <span className="text-sm font-bold block" style={{ color: COLORS.textPrimary }}>View Walkaround</span>
                                        <span className="text-[10px]" style={{ color: COLORS.textMuted }}>AI-assisted visual walkthrough & context review</span>
                                    </div>
                                    <ArrowRight size={16} className="text-orange-500" />
                                </button>

                                {/* GarthAI Intelligence Report CTA - Secondary */}
                                <button
                                    onClick={() => onAIClick?.(item.title)}
                                    className="group flex items-center gap-3 w-full p-3 rounded-xl border transition-all active:scale-[0.98]"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(34, 56, 255, 0.03), rgba(34, 56, 255, 0.08))',
                                        borderColor: 'rgba(34, 56, 255, 0.2)'
                                    }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
                                        style={{
                                            background: 'linear-gradient(135deg, #2238ff, #4a6fff)',
                                            boxShadow: '0 4px 12px rgba(34, 56, 255, 0.3)'
                                        }}
                                    >
                                        <Sparkles size={16} className="text-white" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <span className="text-sm font-bold block" style={{ color: COLORS.textPrimary }}>GarthAI Intelligence Report</span>
                                        <span className="text-[10px]" style={{ color: COLORS.textMuted }}>Price intelligence, market comps, longevity outlook, and risk signals</span>
                                    </div>
                                    <ArrowRight size={16} className="text-blue-500" />
                                </button>
                            </div>

                            {/* Description - Below buttons */}
                            <p className="text-sm leading-relaxed mb-6" style={{ color: COLORS.textSecondary }}>
                                Mint condition. Original packaging included. Recently serviced and inspected.
                            </p>
                            <div className="border-t pt-5" style={{ borderColor: COLORS.border }}>
                                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: COLORS.steelGray }}>Recent Bids</h3>
                                <div className="space-y-2">
                                    {bidHistory.slice(0, 3).map((bid, i) => (
                                        <div key={i} className="flex items-center justify-between py-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? '' : 'bg-slate-300'}`} style={i === 0 ? { background: COLORS.primary } : {}} />
                                                <span className="text-xs font-medium" style={{ color: i === 0 ? COLORS.textPrimary : COLORS.textMuted }}>{bid.user}</span>
                                                <span className="text-[10px]" style={{ color: COLORS.textMuted }}>{bid.time}</span>
                                            </div>
                                            <span className="text-xs font-bold" style={{ color: COLORS.textSecondary }}>${bid.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-3 text-xs font-bold hover:underline transition-colors" style={{ color: COLORS.primary }}>
                                    View more →
                                </button>
                            </div>

                            {/* Price Prophet - Prediction Market (Mobile) */}
                            <div className="mt-6">
                                <PredictionMarket item={item} />
                            </div>

                        </div>

                    </div>
                </div>

                {/* The Arena - Chaotic Comments (shared, full-width) */}
                <div className="mt-10 md:mt-16 px-5 md:px-0">
                    <ChaoticComments item={item} />
                </div>

                {/* Recommendations - Quieter */}
                <div className="mt-16 md:mt-24 px-5 md:px-0">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: COLORS.steelGray }}>
                        More for You
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 snap-x">
                        {relatedItems.map((related) => (
                            <div key={related.id} className="min-w-[260px] w-[260px] snap-center opacity-90 hover:opacity-100 transition-opacity">
                                <AuctionCard
                                    item={related}
                                    isFavorite={favorites.has(related.id)}
                                    onToggleFavorite={() => onToggleFavorite(related.id)}
                                    isAuthenticated={isAuthenticated}
                                    isBidVerified={isBidVerified}
                                    onVerify={onVerify}
                                    onAuthOpen={() => { }}
                                    onSubscribeOpen={onSubscribeOpen}
                                    onClick={() => { }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bid Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-3 pb-8">
                {/* Subtle outer glow effect */}
                <div
                    className="absolute inset-x-3 inset-y-0 rounded-[28px] blur-2xl opacity-15 pointer-events-none"
                    style={{ background: urgencyColors[urgencyLevel] }}
                />

                <div
                    className="relative rounded-[28px] overflow-hidden shadow-2xl"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.98), rgba(255,255,255,0.95))',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 -8px 40px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.08)'
                    }}
                >
                    {/* Top Row: Timer + Contact */}
                    <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                        <div className="flex items-center gap-2.5">
                            <div
                                className={`w-8 h-8 rounded-tight flex items-center justify-center ${urgencyLevel === 'critical' ? 'animate-pulse' : ''}`}
                                style={{
                                    background: `${urgencyColors[urgencyLevel]}15`,
                                    border: `2px solid ${urgencyColors[urgencyLevel]}30`
                                }}
                            >
                                <Clock size={16} style={{ color: urgencyColors[urgencyLevel] }} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: COLORS.steelGray }}>Ends in</span>
                                <span className="text-base font-black tracking-tight" style={{ color: urgencyColors[urgencyLevel] }}>{timeLeft}</span>
                            </div>
                        </div>

                        <button
                            onClick={onContactSeller}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
                            style={{
                                background: COLORS.surface2,
                                color: COLORS.textSecondary
                            }}
                        >
                            <Phone size={14} strokeWidth={2.5} />
                            Contact
                        </button>
                    </div>

                    {/* Reveal Price - Reserved only */}
                    {!item.isUnreserved && (
                        <button
                            onClick={onSubscribeOpen}
                            className="flex items-center justify-between px-5 py-2.5 border-b w-full transition-colors active:bg-slate-50"
                            style={{ borderColor: 'rgba(0,0,0,0.06)' }}
                        >
                            <div className="flex items-center gap-2.5">
                                <Lock size={14} style={{ color: COLORS.steelGray }} />
                                <div className="text-left">
                                    <span className="text-xs font-medium block" style={{ color: COLORS.textPrimary }}>Reveal Price</span>
                                    <span className="text-[10px]" style={{ color: COLORS.textMuted }}>Members only</span>
                                </div>
                            </div>
                            <ArrowRight size={14} style={{ color: COLORS.steelGray }} />
                        </button>
                    )}

                    {/* Bottom Row: Price + EPIC Bid Button */}
                    <div className="flex items-center justify-between px-5 py-4">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest block mb-0.5" style={{ color: COLORS.steelGray }}>Next Bid</span>
                            <span className="text-3xl font-black tracking-tighter leading-none" style={{ color: COLORS.textPrimary }}>
                                ${nextBid.toLocaleString()}
                            </span>
                        </div>

                        {/* EPIC Bid Button */}
                        <button
                            onClick={!isBidVerified ? onVerify : onBid}
                            className="relative h-14 px-8 rounded-2xl font-black text-white text-lg shadow-xl active:scale-95 transition-all overflow-hidden group"
                            style={{
                                background: 'linear-gradient(135deg, #2238ff, #4a6fff)',
                                boxShadow: '0 8px 24px rgba(0, 34, 255, 0.35), 0 4px 12px rgba(0, 34, 255, 0.25)'
                            }}
                        >
                            {/* Subtle shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                            <span className="relative flex items-center gap-2">
                                PLACE BID
                                <ArrowRight size={18} strokeWidth={3} className="group-active:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ItemDetail;

// --- FINANCING COMPONENT ---
const FinancingBidConsole = ({ item, onBid, onSubscribeOpen, nextBid }: { item: AuctionItem, onBid: () => void, onSubscribeOpen: () => void, nextBid: number }) => {
    const [selectedTerm, setSelectedTerm] = useState(item.loanStructure?.terms[0] || 60);
    const rate = item.loanStructure?.interestRate || 5.99;

    // Simple PMT calculation
    const calculatePayment = (amount: number, months: number, annualRate: number) => {
        const r = annualRate / 1200; // Monthly interest rate
        const n = months;
        if (r === 0) return amount / n;
        return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    };

    const monthlyPayment = calculatePayment(nextBid, selectedTerm, rate);

    return (
        <div className="space-y-6">
            {/* Monthly Payment Hero */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600">Est. Payment</span>
                    <span className="text-[10px] font-bold bg-white text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                        {rate}% APR
                    </span>
                </div>
                <div className="text-4xl font-black text-slate-900 tracking-tight">
                    ${Math.round(monthlyPayment).toLocaleString()}<span className="text-lg text-slate-400 font-bold">/mo</span>
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1">
                    for {selectedTerm} months @ ${nextBid.toLocaleString()} bid
                </div>
            </div>

            {/* Term Selector */}
            <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Choose Term</label>
                <div className="grid grid-cols-3 gap-2">
                    {item.loanStructure?.terms.map(term => (
                        <button
                            key={term}
                            onClick={() => setSelectedTerm(term)}
                            className={`py-2 rounded-lg font-bold text-sm transition-all border ${selectedTerm === term
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'}`}
                        >
                            {term}mo
                        </button>
                    ))}
                </div>
            </div>

            {/* Action */}
            <button
                onClick={onBid}
                className="w-full py-4 rounded-xl font-bold text-white text-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-200"
                style={{
                    background: COLORS.primary, // Use financing blue instead of urgency orange
                }}
            >
                FINANCE BID <ArrowRight size={20} strokeWidth={3} />
            </button>

            {/* Footer */}
            <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Powered by LendCo</span>
                <span>•</span>
                <span>Pre-Approval Ready</span>
            </div>
        </div>
    )
}