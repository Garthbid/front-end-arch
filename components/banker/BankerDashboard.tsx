import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BankerItem, BankerActionLog, BankerState, BankerTemplate, ItemState, BankerOffer } from './types';
import { MOCK_BANKER_ITEMS } from './mockData';
import { BANKER_TEMPLATES } from './templates';
import { generateMockCompetingOffers, calculateMyRank } from './ranking';
import { isLocked } from '../../utils/lockTime';
import BankerHeader from './BankerHeader';
import SwipeInterface from './SwipeInterface';
import ReviewTable from './ReviewTable';
import { Undo, Laptop, Zap, CheckCircle2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import HighRiskConfirmDialog from './HighRiskConfirmDialog';
import KeyboardHintBar from './KeyboardHintBar';
import PublicProfile from '../PublicProfile';
import ValuationAnalysisModal from './ValuationAnalysisModal';

// Initial State Factory
const createInitialState = (): BankerState => {
    const initialState = {
        queue: MOCK_BANKER_ITEMS,
        itemStateById: {} as Record<string, ItemState>,
        offersById: {} as Record<string, BankerOffer>,
        actionLog: [] as BankerActionLog[],
        currentIndex: 0, // This is an index into the FILTERED queue in the view, or the GLOBAL queue?
        // To accept filtering, we should probably track "view queue". 
        // OR, simpler: currentIndex is index in THE global queue, and filtering just skips items? 
        // Let's use a derived queue approach.
    };
    return initialState;
};

const BankerDashboard: React.FC = () => {
    // Core State
    const [state, setState] = useState<BankerState>(createInitialState());

    // UI State
    const [activeTemplateId, setActiveTemplateId] = useState<string>(BANKER_TEMPLATES[0].id);
    const [activeTab, setActiveTab] = useState<'SWIPE' | 'REVIEW'>('SWIPE');
    const [autoAdvance, setAutoAdvance] = useState(true);
    const [aprNudge, setAprNudge] = useState(0);
    const [activeFilter, setActiveFilter] = useState('all');

    // Dialogs
    const [highRiskDialogOpen, setHighRiskDialogOpen] = useState(false);
    const [showTemplateOverlay, setShowTemplateOverlay] = useState(false);
    const [viewingSeller, setViewingSeller] = useState(false);
    const [viewingValuation, setViewingValuation] = useState(false);


    // Stamp Feedback
    const [lastDecision, setLastDecision] = useState<{ action: string, label: string, timestamp: number } | null>(null);

    // Derived Logic
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        setLocked(isLocked(new Date()));
        const interval = setInterval(() => setLocked(isLocked(new Date())), 1000);
        return () => clearInterval(interval);
    }, []);

    // Filtering Queue
    const filteredQueue = useMemo(() => {
        return state.queue.filter(item => {
            // 1. Must not be already acted on? Or do we show acted items? usually "Swipe" is for unseen.
            // Let's filter out items that have a status other than 'unseen' UNLESS we are jumping to them?
            // For V2 flow: Queue is "Remaining Items".
            const itemState = state.itemStateById[item.id];
            if (itemState && itemState.status !== 'unseen') return false;

            if (activeFilter === 'all') return true;
            if (activeFilter === 'vehicles') return item.category === 'Vehicles';
            if (activeFilter === 'equipment') return item.category === 'Equipment';
            if (activeFilter === 'high_value') return item.flags.highValue;
            if (activeFilter === 'needs_info') return item.flags.missingVin || item.flags.lowConfidence; // Simplified
            return true;
        });
    }, [state.queue, state.itemStateById, activeFilter]);

    // Current Item in View
    // Since we filter, the "currentIndex" should probably just be 0 (top of stack) of the filtered queue?
    // Tinder style: always top of deck.
    const currentItem = filteredQueue[0] || null;
    const nextItem = filteredQueue[1] || null;

    // Competing Offers
    const competingOffers = useMemo(() => {
        if (!currentItem) return [];
        return generateMockCompetingOffers(currentItem.id);
    }, [currentItem?.id]);

    const myOffer = currentItem ? state.offersById[currentItem.id] : undefined;
    const myRank = myOffer ? calculateMyRank(myOffer, competingOffers) : undefined;

    const activeTemplate = useMemo(() =>
        BANKER_TEMPLATES.find(t => t.id === activeTemplateId) || BANKER_TEMPLATES[0],
        [activeTemplateId]);

    // Effective APR
    const effectiveApr = useMemo(() => {
        const base = activeTemplate.defaultApr;
        return Number((base + aprNudge).toFixed(2));
    }, [activeTemplate, aprNudge]);


    // Handlers
    const executeAction = useCallback((action: 'pass' | 'offer' | 'needs_info' | 'custom_offer', confirmedRisk: boolean = false) => {
        if (!currentItem) return;

        let newState: ItemState = {
            status: action === 'pass' ? 'passed' : action === 'needs_info' ? 'needs_info' : 'offered',
            lastUpdatedAt: Date.now(),
            riskReasons: [], // Populate if risky
            confirmedHighRisk: confirmedRisk
        };

        // Populate Risk
        const reasons = [];
        if (currentItem.flags.missingVin) reasons.push("Missing VIN");
        if (currentItem.flags.highValue) reasons.push("High Value");
        if (currentItem.flags.lowConfidence) reasons.push("Low Confidence");
        newState.riskReasons = reasons;

        let newOffer: BankerOffer | undefined;
        let updateToast = "";
        let stampLabel = "";

        if (action === 'pass') {
            stampLabel = 'PASSED';
            updateToast = "Passed item";
        } else if (action === 'offer' || action === 'custom_offer') {
            newOffer = {
                itemId: currentItem.id,
                lenderId: 'me',
                apr: effectiveApr,
                termMonths: activeTemplate.defaultTerm,
                templateId: activeTemplate.id,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            newState.myOfferId = currentItem.id;
            stampLabel = `TERMS SET: ${effectiveApr}%`;

            // Calc Rank for Toast
            const rank = calculateMyRank(newOffer, competingOffers);
            updateToast = `Rank #${rank} · terms set @ ${effectiveApr}%`;
        } else {
            stampLabel = 'NEEDS INFO';
            updateToast = "Marked for Review";
        }

        // Apply State
        setState(prev => {
            const newLog: BankerActionLog = {
                id: Math.random().toString(36),
                itemId: currentItem.id,
                action,
                timestamp: Date.now(),
                newState: newState,
                previousState: prev.itemStateById[currentItem.id]
            };

            return {
                ...prev,
                // We don't increment index because we are popping from FilteredQueue (it disappears)
                itemStateById: { ...prev.itemStateById, [currentItem.id]: newState },
                offersById: newOffer ? { ...prev.offersById, [currentItem.id]: newOffer } : prev.offersById,
                actionLog: [...prev.actionLog, newLog]
            };
        });

        // Feedback
        setLastDecision({ action, label: stampLabel, timestamp: Date.now() });
        toast(updateToast, {
            action: { label: 'Undo', onClick: () => handleUndo() }
        });
        setAprNudge(0);
        setHighRiskDialogOpen(false); // Close dial if open

    }, [currentItem, effectiveApr, activeTemplate, competingOffers]);


    const handleSwipe = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
        if (locked) { toast.error("Locked!"); return; }
        if (!currentItem) return;

        if (direction === 'right') { // OFFER
            // Guardrail Check
            if ((currentItem.flags.missingVin || currentItem.flags.highValue || currentItem.flags.lowConfidence)) {
                setHighRiskDialogOpen(true);
                return;
            }
            executeAction('offer');
        } else if (direction === 'left') {
            executeAction('pass');
        } else if (direction === 'down') {
            executeAction('needs_info');
        } else {
            // Up = Custom
            executeAction('custom_offer'); // For MVP, just treats as offer using current settings
        }
    }, [locked, currentItem, executeAction]);

    const handleUndo = () => {
        if (locked) return;
        setState(prev => {
            if (prev.actionLog.length === 0) return prev;

            const lastLog = prev.actionLog[prev.actionLog.length - 1];
            const newLog = prev.actionLog.slice(0, -1);

            // Restore previous item state (or delete if none - means back to unseen)
            const newItemStateById = { ...prev.itemStateById };
            if (lastLog.previousState) {
                newItemStateById[lastLog.itemId] = lastLog.previousState;
            } else {
                delete newItemStateById[lastLog.itemId]; // Reverts to unseen, appears back in queue
            }

            // Restore previous offer
            const newOffersById = { ...prev.offersById };
            if (lastLog.action === 'offer') {
                delete newOffersById[lastLog.itemId];
            }

            return {
                ...prev,
                itemStateById: newItemStateById,
                offersById: newOffersById,
                actionLog: newLog
            };
        });
        toast("Undone");
        setLastDecision(null); // Clear stamp if undoing immediately
    };


    const handleBeatBest = (delta: number) => {
        // This is a special action: It updates the rate WITHOUT swiping yet? 
        // Or does it offer immediately? 
        // "updates the current offer APR (or active template APR) and immediately updates preview + rank."
        // "Usage: if we have an offer, it updates/resubmits."

        const newRate = Number((effectiveApr + delta).toFixed(2));
        // Hacky: Update nudge to achieve this rate
        const diff = newRate - activeTemplate.defaultApr;
        setAprNudge(diff);

        toast.success(`Rate adjusted to ${newRate}% to beat lead!`);
        // If we already offered, we should re-submit?
        // For now, let user swipe to confirm.
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeTab !== 'SWIPE') return;
            if (e.key === 'p') handleSwipe('left');
            if (e.key === 'o') handleSwipe('right');
            if (e.key === 's') handleSwipe('down');
            if (e.key === 'c') handleSwipe('up');
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') handleUndo();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSwipe, activeTab]);

    // Derived Stats
    const stats = useMemo(() => {
        let offered = 0, passed = 0, needsInfo = 0, totalApr = 0;
        Object.values(state.itemStateById).forEach(s => {
            if (s.status === 'offered' || s.status === 'custom_offer') {
                offered++;
                // Find offer
                const o = Object.values(state.offersById).find(o => o.itemId === s.myOfferId || o.itemId === state.queue.find(q => q.id === s.myOfferId)?.id); // Rough lookup
                // This lookup is messy without a direct map.
                // Simplified: use offered count.
            }
            if (s.status === 'passed') passed++;
            if (s.status === 'needs_info') needsInfo++;
        });

        // Avg APR calculation
        const offers = Object.values(state.offersById);
        const avgApr = offers.length > 0 ? offers.reduce((a, b) => a + b.apr, 0) / offers.length : 0;

        return { offered, passed, needsInfo, avgApr };
    }, [state.itemStateById, state.offersById]);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 pb-6 md:pb-0 font-sans">
            <Toaster position="bottom-center" />
            <KeyboardHintBar />

            <BankerHeader
                reviewedCount={Object.keys(state.itemStateById).length}
                totalCount={state.queue.length}
                stats={stats}
                onReviewClick={(highRisk) => {
                    setActiveTab('REVIEW');
                    // If highRisk=true, we could filter the review tab
                }}
                onSearchClick={() => toast('Cmd+K to search (Mock)')}
                autoAdvance={autoAdvance}
                onToggleAutoAdvance={() => setAutoAdvance(!autoAdvance)}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                highRiskOffersCount={0} // To implement: count offered items with risk
            />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-4 md:p-6 grid md:grid-cols-[1fr_300px] gap-6">

                {/* Center Column */}
                <div className="flex flex-col items-center">
                    {activeTab === 'SWIPE' ? (
                        <>
                            <SwipeInterface
                                currentItem={currentItem}
                                nextItem={nextItem}
                                competingOffers={competingOffers} // This regenerates per item
                                myOffer={currentItem ? state.offersById[currentItem.id] : undefined}
                                myRank={currentItem ? (state.offersById[currentItem.id] ? calculateMyRank(state.offersById[currentItem.id], competingOffers) : undefined) : undefined}
                                onSwipe={handleSwipe}
                                activeTemplateName={`${activeTemplate.name}`}
                                activeTemplateApr={effectiveApr}
                                isLocked={locked}
                                onBeatBest={handleBeatBest}
                                lastDecision={lastDecision}
                                onBeatBest={handleBeatBest}
                                lastDecision={lastDecision}
                                onAction={(action) => handleSwipe(action === 'pass' ? 'left' : 'right')}
                                onAction={(action) => handleSwipe(action === 'pass' ? 'left' : 'right')}
                                onAdjustRates={() => setShowTemplateOverlay(true)}
                                onViewSeller={() => setViewingSeller(true)}
                                onViewValuation={() => setViewingValuation(true)}
                            />

                            {/* Desktop Actions Row */}
                            {/* Desktop Actions Row - V2 Simplified */}
                            {/* Desktop Actions Row - V2 Simplified (Tight Mobile Layout) */}



                        </>
                    ) : (
                        <div className="w-full">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Review Log</h2>
                                <button onClick={() => setActiveTab('SWIPE')} className="text-blue-600 text-sm font-bold">Back to Queue</button>
                            </div>
                            <ReviewTable
                                actionLog={state.actionLog}
                                itemsById={state.queue.reduce((acc, i) => ({ ...acc, [i.id]: i }), {} as Record<string, BankerItem>)}
                                offersById={state.offersById}
                                isLocked={locked}
                                onEditOffer={() => setActiveTab('SWIPE')}
                            />
                        </div>
                    )}
                </div>

                {/* Right Rail: Templates (Desktop) */}
                <div className="hidden md:block space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Templates</h3>
                            {aprNudge !== 0 && (
                                <button onClick={() => setAprNudge(0)} className="text-[10px] text-red-500 font-bold hover:underline">Reset</button>
                            )}
                        </div>

                        <div className="space-y-2">
                            {BANKER_TEMPLATES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => { setActiveTemplateId(t.id); setAprNudge(0); }}
                                    className={`w-full text-left p-3 rounded-lg border transition-all group ${activeTemplateId === t.id
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm">{t.name}</span>
                                        <span className={`font-mono text-sm ${activeTemplateId === t.id ? 'text-blue-400' : 'text-slate-400'}`}>
                                            {t.id === activeTemplateId ? effectiveApr : t.defaultApr}%
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        {t.termMonths.map(m => (
                                            <span key={m} className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${activeTemplateId === t.id
                                                ? (m === t.defaultTerm ? 'bg-blue-600 text-white' : 'bg-white/20 text-white/70')
                                                : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {m}m
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Rate Nudges (V2) */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Adjust Rate</h4>
                                <span className="font-mono text-xs font-bold text-slate-700">{effectiveApr}%</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                <button onClick={() => setAprNudge(n => n - 0.2)} className="bg-green-50 text-green-700 font-mono text-xs font-bold py-2 rounded hover:bg-green-100 transition-colors">-0.2</button>
                                <button onClick={() => setAprNudge(n => n - 0.1)} className="bg-green-50 text-green-700 font-mono text-xs font-bold py-2 rounded hover:bg-green-100 transition-colors">-0.1</button>
                                <button onClick={() => setAprNudge(n => n + 0.1)} className="bg-red-50 text-red-700 font-mono text-xs font-bold py-2 rounded hover:bg-red-100 transition-colors">+0.1</button>
                                <button onClick={() => setAprNudge(n => n + 0.2)} className="bg-red-50 text-red-700 font-mono text-xs font-bold py-2 rounded hover:bg-red-100 transition-colors">+0.2</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* High Risk Dialog */}
                {currentItem && (
                    <HighRiskConfirmDialog
                        isOpen={highRiskDialogOpen}
                        onClose={() => setHighRiskDialogOpen(false)}
                        onConfirm={() => executeAction('offer', true)}
                        onNeedsInfo={() => executeAction('needs_info')}
                        item={currentItem}
                        riskReasons={
                            [
                                currentItem.flags.missingVin ? "Missing VIN" : null,
                                currentItem.flags.highValue ? "High Value Asset" : null,
                                currentItem.flags.lowConfidence ? "Low Data Confidence" : null
                            ].filter(Boolean) as string[]
                        }
                    />
                )}

                {/* Mobile Template Selector Overlay */}
                {showTemplateOverlay && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-[420px] rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200 relative">
                            <button
                                onClick={() => setShowTemplateOverlay(false)}
                                className="absolute top-3 right-3 z-10 p-2 text-slate-300 hover:text-slate-500 bg-white/80 backdrop-blur-sm rounded-full transition-colors"
                            >
                                <span className="sr-only">Close</span>
                                <span className="text-xl font-black leading-none">✕</span>
                            </button>

                            <div className="p-4 pt-10 space-y-2 max-h-[50vh] overflow-y-auto">
                                {BANKER_TEMPLATES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setActiveTemplateId(t.id);
                                            setAprNudge(0);
                                            // Don't close automatically anymore, let them lock it in
                                        }}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${activeTemplateId === t.id
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg transform scale-[1.02]'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-lg">{t.name}</span>
                                            <span className={`font-mono text-lg font-bold ${activeTemplateId === t.id ? 'text-blue-400' : 'text-slate-400'}`}>
                                                {t.id === activeTemplateId ? effectiveApr : t.defaultApr}%
                                            </span>
                                        </div>
                                        <div className="flex gap-1.5 mt-2">
                                            {t.termMonths.map(m => (
                                                <span key={m} className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wide ${activeTemplateId === t.id
                                                    ? (m === t.defaultTerm ? 'bg-blue-600 text-white' : 'bg-white/20 text-white/70')
                                                    : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {m} Mos
                                                </span>
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Rate Nudges (Mobile) */}
                            <div className="p-4 bg-slate-50 border-t border-slate-100">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Fine Tune Rate</h4>
                                    <span className="font-mono text-lg font-black text-slate-800">{effectiveApr}%</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    <button onClick={() => setAprNudge(n => n - 0.2)} className="bg-white border border-slate-200 text-slate-600 font-mono text-xs font-bold py-3 rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all">-0.2</button>
                                    <button onClick={() => setAprNudge(n => n - 0.1)} className="bg-white border border-slate-200 text-slate-600 font-mono text-xs font-bold py-3 rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all">-0.1</button>
                                    <button onClick={() => setAprNudge(n => n + 0.1)} className="bg-white border border-slate-200 text-slate-600 font-mono text-xs font-bold py-3 rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all">+0.1</button>
                                    <button onClick={() => setAprNudge(n => n + 0.2)} className="bg-white border border-slate-200 text-slate-600 font-mono text-xs font-bold py-3 rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all">+0.2</button>
                                </div>

                                <button
                                    onClick={() => { setShowTemplateOverlay(false); toast.success("Rate Locked"); }}
                                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-xl uppercase tracking-widest shadow-lg shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={24} className="mb-0.5" /> Lock It In
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Seller Profile Overlay */}
                {viewingSeller && (
                    <div className="fixed inset-0 z-[60] bg-white animate-in slide-in-from-right duration-300 overflow-y-auto">
                        <PublicProfile
                            seller={{
                                name: "Justin Rogers",
                                username: "justin_bid",
                                description: "I love buying and selling stuff on GarthBid.com. It's my favourite marketplace.",
                                character: 'HAMMER',
                                membershipTier: 'HAMMER',
                                listings: 24,
                                reviews: { score: 4.9, count: 128 },
                                soldPercent: 94,
                                pastSales: 156
                            }}
                            onBack={() => setViewingSeller(false)}
                            onContactSeller={() => toast.success("Opening chat with Justin...")}
                        />
                    </div>
                )}
                {/* Valuation Analysis Modal */}
                {viewingValuation && currentItem && (
                    <ValuationAnalysisModal
                        isOpen={viewingValuation}
                        onClose={() => setViewingValuation(false)}
                        itemTitle={currentItem.title}
                        estimatedValueLow={currentItem.estValueMin}
                        estimatedValueHigh={currentItem.estValueMax}
                    />
                )}

            </div>
        </div>
    );
};

export default BankerDashboard;
