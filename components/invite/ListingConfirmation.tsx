import React, { useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, Zap, Share2 } from 'lucide-react';
import { COLORS } from '../../constants';
import { getListingTitle } from './InviteModal';

interface ListingConfirmationProps {
    isOpen: boolean;
    listingData: any;
    onClose: () => void;
    onInviteFriends: () => void;
}

const ListingConfirmation: React.FC<ListingConfirmationProps> = ({
    isOpen,
    listingData,
    onClose,
    onInviteFriends,
}) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onInviteRef = useRef(onInviteFriends);
    onInviteRef.current = onInviteFriends;

    useEffect(() => {
        if (!isOpen) return;

        timerRef.current = setTimeout(() => {
            onInviteRef.current();
        }, 2000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const title = getListingTitle(listingData);

    const handleMaybeLater = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        onClose();
    };

    const handleShareNow = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        onInviteFriends();
    };

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={handleMaybeLater}
            />

            {/* Card */}
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-500">
                {/* Success Header */}
                <div className="pt-10 pb-6 px-6 text-center">
                    {/* Animated Check */}
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                        style={{
                            background: `${COLORS.success}15`,
                        }}
                    >
                        <CheckCircle2
                            size={36}
                            strokeWidth={2.5}
                            style={{ color: COLORS.success }}
                        />
                    </div>

                    <h1
                        className="text-2xl font-display uppercase italic tracking-tight mb-2"
                        style={{ color: COLORS.textPrimary }}
                    >
                        You're Live!
                    </h1>

                    {/* Item Title */}
                    <p className="text-base font-bold text-slate-700 mb-3">
                        {title}
                    </p>

                    {/* Unreserved Badge */}
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                        style={{
                            background: `${COLORS.fireOrange}12`,
                            color: COLORS.fireOrange,
                        }}
                    >
                        <Zap size={10} strokeWidth={3} />
                        Unreserved
                    </span>
                </div>

                {/* Actions */}
                <div className="px-6 pb-8 space-y-3">
                    <button
                        onClick={handleShareNow}
                        className="w-full py-4 rounded-xl flex items-center justify-center gap-2.5 font-black text-white text-sm uppercase tracking-widest active:scale-[0.98] transition-all"
                        style={{
                            background: COLORS.primary,
                            boxShadow: `0 8px 20px ${COLORS.primary}40`,
                        }}
                    >
                        <Share2 size={16} strokeWidth={2.5} />
                        Share with Friends
                    </button>

                    <button
                        onClick={handleMaybeLater}
                        className="w-full py-3 text-center text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListingConfirmation;
