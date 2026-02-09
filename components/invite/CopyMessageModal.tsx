import React, { useState, useEffect } from 'react';
import { Copy, Check, Link, X } from 'lucide-react';
import { COLORS } from '../../constants';
import { getShareMessage, getListingUrl } from './InvitePopup';

interface CopyMessageModalProps {
    isOpen: boolean;
    listingData: any;
    onDone: () => void;
    onClose: () => void;
}

const CopyMessageModal: React.FC<CopyMessageModalProps> = ({
    isOpen,
    listingData,
    onDone,
    onClose,
}) => {
    const [messageCopied, setMessageCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMessageCopied(false);
            setLinkCopied(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const message = getShareMessage(listingData);
    const url = getListingUrl(listingData);

    const handleCopyMessage = async () => {
        try {
            await navigator.clipboard.writeText(message);
            setMessageCopied(true);
            setTimeout(() => setMessageCopied(false), 2000);
        } catch {
            // Clipboard API not available
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch {
            // Clipboard API not available
        }
    };

    return (
        <div className="fixed inset-0 z-[270] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 z-10"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="pt-8 pb-4 px-6 text-center">
                    <h2
                        className="text-lg font-display uppercase italic tracking-tight"
                        style={{ color: COLORS.textPrimary }}
                    >
                        Copy & Share
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Send this to your friends via text or DM
                    </p>
                </div>

                {/* Message Preview */}
                <div className="px-6 pb-3">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Copy Actions */}
                <div className="px-6 pb-6 space-y-3">
                    {/* Copy Full Message */}
                    <button
                        onClick={handleCopyMessage}
                        className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-widest active:scale-[0.98] transition-all"
                        style={{
                            background: messageCopied ? COLORS.success : COLORS.primary,
                            color: 'white',
                            boxShadow: messageCopied
                                ? `0 8px 20px ${COLORS.success}40`
                                : `0 8px 20px ${COLORS.primary}40`,
                        }}
                    >
                        {messageCopied ? (
                            <>
                                <Check size={16} strokeWidth={2.5} />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy size={16} strokeWidth={2.5} />
                                Copy Message
                            </>
                        )}
                    </button>

                    {/* Copy Link Only */}
                    <button
                        onClick={handleCopyLink}
                        className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all border"
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
                                Copy Link Only
                            </>
                        )}
                    </button>

                    {/* Done */}
                    <button
                        onClick={onDone}
                        className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CopyMessageModal;
