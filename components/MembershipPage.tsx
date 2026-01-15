import React from 'react';
import { ArrowLeft, Crown, Check, Zap, Users, ShieldCheck, Star, Sparkles } from 'lucide-react';
import { COLORS } from '../constants';

interface MembershipPageProps {
    onBack: () => void;
}

const MembershipPage: React.FC<MembershipPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen md:p-8 animate-in fade-in duration-500" style={{ background: COLORS.voidBlack }}>
            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-95 hover:bg-slate-100"
                        style={{ background: COLORS.surface1, borderColor: COLORS.border, color: COLORS.steelGray }}
                    >
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </button>
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: COLORS.steelGray }}>Choose your advantage</p>
                    </div>
                </div>

                {/* Current Plan Section */}
                <div className="rounded-[32px] border p-8 mb-10 shadow-sm relative overflow-hidden"
                    style={{ background: COLORS.surface1, borderColor: COLORS.border }}>
                    <div className="absolute top-0 right-0 p-8">
                        <div className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border flex items-center gap-2"
                            style={{ background: `${COLORS.fireOrange}10`, color: COLORS.fireOrange, borderColor: `${COLORS.fireOrange}30` }}>
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: COLORS.fireOrange }} />
                            ACTIVE PLAN
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
                            style={{ background: COLORS.fireOrange }}>
                            <Crown size={40} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-display uppercase italic leading-none mb-2" style={{ color: COLORS.textPrimary }}>BUYERS CLUB</h2>
                            <p className="font-medium" style={{ color: COLORS.steelGray }}>Your account is currently billed <span className="font-bold" style={{ color: COLORS.textPrimary }}>$10/month</span>.</p>
                            <div className="flex gap-4 mt-6">
                                <button className="text-xs font-black hover:text-red-500 uppercase tracking-widest transition-colors" style={{ color: COLORS.textMuted }}>
                                    Cancel Membership
                                </button>
                                <span className="w-1 h-1 rounded-full my-auto" style={{ background: COLORS.border }} />
                                <button className="text-xs font-black hover:text-blue-700 uppercase tracking-widest transition-colors" style={{ color: COLORS.fireOrange }}>
                                    Change Billing Cycle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upgrade Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* The Sniper Club */}
                    <div className="rounded-[32px] border p-8 flex flex-col hover:shadow-xl transition-all group"
                        style={{ background: COLORS.surface1, borderColor: COLORS.border }}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform" style={{ background: COLORS.surface2, color: COLORS.steelGray }}>
                                {/* Using Users as placeholder for Target/Sniper icon if Target isn't imported, but assuming standard lucide icons are available or use Users/Star */}
                                <Users size={24} strokeWidth={2.5} />
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black" style={{ color: COLORS.textPrimary }}>$100</span>
                                <span className="text-xs font-bold uppercase tracking-tight ml-1" style={{ color: COLORS.steelGray }}>/mo</span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-display uppercase italic mb-2" style={{ color: COLORS.textPrimary }}>🔫 THE SNIPER CLUB</h3>
                        <p className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-wide">For buyers who don’t miss.</p>

                        <div className="flex-grow space-y-6 mb-8">
                            <BenefitBlock
                                title="Sniper Zone Access"
                                desc="A custom-built advantage layer designed for serious buyers who want to win more and overpay less."
                            />
                            <BenefitBlock
                                title="10× GarthAI Power"
                                desc="Deeper price intelligence, sharper signals, faster decisions."
                            />
                            <BenefitBlock
                                title="Reduced Platform Fees"
                                desc="3.5% per transaction — permanently."
                            />
                        </div>

                        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                            <p className="text-[10px] font-display text-slate-600">"Precision beats speed. Snipers win quietly."</p>
                        </div>

                        <button
                            disabled
                            className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm border opacity-60 cursor-not-allowed"
                            style={{ background: COLORS.surface1, borderColor: COLORS.border, color: COLORS.textPrimary }}
                        >
                            COMING SOON
                        </button>
                    </div>

                    {/* The Hammer Club */}
                    <div className="rounded-[32px] p-8 flex flex-col relative overflow-hidden shadow-2xl hover:scale-[1.02] transition-all group border border-slate-900"
                        style={{ background: '#0F172A' }}>
                        {/* Decoration */}
                        <div className="absolute top-0 right-0 w-40 h-40 blur-3xl rounded-full -mr-16 -mt-16 opacity-30" style={{ background: COLORS.fireOrange }} />

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center backdrop-blur-md border border-white/10">
                                <Sparkles size={24} strokeWidth={2.5} className="animate-pulse" style={{ color: COLORS.fireOrange }} />
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-white">$1000</span>
                                <span className="text-xs font-bold text-white/40 uppercase tracking-tight ml-1">/mo</span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-display text-white uppercase italic mb-2 relative z-10">🔨 THE HAMMER CLUB</h3>
                        <p className="text-sm font-bold text-white/60 mb-6 uppercase tracking-wide relative z-10">For operators who move markets.</p>

                        <div className="flex-grow space-y-6 mb-8 relative z-10">
                            <BenefitBlock
                                title="Private Weekly Live Stream"
                                desc="Advanced, real-world auction marketing tactics. What actually works. No fluff."
                                dark
                            />
                            <BenefitBlock
                                title="Hammer Club Elite Network"
                                desc="Direct access to top sellers, operators, and deal-makers."
                                dark
                            />
                            <BenefitBlock
                                title="Ultra-Low Platform Fees"
                                desc="2.25% on every transaction."
                                dark
                            />
                        </div>

                        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-center relative z-10">
                            <p className="text-[10px] font-display text-white/80">"When the hammer drops, you control the room."</p>
                        </div>

                        <button
                            disabled
                            className="w-full py-4 bg-white/50 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-sm relative z-10 cursor-not-allowed"
                        >
                            COMING SOON
                        </button>
                    </div>
                </div>

                {/* Comparison or Free Plan mention (subtle) */}
                <div className="mt-12 text-center">
                    <button className="text-[10px] font-black hover:text-slate-900 uppercase tracking-[0.2em] transition-colors" style={{ color: COLORS.steelGray }}>
                        Downgrade to Free Version
                    </button>
                </div>

            </div>
        </div>
    );
};

const BenefitBlock = ({ title, desc, dark = false }: { title: string, desc: string, dark?: boolean }) => (
    <div>
        <h4 className={`text-sm font-bold uppercase tracking-wide mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
        <p className={`text-xs leading-relaxed ${dark ? 'text-white/60' : 'text-slate-500'}`}>{desc}</p>
    </div>
);

export default MembershipPage;
