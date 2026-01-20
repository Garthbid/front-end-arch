import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
import { Button } from './ui/button';
import { MarketplaceMode } from './MarketplaceModeToggle';
import { Flame, ShieldCheck, Plus, Check, SlidersHorizontal, X, MapPin, Wallet } from 'lucide-react';
import { cn } from './ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from './ui/sheet';

interface Category {
    id: string;
    label: string;
    icon: string | null;
}

interface MarketplaceCommandBarProps {
    mode: MarketplaceMode;
    onModeChange: (mode: MarketplaceMode) => void;
    category: string;
    onCategoryChange: (category: string) => void;
    categories: Category[];
    onListClick: () => void;
    locationName?: string;
    onLocationClick?: () => void;
    onWalletClick?: () => void;
}

const MarketplaceCommandBar: React.FC<MarketplaceCommandBarProps> = ({
    mode,
    onModeChange,
    category,
    onCategoryChange,
    categories,
    onListClick,
    locationName = 'All locations',
    onLocationClick,
    onWalletClick,
}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const activeCategory = categories.find(c => c.id === category) || categories[0];

    return (
        <motion.header
            className={cn(
                "fixed top-[56px] left-0 right-0 md:sticky md:top-0 z-40 w-full transition-all duration-300 ease-out border-b border-[#f2f2f2]",
                isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-1.5 md:py-2" : "bg-white py-2 md:py-4"
            )}
            initial={false}
        >
            <div className="max-w-[1920px] mx-auto px-3 md:px-8">
                {/* Desktop Layout (>= md) */}
                <div className="hidden md:flex items-center justify-between gap-6">
                    {/* Left: Mode Toggle */}
                    <div className="flex-1 max-w-[340px]">
                        <Tabs value={mode} onValueChange={(v) => onModeChange(v as MarketplaceMode)}>
                            <TabsList className="h-10 rounded-xl p-1 bg-slate-100 w-full flex items-center gap-1 shadow-inner">
                                <TabsTrigger
                                    value="UNRESERVED"
                                    className={cn(
                                        "flex-1 h-full rounded-[9px] text-[11px] font-bold tracking-wider transition-all duration-200 uppercase",
                                        mode === 'UNRESERVED'
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                                    )}
                                >
                                    UNRESERVED
                                </TabsTrigger>
                                <TabsTrigger
                                    value="RESERVED"
                                    className={cn(
                                        "flex-1 h-full rounded-[9px] text-[11px] font-bold tracking-wider transition-all duration-200 uppercase",
                                        mode === 'RESERVED'
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                                    )}
                                >
                                    RESERVED
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Center: Filter Button (Opens Sheet - matching mobile style but with text) */}
                    <div className="flex-1 max-w-[280px]">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full h-10 rounded-xl bg-white border border-slate-200 px-4 flex items-center justify-between hover:bg-slate-50 hover:border-slate-300 shadow-sm text-slate-500 hover:text-slate-700"
                                >
                                    <div className="flex items-center gap-2">
                                        <SlidersHorizontal size={18} />
                                        <span className="text-[13px] font-bold text-slate-900">Filter</span>
                                    </div>
                                    {(category !== 'All' || (locationName && locationName !== 'All locations')) && (
                                        <span className="w-2 h-2 rounded-full bg-[#2238ff]" />
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[400px] p-0 overflow-hidden">
                                <SheetHeader className="pt-6 px-6 pb-4 text-left border-b border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <SheetTitle className="text-xl font-bold tracking-tight">Filter</SheetTitle>
                                        <SheetClose className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                                            <X size={16} />
                                        </SheetClose>
                                    </div>
                                </SheetHeader>

                                {/* Location Button - Opens existing LocationPicker */}
                                <div className="px-6 pt-4 pb-2 border-b border-slate-100">
                                    <button
                                        onClick={() => {
                                            if (onLocationClick) {
                                                onLocationClick();
                                            }
                                        }}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                                <MapPin size={18} className="text-[#2238ff]" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-sm text-slate-900">Choose Your Location</p>
                                                <p className="text-xs text-slate-500">{locationName}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#2238ff]">Change →</span>
                                    </button>
                                </div>

                                {/* Categories Section */}
                                <div className="p-6 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Category</p>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => onCategoryChange(cat.id)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-3 rounded-xl transition-all active:scale-[0.98]",
                                                category === cat.id ? "bg-blue-50/50 ring-1 ring-blue-100" : "hover:bg-slate-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-sm border",
                                                    category === cat.id ? "bg-white border-blue-200" : "bg-slate-50 border-black/5"
                                                )}>
                                                    {cat.icon || "📦"}
                                                </div>
                                                <span className={cn(
                                                    "font-semibold text-sm",
                                                    category === cat.id ? "text-blue-600" : "text-slate-700"
                                                )}>
                                                    {cat.label}
                                                </span>
                                            </div>
                                            {category === cat.id && (
                                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                                    <Check size={12} className="text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Right: List CTA + Wallet */}
                    <div className="flex-1 flex justify-end items-center gap-3">
                        <Button
                            onClick={onListClick}
                            className="h-[40px] rounded-full bg-[#2238ff] hover:bg-[#1a2dbb] text-white font-bold px-6 shadow-lg shadow-blue-500/10 transition-all hover:-translate-y-0.5 active:scale-95 text-[11px] uppercase tracking-wider"
                        >
                            <span className="text-sm mr-1">+</span> List My Item
                        </Button>

                        {onWalletClick && (
                            <button
                                onClick={onWalletClick}
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
                            >
                                <Wallet size={18} className="text-slate-700" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Layout (< md) */}
                <div className="md:hidden flex items-center justify-between gap-2">
                    {/* Left: Mode Toggle (Compact) */}
                    <div className="flex-1">
                        <Tabs value={mode} onValueChange={(v) => onModeChange(v as MarketplaceMode)}>
                            <TabsList className="h-10 rounded-xl p-1 bg-slate-100 w-full flex items-center gap-1 shadow-inner">
                                <TabsTrigger
                                    value="UNRESERVED"
                                    className={cn(
                                        "h-8 rounded-[8px] flex-1 text-[11px] font-bold tracking-wide uppercase flex items-center justify-center gap-1.5 transition-all duration-200",
                                        mode === 'UNRESERVED'
                                            ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    UNRESERVED
                                </TabsTrigger>
                                <TabsTrigger
                                    value="RESERVED"
                                    className={cn(
                                        "h-8 rounded-[8px] flex-1 text-[11px] font-bold tracking-wide uppercase flex items-center justify-center gap-1.5 transition-all duration-200",
                                        mode === 'RESERVED'
                                            ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    RESERVED
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Right Action Cluster: Filter Only */}
                    <div className="ml-3 pl-3 border-l border-slate-100">
                        {/* Filter Button (Opens Sheet) */}
                        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-10 w-10 rounded-xl p-0 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 shadow-sm border border-slate-200"
                                >
                                    <div className="relative">
                                        <SlidersHorizontal className="w-5 h-5" />
                                    </div>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="rounded-t-[32px] p-0 overflow-hidden border-none pb-8 animate-in slide-in-from-bottom duration-300">
                                <SheetHeader className="pt-6 px-6 pb-2 text-left border-b border-slate-50">
                                    <div className="flex items-center justify-between">
                                        <SheetTitle className="text-xl font-bold tracking-tight">Filter</SheetTitle>
                                        <SheetClose className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                                            <X size={16} />
                                        </SheetClose>
                                    </div>
                                </SheetHeader>

                                {/* Location Button - Opens existing LocationPicker */}
                                <div className="px-4 pt-4 pb-2 border-b border-slate-100">
                                    <button
                                        onClick={() => {
                                            setIsFilterOpen(false);
                                            if (onLocationClick) {
                                                setTimeout(() => onLocationClick(), 150);
                                            }
                                        }}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                                <MapPin size={18} className="text-[#2238ff]" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-sm text-slate-900">Choose Your Location</p>
                                                <p className="text-xs text-slate-500">{locationName}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#2238ff]">Change →</span>
                                    </button>
                                </div>

                                {/* Categories Section */}
                                <div className="p-4 space-y-1 max-h-[50vh] overflow-y-auto no-scrollbar">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                onCategoryChange(cat.id);
                                                setIsFilterOpen(false);
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between p-4 rounded-2xl transition-all active:scale-[0.98]",
                                                category === cat.id ? "bg-blue-50/50 ring-1 ring-blue-100" : "hover:bg-slate-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm border",
                                                    category === cat.id ? "bg-white border-blue-200" : "bg-slate-50 border-black/5"
                                                )}>
                                                    {cat.icon || "📦"}
                                                </div>
                                                <span className={cn(
                                                    "font-bold text-sm",
                                                    category === cat.id ? "text-blue-600" : "text-slate-700"
                                                )}>
                                                    {cat.label}
                                                </span>
                                            </div>
                                            {category === cat.id && (
                                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                                    <Check size={12} className="text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default MarketplaceCommandBar;
