import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Phone, Lock, Loader2, Check, Info, Bot } from 'lucide-react';
import { COLORS } from '../constants';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onAgentClick?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, onAgentClick }) => {
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [mondaySmsConsent, setMondaySmsConsent] = useState(false);
    const [showReminderHelper, setShowReminderHelper] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStep('PHONE');
            setPhone('');
            setPhone('');
            setOtp('');
            setMondaySmsConsent(false);
            setShowReminderHelper(false);
            setIsPulsing(false);
            setIsLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) return;

        if (!mondaySmsConsent) {
            setShowReminderHelper(true);
            setIsPulsing(true);
            setTimeout(() => setIsPulsing(false), 1000); // 1s pulse
            return;
        }

        setIsLoading(true);
        // Mock API call
        setTimeout(() => {
            setIsLoading(false);
            setStep('OTP');
        }, 1000);
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 4) return;

        setIsLoading(true);
        // Mock Verification
        setTimeout(() => {
            setIsLoading(false);
            onSuccess();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 pt-6 pb-2 flex justify-between items-center">
                    <h2 className="text-2xl font-display text-slate-900 tracking-tight">
                        {step === 'PHONE' ? 'GET STARTED' : 'VERIFY CODE'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 pt-2">
                    {step === 'PHONE' ? (
                        <form onSubmit={handlePhoneSubmit} className="space-y-6">
                            <p className="text-gray-500 font-medium">
                                Enter your mobile number to bid, buy, and sell. No passwords to remember.
                            </p>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="(555) 555-0123"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-xl font-bold text-slate-900 focus:outline-none focus:border-[#2238ff] focus:bg-white transition-colors placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            {/* Monday SMS Consent Row */}
                            <div className="space-y-3">
                                <div
                                    className={`group relative flex items-start justify-between gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 ${mondaySmsConsent ? 'border-blue-200 bg-blue-50/50' : (phone.length >= 3 ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50')}`}
                                    onClick={() => {
                                        setMondaySmsConsent(!mondaySmsConsent);
                                        if (showReminderHelper) setShowReminderHelper(false);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === ' ' || e.key === 'Enter') {
                                            e.preventDefault();
                                            setMondaySmsConsent(!mondaySmsConsent);
                                            if (showReminderHelper) setShowReminderHelper(false);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-labelledby="monday-reminder-label"
                                >
                                    <div className="flex flex-col gap-1 pr-2">
                                        <div className="flex items-start gap-2">
                                            <span id="monday-reminder-label" className={`text-sm font-semibold leading-tight transition-colors ${mondaySmsConsent ? 'text-blue-700' : 'text-slate-900 group-hover:text-slate-800'}`}>
                                                Get a reminder when Monday’s auction begins.
                                            </span>
                                            {mondaySmsConsent && (
                                                <Check size={16} className="text-blue-600 shrink-0 mt-0.5 animate-in fade-in zoom-in spin-in-12 duration-300" strokeWidth={2.5} />
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium">
                                            One reminder text each Monday. No spam. Toggle on to continue.
                                        </span>
                                    </div>

                                    {/* Switch */}
                                    <div className={`relative shrink-0 w-11 h-6 rounded-full transition-all duration-500 ease-in-out ${mondaySmsConsent ? 'bg-blue-600' : (phone.length >= 3 ? 'bg-blue-200 ring-4 ring-blue-200 animate-pulse' : 'bg-slate-200 group-hover:bg-slate-300')}`}>
                                        <div
                                            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ease-in-out ${mondaySmsConsent ? 'translate-x-5' : 'translate-x-0'} ${!mondaySmsConsent && 'shadow-sm'}`}
                                        />
                                    </div>
                                </div>

                                {/* Feedback Messages */}
                                {mondaySmsConsent && (
                                    <div className="flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1">
                                        <Check size={12} className="text-emerald-500" strokeWidth={3} />
                                        <p className="text-xs text-slate-500 font-medium">
                                            All set — we’ll send you one reminder each Monday.
                                        </p>
                                    </div>
                                )}

                                {showReminderHelper && !mondaySmsConsent && (
                                    <div
                                        className="rounded-lg bg-red-50 p-3 flex gap-3 animate-in fade-in slide-in-from-top-1 duration-300"
                                        role="alert"
                                        aria-live="polite"
                                    >
                                        <Info size={16} className="text-red-600 shrink-0 mt-0.5" />
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-semibold text-red-900">
                                                Before we send your code
                                            </p>
                                            <p className="text-xs text-red-700">
                                                Monday reminders are required so we can notify you when auctions begin.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={phone.length < 3 || isLoading}
                                onClick={(e) => {
                                    if (!mondaySmsConsent && phone.length >= 3) {
                                        e.preventDefault();
                                        setShowReminderHelper(true);
                                    }
                                }}
                                className={`w-full py-4 rounded-xl font-black text-white text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${!mondaySmsConsent && phone.length >= 3 ? 'opacity-50 cursor-not-allowed hover:shadow-lg active:scale-100' : ''}`}
                                style={{ backgroundColor: COLORS.primary }}
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <>SEND CODE <ArrowRight size={20} /></>}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <p className="text-gray-500 font-medium">
                                We sent a code to <span className="text-slate-900 font-bold">{phone}</span>.
                            </p>

                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        autoFocus
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="0000"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-2xl font-black text-slate-900 tracking-[0.5em] focus:outline-none focus:border-[#2238ff] focus:bg-white transition-colors placeholder:tracking-normal placeholder:text-gray-300 text-center"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={otp.length < 3 || isLoading}
                                className="w-full py-4 rounded-xl font-black text-white text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: COLORS.primary }}
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : 'VERIFY & ENTER'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep('PHONE')}
                                className="w-full text-center text-sm font-bold text-gray-400 hover:text-slate-700"
                            >
                                Wrong number?
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 text-center space-y-2">
                    {onAgentClick && (
                        <button
                            type="button"
                            onClick={onAgentClick}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors hover:bg-purple-50"
                            style={{ color: '#8b5cf6' }}
                        >
                            <Bot size={14} /> Are you an AI agent? Click here
                        </button>
                    )}
                    <p className="text-[10px] text-gray-400 font-medium">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;