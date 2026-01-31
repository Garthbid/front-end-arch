import React, { useState } from 'react';
import { ArrowLeft, Copy, Share2, FileText, ChevronRight, Gift } from 'lucide-react';
import { useEarnGBX } from './GBXAnimationProvider';
import type { ViewState } from '../types';

// ============================================
// INVITE & EARN CARD COMPONENT
// ============================================

const InviteEarnCard: React.FC<{ onNavigate?: (view: ViewState) => void }> = ({ onNavigate }) => {
    const [copied, setCopied] = useState(false);

    // Mock data (would come from API)
    const inviteUrl = 'garthbid.com/invite/justin-8F3K';
    const fullInviteUrl = 'https://garthbid.com/invite/justin-8F3K';
    const stats = {
        invited: 0,
        joined: 0,
        earned: 0,
    };

    const canShare = typeof navigator !== 'undefined' && !!navigator.share;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(fullInviteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch (err) {
            // silently ignore
        }
    };

    const handleShare = async () => {
        if (canShare) {
            try {
                await navigator.share({
                    title: 'Join GarthBid',
                    text: 'Check out GarthBid - the internet\'s bidding war arena!',
                    url: fullInviteUrl,
                });
            } catch (err) {
                // User cancelled or error
            }
        }
    };

    return (
        <>
            <div className="mb-6 p-5 rounded-2xl border bg-white border-slate-200 shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                    <Gift size={18} className="text-orange-500" />
                    <h3 className="font-bold text-sm text-slate-900">Invite & Earn</h3>
                </div>

                {/* Subtext */}
                <p className="text-xs text-slate-500 mb-4">
                    Invite friends — earn free Garthbucks when they sign up!
                </p>

                {/* Invite Link Display */}
                <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="flex-1 text-xs font-mono text-slate-600 truncate">
                        {inviteUrl}
                    </span>
                    {canShare && (
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
                            aria-label="Share invite link"
                        >
                            <Share2 size={14} className="text-slate-500" />
                        </button>
                    )}
                </div>

                {/* Copy Button */}
                <button
                    onClick={handleCopyLink}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${copied
                        ? 'bg-green-500 text-white'
                        : 'bg-[#ff5000] text-white hover:bg-[#e54600]'
                        }`}
                >
                    <Copy size={14} />
                    {copied ? 'Copied!' : 'Copy Invite Link'}
                </button>

                {/* Stats Row */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="text-center flex-1">
                        <p className="text-lg font-bold text-slate-900">{stats.invited}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Invited</p>
                    </div>
                    <div className="text-center flex-1 border-x border-slate-100">
                        <p className="text-lg font-bold text-slate-900">{stats.joined}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Joined</p>
                    </div>
                    <div className="text-center flex-1">
                        <p className="text-lg font-bold text-orange-500">{stats.earned}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Earned GBX</p>
                    </div>
                </div>

                {/* Empty State Message */}
                {stats.invited === 0 && stats.joined === 0 && (
                    <p className="text-xs text-slate-400 text-center mt-3">
                        Share your link to start earning.
                    </p>
                )}

                {/* How Rewards Work Link */}
                <button
                    onClick={() => onNavigate?.('HOW_REWARDS_WORK')}
                    className="w-full text-xs text-blue-600 font-medium mt-3 hover:underline"
                >
                    How rewards work →
                </button>
            </div>
        </>
    );
};

// ============================================
// WALLET PAGE PROPS
// ============================================

interface WalletPageProps {
    onBack: () => void;
    onViewInvoices: () => void;
    onNavigate?: (view: ViewState) => void;
}

// ============================================
// WALLET PAGE COMPONENT
// ============================================

const WalletPage: React.FC<WalletPageProps> = ({ onBack, onViewInvoices, onNavigate }) => {
    const { gbxBalance } = useEarnGBX();

    return (
        <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </button>
                    <div>
                        <h1 className="text-xl font-display text-slate-900 uppercase italic tracking-tighter leading-none">Garth Wallet</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rewards & Earnings</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-6">

                {/* View Invoices CTA */}
                <button
                    onClick={onViewInvoices}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border bg-white border-slate-200 shadow-md hover:shadow-lg hover:border-blue-200 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <FileText size={18} className="text-blue-600" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-sm text-slate-900">My Invoices</h3>
                            <p className="text-xs text-slate-500">View payments & releases</p>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-blue-400" />
                </button>

                {/* Garthbucks Balance — Credit Card Style */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#080e3a] via-[#111d6e] to-[#0a1045] shadow-2xl shadow-black/50 border border-white/[0.06]" style={{ aspectRatio: '1.586', maxHeight: '260px' }}>

                    {/* Holographic diagonal shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" style={{ transform: 'rotate(-20deg)', transformOrigin: 'top left' }} />

                    {/* Subtle mesh pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                    {/* Corner glow — like the Chase Sapphire light refraction */}
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/[0.08] blur-3xl rounded-full" />
                    <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-indigo-400/[0.06] blur-3xl rounded-full" />

                    {/* Floating emojis */}
                    <div className="absolute top-4 right-6 text-3xl opacity-[0.07] rotate-12 select-none">💸</div>
                    <div className="absolute bottom-12 left-8 text-2xl opacity-[0.05] -rotate-6 select-none">💸</div>

                    <div className="relative z-10 h-full flex flex-col justify-between p-5 pb-4">

                        {/* Top row — chip + contactless + brand */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                {/* EMV Chip */}
                                <div className="w-11 h-8 rounded-[5px] relative overflow-hidden shadow-md" style={{ background: 'linear-gradient(145deg, #e8c547 0%, #d4a83a 30%, #c9992e 60%, #dbb540 100%)' }}>
                                    {/* Chip contact pads */}
                                    <div className="absolute inset-[2px] rounded-[3px]" style={{ background: 'linear-gradient(145deg, #f0d060 0%, #c89e30 100%)' }}>
                                        {/* Center horizontal line */}
                                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-700/25" style={{ transform: 'translateY(-0.5px)' }} />
                                        {/* Center vertical line */}
                                        <div className="absolute left-1/2 top-[3px] bottom-[3px] w-[1px] bg-amber-700/25" style={{ transform: 'translateX(-0.5px)' }} />
                                        {/* Left pad border */}
                                        <div className="absolute left-[3px] top-[3px] bottom-[3px] w-[8px] rounded-[2px] border border-amber-700/20" />
                                        {/* Right pad border */}
                                        <div className="absolute right-[3px] top-[3px] bottom-[3px] w-[8px] rounded-[2px] border border-amber-700/20" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] font-display text-white/40 uppercase italic tracking-[0.15em]">Garthbucks</p>
                        </div>

                        {/* Center — balance */}
                        <div>
                            <p className="text-[9px] font-bold text-blue-400/60 uppercase tracking-[0.25em] mb-0.5">Balance</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-display text-white tracking-tight italic" style={{ WebkitTextStroke: '0.5px rgba(255,255,255,0.2)' }}>{gbxBalance}</span>
                                <span className="text-sm font-display text-white/40 uppercase italic tracking-wider">GBX</span>
                            </div>
                        </div>

                        {/* Bottom row — cardholder details + actions */}
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[9px] text-white/25 uppercase tracking-[0.15em] mb-0.5">GBX Holder</p>
                                <p className="text-xs font-bold text-white/70 uppercase tracking-wider">Justin M.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => onNavigate?.('GBX_WHITEPAPER')} className="text-[10px] text-white/30 hover:text-white/60 transition-colors underline underline-offset-2">
                                    Learn more
                                </button>
                                <button onClick={() => onNavigate?.('MY_LEDGER')} className="px-4 py-2 rounded-lg bg-white/[0.08] backdrop-blur-sm text-white border border-white/[0.12] text-[11px] font-display uppercase italic tracking-wider hover:bg-white/[0.15] transition-all active:scale-[0.97]">
                                    My Ledger
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Invite & Earn Card */}
                <InviteEarnCard onNavigate={onNavigate} />

            </div>
        </div>
    );
};

export default WalletPage;
