import React, { useState, useEffect } from 'react';
import { Timer, Search, Lock, AlertTriangle, Filter } from 'lucide-react';
import { getNextMondayNoon, formatCountdown, isLocked } from '../../utils/lockTime';
import { cn } from '../../utils/cn'; // Assuming we have utils/cn, otherwise use local helper

interface BankerHeaderProps {
    reviewedCount: number;
    totalCount: number;
    stats: {
        offered: number;
        passed: number;
        needsInfo: number;
        avgApr: number;
    };
    onReviewClick: (onlyHighRisk?: boolean) => void;
    onSearchClick: () => void;
    autoAdvance: boolean;
    onToggleAutoAdvance: () => void;
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    highRiskOffersCount: number;
}

const BankerHeader: React.FC<BankerHeaderProps> = ({
    reviewedCount,
    totalCount,
    stats,
    onReviewClick,
    onSearchClick,
    autoAdvance,
    onToggleAutoAdvance,
    activeFilter,
    onFilterChange,
    highRiskOffersCount
}) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const nextDeadline = getNextMondayNoon(now);
            const diff = nextDeadline.getTime() - now.getTime();
            setTimeLeft(diff > 0 ? diff : 0);
            setLocked(isLocked(now));
        };

        updateTime(); // initial
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const progressPercent = Math.min(100, (reviewedCount / totalCount) * 100);
    const isClosingSoon = timeLeft < 10 * 60 * 1000 && !locked; // 10 mins

    // Queue Filters
    const FILTERS = [
        { id: 'all', label: `All (${totalCount})` },
        { id: 'vehicles', label: 'Vehicles' },
        { id: 'equipment', label: 'Equipment' },
        { id: 'high_value', label: 'High Value' },
        { id: 'needs_info', label: `Needs Info (${stats.needsInfo})` },
    ];

    return (
        <div className="sticky top-0 z-50 w-full flex flex-col shadow-xl">
            {/* 1. Main Dark Bar */}
            <div className="bg-slate-900 border-b border-slate-800 text-white">
                <div className="flex items-center justify-between px-4 py-2.5 md:px-6">
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block font-bold text-lg tracking-tight">
                            <span className="text-white">GARTH</span>
                            <span className="text-blue-500">BANKER</span>
                        </div>

                        {/* Timer Block */}
                        <div className={cn("flex items-center gap-3 bg-slate-800/50 px-3 py-1.5 rounded-lg border", isClosingSoon ? "border-amber-500/50 bg-amber-900/10" : "border-slate-700/50")}>
                            {locked ? <Lock size={16} className="text-red-500" /> : <Timer size={16} className={isClosingSoon ? "text-amber-400" : "text-blue-400"} />}
                            <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
                                <span className={cn("text-[10px] font-bold uppercase tracking-wider", isClosingSoon ? "text-amber-400" : "text-slate-400")}>
                                    {locked ? 'Locked' : 'Locks Mon 12PM'}
                                </span>
                                <span className="font-mono text-sm md:text-base font-bold tabular-nums">
                                    {locked ? 'LOCKED' : formatCountdown(timeLeft)}
                                </span>
                            </div>
                        </div>

                        {/* Desktop Stats Row */}
                        <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-400 border-l border-slate-700 pl-6 h-8">
                            <span className="text-slate-500">SESSION STATUS:</span>
                            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Offers: <span className="text-white">{stats.offered}</span></div>
                            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Passed: <span className="text-white">{stats.passed}</span></div>
                            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Avg APR: <span className="text-white">{stats.avgApr.toFixed(2)}%</span></div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onToggleAutoAdvance}
                            className={cn("hidden md:flex flex-col items-center justify-center transition-opacity", autoAdvance ? "opacity-100" : "opacity-40 hover:opacity-100")}
                            title="Auto-advance after action"
                        >
                            <span className="text-[9px] uppercase font-bold text-slate-400 mb-0.5">Auto-Next</span>
                            <div className={cn("w-6 h-3 rounded-full p-0.5 relative", autoAdvance ? "bg-blue-600" : "bg-slate-700")}>
                                <div className={cn("w-2 h-2 bg-white rounded-full absolute top-0.5 transition-all", autoAdvance ? "left-3.5" : "left-0.5")} />
                            </div>
                        </button>

                        <div className="h-8 w-px bg-slate-700 hidden md:block" />

                        <button
                            onClick={() => onReviewClick(false)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs font-medium transition-colors"
                        >
                            Review All
                        </button>
                        <button
                            onClick={onSearchClick}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors text-slate-400 hover:text-white"
                        >
                            <Search size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Safety / Warning Banner (Pre-Lock) */}
            {isClosingSoon && (
                <div className="bg-amber-500 text-slate-900 px-4 py-2 flex items-center justify-between text-xs font-bold animate-pulse">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={16} />
                        <span>LOCKING SOON — Please review high-risk offers ({highRiskOffersCount})</span>
                    </div>
                    <button
                        onClick={() => onReviewClick(true)}
                        className="bg-slate-900 text-amber-500 px-3 py-1 rounded shadow-sm hover:bg-black transition-colors"
                    >
                        Review High Risk
                    </button>
                </div>
            )}

            {/* 3. Queue Map Bar (White) */}
            <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <Filter size={14} className="text-slate-400 mr-2 shrink-0" />
                {FILTERS.map(f => (
                    <button
                        key={f.id}
                        onClick={() => onFilterChange(f.id)}
                        className={cn(
                            "px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border",
                            activeFilter === f.id
                                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                        )}
                    >
                        {f.label}
                    </button>
                ))}
                <div className="ml-auto text-[10px] font-mono font-medium text-slate-400 hidden lg:block">
                    QUEUE PROGRESS: {Math.round(progressPercent)}%
                </div>
            </div>
        </div>
    );
};

export default BankerHeader;
