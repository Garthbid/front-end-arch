import React, { useState, useEffect } from 'react';
import { Copy, Check, X } from 'lucide-react';
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
    return `garthbid.com/i/${slug}`;
};

export const getShareMessage = (data: any): string => {
    const title = getListingTitle(data);
    const url = getListingUrl(data);
    return `Hey — I'm selling my ${title} UNRESERVED on GarthBid. Bidding starts at $250.\n\nIf it goes cheap, at least one of us wins 😄\n\nCheck it out: ${url}`;
};

// --- Component ---

interface InviteModalProps {
    isOpen: boolean;
    listingData: any;
    onDone: () => void;
    onMaybeLater: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({
    isOpen,
    listingData,
    onDone,
    onMaybeLater,
}) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen) setCopied(false);
    }, [isOpen]);

    if (!isOpen) return null;

    const title = getListingTitle(listingData);
    const message = getShareMessage(listingData);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message);
            setCopied(true);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = message;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
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
                    className="hidden sm:flex absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 z-10"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="px-6 pt-6 pb-2 text-center">
                    <div className="text-4xl mb-3">🎉</div>

                    <h2
                        className="text-lg font-display uppercase italic tracking-tight mb-2"
                        style={{ color: COLORS.textPrimary }}
                    >
                        Your {title.split(' ').slice(0, 3).join(' ')} is Unreserved!
                    </h2>

                    <p className="text-sm text-slate-500 leading-relaxed">
                        Tell your friends — if it goes cheap,{' '}
                        at least one of you wins 😄
                    </p>
                </div>

                {/* Message Preview */}
                <div className="px-6 pt-4 pb-3">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 pt-2 pb-6 space-y-3">
                    {!copied ? (
                        <>
                            {/* Copy Message Button */}
                            <button
                                onClick={handleCopy}
                                className="w-full py-4 rounded-xl flex items-center justify-center gap-2.5 font-black text-white text-sm uppercase tracking-widest active:scale-[0.98] transition-all"
                                style={{
                                    background: COLORS.primary,
                                    boxShadow: `0 8px 20px ${COLORS.primary}40`,
                                }}
                            >
                                <Copy size={16} strokeWidth={2.5} />
                                Copy Message
                            </button>

                            {/* Maybe Later */}
                            <button
                                onClick={onMaybeLater}
                                className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                            >
                                Maybe Later
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Copied! Button */}
                            <button
                                disabled
                                className="w-full py-4 rounded-xl flex items-center justify-center gap-2.5 font-black text-white text-sm uppercase tracking-widest transition-all"
                                style={{
                                    background: COLORS.success,
                                    boxShadow: `0 8px 20px ${COLORS.success}40`,
                                }}
                            >
                                <Check size={16} strokeWidth={2.5} />
                                Copied!
                            </button>

                            {/* Instruction */}
                            <p className="text-center text-sm text-slate-500">
                                Now paste it in your group chats & messages 💬
                            </p>

                            {/* Done Button */}
                            <button
                                onClick={onDone}
                                className="w-full py-3.5 rounded-xl flex items-center justify-center font-bold text-sm transition-all border"
                                style={{
                                    background: COLORS.surface1,
                                    color: COLORS.textPrimary,
                                    borderColor: COLORS.border,
                                }}
                            >
                                Done
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InviteModal;
