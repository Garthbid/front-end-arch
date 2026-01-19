import React, { useState } from 'react';
import { ArrowLeft, Gift, Copy, Share2, FileText, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useEarnGBX } from './GBXAnimationProvider';

// ============================================
// INVITE & EARN CARD COMPONENT
// ============================================

const InviteEarnCard: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [showRewardsDialog, setShowRewardsDialog] = useState(false);

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
            console.error('Failed to copy:', err);
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
                    Invite friends — earn free Garthbucks when they buy or sell.
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
                    onClick={() => setShowRewardsDialog(true)}
                    className="w-full text-xs text-blue-600 font-medium mt-3 hover:underline"
                >
                    How rewards work →
                </button>
            </div>

            {/* How Rewards Work Dialog */}
            <Dialog open={showRewardsDialog} onOpenChange={setShowRewardsDialog}>
                <DialogContent className="sm:max-w-md rounded-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            <Gift size={20} className="text-orange-500" />
                            How Rewards Work
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 mt-2">
                            Earn Garthbucks when your friends take action!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                            <span className="text-lg">🎉</span>
                            <div>
                                <p className="font-bold text-sm text-slate-900">5 GBX</p>
                                <p className="text-xs text-slate-500">When they sign up</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                            <span className="text-lg">🛒</span>
                            <div>
                                <p className="font-bold text-sm text-slate-900">20 GBX</p>
                                <p className="text-xs text-slate-500">When they complete their first purchase</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                            <span className="text-lg">💰</span>
                            <div>
                                <p className="font-bold text-sm text-slate-900">50 GBX</p>
                                <p className="text-xs text-slate-500">When they complete their first sale</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-4 text-center">
                        Rewards post after the transaction is confirmed.
                    </p>

                    <button
                        onClick={() => setShowRewardsDialog(false)}
                        className="w-full mt-4 py-3 rounded-xl bg-[#2238ff] hover:bg-[#1a2dbb] text-white font-bold text-sm transition-colors"
                    >
                        Got it
                    </button>
                </DialogContent>
            </Dialog>
        </>
    );
};

// ============================================
// WALLET PAGE PROPS
// ============================================

interface WalletPageProps {
    onBack: () => void;
    onViewInvoices: () => void;
}

// ============================================
// WALLET PAGE COMPONENT
// ============================================

const WalletPage: React.FC<WalletPageProps> = ({ onBack, onViewInvoices }) => {
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
                    className="w-full flex items-center justify-between p-4 rounded-2xl border bg-white border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                            <FileText size={18} className="text-orange-500" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-sm text-slate-900">My Invoices</h3>
                            <p className="text-xs text-slate-500">View payments & releases</p>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-400" />
                </button>

                {/* Invite & Earn Card */}
                <InviteEarnCard />

                {/* Garthbucks Balance */}
                <div className="p-5 rounded-2xl border bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500 shadow-lg shadow-blue-500/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Garthbucks Balance</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-white">{gbxBalance}</span>
                                <span className="text-xs font-medium text-blue-200">GBX</span>
                            </div>
                        </div>
                        <button className="px-4 py-2 rounded-xl bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition-colors">
                            Add Funds
                        </button>
                    </div>
                    <p className="mt-3 text-xs text-blue-200">
                        What are Garthbucks? <span className="underline cursor-pointer">Learn more</span>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default WalletPage;
