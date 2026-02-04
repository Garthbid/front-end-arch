import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, CheckCircle2, AlertCircle, Loader2, Check, ArrowRight } from 'lucide-react';
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
    const [step, setStep] = useState<1 | 2>(1);
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showWhyInfo, setShowWhyInfo] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset state on open
            setStep(1);
            setCardholderName('');
            setCardNumber('');
            setExpiry('');
            setCvc('');
            setIsCheckboxChecked(false);
            setIsSubmitting(false);
            setError(null);
            setShowWhyInfo(false);
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

    const handleClose = () => {
        if (!isSubmitting) {
            setStep(1);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200"
            >
                {/* Close Button */}
                {!isSubmitting && (
                    <button
                        onClick={handleClose}
                        className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100/80 transition-colors text-slate-400 hover:text-slate-600 z-10"
                    >
                        <X size={18} />
                    </button>
                )}

                {step === 1 ? (
                    /* ===== STEP 1: Verification Intro ===== */
                    <div className="px-7 pt-7 pb-6">
                        {/* Shield Icon */}
                        <div className="flex justify-center mb-5">
                            <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center">
                                <Shield className="h-7 w-7 text-[#2238ff]" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-semibold text-slate-800 text-center tracking-[0.3px] leading-tight">
                            Quick Verification
                        </h2>

                        {/* Description */}
                        <p className="mt-3 text-[15px] text-slate-500 text-center leading-relaxed">
                            Before you bid, we need to confirm you're a real person with a valid payment method.
                        </p>

                        {/* Benefits List */}
                        <div className="space-y-3 py-5">
                            {[
                                'Protects sellers from fake bids',
                                'Keeps auctions fair for everyone',
                                'Takes less than 30 seconds',
                            ].map((text) => (
                                <div key={text} className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-slate-600">{text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="space-y-3 pt-2">
                            <button
                                onClick={() => setStep(2)}
                                className="w-full py-3.5 rounded-full font-semibold text-white text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] active:translate-y-0 flex items-center justify-center gap-2"
                                style={{
                                    background: `linear-gradient(135deg, #2238ff 0%, #1a2dbb 100%)`,
                                    boxShadow: `0 4px 14px -2px rgba(34, 56, 255, 0.4), inset 0 1px 0 0 rgba(255,255,255,0.15)`
                                }}
                            >
                                Continue
                                <ArrowRight size={16} />
                            </button>

                            <button
                                onClick={() => setShowWhyInfo(!showWhyInfo)}
                                className="w-full py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Why do we do this?
                            </button>

                            {/* Expandable "Why" section */}
                            {showWhyInfo && (
                                <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-500 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                    <p className="font-medium text-slate-600 mb-2">Protecting our community</p>
                                    <p>
                                        Fake bids hurt everyone — sellers lose time, and real buyers miss out.
                                        By verifying your payment method upfront, we ensure every bid is backed
                                        by a real person ready to complete the purchase. The $250 hold is temporary
                                        and released immediately after verification.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* ===== STEP 2: Payment Form ===== */
                    <>
                        {/* Header Block */}
                        <div className="px-7 pt-7 pb-4">
                            <h2 className="text-xl font-semibold text-slate-800 text-center tracking-[0.3px] leading-tight">
                                Add Payment Method
                            </h2>
                            <p className="mt-3 text-[15px] text-slate-500 text-center leading-relaxed">
                                We'll place a temporary $250 hold to verify your card. It's released automatically — you won't be charged.
                            </p>
                        </div>

                        {/* Card Fields Block */}
                        <div className="px-7 pb-6 space-y-5">
                            {/* Input Fields */}
                            <div className="space-y-4">
                                {/* Cardholder */}
                                <div>
                                    <label className="text-xs font-medium text-slate-400 tracking-wide mb-2 block">Cardholder Name</label>
                                    <input
                                        type="text"
                                        value={cardholderName}
                                        onChange={(e) => setCardholderName(e.target.value)}
                                        placeholder="Name on card"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-300 transition-all bg-slate-50/50"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Card Number */}
                                <div>
                                    <label className="text-xs font-medium text-slate-400 tracking-wide mb-2 block">Card Number</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-300 transition-all font-mono bg-slate-50/50"
                                            disabled={isSubmitting}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                            <Lock size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs font-medium text-slate-400 tracking-wide mb-2 block">Expiry</label>
                                        <input
                                            type="text"
                                            value={expiry}
                                            onChange={handleExpiryChange}
                                            placeholder="MM / YY"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-300 transition-all font-mono bg-slate-50/50"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-medium text-slate-400 tracking-wide mb-2 block">CVC</label>
                                        <input
                                            type="text"
                                            value={cvc}
                                            onChange={handleCvcChange}
                                            placeholder="123"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-300 transition-all font-mono bg-slate-50/50"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                {/* Stripe trust badge */}
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Lock size={11} className="text-slate-400" />
                                    <span>Secured by Stripe</span>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-start gap-3 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Checkbox */}
                            <label className="flex items-start gap-3 cursor-pointer group p-3 -mx-1 hover:bg-slate-50/80 rounded-xl transition-colors">
                                <div className="relative flex items-center mt-0.5 shrink-0">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={isCheckboxChecked}
                                        onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                                        disabled={isSubmitting}
                                    />
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isCheckboxChecked ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                                        {isCheckboxChecked && <CheckCircle2 size={14} className="text-white" />}
                                    </div>
                                </div>
                                <span className="text-[13px] text-slate-500 leading-snug select-none group-hover:text-slate-600 transition-colors">
                                    I understand this is a temporary $250 hold to verify my card (not a charge).
                                </span>
                            </label>

                            {/* Actions Block */}
                            <div className="space-y-3 pt-1">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isFormValid || isSubmitting}
                                    className="w-full py-3.5 rounded-full font-semibold text-white text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] active:translate-y-0 flex items-center justify-center gap-2"
                                    style={{
                                        background: isFormValid && !isSubmitting
                                            ? `linear-gradient(135deg, #2238ff 0%, #1a2dbb 100%)`
                                            : COLORS.primary,
                                        boxShadow: isFormValid && !isSubmitting
                                            ? `0 4px 14px -2px rgba(34, 56, 255, 0.4), inset 0 1px 0 0 rgba(255,255,255,0.15)`
                                            : undefined
                                    }}
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

                                {/* Back link */}
                                <button
                                    onClick={() => setStep(1)}
                                    disabled={isSubmitting}
                                    className="w-full py-3 rounded-full font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100/60 transition-colors text-sm"
                                >
                                    ← Back
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default IdentityCheckModal;
