import React, { useState } from 'react';
import { ShieldCheck, Loader2, CheckCircle2, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { COLORS } from '../constants';

interface VerifyToBidProps {
    onVerify: () => void;
    onSkip: () => void;
}

const VerifyToBid: React.FC<VerifyToBidProps> = ({ onVerify, onSkip }) => {
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 16) v = v.slice(0, 16);
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.slice(i, i + 4));
        }
        setCardNumber(parts.join(' '));
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 4) v = v.slice(0, 4);

        if (v.length >= 2) {
            setExpiry(`${v.slice(0, 2)} / ${v.slice(2)}`);
        } else {
            setExpiry(v);
        }
    };

    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 4) v = v.slice(0, 4);
        setCvc(v);
    };

    const isFormValid =
        cardholderName.trim().length > 0 &&
        cardNumber.replace(/\s/g, '').length === 16 &&
        expiry.replace(/\D/g, '').length === 4 &&
        cvc.length >= 3 &&
        isCheckboxChecked;

    const handleSubmit = async () => {
        if (!isFormValid) return;

        setIsSubmitting(true);
        setError(null);

        setTimeout(() => {
            const randomFail = false;

            if (randomFail) {
                setError("Authorization failed. Please try another card.");
                setIsSubmitting(false);
            } else {
                // Success
                // Don't set isSubmitting false immediately to prevent flicker before parent acts
                onVerify();
                // Parent handles navigation/toast
            }
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
            <div className="w-full max-w-[520px] bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={32} className="text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Quick Identity Check (No Charge)
                    </h1>
                    <p className="text-slate-500 font-medium">
                        We use a temporary card authorization to confirm verified bidders.
                    </p>
                </div>

                {/* Info Block */}
                <div className="bg-slate-50 rounded-xl p-4 mb-8 border border-slate-100">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            <span>No purchases will be made</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            <span>Never used for payment</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">
                            This takes seconds and helps keep Garthbid clean, fair, and scam-free.
                        </p>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 mb-8">
                    {/* Cardholder */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Cardholder Name</label>
                        <input
                            type="text"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            placeholder="Name on card"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Card Number */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Card Number</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="0000 0000 0000 0000"
                                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                                disabled={isSubmitting}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Expiry</label>
                            <input
                                type="text"
                                value={expiry}
                                onChange={handleExpiryChange}
                                placeholder="MM / YY"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">CVC</label>
                            <input
                                type="text"
                                value={cvc}
                                onChange={handleCvcChange}
                                placeholder="123"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 px-1">
                        <Lock size={12} className="text-slate-400" />
                        <span>Secured by industry-standard encryption</span>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-start gap-3 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Checkbox */}
                <div className="mb-8">
                    <label className="flex items-start gap-3 cursor-pointer group p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                        <div className="relative flex items-center mt-0.5">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={isCheckboxChecked}
                                onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                                disabled={isSubmitting}
                            />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isCheckboxChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                                {isCheckboxChecked && <CheckCircle2 size={14} className="text-white" />}
                            </div>
                        </div>
                        <span className="text-sm font-medium text-slate-600 leading-snug select-none group-hover:text-slate-800 transition-colors">
                            I understand this is a temporary authorization, not a charge
                        </span>
                    </label>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || isSubmitting}
                        className="w-full py-4 rounded-xl font-bold text-white text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        style={{ backgroundColor: COLORS.fireOrange }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            'Verify & Start Bidding'
                        )}
                    </button>

                    <button
                        onClick={onSkip}
                        disabled={isSubmitting}
                        className="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Do it later
                    </button>

                    <p className="text-[10px] text-center text-slate-400 leading-relaxed px-4 pt-2">
                        A temporary $250 authorization hold may appear. This is not a charge and is released by your bank within 1–2 days.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyToBid;
