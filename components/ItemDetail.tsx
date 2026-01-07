import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Share2, Flame, ShieldCheck,
    MessageCircle, Lock, Zap, ArrowRight,
    Sparkles, MapPin, Eye, Clock,
    Tag, CheckCircle, AlertCircle
} from 'lucide-react';
import { AuctionItem, AuctionStatus } from '../types';
import { COLORS, MOCK_AUCTIONS } from '../constants';
import AuctionCard from './AuctionCard';

interface ItemDetailProps {
    item: AuctionItem;
    onBack: () => void;
    isAuthenticated: boolean;
    onBid: () => void;
    onSubscribeOpen: () => void;
    favorites: Set<string>;
    onToggleFavorite: (id: string) => void;
    onAIClick?: (itemTitle: string) => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({
    item,
    onBack,
    isAuthenticated,
    onBid,
    onSubscribeOpen,
    favorites,
    onToggleFavorite,
    onAIClick
}) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState<string>('');

    // Mock images
    const images = [
        item.imageUrl,
        `${item.imageUrl}&v=2`,
        `${item.imageUrl}&v=3`,
        `${item.imageUrl}&v=4`
    ];

    // Mock Bid History
    const bidHistory = [
        { user: '@sniper_elite', amount: item.currentBid, time: '2m ago', active: true },
        { user: item.winningBidder, amount: item.currentBid - 50, time: '15m ago', active: false },
        { user: '@casual_bidder', amount: item.currentBid - 150, time: '1h ago', active: false },
        { user: '@deal_hunter', amount: item.currentBid - 300, time: '2h ago', active: false },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            const difference = item.endsAt.getTime() - new Date().getTime();
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

    // --- COMPONENTS ---

    const StatusBanner = ({ status, compact = false }: { status?: AuctionStatus, compact?: boolean }) => {
        if (!status) return null;

        const config: Record<string, { icon: any, label: string, color: string, glowColor?: string }> = {
            'FEATURED': { icon: Sparkles, label: 'Featured Item', color: 'text-yellow-600', glowColor: 'bg-yellow-400/20' },
            'UNRESERVED': { icon: Tag, label: 'Unreserved', color: 'text-[#224cff]', glowColor: 'bg-[#224cff]/10' },
            'PENDING': { icon: Clock, label: 'Sale Pending', color: 'text-[#d97706]' },
            'SOLD': { icon: CheckCircle, label: 'Sold', color: 'text-[#10b981]', glowColor: 'bg-[#10b981]/10' },
            'NOT_SOLD': { icon: AlertCircle, label: 'Not Sold', color: 'text-red-500' }
        };

        const c = config[status];
        if (!c) return null;
        const Icon = c.icon;

        return (
            <div className={`w-full rounded-[14px] mb-4 overflow-hidden border`} style={{ background: COLORS.surface1, borderColor: COLORS.border }}>
                <div className={`${compact ? 'p-3' : 'p-4'} flex items-center gap-4 relative`}>
                    {c.glowColor && <div className={`absolute left-3 w-10 h-10 ${c.glowColor} blur-[12px] rounded-full opacity-60 pointer-events-none`} />}
                    <div className={`relative ${compact ? 'p-2.5' : 'p-3'} rounded-xl ${c.color}`} style={{ background: COLORS.surface2 }}>
                        <Icon size={compact ? 18 : 22} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1" style={{ color: COLORS.steelGray }}>Status</span>
                        <span className={`${compact ? 'text-lg' : 'text-xl'} font-display ${c.color} leading-none`}>{c.label}</span>
                    </div>
                </div>
            </div>
        );
    }

    const RevealPriceBanner = ({ compact = false }: { compact?: boolean }) => (
        <button onClick={onSubscribeOpen} className="w-full text-left group cursor-pointer block">
            <div className="w-full p-0.5 rounded-[22px] bg-gradient-to-b from-blue-50 to-transparent mb-6">
                <div className={`rounded-[20px] ${compact ? 'p-4' : 'p-5'} flex items-center justify-between relative overflow-hidden`} style={{ background: COLORS.surface1 }}>
                    {/* Background FX */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 opacity-30 blur-3xl rounded-full -mr-16 -mt-16 group-hover:opacity-50 transition-opacity" />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 rounded-xl backdrop-blur-md group-hover:bg-blue-50 transition-colors" style={{ background: COLORS.surface2 }}>
                            <Lock size={compact ? 20 : 24} style={{ color: COLORS.fireOrange }} strokeWidth={3} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1" style={{ color: COLORS.steelGray }}>Members Only</span>
                            <span className={`${compact ? 'text-xl' : 'text-2xl'} font-display tracking-wide leading-none`} style={{ color: COLORS.textPrimary }}>REVEAL PRICE</span>
                        </div>
                    </div>

                    <div className="relative z-10 text-slate-400 rounded-full p-2 group-hover:rotate-45 transition-transform duration-300">
                        <ArrowRight size={20} strokeWidth={3} />
                    </div>
                </div>
            </div>
        </button>
    );

    return (
        <div className="min-h-screen pb-32 md:pb-0 animate-in fade-in duration-500" style={{ background: COLORS.voidBlack }}>

            {/* 1. Header (Desktop: Visible | Mobile: Hidden) */}
            <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-start">
                    <button
                        onClick={onBack}
                        className="pointer-events-auto backdrop-blur-xl hover:bg-white/90 w-12 h-12 rounded-full flex items-center justify-center transition-all border shadow-sm"
                        style={{ background: 'rgba(255,255,255,0.8)', borderColor: COLORS.border, color: COLORS.textSecondary }}
                    >
                        <ArrowLeft size={22} strokeWidth={2.5} />
                    </button>

                    <div className="flex gap-3 pointer-events-auto">
                        <button
                            onClick={() => onAIClick?.(item.title)}
                            className="backdrop-blur-xl hover:bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center transition-all border shadow-sm"
                            style={{ background: 'rgba(255,255,255,0.8)', borderColor: COLORS.border, color: COLORS.fireOrange }}
                        >
                            <Sparkles size={20} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => onToggleFavorite(item.id)}
                            className={`backdrop-blur-xl w-12 h-12 rounded-full flex items-center justify-center transition-all border shadow-sm ${isCurrentItemFavorite ? 'bg-blue-50 border-blue-200 text-[#224cff]' : 'bg-white/80 border-slate-200 text-slate-400 hover:text-[#224cff]'}`}
                        >
                            <Flame size={20} strokeWidth={2.5} fill={isCurrentItemFavorite ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto md:px-8 md:pt-24">
                <div className="flex flex-col lg:flex-row lg:gap-16">

                    {/* 2. Left Column: Image Gallery */}
                    <div className="w-full lg:w-3/5 relative group">
                        <div className="relative aspect-[4/3] md:aspect-auto md:h-[600px] rounded-none md:rounded-3xl overflow-hidden shadow-2xl border-b md:border" style={{ background: COLORS.surface1, borderColor: COLORS.border }}>
                            <img
                                src={images[activeImageIndex]}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border" style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}>
                                <Eye size={12} /> 12 Watching
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="hidden md:flex justify-center gap-4 mt-8">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={`relative w-16 h-16 rounded-2xl overflow-hidden transition-all duration-300 ${activeImageIndex === idx ? `ring-2 ring-offset-4 ring-offset-white ring-[${COLORS.fireOrange}] scale-110` : 'opacity-50 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Description (Desktop) */}
                        <div className="hidden lg:block mt-16 px-4 md:px-0">
                            <h3 className="text-2xl font-display mb-6" style={{ color: COLORS.textPrimary }}>Description</h3>
                            <p className="text-lg leading-relaxed font-medium mb-4" style={{ color: COLORS.textSecondary }}>
                                "Mint condition. Original packaging included. Keeps excellent time and has been serviced recently. A rare find.
                                This item has been inspected by our team of experts and is guaranteed authentic."
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="p-4 rounded-xl border" style={{ background: COLORS.surface1, borderColor: COLORS.border }}>
                                    <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: COLORS.steelGray }}>Condition</div>
                                    <div className="font-bold" style={{ color: COLORS.textPrimary }}>Used - Excellent</div>
                                </div>
                                <div className="p-4 rounded-xl border" style={{ background: COLORS.surface1, borderColor: COLORS.border }}>
                                    <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: COLORS.steelGray }}>Authenticity</div>
                                    <div className="font-bold" style={{ color: COLORS.textPrimary }}>Guaranteed</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Right Column: Product Info & Actions */}
                    <div className="w-full lg:w-2/5 px-6 md:px-0 mt-6 lg:mt-0">

                        {/* Timer Section */}
                        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl border" style={{ background: 'rgba(34, 76, 255, 0.05)', borderColor: 'rgba(34, 76, 255, 0.2)' }}>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center animate-pulse shadow-blue-200 shadow-lg" style={{ background: COLORS.fireOrange }}>
                                <Clock className="text-white" size={24} />
                            </div>
                            <div>
                                <span className="text-[11px] font-black uppercase tracking-widest block mb-1" style={{ color: COLORS.fireOrange }}>Time Remaining</span>
                                <span className="text-2xl font-display tracking-wide leading-none" style={{ color: COLORS.fireOrange }}>{timeLeft}</span>
                            </div>
                        </div>

                        {/* Title Block */}
                        <div className="mb-8">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display leading-[0.95] mb-4" style={{ color: COLORS.textPrimary }}>
                                {item.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm font-medium" style={{ color: COLORS.steelGray }}>
                                <span className="flex items-center gap-1"><MapPin size={14} /> {item.location}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-400" />
                                <span>Used - Excellent</span>
                            </div>
                        </div>

                        {/* Seller Signature */}
                        <div className="flex items-center justify-between py-6 border-t mb-8" style={{ borderColor: COLORS.border }}>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img src={`https://i.pravatar.cc/150?u=${item.winningBidder}`} alt="Seller" className="w-12 h-12 rounded-full ring-2 ring-blue-100" />
                                    <div className="absolute -bottom-1 -right-1 text-white p-0.5 rounded-full border-2 border-white" style={{ background: COLORS.fireOrange }}>
                                        <ShieldCheck size={10} strokeWidth={3} />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="font-bold leading-none mb-1" style={{ color: COLORS.textPrimary }}>{item.winningBidder}</div>
                                    <div className="text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.steelGray }}>Trusted Seller</div>
                                </div>
                            </div>
                            <button className="w-10 h-10 rounded-full border flex items-center justify-center transition-all bg-white hover:shadow-md" style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}>
                                <MessageCircle size={18} />
                            </button>
                        </div>

                        {/* Mobile Only: Description & Banners */}
                        <div className="lg:hidden">
                            <div className="mb-10">
                                <p className="text-lg leading-relaxed font-medium" style={{ color: COLORS.textSecondary }}>
                                    "Mint condition. Original packaging included. Keeps excellent time and has been serviced recently. A rare find."
                                </p>
                                <button className="mt-2 text-sm font-bold hover:underline transition-colors" style={{ color: COLORS.fireOrange }}>
                                    Read full description
                                </button>
                            </div>
                            <div className="mb-10">
                                <StatusBanner status={item.status} />
                                <RevealPriceBanner />
                            </div>
                        </div>

                        {/* Desktop Widget */}
                        <div className="hidden lg:block sticky top-8 p-1.5 rounded-[32px] bg-gradient-to-b from-white to-slate-50 shadow-xl shadow-slate-200/50">
                            <div className="rounded-[28px] p-8 border" style={{ background: COLORS.surface1, borderColor: COLORS.border }}>
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: COLORS.steelGray }}>Next Bid</span>
                                        <div className="text-6xl font-bold tracking-tighter leading-none" style={{ color: COLORS.textPrimary }}>
                                            ${nextBid.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={onBid}
                                        className="relative w-full py-5 rounded-2xl font-bold text-white text-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all overflow-hidden group"
                                        style={{
                                            background: COLORS.fireOrange,
                                            boxShadow: `0 10px 30px ${COLORS.fireOrange}40`
                                        }}
                                    >
                                        <span className="relative flex items-center justify-center gap-3">
                                            PLACE BID <ArrowRight size={24} strokeWidth={3} />
                                        </span>
                                    </button>
                                    <p className="text-center text-xs font-bold" style={{ color: COLORS.steelGray }}>
                                        Current Bid: <span style={{ color: COLORS.textPrimary }}>${item.currentBid.toLocaleString()}</span>
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t space-y-4" style={{ borderColor: COLORS.border }}>
                                    <StatusBanner status={item.status} compact={true} />
                                    <RevealPriceBanner compact={true} />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Bid History */}
                        <div className="mt-8 border-t pt-8 lg:hidden" style={{ borderColor: COLORS.border }}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold flex items-center gap-2" style={{ color: COLORS.textPrimary }}>
                                    <Zap size={18} className="text-yellow-500 fill-current" /> Bid Activity
                                </h3>
                            </div>
                            <div className="space-y-6">
                                {bidHistory.map((bid, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${bid.active ? '' : 'bg-slate-300'}`} style={bid.active ? { background: COLORS.fireOrange } : {}} />
                                            <span className={`text-sm font-bold ${bid.active ? '' : 'text-slate-400'}`} style={bid.active ? { color: COLORS.textPrimary } : {}}>
                                                {bid.user}
                                            </span>
                                        </div>
                                        <div className="text-sm font-mono font-bold" style={{ color: COLORS.textSecondary }}>
                                            ${bid.amount.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* 4. Recommendations */}
                <div className="mt-20 md:mt-32 px-6 md:px-0 mb-12">
                    <div className="flex items-center gap-2 mb-8">
                        <Sparkles size={20} style={{ color: COLORS.fireOrange }} />
                        <h3 className="text-2xl font-display tracking-tight" style={{ color: COLORS.textPrimary }}>
                            More for You
                        </h3>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-12 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 snap-x">
                        {relatedItems.map((related) => (
                            <div key={related.id} className="min-w-[280px] w-[280px] snap-center">
                                <AuctionCard
                                    item={related}
                                    isFavorite={favorites.has(related.id)}
                                    onToggleFavorite={() => onToggleFavorite(related.id)}
                                    isAuthenticated={isAuthenticated}
                                    onAuthOpen={() => { }}
                                    onSubscribeOpen={onSubscribeOpen}
                                    onClick={() => { }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. Mobile Action Dock */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pb-8">
                <div className="bg-white/95 backdrop-blur-xl rounded-[24px] p-2 pr-2 pl-6 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.12)] border pointer-events-auto" style={{ borderColor: COLORS.border }}>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: COLORS.steelGray }}>Next Bid</span>
                        <span className="text-2xl font-bold tracking-tight" style={{ color: COLORS.textPrimary }}>${nextBid.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={onBid}
                        className="h-14 px-8 rounded-[20px] font-bold text-white text-lg shadow-lg active:scale-95 transition-all flex items-center gap-2"
                        style={{ backgroundColor: COLORS.fireOrange }}
                    >
                        BID NOW
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ItemDetail;