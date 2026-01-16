import React, { useState, useEffect } from 'react';
import { Ticket, ArrowRight, ShieldCheck, CheckCircle2, Zap, Flame, Bot, Users, Lock, Unlock, Coins } from 'lucide-react';
import { COLORS } from '../constants';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoin: () => void;
    onContinueFree: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onJoin, onContinueFree }) => {
    const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
    const [isUnlocked, setIsUnlocked] = useState(false);

    // Reset and trigger animation on open
    useEffect(() => {
        if (isOpen) {
            setIsUnlocked(false);
            const timer = setTimeout(() => setIsUnlocked(true), 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/85 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Card - Compact for no-scroll mobile */}
            <div className="relative w-full max-w-sm bg-white rounded-[28px] shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-300">

                {/* Header - Compact with energy glow */}
                <div className="relative bg-[#2238ff] pt-5 pb-5 px-5 text-center overflow-hidden">
                    {/* Energy Glow Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#4f7aff_0%,_#2238ff_60%,_#1a3ad4_100%)]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-4 -left-8 w-28 h-28 bg-indigo-400/15 rounded-full blur-2xl" />

                    {/* Trust Pill */}
                    <div className="relative z-10 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20 mb-3">
                        <Users size={10} className="text-white/90" />
                        <span className="text-[9px] font-bold text-white/90 tracking-wide">Trusted by 5,400+ members</span>
                    </div>

                    {/* Lock Animation */}
                    <div className="relative z-10 mb-2 flex justify-center">
                        <div className={`transition-all duration-300 ${isUnlocked ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                            <Lock size={20} className="text-white/60" />
                        </div>
                        <div className={`absolute transition-all duration-300 ${isUnlocked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                            <Unlock size={20} className="text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="relative z-10">
                        <h2 className="text-3xl font-display text-white italic tracking-tighter leading-none drop-shadow-lg mb-0.5">
                            BUYERS CLUB
                        </h2>
                        <p className="text-blue-100/90 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 mb-2">
                            <Ticket size={12} className="text-[#ff5800]" fill="currentColor" /> All-Access Membership
                        </p>
                        <p className="text-white/70 text-[11px] font-medium italic">
                            This is where unreserved bidding lives.
                        </p>
                    </div>
                </div>

                {/* Body - Tight spacing */}
                <div className="px-5 pt-4 pb-5 bg-white">

                    {/* Toggle */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-gray-100 p-0.5 rounded-lg flex items-center w-full max-w-[200px]">
                            <button
                                onClick={() => setBillingCycle('MONTHLY')}
                                className={`flex-1 py-2 rounded-md text-[11px] font-black uppercase tracking-wide transition-all ${billingCycle === 'MONTHLY' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('YEARLY')}
                                className={`flex-1 py-2 rounded-md text-[11px] font-black uppercase tracking-wide transition-all ${billingCycle === 'YEARLY' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400'}`}
                            >
                                Yearly
                            </button>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-1">
                        <div className="flex items-end justify-center gap-1.5">
                            <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                                {billingCycle === 'YEARLY' ? '$100' : '$10'}
                            </span>
                            <div className="flex flex-col mb-1">
                                <span className="text-xs font-bold text-gray-400 line-through decoration-red-400 decoration-2">
                                    {billingCycle === 'YEARLY' ? '$200' : '$20'}
                                </span>
                                <span className="text-xs font-semibold text-gray-500">
                                    /{billingCycle === 'YEARLY' ? 'yr' : 'mo'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mb-4">
                        Most members recover this in a single win.
                    </p>

                    {/* 3 Features - Compact */}
                    <div className="space-y-2 mb-5">
                        <FeatureRow icon={<Zap size={14} />} keyword="Enter the Arena" rest=" — Bidding Unlocked" />
                        <FeatureRow icon={<Flame size={14} />} keyword="UNRESERVED Mondays" rest=" — A Weekly Chance at Life-Changing Deals" />
                        <FeatureRow icon={<Bot size={14} />} keyword="GarthAI™" rest=" — Real-Time Bidding Intelligence" />
                        <FeatureRow icon={<Coins size={14} />} keyword="Platform Fees" rest=" — Among the Lowest in the Industry" />
                    </div>

                    {/* Primary CTA */}
                    <button
                        onClick={onJoin}
                        className="group relative w-full py-3.5 rounded-2xl font-black text-white text-base tracking-wide shadow-[0_6px_20px_rgba(0,34,255,0.35)] hover:shadow-[0_10px_28px_rgba(0,34,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_4px_12px_rgba(0,34,255,0.3)] transition-all duration-200 overflow-hidden"
                        style={{
                            backgroundColor: COLORS.primary,
                            boxShadow: `0 6px 20px rgba(0,34,255,0.35), inset 0 1px 0 rgba(255,255,255,0.15)`
                        }}
                    >
                        {/* Shimmer */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-shimmer" />
                        <span className="relative flex items-center justify-center gap-2">
                            UNLOCK BUYERS CLUB <ArrowRight size={18} strokeWidth={3} />
                        </span>
                    </button>

                    <style>{`
            @keyframes shimmer {
              100% { transform: translateX(100%); }
            }
            .group:hover .animate-shimmer {
              animation: shimmer 1s infinite;
            }
          `}</style>

                    {/* Trust Row */}
                    <div className="mt-3 flex items-center justify-center gap-2 text-[9px] font-semibold text-gray-400">
                        <ShieldCheck size={10} className="text-green-500" />
                        <span>Cancel anytime</span>
                        <span className="text-gray-300">·</span>
                        <CheckCircle2 size={10} className="text-[#2238ff]" />
                        <span>Contact Sellers Directly</span>
                    </div>

                    {/* Continue Free */}
                    <button
                        onClick={onContinueFree}
                        className="w-full mt-3 py-1.5 text-center text-[10px] font-semibold text-gray-400 hover:text-gray-600 uppercase tracking-wider transition-colors"
                    >
                        Continue for free
                    </button>
                </div>
            </div>
        </div>
    );
};

// Compact feature row component
const FeatureRow: React.FC<{ icon: React.ReactNode; keyword: string; rest: string }> = ({ icon, keyword, rest }) => (
    <div className="flex items-center gap-2.5">
        <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `${COLORS.primary}12` }}
        >
            <span style={{ color: COLORS.primary }}>{icon}</span>
        </div>
        <p className="text-[12px] text-gray-600">
            <span className="font-bold text-slate-900">{keyword}</span>
            <span className="text-gray-500">{rest}</span>
        </p>
    </div>
);

export default SubscriptionModal;