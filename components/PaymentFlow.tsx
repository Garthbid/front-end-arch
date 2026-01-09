import React from 'react';
import { COLORS } from '../constants';
import {
    Trophy, X, FileText, MapPin
} from 'lucide-react';

// Mock won auction data
const MOCK_WON_AUCTION = {
    id: 'won-1',
    title: '2012 John Deere 9860 STS Combine',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    winningBid: 125000,
    location: 'Calgary, AB',
};

interface PaymentFlowProps {
    onBack: () => void;
    onPaymentComplete?: () => void;
}

const PaymentFlow: React.FC<PaymentFlowProps> = ({ onBack, onPaymentComplete }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onBack}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300"
            >
                {/* Close Button */}
                <button
                    onClick={onBack}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
                >
                    <X size={18} style={{ color: COLORS.textMuted }} />
                </button>

                {/* Celebration Header - Compact */}
                <div className="text-center pt-6 pb-4 px-5">
                    <div
                        className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3"
                        style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}
                    >
                        <Trophy size={26} className="text-amber-600" strokeWidth={2} />
                    </div>
                    <h1 className="text-2xl font-display uppercase italic tracking-tight mb-1" style={{ color: COLORS.textPrimary }}>
                        You <span style={{ color: '#10b981' }}>Won!</span>
                    </h1>
                    <p className="text-xs" style={{ color: COLORS.textMuted }}>
                        Complete your payment to claim your item.
                    </p>
                </div>

                {/* Item Card - Compact */}
                <div className="px-5">
                    <div
                        className="rounded-xl border overflow-hidden"
                        style={{ background: COLORS.surface1, borderColor: COLORS.border }}
                    >
                        <div className="flex gap-3 p-3">
                            {/* Thumbnail */}
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={MOCK_WON_AUCTION.imageUrl}
                                    alt={MOCK_WON_AUCTION.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <h2 className="font-bold text-sm mb-1 line-clamp-2" style={{ color: COLORS.textPrimary }}>
                                    {MOCK_WON_AUCTION.title}
                                </h2>
                                <div className="flex items-center gap-1 text-[10px] mb-2" style={{ color: COLORS.textMuted }}>
                                    <MapPin size={10} />
                                    {MOCK_WON_AUCTION.location}
                                </div>
                                <div className="text-lg font-bold" style={{ color: '#224cff' }}>
                                    ${MOCK_WON_AUCTION.winningBid.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* View Invoice Button */}
                <div className="p-5">
                    <button
                        onClick={() => {
                            alert('Invoice view - next steps coming soon!');
                            onPaymentComplete?.();
                        }}
                        className="w-full py-3.5 rounded-xl font-bold text-white text-base active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        style={{
                            background: 'linear-gradient(135deg, #224cff, #4a6fff)',
                            boxShadow: '0 6px 20px rgba(34, 76, 255, 0.3)'
                        }}
                    >
                        <FileText size={18} strokeWidth={2.5} />
                        View Invoice
                    </button>

                    <p className="text-center text-[10px] mt-3" style={{ color: COLORS.textMuted }}>
                        Payment processed securely by GarthBid
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentFlow;
