import React, { useState, useEffect } from 'react';
import { Ticket, ArrowRight, Check, Crown, X } from 'lucide-react';
import { COLORS } from '../constants';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoin: () => void;
    onContinueFree: () => void;
    highlightAI?: boolean;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
    isOpen,
    onClose,
    onJoin,
    highlightAI = false
}) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Card - Buyers Club Only */}
            <div className="relative w-full max-w-sm bg-white rounded-[32px] p-6 md:p-8 shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-300 scale-100">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100/80 text-slate-400 hover:text-slate-600 transition-colors z-20"
                >
                    <X size={20} />
                </button>

                {/* Header Row */}
                <div className="flex justify-between items-start mb-6">
                    {/* Crown Icon Box */}
                    <div
                        className="w-16 h-16 rounded-3xl flex items-center justify-center transform transition-all duration-500 hover:rotate-6 hover:scale-105"
                        style={{
                            background: '#2238ff',
                            boxShadow: '0 8px 24px -4px rgba(34, 56, 255, 0.4)'
                        }}
                    >
                        <Crown size={30} strokeWidth={1.5} className="text-white" />
                    </div>

                    {/* Price */}
                    <div className="text-right">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-[#2238ff] tracking-tight">$25</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">/mo</span>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-8">
                    <h2 className="text-3xl font-display italic font-black uppercase tracking-tighter text-slate-900 mb-1">
                        💰 BUYERS CLUB
                    </h2>
                    <p className="text-[11px] font-bold text-[#2238ff] uppercase tracking-[0.2em]">Standard Advantage</p>
                </div>

                {/* Benefits List */}
                <div className="space-y-4 mb-8">
                    {/* GarthAI - Highlighted Conditionally */}
                    <div className={`transition-all duration-1000 ${highlightAI ? 'scale-[1.02]' : ''}`}>
                        <BenefitRow
                            title="Access to GarthAI™"
                            desc="World-class bidding intelligence to guide every decision."
                            isHighlighted={highlightAI}
                        />
                    </div>
                    <BenefitRow title="Priority support" desc="Faster help when timing matters." />
                    <BenefitRow title="Platform fee: 5%" desc="Reduced from the standard 10% fee." />
                </div>

                {/* Primary Action Button */}
                <button
                    onClick={onJoin}
                    className="group relative w-full py-4 rounded-2xl font-black text-white text-sm tracking-widest uppercase shadow-[0_10px_30px_-5px_rgba(34,56,255,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(34,56,255,0.5)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
                    style={{
                        background: '#2238ff',
                    }}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        ENTER BUYERS CLUB <ArrowRight size={18} strokeWidth={3} />
                    </span>
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-shimmer" />
                </button>

                <style>{`
                    @keyframes shimmer {
                        100% { transform: translateX(100%); }
                    }
                    .group:hover .animate-shimmer {
                        animation: shimmer 1s infinite;
                    }
                `}</style>
            </div>
        </div>
    );
};

// Benefit Row Component
const BenefitRow = ({ title, desc, isHighlighted = false }: { title: string, desc: string, isHighlighted?: boolean }) => {
    return (
        <div className={`flex gap-3.5 items-start p-2 -mx-2 rounded-xl transition-all duration-500 ${isHighlighted ? 'bg-blue-50/80 ring-1 ring-blue-200 shadow-sm' : ''}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-500 ${isHighlighted ? 'bg-[#2238ff] text-white shadow-md scale-110' : 'bg-blue-100 text-[#2238ff]'}`}>
                <Check size={14} strokeWidth={isHighlighted ? 3 : 2.5} />
            </div>
            <div>
                <h4 className={`text-[15px] font-bold mb-0.5 transition-colors duration-500 ${isHighlighted ? 'text-[#2238ff]' : 'text-slate-900'}`}>
                    {title}
                </h4>
                <p className="text-[13px] leading-snug text-slate-500 font-medium">{desc}</p>
            </div>
        </div>
    );
};

export default SubscriptionModal;