import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ShieldCheck } from 'lucide-react';
import { cn } from './ui/button';

export type MarketplaceMode = 'UNRESERVED' | 'RESERVED';

interface MarketplaceModeToggleProps {
    mode: MarketplaceMode;
    onChange: (mode: MarketplaceMode) => void;
    className?: string;
}

const MarketplaceModeToggle: React.FC<MarketplaceModeToggleProps> = ({ mode, onChange, className }) => {
    return (
        <div className={cn("sticky top-[56px] md:top-0 z-40 backdrop-blur-md bg-white/70 py-4 -mx-4 px-4 md:mx-0 md:px-0 border-b border-black/5", className)}>
            <div className="max-w-md mx-auto px-4">
                {/* The Segmented Control Container */}
                <div className="relative bg-slate-200/50 p-1 rounded-full flex items-center h-12 shadow-sm ring-1 ring-black/5">

                    {/* Unreserved Option */}
                    <button
                        onClick={() => onChange('UNRESERVED')}
                        className={cn(
                            "relative flex-1 h-full flex items-center justify-center gap-2 text-[13px] font-semibold tracking-[0.12em] uppercase transition-colors duration-300 z-10",
                            mode === 'UNRESERVED' ? "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {mode === 'UNRESERVED' && (
                            <motion.div
                                layoutId="modeThumb"
                                className="absolute inset-0 rounded-full bg-gradient-to-b from-[#ff6b00] to-[#ff5000] shadow-[0_10px_26px_rgba(255,88,0,0.20)] -z-10"
                                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                        <Flame
                            size={15}
                            className={cn("transition-opacity", mode === 'UNRESERVED' ? "opacity-100" : "opacity-40")}
                        />
                        UNRESERVED
                    </button>

                    {/* Reserved Option */}
                    <button
                        onClick={() => onChange('RESERVED')}
                        className={cn(
                            "relative flex-1 h-full flex items-center justify-center gap-2 text-[13px] font-semibold tracking-[0.12em] uppercase transition-colors duration-200 z-10",
                            mode === 'RESERVED' ? "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {mode === 'RESERVED' && (
                            <motion.div
                                layoutId="modeThumb"
                                className="absolute inset-0 rounded-full bg-gradient-to-b from-[#4359ff] to-[#2238ff] shadow-[0_10px_26px_rgba(34,76,255,0.20)] -z-10"
                                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                        <ShieldCheck
                            size={15}
                            className={cn("transition-opacity", mode === 'RESERVED' ? "opacity-100" : "opacity-40")}
                        />
                        RESERVED
                    </button>
                </div>

                {/* Helper Microcopy */}
                <div className="text-center mt-3 h-4 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={mode}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="text-[12px] text-slate-400 font-medium tracking-tight"
                        >
                            {mode === 'UNRESERVED'
                                ? "No minimum · Highest bid wins"
                                : "Seller approval required"}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MarketplaceModeToggle;
