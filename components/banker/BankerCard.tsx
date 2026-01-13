import React from 'react';
import { BankerItem, CompetingOffer, BankerOffer } from './types';
import { MapPin, Calendar, AlertTriangle, ShieldAlert, CheckCircle2, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/cn'; // Assuming utils/cn exists
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip'; // Assuming shadcn tooltip available or similar

interface BankerCardProps {
    item: BankerItem;
    competingOffers: CompetingOffer[];
    myOffer?: BankerOffer;
    myRank?: number;
    onShowLadder: () => void;
    activeTemplateName?: string;
    activeTemplateApr?: number;
    onBeatBest?: (delta: number) => void;
    onAction?: (action: 'pass' | 'offer') => void;
    onAdjustRates?: () => void;
    onViewSeller?: () => void;
    onViewValuation?: () => void;
}

const BankerCard: React.FC<BankerCardProps> = ({
    item,
    competingOffers,
    myOffer,
    myRank,
    onShowLadder,
    activeTemplateName,
    activeTemplateApr,
    onBeatBest,
    onAction,
    onAdjustRates,
    onViewSeller,
    onViewValuation
}) => {
    const timeLeft = Math.max(0, new Date(item.closeAt).getTime() - new Date().getTime());
    const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));

    const bestOffer = competingOffers.find(o => o.rank === 1);
    const potentialApr = myOffer?.apr || activeTemplateApr || 0;

    // "Beat #1" Logic
    const beatDelta = bestOffer ? Number((bestOffer.apr - 0.1).toFixed(2)) : 0;
    const showBeatButton = bestOffer && (!myRank || myRank > 1) && (!myOffer || myOffer.apr >= bestOffer.apr);

    // Risk Panel Logic
    const riskIndicators = [
        {
            label: 'Data Quality',
            value: item.flags.lowConfidence ? 'Low' : 'High',
            color: item.flags.lowConfidence ? 'text-red-500' : 'text-green-500',
            tooltip: item.flags.lowConfidence ? 'Missing hours/mileage + basic description' : 'Verified Serial + 10+ photos'
        },
        {
            label: 'VIN / Serial',
            value: item.flags.missingVin ? 'Missing' : 'Verified',
            color: item.flags.missingVin ? 'text-red-500' : 'text-green-500',
            tooltip: item.flags.missingVin ? 'Asset cannot be lien checked properly' : 'Clean CPIC search'
        },
        {
            label: 'Valuation',
            value: item.flags.highValue ? 'Wide Range' : 'Stable',
            color: item.flags.highValue ? 'text-amber-500' : 'text-green-500',
            tooltip: item.flags.highValue ? 'High value assets have volatile market pricing' : 'High transaction volume model'
        },
    ];

    return (
        <div className="w-full max-w-[420px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 select-none relative">

            {/* 1. Top Strip: Competing Offers (V2) */}
            <div className="bg-slate-50 border-b border-slate-100 p-3 pt-4 relative">
                <div className="absolute top-1 left-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Best Terms This Week
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mt-1">
                    {competingOffers.slice(0, 3).map((offer) => (
                        <div
                            key={offer.rank}
                            onClick={onShowLadder}
                            className={cn(
                                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-transform hover:scale-105 border shadow-sm",
                                offer.rank === 1 ? "bg-amber-50 text-amber-900 border-amber-200" :
                                    offer.rank === 2 ? "bg-white text-slate-700 border-slate-200" :
                                        "bg-white text-slate-600 border-slate-200"
                            )}
                        >
                            <span className="opacity-40 text-[10px]">#{offer.rank}</span>
                            <span className="font-mono">{offer.apr.toFixed(2)}%</span>
                            <span className="opacity-30">·</span>
                            <span>{offer.termMonths}m</span>
                        </div>
                    ))}

                    {/* Beat #1 Button */}
                    {showBeatButton && onBeatBest && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onBeatBest(beatDelta); }}
                            className="ml-1 px-2 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-[10px] font-bold uppercase rounded-lg border border-blue-200 transition-colors flex items-center gap-1 animate-in fade-in zoom-in"
                        >
                            <TrendingDown size={12} /> Beat #{bestOffer?.rank}
                        </button>
                    )}
                </div>

                {/* Your Position Chip */}
                <div className="mt-2 flex justify-end">
                    {myOffer && (
                        <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            <span className="font-bold">You: {myOffer.apr.toFixed(2)}%</span>
                            <span className="text-blue-400">·</span>
                            <span>{myOffer.termMonths}m</span>
                            <span className={cn("ml-1 font-bold px-1.5 rounded text-[10px]", myRank === 1 ? "bg-amber-100 text-amber-700" : "bg-white text-blue-400")}>
                                Rank #{myRank}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Main Content */}
            <div className="relative group">
                {/* Image */}
                <div className="aspect-video w-full bg-slate-200 relative overflow-hidden">
                    <img
                        src={item.thumbUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />

                    {/* V2 Risk Badges on Image (Minimal) */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                        {item.flags.missingVin && (
                            <span className="px-2 py-1 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded shadow-sm flex items-center gap-1">
                                <ShieldAlert size={12} /> No VIN
                            </span>
                        )}
                        {item.flags.highValue && (
                            <div className="px-2 py-1 bg-black/50 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase rounded shadow-sm">
                                High Value
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent p-4 pt-16 text-white text-shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold leading-tight line-clamp-2 drop-shadow-md">{item.title}</h2>
                                <div className="flex items-center gap-2 mt-1 text-slate-300 text-xs font-medium">
                                    <span>{item.category}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><MapPin size={10} /> {item.facts.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. V2 Risk & Confidence Panel */}
                <div className="p-4 bg-white space-y-4">
                    {/* Est Value & Time */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Est. Value</p>
                            <p className="text-lg font-black text-slate-800 tracking-tight">
                                ${(item.estValueMin / 1000).toFixed(0)}k - ${(item.estValueMax / 1000).toFixed(0)}k
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Closes in</p>
                            <p className={cn("text-lg font-black flex items-center gap-1 justify-end tracking-tight", hoursLeft < 24 ? "text-orange-600" : "text-slate-800")}>
                                {hoursLeft < 24 && <Calendar size={14} className="mb-0.5" />} {hoursLeft}h
                            </p>
                        </div>
                    </div>

                    {/* New 4-Tile Banker Grid */}
                    {/* New 3+1 Banker Grid: Seller, Valuation, Longevity + Adjust Rates */}
                    <div className="grid grid-cols-4 gap-2 h-[50px]">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        onClick={(e) => { e.stopPropagation(); onViewSeller?.(); }}
                                        className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-center cursor-pointer transition-colors hover:bg-slate-100 flex flex-col justify-center active:scale-95 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <p className="text-[8px] text-slate-400 uppercase font-bold mb-0.5 truncate w-full">Seller</p>
                                        <p className={cn("text-xs font-bold truncate", item.facts.sellerRating === 'Excellent' ? "text-green-600" : item.facts.sellerRating === 'Risky' ? "text-red-500" : "text-slate-700")}>{item.facts.sellerRating || 'Unrated'}</p>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent><p>View Seller Profile</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        onClick={(e) => { e.stopPropagation(); onViewValuation?.(); }}
                                        className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-center cursor-pointer transition-colors hover:bg-slate-100 flex flex-col justify-center active:scale-95 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <p className="text-[8px] text-slate-400 uppercase font-bold mb-0.5 truncate w-full">Valuation</p>
                                        <p className={cn("text-xs font-bold truncate", item.facts.priceAnalysis === 'Strong' ? "text-green-600" : "text-slate-700")}>{item.facts.priceAnalysis || 'N/A'}</p>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent><p>View Price Analysis</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-center cursor-help transition-colors hover:bg-slate-100 flex flex-col justify-center">
                                        <p className="text-[8px] text-slate-400 uppercase font-bold mb-0.5 truncate w-full">Longevity</p>
                                        <p className={cn("text-xs font-bold truncate", item.facts.longevityRating === 'A' ? "text-green-600" : "text-slate-700")}>{item.facts.longevityRating || 'N/A'}</p>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent><p>Asset class durability rating</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <button
                            onClick={(e) => { e.stopPropagation(); onAdjustRates?.(); }}
                            className="bg-slate-900 rounded-lg text-white flex flex-col items-center justify-center shadow-md active:scale-95 transition-all hover:bg-slate-800"
                        >
                            <span className="text-[8px] font-bold uppercase tracking-wider opacity-80">Adjust</span>
                            <span className="text-[10px] font-black uppercase tracking-tight">Rates</span>
                        </button>
                    </div>

                    {/* Progress Label */}
                    <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Confidence</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all", item.facts.dataConfidence > 80 ? "bg-green-500" : item.facts.dataConfidence > 50 ? "bg-amber-500" : "bg-red-500")}
                                style={{ width: `${item.facts.dataConfidence}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">{item.facts.dataConfidence}%</span>
                    </div>
                </div>
            </div>

            {/* 4. Action Footer (Attached) */}
            <div className="bg-white border-t border-slate-100 p-4 pb-6 flex items-center gap-4">
                <button
                    onClick={(e) => { e.stopPropagation(); onShowLadder(); /* Hack: reusing pass/left logic from parent if passed down */ }}
                    className="h-14 w-14 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 active:scale-95 transition-all flex items-center justify-center group shrink-0"
                >
                    <span className="font-black text-2xl group-hover:rotate-90 transition-transform">✕</span>
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); /* onSwipe('right') logic needs to be triggered here */ }}
                    className="flex-1 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-200 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
                >
                    <span className="font-black text-2xl tracking-tight">OFFER {potentialApr.toFixed(2)}%</span>
                </button>
            </div>
        </div>
    );
};

export default BankerCard;
