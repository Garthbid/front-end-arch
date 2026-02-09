import React from 'react';
import { PartyPopper, ArrowRight } from 'lucide-react';
import { COLORS } from '../../constants';
import { getListingTitle } from './InvitePopup';

interface InviteConfirmationProps {
    isOpen: boolean;
    listingData: any;
    onViewListing: () => void;
    onClose: () => void;
}

const InviteConfirmation: React.FC<InviteConfirmationProps> = ({
    isOpen,
    listingData,
    onViewListing,
    onClose,
}) => {
    if (!isOpen) return null;

    const title = getListingTitle(listingData);

    return (
        <div className="fixed inset-0 z-[280] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Card */}
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-500">
                <div className="pt-10 pb-4 px-6 text-center">
                    {/* Celebration Icon */}
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                        style={{
                            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                        }}
                    >
                        <PartyPopper size={30} className="text-amber-600" />
                    </div>

                    <h1
                        className="text-2xl font-display uppercase italic tracking-tight mb-3"
                        style={{ color: COLORS.textPrimary }}
                    >
                        Invites Sent!
                    </h1>

                    <p className="text-sm text-slate-500 leading-relaxed mb-1">
                        Your friends will get a link to your listing.
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        If they sign up and bid, you'll both earn{' '}
                        <span className="font-bold" style={{ color: COLORS.accent }}>
                            Garthbucks
                        </span>
                        !
                    </p>
                </div>

                {/* Actions */}
                <div className="px-6 pt-4 pb-8 space-y-3">
                    <button
                        onClick={onViewListing}
                        className="w-full py-4 rounded-xl flex items-center justify-center gap-2.5 font-black text-white text-sm uppercase tracking-widest active:scale-[0.98] transition-all"
                        style={{
                            background: COLORS.primary,
                            boxShadow: `0 8px 20px ${COLORS.primary}40`,
                        }}
                    >
                        View Your Listing
                        <ArrowRight size={16} strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InviteConfirmation;
