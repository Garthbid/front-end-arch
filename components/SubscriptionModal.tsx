import React, { useState } from 'react';
import { Ticket, ArrowRight, ShieldCheck, Users, Zap, CheckCircle2 } from 'lucide-react';
import { COLORS } from '../constants';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: () => void;
  onContinueFree: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onJoin, onContinueFree }) => {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      {/* Immersive Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* The "Black Card" / Premium Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-300 border border-white/20 ring-1 ring-black/5">
        
        {/* Premium Header - Dynamic Gradient */}
        <div className="relative bg-[#224cff] pt-10 pb-8 px-6 text-center overflow-hidden">
             {/* Decorative Background Effects */}
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_#4f7aff_0%,_#224cff_100%)]" />
             <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
             <div className="absolute top-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
             
             {/* Social Proof Pill */}
             <div className="relative z-10 inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 mb-6 shadow-sm">
                <Users size={12} className="text-white" />
                <span className="text-[10px] font-bold text-white tracking-wide">Trusted by 12,400+ Members</span>
             </div>

             {/* Title Group */}
             <div className="relative z-10">
                 <h2 className="text-4xl font-display text-white italic tracking-tighter leading-none drop-shadow-sm mb-1">
                    BUYERS CLUB
                 </h2>
                 {/* Updated Copy: Utilitarian/Access focused */}
                 <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                    <Ticket size={14} className="text-[#ff5800]" fill="currentColor" /> All-Access Membership
                 </p>
             </div>
        </div>

        {/* Body Content */}
        <div className="p-6 bg-white relative">
            
            {/* Toggle Switch */}
            <div className="flex justify-center mb-6">
                <div className="bg-gray-100 p-1 rounded-xl flex items-center relative w-full max-w-[240px]">
                    <button 
                        onClick={() => setBillingCycle('MONTHLY')}
                        className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all z-10 ${billingCycle === 'MONTHLY' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Monthly
                    </button>
                    <button 
                        onClick={() => setBillingCycle('YEARLY')}
                        className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all z-10 relative ${billingCycle === 'YEARLY' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Yearly
                        <span className="absolute -top-3 -right-2 bg-[#ff5800] text-white text-[8px] px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">SAVE 20%</span>
                    </button>
                </div>
            </div>

            {/* Price Anchor */}
            <div className="flex items-end justify-center mb-8 gap-1.5 relative">
                <span className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                    {billingCycle === 'YEARLY' ? '$7' : '$9'}
                </span>
                <div className="flex flex-col mb-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide line-through decoration-red-400 decoration-2">
                         {billingCycle === 'YEARLY' ? '$12' : '$15'}
                    </span>
                    <span className="text-sm font-bold text-gray-500 leading-none">/mo</span>
                </div>
            </div>

            {/* Comparison Table (The Value Prop) */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100 space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-300 tracking-wider mb-2">
                    <span>Feature</span>
                    <div className="flex gap-4">
                        <span className="w-16 text-right">Industry</span>
                        <span className="w-16 text-right text-[#224cff]">Garth</span>
                    </div>
                </div>
                <ComparisonRow label="Buyer Fees" bad="15-25%" good="0%" />
                <ComparisonRow label="Seller Fees" bad="10-20%" good="0%" />
                <ComparisonRow label="Seller Contact" bad="Blocked" good="Direct" />
            </div>

            {/* Hero CTA Button with Shimmer */}
            <button 
                onClick={onJoin}
                className="group relative w-full py-4 rounded-2xl font-black text-white text-lg shadow-[0_8px_20px_rgba(34,76,255,0.3)] hover:shadow-[0_12px_28px_rgba(34,76,255,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden"
                style={{ backgroundColor: COLORS.primary }}
            >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-shimmer" />
                
                <span className="relative flex items-center justify-center gap-2 tracking-wide">
                   UNLOCK MEMBERSHIP <ArrowRight size={20} strokeWidth={3} />
                </span>
            </button>
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .group:hover .animate-shimmer {
                    animation: shimmer 1.2s infinite;
                }
            `}</style>

            {/* Trust Footer */}
            <div className="mt-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                    <ShieldCheck size={12} className="text-green-500" />
                    <span>Cancel Anytime</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                    <CheckCircle2 size={12} className="text-[#224cff]" />
                    <span>Contact + Pay Directly</span>
                </div>
            </div>

            {/* Secondary Option */}
            <button 
                onClick={onContinueFree}
                className="w-full mt-4 py-2 text-center text-[11px] font-bold text-gray-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
            >
                Continue for free
            </button>
        </div>
      </div>
    </div>
  );
};

const ComparisonRow: React.FC<{ label: string, bad: string, good: string }> = ({ label, bad, good }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</span>
        <div className="flex gap-4">
             <div className="w-16 text-right">
                <span className="text-xs font-bold text-gray-400 line-through decoration-gray-400/50">{bad}</span>
             </div>
             <div className="w-16 text-right">
                <span className="text-sm font-black text-[#00d26a]">{good}</span>
             </div>
        </div>
    </div>
);

export default SubscriptionModal;