import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { COLORS } from '../constants';

interface IdentityCheckModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified: () => void;
}

const IdentityCheckModal: React.FC<IdentityCheckModalProps> = ({
    isOpen,
    onClose,
    onVerified
}) => {
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Reset state on open
            setCardholderName('');
            setCardNumber('');
            setExpiry('');
            setCvc('');
            setIsCheckboxChecked(false);
            setIsSubmitting(false);
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Format: 0000 0000 0000 0000
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 16) v = v.slice(0, 16);
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.slice(i, i + 4));
        }
        setCardNumber(parts.join(' '));
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Format: MM / YY
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

        // Simulate API call
        setTimeout(() => {
            // Create a 10% chance of random failure for realism testing
            // const randomFail = Math.random() < 0.1; 
            const randomFail = false; // Disable failure for verified path

            if (randomFail) {
                setError("Authorization failed. Please try another card.");
                setIsSubmitting(false);
            } else {
                setIsSubmitting(false);
                onVerified();
            }
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={!isSubmitting ? onClose : undefined}
            />

            {/* Modal Content - Original Simple Style */}
            <div
                className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div className="p-6 pb-2">
                    <h2 className="text-xl font-bold text-slate-900">
                        Quick Identity Check (No Charge)
                    </h2>
                    <div className="mt-2 text-sm text-slate-500 leading-relaxed font-medium space-y-2">
                        <p>We use a temporary card authorization to confirm verified bidders.</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>No purchases will be made</li>
                            <li>Never used for payment</li>
                        </ul>
                    </div>
                </div>

                {/* Close Button */}
                {!isSubmitting && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X size={18} />
                    </button>
                )}

                <div className="p-6 pt-4 space-y-4">

                    {/* Input Fields - Simple Standard */}
                    <div className="space-y-3">
                        {/* Cardholder */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Cardholder Name</label>
                            <input
                                type="text"
                                value={cardholderName}
                                onChange={(e) => setCardholderName(e.target.value)}
                                placeholder="Name on card"
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                                    disabled={isSubmitting}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock size={14} />
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
                                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
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
                                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span>Secured by Stripe</span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-start gap-3 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <div className="relative flex items-center mt-0.5 shrink-0">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={isCheckboxChecked}
                                onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                                disabled={isSubmitting}
                            />
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isCheckboxChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                                {isCheckboxChecked && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-slate-600 leading-snug select-none group-hover:text-slate-800 transition-colors">
                                I understand this is a temporary authorization, not a charge
                            </span>
                            <span className="text-[11px] text-slate-400 leading-relaxed font-normal">
                                A temporary $250 authorization hold may appear. This is not a charge and is released by your bank within 1–2 days.
                            </span>
                        </div>
                    </label>

                    {/* Actions */}
                    <div className="space-y-3 pt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || isSubmitting}
                            className="w-full py-3 rounded-lg font-bold text-white text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            style={{ backgroundColor: COLORS.fireOrange }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify & Start Bidding'
                            )}
                        </button>

                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-lg font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                        >
                            Do It Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdentityCheckModal;
