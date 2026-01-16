import React, { useState } from 'react';
import { X, Sparkles, Phone, Globe, User, ArrowRight, Check } from 'lucide-react';
import { COLORS } from '../constants';

interface HammerClubRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

const HammerClubRequestModal: React.FC<HammerClubRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const isFormValid = fullName.trim() && phone.trim() && website.trim();

    const handleSubmit = async () => {
        if (!isFormValid) return;
        setIsSubmitting(true);
        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
        setTimeout(() => {
            onSubmit();
            // Reset form
            setFullName('');
            setPhone('');
            setWebsite('');
            setIsSubmitted(false);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
                style={{ maxHeight: '90vh' }}
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 -mr-32 -mt-32" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #ef4444 100%)' }} />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-2xl opacity-15 -ml-24 -mb-24" style={{ background: '#3b82f6' }} />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white/60 hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className="relative z-10 p-8 overflow-y-auto" style={{ maxHeight: '90vh' }}>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(239, 68, 68, 0.2) 100%)' }}
                        >
                            <Sparkles size={24} className="text-amber-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-0.5">Request Access</p>
                            <h2 className="text-2xl font-display text-white uppercase italic">🔨 Hammer Club</h2>
                        </div>
                    </div>

                    {isSubmitted ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                                <Check size={40} className="text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Request Submitted</h3>
                            <p className="text-white/60 text-sm">We'll be in touch within 48 hours.</p>
                        </div>
                    ) : (
                        <>
                            {/* Description */}
                            <div className="space-y-4 mb-8">
                                <p className="text-white/80 text-sm leading-relaxed">
                                    The Hammer Club is reserved for operators doing <span className="text-amber-400 font-bold">$100,000+ per month</span> in volume on Garthbid.
                                </p>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    This is a closed, high-signal group focused on advanced marketing strategy, real data analysis, and AI-driven execution. Participation can materially impact not just your results on Garthbid, but how you operate across your entire business.
                                </p>
                                <p className="text-amber-400/80 text-sm font-medium">
                                    Access is limited. Not every request is approved.
                                </p>
                            </div>

                            {/* How it works */}
                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">How it works</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-xs font-bold">1</div>
                                        <span className="text-white/70 text-sm">Submit your details below</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-xs font-bold">2</div>
                                        <span className="text-white/70 text-sm">The founder will personally review your request</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-xs font-bold">3</div>
                                        <span className="text-white/70 text-sm">If it looks like a strong fit, you'll receive a direct phone call for a brief interview</span>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="space-y-4 mb-8">
                                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Required information</h3>

                                {/* Full Name */}
                                <div>
                                    <label className="block text-xs font-medium text-white/60 mb-2">Full name</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Enter your full name"
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-medium text-white/60 mb-2">Phone number</label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Website */}
                                <div>
                                    <label className="block text-xs font-medium text-white/60 mb-2">Business website</label>
                                    <div className="relative">
                                        <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                        <input
                                            type="url"
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            placeholder="https://yourcompany.com"
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={!isFormValid || isSubmitting}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all duration-300 ${isFormValid && !isSubmitting
                                        ? 'active:scale-[0.98] hover:-translate-y-1 hover:shadow-2xl'
                                        : 'opacity-50 cursor-not-allowed'
                                    }`}
                                style={{
                                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                    color: '#0f172a',
                                    boxShadow: isFormValid ? '0 15px 40px -10px rgba(251, 191, 36, 0.5)' : 'none'
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        SUBMIT REQUEST
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HammerClubRequestModal;
