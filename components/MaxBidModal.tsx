import React, { useState } from 'react';
import { X, Zap, ShieldCheck } from 'lucide-react';
import { COLORS } from '../constants';

interface MaxBidModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentBid: number;
    itemTitle: string;
    itemImage: string;
    onSubmit: (amount: number) => void;
    financingState?: {
        unlocked: boolean;
        apr: number | null;
    };
    hasLoanStructure?: boolean;
}

const MaxBidModal: React.FC<MaxBidModalProps> = ({
    isOpen,
    onClose,
    currentBid,
    itemTitle,
    itemImage,
    onSubmit,
    financingState,
    hasLoanStructure
}) => {
    const [bidAmount, setBidAmount] = useState<string>('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(bidAmount.replace(/[^0-9.]/g, ''));
        if (amount > currentBid) {
            onSubmit(amount);
            onClose();
        }
    };

    const isFinancing = financingState?.unlocked && hasLoanStructure;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200"
                style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            >
                {/* Header Image */}
                <div className="h-32 w-full relative">
                    <img
                        src={itemImage}
                        alt={itemTitle}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-all border border-white/10"
                    >
                        <X size={16} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-2 text-amber-500 font-bold uppercase tracking-widest text-[10px]">
                        <Zap size={14} fill="currentColor" />
                        <span>{isFinancing ? 'Max Bi-Weekly Payment' : 'High Velocity Mode'}</span>
                    </div>

                    <h2 className="text-2xl font-display text-slate-900 mb-2 leading-tight">
                        {isFinancing ? 'Set your max payment.' : 'Set your maximum bid.'}
                    </h2>

                    <h3 className="text-sm font-bold text-slate-700 mb-6">
                        {isFinancing
                            ? "Enter the highest bi-weekly payment you're willing to pay."
                            : "Enter the highest price you're willing to pay for this item."
                        }
                    </h3>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                {isFinancing ? 'MAXIMUM BI-WEEKLY PAYMENT' : 'MAXIMUM BID'}
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">$</span>
                                <input
                                    type="text"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    placeholder={isFinancing ? "1,250" : "125,100"}
                                    className="w-full pl-8 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-300"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* What happens next section */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="flex items-center gap-2 mb-3">
                                <ShieldCheck size={16} className="text-slate-400" />
                                <span className="font-bold text-xs uppercase text-slate-500 tracking-wider">What happens next</span>
                            </div>
                            <ul className="space-y-2">
                                {[
                                    "Garth automatically places bids on your behalf",
                                    "Bids are placed only when another bidder bids",
                                    "We never bid above your maximum",
                                    "You don't need to watch the auction",
                                    "If you win, you pay the lowest price required",
                                    "Your maximum bid is never shown to other bidders"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                                        <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            type="submit"
                            disabled={!bidAmount || parseFloat(bidAmount) <= currentBid}
                            className="w-full py-4 rounded-xl font-black text-white text-lg tracking-wide hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                            style={{ background: COLORS.fireOrange }}
                        >
                            START AUTO BIDDING
                        </button>
                    </form>

                    <p className="text-center text-[10px] text-slate-400 mt-6 font-medium">
                        You're always in control. You can disable Auto-Bid at any time.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MaxBidModal;
