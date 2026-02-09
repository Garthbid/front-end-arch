import React, { useState, useEffect } from 'react';
import { Users, Share2, Link, Copy, Check, X } from 'lucide-react';
import { COLORS } from '../../constants';

// --- Shared message generation helpers ---

export const getListingTitle = (data: any): string => {
    if (!data) return 'my item';
    if (data.make && data.model) {
        return [data.year, data.make, data.model].filter(Boolean).join(' ');
    }
    return data.title || 'my item';
};

export const getListingUrl = (data: any): string => {
    const title = getListingTitle(data);
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    return `${window.location.origin}/listing/${slug}`;
};

export const getShareMessage = (data: any): string => {
    const title = getListingTitle(data);
    const url = getListingUrl(data);
    return `Hey — I'm selling my ${title} UNRESERVED on GarthBid.\n\nBidding starts at $250. If it goes cheap, at least one of us wins 😄\n\nCheck it out: ${url}`;
};

// --- Component ---

interface InvitePopupProps {
    isOpen: boolean;
    listingData: any;
    onInviteFriends: () => void;
    onCopyLink: () => void;
    onMaybeLater: () => void;
}

const InvitePopup: React.FC<InvitePopupProps> = ({
    isOpen,
    listingData,
    onInviteFriends,
    onCopyLink,
    onMaybeLater,
}) => {
    const [linkCopied, setLinkCopied] = useState(false);
    const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

    useEffect(() => {
        if (isOpen) setLinkCopied(false);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInvite = async () => {
        const message = getShareMessage(listingData);
        const url = getListingUrl(listingData);
        const title = getListingTitle(listingData);

        if (canNativeShare) {
            try {
                await navigator.share({
                    title: `${title} on GarthBid`,
                    text: message,
                    url: url,
                });
                onInviteFriends();
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    // Fallback to SMS
                    handleSmsFallback();
                }
            }
        } else {
            // Desktop: open copy message modal
            onCopyLink();
        }
    };

    const handleSmsFallback = () => {
        const message = getShareMessage(listingData);
        const encoded = encodeURIComponent(message);
        window.open(`sms:?body=${encoded}`, '_self');
        setTimeout(() => onInviteFriends(), 500);
    };

    const handleCopyLink = async () => {
        const url = getListingUrl(listingData);
        try {
            await navigator.clipboard.writeText(url);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            onCopyLink();
        }
    };

    return (
        <div className="fixed inset-0 z-[260] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onMaybeLater}
            />

            {/* Modal Card */}
            <div className="relative w-full sm:max-w-sm bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 sm:slide-in-from-bottom-0 fade-in duration-300">
                {/* Mobile drag handle */}
                <div className="flex justify-center pt-3 sm:hidden">
                    <div className="w-10 h-1 bg-slate-200 rounded-full" />
                </div>

                {/* Close button (desktop) */}
                <button
                    onClick={onMaybeLater}
                    className="hidden sm:flex absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                >
                    <X size={18} />
                </button>

                {/* Content */}
                <div className="px-6 pt-6 pb-2 text-center">
                    {/* Icon */}
                    <div
                        className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                        style={{
                            background: `${COLORS.primary}10`,
                        }}
                    >
                        <Users size={24} style={{ color: COLORS.primary }} />
                    </div>

                    <h2
                        className="text-lg font-display uppercase italic tracking-tight mb-2"
                        style={{ color: COLORS.textPrimary }}
                    >
                        Your item is Unreserved!
                    </h2>

                    <p className="text-sm text-slate-500 leading-relaxed mb-1">
                        Invite close friends — if it goes cheap,
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        at least one of you wins 😄
                    </p>
                </div>

                {/* Actions */}
                <div className="px-6 pt-4 pb-6 space-y-3">
                    {/* Primary: Invite Friends */}
                    <button
                        onClick={handleInvite}
                        className="w-full py-4 rounded-xl flex items-center justify-center gap-2.5 font-black text-white text-sm uppercase tracking-widest active:scale-[0.98] transition-all"
                        style={{
                            background: COLORS.primary,
                            boxShadow: `0 8px 20px ${COLORS.primary}40`,
                        }}
                    >
                        <Share2 size={16} strokeWidth={2.5} />
                        {canNativeShare ? 'Invite Friends' : 'Text Friends (Copy Message)'}
                    </button>

                    {/* Secondary: Copy Link */}
                    <button
                        onClick={handleCopyLink}
                        className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all border"
                        style={{
                            background: linkCopied ? `${COLORS.success}10` : COLORS.surface1,
                            color: linkCopied ? COLORS.success : COLORS.textPrimary,
                            borderColor: linkCopied ? `${COLORS.success}30` : COLORS.border,
                        }}
                    >
                        {linkCopied ? (
                            <>
                                <Check size={16} strokeWidth={2.5} />
                                Link Copied!
                            </>
                        ) : (
                            <>
                                <Link size={16} />
                                Copy Link Instead
                            </>
                        )}
                    </button>

                    {/* Tertiary: Maybe Later */}
                    <button
                        onClick={onMaybeLater}
                        className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvitePopup;
