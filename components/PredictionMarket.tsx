import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Target, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { AuctionItem } from '../types';
import { COLORS } from '../constants';
import { useEarnGBX } from './GBXAnimationProvider';

// ============================================
// TYPES
// ============================================

interface Prediction {
    username: string;
    predictedPrice: number;
    wagerAmount: number;
    timestamp: number;
    isOwn?: boolean;
}

interface PredictionMarketProps {
    item: AuctionItem;
}

// ============================================
// MOCK PLAYER GENERATION
// ============================================

const MOCK_USERNAMES = [
    '@sniper_elite', '@deal_hunter', '@farm_king_88', '@auction_ace',
    '@bid_master', '@price_guru', '@lucky_strike', '@deep_value',
    '@hammer_time', '@lot_shark', '@penny_wise', '@bull_runner',
];

function seededRandom(seed: string): () => number {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    }
    return () => {
        h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
        h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
        h = (h ^ (h >>> 16)) >>> 0;
        return h / 4294967296;
    };
}

function generateMockPredictions(itemId: string, currentBid: number): Prediction[] {
    const rand = seededRandom(itemId);
    const count = Math.floor(rand() * 8) + 5; // 5-12 predictions
    const predictions: Prediction[] = [];

    for (let i = 0; i < count; i++) {
        const variance = (rand() - 0.5) * 2 * currentBid * 0.3; // ±30% of current bid
        const predictedPrice = Math.max(1, Math.round(currentBid + variance));
        const wagerAmount = [5, 10, 15, 20, 25, 30, 50][Math.floor(rand() * 7)];
        predictions.push({
            username: MOCK_USERNAMES[i % MOCK_USERNAMES.length],
            predictedPrice,
            wagerAmount,
            timestamp: Date.now() - Math.floor(rand() * 3600000),
        });
    }

    return predictions;
}

// Pre-computed coin burst offsets (avoid Math.random in render)
const COIN_OFFSETS = [
    { y: -38, x: -22 }, { y: -45, x: 15 }, { y: -32, x: -8 },
    { y: -50, x: 25 }, { y: -35, x: -18 }, { y: -42, x: 10 },
];

// ============================================
// COMPONENT
// ============================================

const PredictionMarket: React.FC<PredictionMarketProps> = ({ item }) => {
    const { gbxBalance, spendGBX, addGBX } = useEarnGBX();

    // Local state
    const [priceInput, setPriceInput] = useState('');
    const [wagerInput, setWagerInput] = useState('');
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [myPrediction, setMyPrediction] = useState<Prediction | null>(null);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [justLocked, setJustLocked] = useState(false);
    const [error, setError] = useState('');

    const storageKeyAll = `gbx_predictions_${item.id}`;
    const storageKeyMine = `gbx_my_prediction_${item.id}`;

    // Check if auction ended
    const isResolved = item.endsAt.getTime() <= Date.now();

    // Initialize from localStorage + seed mocks
    useEffect(() => {
        const storedAll = localStorage.getItem(storageKeyAll);
        const storedMine = localStorage.getItem(storageKeyMine);

        try {
            if (storedAll) {
                setPredictions(JSON.parse(storedAll));
            } else {
                const mocks = generateMockPredictions(item.id, item.currentBid);
                setPredictions(mocks);
                localStorage.setItem(storageKeyAll, JSON.stringify(mocks));
            }

            if (storedMine) {
                setMyPrediction(JSON.parse(storedMine));
            }
        } catch {
            const mocks = generateMockPredictions(item.id, item.currentBid);
            setPredictions(mocks);
            localStorage.setItem(storageKeyAll, JSON.stringify(mocks));
        }
    }, [item.id, storageKeyAll, storageKeyMine]);

    // Pool total
    const poolTotal = useMemo(() => {
        let total = predictions.reduce((sum, p) => sum + p.wagerAmount, 0);
        if (myPrediction) total += myPrediction.wagerAmount;
        return total;
    }, [predictions, myPrediction]);

    const totalPredictions = predictions.length + (myPrediction ? 1 : 0);

    // Combine all predictions with user's marked
    const allPredictions = useMemo(() => {
        const all = [...predictions];
        if (myPrediction) all.push({ ...myPrediction, username: 'You', isOwn: true });
        return all;
    }, [predictions, myPrediction]);

    // Leaderboard: sorted by wager descending
    const leaderboard = useMemo(() => {
        return [...allPredictions].sort((a, b) => b.wagerAmount - a.wagerAmount).slice(0, 5);
    }, [allPredictions]);

    // Resolution: find winner (closest to currentBid as "hammer price")
    const winner = useMemo(() => {
        if (!isResolved || allPredictions.length === 0) return null;
        return allPredictions.reduce((closest, p) =>
            Math.abs(p.predictedPrice - item.currentBid) < Math.abs(closest.predictedPrice - item.currentBid)
                ? p : closest
        );
    }, [isResolved, allPredictions, item.currentBid]);

    // Handle payout on resolution
    useEffect(() => {
        if (!isResolved || !winner || !myPrediction) return;
        const payoutKey = `gbx_prediction_paid_${item.id}`;
        if (localStorage.getItem(payoutKey)) return;

        if (winner.isOwn) {
            addGBX(poolTotal);
            localStorage.setItem(payoutKey, 'true');
        }
    }, [isResolved, winner, myPrediction, poolTotal, item.id, addGBX]);

    // Input handlers
    const handlePriceChange = (val: string) => {
        const cleaned = val.replace(/[^0-9]/g, '');
        setPriceInput(cleaned);
        setError('');
    };

    const handleWagerChange = (val: string) => {
        const cleaned = val.replace(/[^0-9]/g, '');
        setWagerInput(cleaned);
        setError('');
    };

    const handleQuickWager = (amount: number) => {
        const actual = amount === -1 ? gbxBalance : amount;
        setWagerInput(String(actual));
        setError('');
    };

    // Submit prediction
    const handleSubmit = useCallback(() => {
        const price = parseInt(priceInput, 10);
        const wager = parseInt(wagerInput, 10);

        if (!price || price <= 0) {
            setError('Enter a valid price prediction.');
            return;
        }
        if (!wager || wager < 1) {
            setError('Minimum wager is 1 GBX.');
            return;
        }
        if (wager > gbxBalance) {
            setError('Insufficient GBX balance.');
            return;
        }

        const success = spendGBX(wager);
        if (!success) {
            setError('Insufficient GBX balance.');
            return;
        }

        const prediction: Prediction = {
            username: '@you',
            predictedPrice: price,
            wagerAmount: wager,
            timestamp: Date.now(),
        };

        setMyPrediction(prediction);
        localStorage.setItem(storageKeyMine, JSON.stringify(prediction));

        setJustLocked(true);
        setShowLeaderboard(true);

        // Haptic feedback
        if (navigator.vibrate) {
            try { navigator.vibrate([50, 30, 50]); } catch { }
        }

        setTimeout(() => setJustLocked(false), 2000);
    }, [priceInput, wagerInput, gbxBalance, spendGBX, storageKeyMine]);

    // ============================================
    // RENDER
    // ============================================

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border overflow-hidden"
            style={{
                background: COLORS.surface1,
                borderColor: COLORS.border,
            }}
        >
            {/* Header */}
            <div
                className="px-5 py-4"
                style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(245, 158, 11, 0.15))',
                    borderBottom: `1px solid rgba(251, 191, 36, 0.2)`,
                }}
            >
                <div className="flex items-center gap-2 mb-1">
                    <Target size={18} className="text-amber-500" />
                    <span className="text-sm font-black uppercase tracking-wider" style={{ color: COLORS.textPrimary }}>
                        Price Prophet
                    </span>
                </div>
                <p className="text-xs" style={{ color: COLORS.textMuted }}>
                    Predict the hammer price. Win GBX.
                </p>
            </div>

            <div className="px-5 py-4 space-y-4">

                {/* Pool Display */}
                <div
                    className="rounded-xl p-4 text-center"
                    style={{
                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(217, 119, 6, 0.15))',
                        border: '1px solid rgba(251, 191, 36, 0.25)',
                    }}
                >
                    <motion.div
                        key={poolTotal}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-black tracking-tight"
                        style={{ color: COLORS.textPrimary }}
                    >
                        <span className="mr-1">🪙</span>
                        {poolTotal.toLocaleString()} GBX
                    </motion.div>
                    <div className="text-xs font-medium mt-1" style={{ color: COLORS.textMuted }}>
                        {totalPredictions} prediction{totalPredictions !== 1 ? 's' : ''} placed
                    </div>
                </div>

                {/* === RESOLVED STATE === */}
                {isResolved && (
                    <div className="space-y-3">
                        <div
                            className="rounded-xl p-4 text-center border"
                            style={{
                                background: winner?.isOwn
                                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.15))'
                                    : COLORS.surface2,
                                borderColor: winner?.isOwn
                                    ? 'rgba(16, 185, 129, 0.3)'
                                    : COLORS.border,
                            }}
                        >
                            <Trophy size={24} className="mx-auto mb-2 text-amber-500" />
                            <div className="text-sm font-bold mb-1" style={{ color: COLORS.textPrimary }}>
                                {winner ? (
                                    winner.isOwn ? 'You won!' : `${winner.username} won!`
                                ) : 'No predictions placed'}
                            </div>
                            {winner && (
                                <div className="text-xs" style={{ color: COLORS.textMuted }}>
                                    Predicted ${winner.predictedPrice.toLocaleString()} — Hammer: ${item.currentBid.toLocaleString()}
                                </div>
                            )}
                            {winner?.isOwn && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="mt-2 text-lg font-black text-emerald-600"
                                >
                                    +{poolTotal.toLocaleString()} GBX
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}

                {/* === LOCKED STATE === */}
                {!isResolved && myPrediction && (
                    <div className="space-y-3">
                        <motion.div
                            initial={justLocked ? { scale: 0.95 } : false}
                            animate={{ scale: 1 }}
                            className="rounded-xl p-4 border"
                            style={{
                                background: 'linear-gradient(135deg, rgba(34, 56, 255, 0.04), rgba(34, 56, 255, 0.08))',
                                borderColor: 'rgba(34, 56, 255, 0.2)',
                            }}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Lock size={14} className="text-blue-500" />
                                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.primary }}>
                                    Your Prediction — Locked
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-black tracking-tight" style={{ color: COLORS.textPrimary }}>
                                        ${myPrediction.predictedPrice.toLocaleString()}
                                    </div>
                                    <div className="text-xs font-medium mt-0.5" style={{ color: COLORS.textMuted }}>
                                        Wagered: 🪙 {myPrediction.wagerAmount} GBX
                                    </div>
                                </div>
                                <div className="text-right" title="Final winnings depend on pool size at close">
                                    <div className="text-xs font-medium cursor-help border-b border-dashed" style={{ color: COLORS.textMuted, borderColor: COLORS.textMuted }}>If you win</div>
                                    <div className="text-lg font-bold text-amber-600">
                                        ~{poolTotal.toLocaleString()} GBX
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Coin burst animation on lock */}
                        <AnimatePresence>
                            {justLocked && (
                                <motion.div
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.5 }}
                                    className="flex justify-center gap-1 -mt-2"
                                >
                                    {COIN_OFFSETS.map((offset, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ y: 0, opacity: 1, scale: 1 }}
                                            animate={{
                                                y: offset.y,
                                                x: offset.x,
                                                opacity: 0,
                                                scale: 0.5,
                                            }}
                                            transition={{ duration: 0.8, delay: i * 0.05 }}
                                            className="text-lg"
                                        >
                                            🪙
                                        </motion.span>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* === OPEN STATE === */}
                {!isResolved && !myPrediction && (
                    <div className="space-y-3">
                        {/* Price Input */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: COLORS.steelGray }}>
                                Your Prediction
                            </label>
                            <div
                                className="flex items-center rounded-xl border px-3 py-2.5 transition-colors focus-within:border-blue-400"
                                style={{ background: '#fff', borderColor: COLORS.border }}
                            >
                                <span className="text-lg font-bold mr-1" style={{ color: COLORS.textMuted }}>$</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={priceInput}
                                    onChange={(e) => handlePriceChange(e.target.value)}
                                    placeholder={item.currentBid.toLocaleString()}
                                    className="flex-1 text-xl font-bold bg-transparent outline-none"
                                    style={{ color: COLORS.textPrimary }}
                                />
                            </div>
                        </div>

                        {/* Wager Input */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: COLORS.steelGray }}>
                                Your Wager
                            </label>
                            <div
                                className="flex items-center rounded-xl border px-3 py-2.5 transition-colors focus-within:border-blue-400"
                                style={{ background: '#fff', borderColor: COLORS.border }}
                            >
                                <span className="text-base mr-1">🪙</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={wagerInput}
                                    onChange={(e) => handleWagerChange(e.target.value)}
                                    placeholder="0"
                                    className="flex-1 text-xl font-bold bg-transparent outline-none"
                                    style={{ color: COLORS.textPrimary }}
                                />
                                <span className="text-sm font-bold ml-1" style={{ color: COLORS.textMuted }}>GBX</span>
                            </div>
                            <div className="flex items-center justify-between mt-1.5">
                                <span className="text-[11px] font-medium" style={{ color: COLORS.textMuted }}>
                                    Balance: {gbxBalance} GBX
                                </span>
                                {/* Quick-pick chips */}
                                <div className="flex gap-1.5">
                                    {[5, 10, 25].map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => handleQuickWager(amt)}
                                            disabled={gbxBalance < amt}
                                            className="px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                                            style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}
                                        >
                                            {amt}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handleQuickWager(-1)}
                                        disabled={gbxBalance < 1}
                                        className="px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                                        style={{ borderColor: COLORS.border, color: COLORS.primary }}
                                    >
                                        ALL
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Potential winnings */}
                        {wagerInput && parseInt(wagerInput, 10) > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-center text-sm font-medium"
                                style={{ color: COLORS.textMuted }}
                            >
                                If you win: <span className="font-bold text-amber-600" title="Final winnings depend on pool size at close">~{(poolTotal + (parseInt(wagerInput, 10) || 0)).toLocaleString()} GBX</span>
                            </motion.div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="text-xs font-medium text-red-500 text-center">
                                {error}
                            </div>
                        )}

                        {/* CTA */}
                        <button
                            onClick={handleSubmit}
                            disabled={gbxBalance < 1}
                            className="relative w-full py-3.5 rounded-xl font-bold text-white text-base transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            style={{
                                background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                                boxShadow: '0 6px 20px rgba(217, 119, 6, 0.3)',
                            }}
                        >
                            {/* Shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <span className="relative flex items-center justify-center gap-2">
                                <Target size={18} />
                                LOCK IN PREDICTION
                            </span>
                        </button>

                        {gbxBalance < 1 && (
                            <p className="text-[11px] text-center font-medium" style={{ color: COLORS.textMuted }}>
                                Place bids to earn GBX, then wager here.
                            </p>
                        )}
                    </div>
                )}

                {/* === LEADERBOARD === */}
                {totalPredictions > 0 && (
                    <div>
                        <button
                            onClick={() => setShowLeaderboard(!showLeaderboard)}
                            className="flex items-center justify-between w-full py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:opacity-80"
                            style={{ color: COLORS.steelGray }}
                        >
                            <span>Leaderboard</span>
                            {showLeaderboard ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        <AnimatePresence>
                            {showLeaderboard && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-1 pt-1">
                                        {leaderboard.map((entry, i) => {
                                            const isUser = !!entry.isOwn;
                                            return (
                                                <motion.div
                                                    key={`${entry.username}-${i}`}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className={`flex items-center justify-between py-2 px-3 rounded-lg ${isUser ? 'border' : ''}`}
                                                    style={{
                                                        background: isUser ? 'rgba(34, 56, 255, 0.04)' : 'transparent',
                                                        borderColor: isUser ? 'rgba(34, 56, 255, 0.15)' : 'transparent',
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold w-5" style={{ color: COLORS.textMuted }}>
                                                            {i + 1}.
                                                        </span>
                                                        <span
                                                            className="text-xs font-bold"
                                                            style={{ color: isUser ? COLORS.primary : COLORS.textPrimary }}
                                                        >
                                                            {isUser ? 'You' : entry.username}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>
                                                            ${entry.predictedPrice.toLocaleString()}
                                                        </span>
                                                        <span className="text-[11px] font-bold text-amber-600">
                                                            {entry.wagerAmount} GBX
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PredictionMarket;
