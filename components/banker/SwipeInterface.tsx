
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import BankerCard from './BankerCard';
import { BankerItem, CompetingOffer } from './types';
import { Search, Archive } from 'lucide-react';

interface SwipeInterfaceProps {
    currentItem: BankerItem | null;
    nextItem: BankerItem | null;
    competingOffers: CompetingOffer[];
    myOffer?: any;
    myRank?: number;
    onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
    activeTemplateName: string;
    activeTemplateApr?: number;
    isLocked: boolean;
    onBeatBest?: (delta: number) => void;
    lastDecision?: { action: string; label: string; timestamp: number } | null;
    onAction?: (action: 'pass' | 'offer') => void; // Added in prev step
    onAction?: (action: 'pass' | 'offer') => void; // Added in prev step
    onAdjustRates?: () => void;
    onViewSeller?: () => void;
    onViewValuation?: () => void;
}

const SwipeInterface: React.FC<SwipeInterfaceProps> = ({
    currentItem,
    nextItem,
    competingOffers, // Ideally this should be for the current item
    myOffer,
    myRank,
    onSwipe,
    activeTemplateName,
    activeTemplateApr,
    isLocked,
    onBeatBest,
    lastDecision,
    onAction,
    onAdjustRates,
    onViewSeller,
    onViewValuation
}) => {
    const [exitX, setExitX] = useState<number | string>(0);
    const [exitY, setExitY] = useState<number | string>(0);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-10, 10]);

    // Opacity transforms for indicators
    const passOpacity = useTransform(x, [-100, -20], [1, 0]);
    const offerOpacity = useTransform(x, [20, 100], [0, 1]);
    const customOpacity = useTransform(y, [-100, -20], [1, 0]);
    const saveOpacity = useTransform(y, [20, 100], [0, 1]);

    // Color transforms for card background hint
    const overlayColor = useTransform(
        x,
        [-200, 0, 200],
        ['rgba(239, 68, 68, 0.1)', 'rgba(255, 255, 255, 0)', 'rgba(34, 197, 94, 0.1)']
    );

    const handleDragEnd = (event: any, info: PanInfo) => {
        if (isLocked) {
            // Snap back if locked
            return;
        }

        const threshold = 100;

        if (info.offset.x > threshold) {
            setExitX(300);
            onSwipe('right');
        } else if (info.offset.x < -threshold) {
            setExitX(-300);
            onSwipe('left');
        } else if (info.offset.y < -threshold) {
            setExitY(-300);
            onSwipe('up');
        } else if (info.offset.y > threshold) {
            setExitY(300);
            onSwipe('down');
        }
    };

    // Reset motion values when item changes
    useEffect(() => {
        x.set(0);
        y.set(0);
    }, [currentItem]);

    if (!currentItem) return <div className="flex h-full items-center justify-center text-slate-400">Queue Empty</div>;

    return (
        <div className="relative w-full max-w-[420px] h-[640px] flex items-center justify-center">
            <AnimatePresence>
                <motion.div
                    key={currentItem.id}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
                    style={{ x, y, rotate, background: overlayColor }}
                    drag={isLocked ? false : true}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    onDragEnd={handleDragEnd}
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
                    exit={{ x: exitX, y: exitY, opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                >
                    {/* Action Indicators Overlay (While Dragging) */}
                    <motion.div style={{ opacity: passOpacity }} className="absolute top-8 right-8 z-20 pointer-events-none transform rotate-12">
                        <div className="border-[6px] border-red-500/80 text-red-500 rounded-xl px-4 py-2 font-black text-4xl uppercase tracking-widest bg-white/90 backdrop-blur-md shadow-xl">
                            PASS
                        </div>
                    </motion.div>

                    <motion.div style={{ opacity: offerOpacity }} className="absolute top-8 left-8 z-20 pointer-events-none transform -rotate-12">
                        <div className="border-[6px] border-green-500/80 text-green-500 rounded-xl px-4 py-2 font-black text-4xl uppercase tracking-widest bg-white/90 backdrop-blur-md shadow-xl">
                            OFFER
                        </div>
                    </motion.div>

                    {/* V2 Decision Stamp Overlay (Post-Action Animation on PREVIOUS card - Logic handled in Dashboard to show overlay on exit? 
              Actually, usually this overlays on the CARD right before it leaves. 
              Since Framer handles exit animations, we can add a 'decision' prop or similar.
              For simplicity in this architecture, the dashboard handles the state transition.
              The indicators above handle the drag feedback.
              The Toast handles the post-action confirmation. 
              If we want a stamp on the *next* card or just a flash, we can do it.
          */}

                    {/* Actual Card */}
                    <BankerCard
                        item={currentItem}
                        competingOffers={competingOffers}
                        myOffer={myOffer}
                        myRank={myRank}
                        activeTemplateName={activeTemplateName}
                        activeTemplateApr={activeTemplateApr}
                        onShowLadder={() => { }}
                        onBeatBest={onBeatBest}
                        onAction={onAction}
                        onAdjustRates={onAdjustRates}
                        onViewSeller={onViewSeller}
                        onViewValuation={onViewValuation}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Decision Stamp Animation (Overlay on top of everything for 600ms) */}
            <AnimatePresence>
                {lastDecision && (Date.now() - lastDecision.timestamp < 600) && (
                    <motion.div
                        initial={{ scale: 1.5, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="absolute z-50 pointer-events-none"
                    >
                        <div className={`
                        px-6 py-3 rounded-xl border-[6px] font-black text-3xl uppercase tracking-widest shadow-2xl backdrop-blur-md bg-white/90
                        ${lastDecision.action === 'pass' ? 'border-red-500 text-red-500' :
                                lastDecision.action === 'offer' ? 'border-green-500 text-green-500' : 'border-amber-500 text-amber-500'}
                    `}>
                            {lastDecision.label}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Card (Preview) */}
            {nextItem && (
                <div className="absolute top-4 scale-95 opacity-50 z-0">
                    {/* Minimal preview to imply depth */}
                    <div className="w-[420px] h-[500px] bg-slate-100 rounded-3xl border border-slate-200">
                        <div className="aspect-[4/3] bg-slate-200 rounded-t-3xl" />
                        <div className="p-4 space-y-4">
                            <div className="h-6 bg-slate-200 rounded w-3/4" />
                            <div className="h-4 bg-slate-200 rounded w-1/2" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SwipeInterface;
