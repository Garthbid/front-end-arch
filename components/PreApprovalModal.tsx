import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';
import { COLORS } from '../constants';

interface PreApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PreApprovalData) => void;
}

export interface PreApprovalData {
    fullName: string;
    email: string;
    phone: string;
    incomeRange: string;
}

const INCOME_RANGES = [
    '$0 - $25,000',
    '$25,001 - $50,000',
    '$50,001 - $75,000',
    '$75,001 - $100,000',
    '$100,001+',
];

const PreApprovalModal: React.FC<PreApprovalModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<PreApprovalData>({
        fullName: '',
        email: '',
        phone: '',
        incomeRange: '',
    });
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) return;

        setIsSubmitting(true);
        // Simulate network delay
        setTimeout(() => {
            setIsSubmitting(false);
            onSubmit(formData);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                style={{ background: COLORS.surface1, border: `1px solid ${COLORS.border}` }}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-display font-bold text-gray-900">Get Pre-Approved</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">No impact to credit score</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Phone</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                                    placeholder="(555) 123-4567"
                                    value={formData.phone}
                                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Annual Income</label>
                            <select
                                required
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium appearance-none"
                                value={formData.incomeRange}
                                onChange={e => setFormData(prev => ({ ...prev, incomeRange: e.target.value }))}
                            >
                                <option value="">Select Range</option>
                                {INCOME_RANGES.map(range => (
                                    <option key={range} value={range}>{range}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors">
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${agreed ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                                {agreed && <CheckCircle size={14} className="text-white" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={agreed}
                                onChange={e => setAgreed(e.target.checked)}
                            />
                            <span className="text-sm text-gray-600 leading-tight">
                                I agree to the <span className="text-blue-600 font-semibold">Terms of Service</span> and authorize a soft credit check.
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!agreed || isSubmitting}
                        className="w-full py-4 rounded-xl font-black text-lg text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.5)'
                        }}
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                SUBMIT APPLICATION <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
                            <ShieldCheck size={12} /> Bank-Level Security
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default PreApprovalModal;
