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
                        <h1 className="text-3xl font-display uppercase italic tracking-tight" style={{ color: COLORS.textPrimary }}>Your Membership</h1>
                        <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: COLORS.steelGray }}>Manage your GarthBid status</p>
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
                            <p className="font-medium" style={{ color: COLORS.steelGray }}>Your account is currently billed <span className="font-bold" style={{ color: COLORS.textPrimary }}>$9.00/month</span>.</p>
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

                    {/* The Masters Club */}
                    <div className="rounded-[32px] border p-8 flex flex-col hover:shadow-xl transition-all group"
                        style={{ background: COLORS.surface1, borderColor: COLORS.border }}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: COLORS.surface2, color: COLORS.steelGray }}>
                                <Star size={24} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black" style={{ color: COLORS.textPrimary }}>$19</span>
                                <span className="text-xs font-bold uppercase tracking-tight ml-1" style={{ color: COLORS.steelGray }}>/mo</span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-display uppercase italic mb-4" style={{ color: COLORS.textPrimary }}>THE MASTERS CLUB</h3>

                        <ul className="space-y-4 mb-10 flex-grow">
                            <BenefitItem icon={Check} label="Ad-Free Experience" />
                            <BenefitItem icon={Zap} label="2.5x more Garthbucks/action" />
                            <BenefitItem icon={ShieldCheck} label="Priority Support" />
                        </ul>

                        <button
                            className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all active:scale-[0.98] border shadow-sm hover:shadow-md hover:bg-slate-50"
                            style={{ background: COLORS.surface1, borderColor: COLORS.border, color: COLORS.textPrimary }}
                        >
                            Upgrade to Masters
                        </button>
                    </div>

                    {/* The Auctioneer Club */}
                    <div className="rounded-[32px] p-8 flex flex-col relative overflow-hidden shadow-2xl hover:scale-[1.02] transition-all group border border-slate-900"
                        style={{ background: '#0F172A' }}>
                        {/* Decoration */}
                        <div className="absolute top-0 right-0 w-40 h-40 blur-3xl rounded-full -mr-16 -mt-16 opacity-30" style={{ background: COLORS.fireOrange }} />

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center backdrop-blur-md border border-white/10">
                                <Sparkles size={24} strokeWidth={2.5} className="animate-pulse" style={{ color: COLORS.fireOrange }} />
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-white">$69</span>
                                <span className="text-xs font-bold text-white/40 uppercase tracking-tight ml-1">/mo</span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-display text-white uppercase italic mb-4 relative z-10">THE AUCTIONEER</h3>

                        <ul className="space-y-4 mb-10 flex-grow relative z-10">
                            <BenefitItem icon={Check} label="10x Garthbucks/action" dark />
                            <BenefitItem icon={Users} label="Exclusive elite community" dark />
                            <BenefitItem icon={ShieldCheck} label="Highest Priority Support" dark />
                            <BenefitItem icon={Crown} label="Custom Profile Badge" dark />
                        </ul>

                        <button
                            className="w-full py-4 bg-white hover:bg-blue-50 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-sm transition-all active:scale-[0.98] shadow-lg relative z-10"
                        >
                            Become an Auctioneer
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

const BenefitItem = ({ icon: Icon, label, dark = false }: { icon: any, label: string, dark?: boolean }) => (
    <li className="flex items-center gap-3">
        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${dark ? 'bg-white/10' : 'bg-slate-100'}`} style={{ color: dark ? COLORS.fireOrange : COLORS.steelGray }}>
            <Icon size={12} strokeWidth={3} />
        </div>
        <span className={`text-sm font-bold tracking-tight ${dark ? 'text-white/80' : 'text-slate-500'}`}>
            {label}
        </span>
    </li>
);

export default MembershipPage;
