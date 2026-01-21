import React, { useState } from 'react';
import { ArrowLeft, Crown, Check, Zap, Users, ShieldCheck, Star, Sparkles, Target, ArrowRight } from 'lucide-react';
import { COLORS } from '../constants';
import HammerClubRequestModal from './HammerClubRequestModal';

interface MembershipPageProps {
    onBack: () => void;
    onUpgrade: (tier: MembershipTier) => void;
}

type MembershipTier = 'none' | 'buyers' | 'sniper' | 'hammer';

const MembershipPage: React.FC<MembershipPageProps> = ({ onBack, onUpgrade }) => {
    const [activeTier, setActiveTier] = useState<MembershipTier>('none');
    const [isHammerModalOpen, setIsHammerModalOpen] = useState(false);

    const handleJoin = (tier: MembershipTier) => {
        if (tier === 'hammer') {
            setIsHammerModalOpen(true);
        } else {
            setActiveTier(tier);
            onUpgrade(tier);
        }
    };

    const handleHammerSubmit = () => {
        setIsHammerModalOpen(false);
        setActiveTier('hammer');
        onUpgrade('hammer');
    };

    const handleCancel = () => {
        setActiveTier('none');
        onUpgrade('none');
    };
    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #fafbfc 0%, #f1f5f9 100%)' }}>
            {/* Ambient background effects */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-30 pointer-events-none" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }} />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ background: COLORS.fireOrange }} />

            <div className="relative z-10 max-w-5xl mx-auto px-4 pt-[80px] pb-4 md:py-6">

                {/* Header - Minimal, elegant */}
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <button
                        onClick={onBack}
                        className="w-11 h-11 rounded-full border flex items-center justify-center transition-all active:scale-95 hover:bg-white hover:shadow-lg hover:border-transparent"
                        style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderColor: COLORS.border, color: COLORS.steelGray }}
                    >
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </button>
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.25em] bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text text-transparent">Choose your advantage</p>
                    </div>
                </div>

                {/* All Three Tiers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                    {/* Buyers Club */}
                    <div className="relative group">
                        {/* Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-slate-700 rounded-[36px] blur-lg opacity-10 group-hover:opacity-30 transition-all duration-500" />

                        <div
                            className="relative rounded-[32px] p-8 flex flex-col h-full transition-all duration-500 group-hover:-translate-y-2"
                            style={{
                                background: 'linear-gradient(165deg, #ffffff 0%, #f8fafc 100%)',
                                border: '1px solid rgba(226, 232, 240, 0.8)',
                                boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500"
                                    style={{
                                        background: '#2238ff',
                                        boxShadow: '0 10px 30px -5px rgba(0, 34, 255, 0.4)'
                                    }}
                                >
                                    <Crown size={26} strokeWidth={2} className="text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black" style={{ color: '#2238ff' }}>$25</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">/mo</span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-display uppercase italic mb-1" style={{ color: COLORS.textPrimary }}>💰 BUYERS CLUB</h3>
                            <p className="text-xs font-bold text-blue-600 mb-6 uppercase tracking-widest">Standard Advantage</p>

                            <div className="flex-grow space-y-4 mb-8">
                                <BenefitRow title="Access to GarthAI™" desc="World-class bidding intelligence to guide every decision." />
                                <BenefitRow title="Priority support" desc="Faster help when timing matters." />
                                <BenefitRow title="Platform fee: 5%" desc="Reduced from the standard 10% fee." />
                            </div>

                            {activeTier === 'buyers' ? (
                                <div className="text-center">
                                    <div
                                        className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm text-white flex items-center justify-center gap-2"
                                        style={{
                                            background: '#2238ff',
                                            boxShadow: '0 0 20px rgba(0, 34, 255, 0.4), 0 10px 30px -10px rgba(0, 34, 255, 0.5)'
                                        }}
                                    >
                                        <Check size={18} />
                                        MEMBERSHIP ACTIVE
                                    </div>
                                    <button
                                        onClick={handleCancel}
                                        className="mt-3 text-xs font-medium text-slate-400 hover:text-red-500 transition-colors underline-offset-2 hover:underline"
                                    >
                                        Cancel membership
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleJoin('buyers')}
                                    className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm text-white active:scale-[0.98] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2"
                                    style={{
                                        background: '#2238ff',
                                        boxShadow: '0 0 20px rgba(0, 34, 255, 0.4), 0 10px 30px -10px rgba(0, 34, 255, 0.5)'
                                    }}
                                >
                                    ENTER BUYERS CLUB
                                    <ArrowRight size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sniper Club - Military/Tactical Theme */}
                    <div className="relative group">
                        {/* Tactical badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                            <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg flex items-center gap-1.5"
                                style={{ background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)', boxShadow: '0 8px 20px -5px rgba(0,0,0,0.4)' }}>
                                <Target size={12} />
                                Most Popular
                            </div>
                        </div>

                        {/* Subtle tactical glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-zinc-700 rounded-[36px] blur-lg opacity-20 group-hover:opacity-40 transition-all duration-500" />

                        <div
                            className="relative rounded-[32px] p-8 flex flex-col h-full overflow-hidden transition-all duration-500 group-hover:-translate-y-2"
                            style={{
                                background: 'linear-gradient(165deg, #1f2937 0%, #111827 50%, #0f172a 100%)',
                                border: '1px solid rgba(75, 85, 99, 0.5)',
                                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
                            }}
                        >
                            {/* Camo-inspired pattern overlay */}
                            <div className="absolute inset-0 opacity-[0.08]"
                                style={{
                                    backgroundImage: `
                                        radial-gradient(ellipse 80px 60px at 20% 30%, #4b5563 0%, transparent 50%),
                                        radial-gradient(ellipse 60px 80px at 70% 20%, #374151 0%, transparent 50%),
                                        radial-gradient(ellipse 90px 70px at 40% 70%, #1f2937 0%, transparent 50%),
                                        radial-gradient(ellipse 70px 50px at 80% 80%, #4b5563 0%, transparent 50%),
                                        radial-gradient(ellipse 50px 70px at 10% 60%, #374151 0%, transparent 50%)
                                    `
                                }}
                            />

                            {/* Subtle scan line effect */}
                            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }} />

                            {/* Crosshair accent in corner */}
                            <div className="absolute top-4 right-4 w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity">
                                <div className="absolute top-1/2 left-0 w-full h-px bg-emerald-400" />
                                <div className="absolute left-1/2 top-0 h-full w-px bg-emerald-400" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-emerald-400" />
                            </div>

                            <div className="relative z-10 flex justify-between items-start mb-6">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500"
                                    style={{
                                        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                                        boxShadow: '0 10px 30px -5px rgba(6, 95, 70, 0.5)'
                                    }}
                                >
                                    <Target size={26} strokeWidth={2} className="text-emerald-300" />
                                </div>
                                <div className="text-right">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">$250</span>
                                        <span className="text-xs font-bold text-white/40 uppercase tracking-tight">/mo</span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="relative z-10 text-2xl font-display text-white uppercase italic mb-1">🔫 SNIPER CLUB</h3>
                            <p className="relative z-10 text-xs font-bold text-emerald-400 mb-6 uppercase tracking-widest">Precision Advantage</p>

                            <div className="relative z-10 flex-grow space-y-4 mb-8">
                                <BenefitRow title="Sniper Zone access" desc="Advanced tools for buyers who compete on timing and accuracy." dark />
                                <BenefitRow title="GarthAI Pro™ (exclusive)" desc="Advanced intelligence for faster, more precise decisions." dark highlight exclusive />
                                <BenefitRow title="Platform fee: 3.5%" desc="Reduced from the standard 10% fee." dark />
                            </div>

                            {activeTier === 'sniper' ? (
                                <div className="relative z-10 text-center">
                                    <div
                                        className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                                        style={{
                                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                            color: '#ffffff',
                                            boxShadow: '0 15px 40px -10px rgba(5, 150, 105, 0.5)'
                                        }}
                                    >
                                        <Check size={18} />
                                        MEMBERSHIP ACTIVE
                                    </div>
                                    <button
                                        onClick={handleCancel}
                                        className="mt-3 text-xs font-medium text-white/50 hover:text-red-400 transition-colors underline-offset-2 hover:underline"
                                    >
                                        Cancel membership
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleJoin('sniper')}
                                    className="relative z-10 w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm active:scale-[0.98] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2"
                                    style={{
                                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                        color: '#ffffff',
                                        boxShadow: '0 15px 40px -10px rgba(5, 150, 105, 0.5)'
                                    }}
                                >
                                    UPGRADE TO SNIPER
                                    <ArrowRight size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Hammer Club - Authority/Premium Theme */}
                    <div className="relative group">
                        {/* Elite badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                            <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/30 flex items-center gap-1.5">
                                <Sparkles size={12} className="animate-pulse" />
                                Elite
                            </div>
                        </div>

                        {/* Premium glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-[36px] blur-lg opacity-20 group-hover:opacity-50 transition-all duration-500" />

                        <div
                            className="relative rounded-[32px] p-8 flex flex-col h-full overflow-hidden transition-all duration-500 group-hover:-translate-y-2"
                            style={{
                                background: 'linear-gradient(165deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                                border: '1px solid rgba(251, 191, 36, 0.3)',
                                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
                            }}
                        >
                            {/* Animated gradient orbs */}
                            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }} />
                            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl opacity-20" style={{ background: '#3b82f6' }} />

                            {/* Subtle grid pattern */}
                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '20px 20px' }} />

                            <div className="relative z-10 flex justify-between items-start mb-6">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(239, 68, 68, 0.2) 100%)',
                                        boxShadow: '0 10px 30px -5px rgba(251, 191, 36, 0.3)'
                                    }}
                                >
                                    <Sparkles size={26} strokeWidth={2} className="text-amber-400 animate-pulse" />
                                </div>
                                <div className="text-right">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">$2500</span>
                                        <span className="text-xs font-bold text-white/40 uppercase tracking-tight">/mo</span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="relative z-10 text-2xl font-display text-white uppercase italic mb-1">🔨 HAMMER CLUB</h3>
                            <p className="relative z-10 text-xs font-bold text-amber-400 mb-6 uppercase tracking-widest">Authority Advantage</p>

                            <div className="relative z-10 flex-grow space-y-4 mb-8">
                                <BenefitRow title="Private weekly strategy briefing" desc="Closed-door analysis of real marketing data, AI leverage, and what's driving results — skills you can apply beyond Garthbid." dark />
                                <BenefitRow title="Hammer Club command channel" desc="A private space for top operators to collaborate, influence platform priorities, and sharpen strategy together." dark />
                                <BenefitRow title="Platform fee: 2.25%" desc="Preferred rate." dark highlight />
                            </div>

                            {activeTier === 'hammer' ? (
                                <div className="relative z-10 text-center">
                                    <div
                                        className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                                        style={{
                                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                            color: '#0f172a',
                                            boxShadow: '0 15px 40px -10px rgba(251, 191, 36, 0.5)'
                                        }}
                                    >
                                        <Check size={18} />
                                        MEMBERSHIP ACTIVE
                                    </div>
                                    <button
                                        onClick={handleCancel}
                                        className="mt-3 text-xs font-medium text-white/50 hover:text-red-400 transition-colors underline-offset-2 hover:underline"
                                    >
                                        Cancel membership
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleJoin('hammer')}
                                    className="relative z-10 w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm active:scale-[0.98] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2"
                                    style={{
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                        color: '#0f172a',
                                        boxShadow: '0 15px 40px -10px rgba(251, 191, 36, 0.5)'
                                    }}
                                >
                                    REQUEST ACCESS
                                    <ArrowRight size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer note */}
                <div className="mt-16 text-center">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">All plans include a 30-day money-back guarantee</p>
                    <button className="text-[10px] font-black hover:text-slate-700 uppercase tracking-[0.2em] transition-colors underline-offset-4 hover:underline" style={{ color: COLORS.steelGray }}>
                        Compare all features
                    </button>
                </div>

            </div>

            {/* Hammer Club Request Modal */}
            <HammerClubRequestModal
                isOpen={isHammerModalOpen}
                onClose={() => setIsHammerModalOpen(false)}
                onSubmit={handleHammerSubmit}
            />
        </div>
    );
};

// Compact benefit row for tier cards
const BenefitRow = ({ title, desc, dark = false, highlight = false, exclusive = false }: { title: string, desc: string, dark?: boolean, highlight?: boolean, exclusive?: boolean }) => {
    // Determine if this is Sniper (emerald) or Hammer (amber) based on title content
    const isSniper = title.includes('Sniper') || title.includes('GarthAI Pro') || title.includes('3.5%');
    const checkColor = dark ? (isSniper ? 'bg-emerald-400/20 text-emerald-400' : 'bg-amber-400/20 text-amber-400') : 'bg-blue-100 text-blue-600';
    const highlightBg = dark ? (isSniper ? 'bg-emerald-400/10' : 'bg-white/5') : 'bg-blue-50';

    // Exclusive styling for premium features
    const exclusiveTitleClass = exclusive ? (dark ? 'text-emerald-300' : 'text-blue-700') : (dark ? 'text-white' : 'text-slate-900');
    const exclusiveGlow = exclusive ? 'drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' : '';

    return (
        <div className={`flex gap-3 ${highlight ? 'p-3 rounded-xl ' + highlightBg : ''}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${checkColor} ${exclusive ? 'ring-1 ring-emerald-400/30' : ''}`}>
                <Check size={12} strokeWidth={3} />
            </div>
            <div>
                <h4 className={`text-sm font-bold mb-0.5 ${exclusiveTitleClass} ${exclusiveGlow}`}>{title}</h4>
                <p className={`text-xs leading-relaxed ${dark ? 'text-white/50' : 'text-slate-500'}`}>{desc}</p>
            </div>
        </div>
    );
};

export default MembershipPage;
