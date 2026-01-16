import React from 'react';
import {
    AlertTriangle, Check, Info, ArrowRight, Lock, Flame, Scale, ShieldCheck, Zap, Clock
} from 'lucide-react';
import { COLORS } from '../constants';

interface ImportantDecisionModalProps {
    isOpen: boolean;
    itemValue: number;
    onSelectUnreserved: () => void;
    onSelectReserve: () => void;
    onClose: () => void;
    onRulesClick?: () => void;
}

const ImportantDecisionModal: React.FC<ImportantDecisionModalProps> = ({
    isOpen,
    itemValue,
    onSelectUnreserved,
    onSelectReserve,
    onClose,
    onRulesClick
}) => {
    if (!isOpen) return null;

    // Remove itemValue-based restriction as per request
    const isReserveEligible = true;

    return (
        <div className="fixed inset-0 z-[200] flex items-start sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`relative w-full max-w-4xl bg-white h-full sm:h-auto rounded-none sm:rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-top-full sm:zoom-in-95 sm:slide-in-from-bottom-0 duration-500 flex flex-col sm:max-h-[90vh]`} style={{ color: COLORS.textPrimary }}>

                {/* Attention Strip */}
                <div className="bg-amber-50 border-b border-amber-100 px-6 pt-[calc(env(safe-area-inset-top,20px)+12px)] pb-3 sm:py-3 flex items-center justify-center gap-2 sm:gap-3 flex-shrink-0">
                    <AlertTriangle size={14} className="text-amber-600 sm:w-[18px] sm:h-[18px]" />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-amber-900">Please read before continuing</span>
                </div>

                {/* Header */}
                <div className="px-6 sm:px-8 pt-6 sm:pt-10 pb-2 sm:pb-4 text-center max-w-2xl mx-auto flex-shrink-0">
                    <h2 className="text-3xl sm:text-5xl font-display text-slate-900 tracking-tight uppercase italic leading-none mb-3 sm:mb-4">
                        Important <span style={{ color: COLORS.primary }}>Decision</span>
                    </h2>
                    <p className="font-medium text-sm sm:text-base leading-tight px-4 sm:px-0" style={{ color: COLORS.textSecondary }}>
                        This choice affects risk, buyer excitement, and your final price.
                    </p>
                </div>

                {/* Options Area - Scrollable on mobile */}
                <div className="flex-grow overflow-y-auto no-scrollbar overscroll-contain flex flex-col">
                    <div className="px-5 sm:px-10 py-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                            {/* OPTION 1: UNRESERVED */}
                            <button
                                onClick={onSelectUnreserved}
                                className="group relative flex flex-col text-left p-6 sm:p-8 rounded-[28px] border-2 sm:border-4 border-transparent hover:bg-white transition-all hover:shadow-xl sm:hover:shadow-2xl hover:shadow-blue-500/10 active:scale-[0.98]"
                                style={{ background: COLORS.surface1 }}
                            >
                                {/* Recommended Badge */}
                                <div className="absolute -top-3 left-6 sm:left-8 text-white px-3 sm:px-4 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg z-10" style={{ background: COLORS.primary }}>
                                    Recommended
                                </div>

                                <div className="flex justify-between items-start mb-4 sm:mb-6">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform" style={{ background: `${COLORS.primary}15`, color: COLORS.primary }}>
                                        <Flame size={24} className="sm:w-[28px] sm:h-[28px]" strokeWidth={2.5} fill="currentColor" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs sm:text-sm font-black uppercase tracking-tight" style={{ color: COLORS.textPrimary }}>No Upfront Cost</div>
                                        <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest" style={{ color: COLORS.primary }}>Maximum Exposure</div>
                                    </div>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-display text-slate-900 uppercase italic mb-2 sm:mb-3">UNRESERVED</h3>
                                <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug mb-5 sm:mb-6">
                                    Item sells to the highest bidder when the timer ends. No exceptions.
                                </p>

                                <ul className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
                                    <DecisionBullet icon={Check} text="Legally committed to the hammer price" />
                                    <DecisionBullet icon={Zap} text="Real FOMO → higher final prices" iconColor={COLORS.primary} />
                                    <DecisionBullet icon={ShieldCheck} text="Maximum buyer trust and momentum" />
                                </ul>

                                <div className="mt-auto">
                                    <div className="w-full py-4 sm:py-4 text-white rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm text-center shadow-xl group-hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2" style={{ background: COLORS.primary }}>
                                        Post Unreserved <ArrowRight size={16} />
                                    </div>
                                    <p className="flex items-center justify-center gap-1.5 text-[10px] text-center mt-2" style={{ color: COLORS.textMuted }}>
                                        Variable platform fee applies only on a successful sale
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onClose();
                                                onRulesClick?.();
                                            }}
                                            className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                                            style={{ color: COLORS.textMuted }}
                                            title="Learn more about fees"
                                        >
                                            <Info size={12} />
                                        </button>
                                    </p>
                                </div>
                            </button>

                            {/* OPTION 2: RESERVE PROTECTION */}
                            <div className={`relative flex flex-col p-6 sm:p-8 rounded-[28px] border-2 sm:border-4 transition-all ${isReserveEligible ? 'bg-slate-50 border-transparent hover:border-slate-300 hover:bg-white cursor-pointer' : 'bg-slate-50 border-transparent opacity-70'}`}>
                                <div className="flex justify-between items-start mb-4 sm:mb-6">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center shadow-inner">
                                        <Lock size={24} className="sm:w-[28px] sm:h-[28px]" strokeWidth={2.5} />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight">$25 Upfront Fee</div>
                                        <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price Protection</div>
                                    </div>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-display text-slate-900 uppercase italic mb-2 sm:mb-3">RESERVED</h3>
                                <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug mb-5 sm:mb-6">
                                    Set a minimum price and stay in control of the final outcome.
                                </p>

                                <ul className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
                                    <DecisionBullet icon={Scale} text="Accept, reject, or counter the final offer" />
                                    <DecisionBullet icon={Clock} text="Less urgency for buyers" color="text-slate-400" />
                                    <DecisionBullet icon={ShieldCheck} text="Lower risk, but typically lower upside" />
                                </ul>

                                <div className="mt-auto">
                                    <div
                                        onClick={isReserveEligible ? onSelectReserve : undefined}
                                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-2 ${isReserveEligible ? 'bg-slate-900 text-white shadow-xl active:scale-[0.98]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                                    >
                                        Add Reserve ($25) <ArrowRight size={16} />
                                    </div>
                                    <p className="flex items-center justify-center gap-1.5 text-[10px] text-center mt-2" style={{ color: COLORS.textMuted }}>
                                        Variable platform fee applies if the item sells
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onClose();
                                                onRulesClick?.();
                                            }}
                                            className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                                            style={{ color: COLORS.textMuted }}
                                            title="Learn more about fees"
                                        >
                                            <Info size={12} />
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Helper - Now inside scroll area for natural flow */}
                    <div className="bg-slate-50 border-t border-slate-100 px-6 sm:px-8 py-8 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 pb-[calc(env(safe-area-inset-bottom,20px)+32px)] sm:pb-6 mt-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.primary }} />
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-500 tracking-widest italic text-center sm:text-left">Confident in demand? → Go unreserved</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full" />
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-500 tracking-widest italic text-center sm:text-left">Need a safety net? → Add reserve</span>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

const DecisionBullet = ({ icon: Icon, text, color = "text-slate-500", iconColor }: { icon: any, text: string, color?: string, iconColor?: string }) => (
    <li className="flex items-start gap-2.5 sm:gap-3">
        <Icon size={14} className={`${!iconColor ? color : ''} mt-0.5 flex-shrink-0 sm:w-[16px] sm:h-[16px]`} style={{ color: iconColor }} strokeWidth={3} />
        <span className="text-[11px] sm:text-xs font-bold text-slate-600 leading-tight">{text}</span>
    </li>
);

export default ImportantDecisionModal;
