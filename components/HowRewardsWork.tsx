import React from 'react';
import { ArrowLeft, Users, ShoppingCart, Store, Coins } from 'lucide-react';
import type { ViewState } from '../types';

interface HowRewardsWorkProps {
    onBack: () => void;
    onNavigate?: (view: ViewState) => void;
}

const HowRewardsWork: React.FC<HowRewardsWorkProps> = ({ onBack, onNavigate }) => {
    return (
        <div className="min-h-screen bg-slate-50 pb-24 animate-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-500" />
                    </button>
                    <h1 className="text-sm font-bold text-slate-900">How Rewards Work</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 md:px-8 pt-8">

                {/* Hero */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                        Invite Friends, Earn Garthbucks
                    </h2>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                        Share your link. When your friends join and participate, you both win.
                    </p>
                </div>

                {/* Reward cards — all same style */}
                <div className="space-y-3 mb-6">

                    {/* Sign Up */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#2238ff]/10 flex items-center justify-center">
                                <Users size={18} className="text-[#2238ff]" />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-900">Friend Signs Up</p>
                                <p className="text-xs text-slate-500">They create an account using your link</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-slate-900">125</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">GBX</p>
                        </div>
                    </div>

                    {/* First Purchase */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#2238ff]/10 flex items-center justify-center">
                                <ShoppingCart size={18} className="text-[#2238ff]" />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-900">First Purchase</p>
                                <p className="text-xs text-slate-500">They win their first auction</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-slate-900">125</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">GBX</p>
                        </div>
                    </div>

                    {/* First Sale */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#2238ff]/10 flex items-center justify-center">
                                <Store size={18} className="text-[#2238ff]" />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-900">First Sale</p>
                                <p className="text-xs text-slate-500">They complete their first sale</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-slate-900">250</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">GBX</p>
                        </div>
                    </div>

                </div>

                {/* Total */}
                <div className="p-4 rounded-2xl bg-[#2238ff] text-center mb-8">
                    <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold mb-1">Total Possible Per Referral</p>
                    <div className="flex items-baseline justify-center gap-2">
                        <span className="text-3xl font-bold text-white">500</span>
                        <span className="text-sm text-white/60 font-semibold uppercase">GBX</span>
                    </div>
                </div>

                {/* Urgency callout */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#ff5000]/5 border border-[#ff5000]/15 mb-8">
                    <span className="text-[#ff5000] text-lg mt-0.5">⚡</span>
                    <p className="text-sm text-slate-700">
                        <strong className="text-[#ff5000]">Act fast!</strong> Your friend must sign up right after clicking your link to earn the full 125 GBX signup reward.
                    </p>
                </div>

                {/* How it works steps */}
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">How It Works</h3>
                <div className="space-y-4 mb-8">
                    {[
                        { step: '1', title: 'Copy your invite link', desc: 'Find it in your Garth Wallet under Invite & Earn' },
                        { step: '2', title: 'Share it with friends', desc: 'Text it, post it, send it however you want' },
                        { step: '3', title: 'They sign up immediately', desc: 'They need to create their account right after clicking your link' },
                    ].map((item) => (
                        <div key={item.step} className="flex items-start gap-4">
                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-slate-600">{item.step}</span>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-900">{item.title}</p>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-start gap-4">
                        <div className="w-7 h-7 rounded-full bg-[#2238ff]/10 flex items-center justify-center flex-shrink-0">
                            <Coins size={14} className="text-[#2238ff]" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-900">You earn 125 GBX instantly</p>
                            <p className="text-xs text-slate-500">Plus bonus GBX when they buy or sell for the first time</p>
                        </div>
                    </div>
                </div>

                {/* Weekly pool disclaimer */}
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 mb-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Important Note</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        All Garthbucks rewards come from a fixed weekly pool of 1,000,000 GBX. If total rewards earned across all users in a given week exceed the pool, all payouts are scaled proportionally. This means the amounts shown above represent your <strong className="text-slate-700">maximum possible reward</strong> — actual amounts may be lower during high-activity weeks. No GBX is ever created beyond the weekly allocation.
                    </p>
                    <button onClick={() => onNavigate?.('GBX_WHITEPAPER')} className="text-xs text-[#2238ff] font-medium mt-2 hover:underline">
                        Read the full Garthbucks Whitepaper →
                    </button>
                </div>

                {/* Fine print */}
                <p className="text-xs text-slate-400 text-center pb-4">
                    Rewards are credited after the action is confirmed. One referral per user.
                </p>

            </div>
        </div>
    );
};

export default HowRewardsWork;
