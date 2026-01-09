import React, { useState } from 'react';
import { X, ArrowRight, Building2, User, Loader2, Plus, Trash2, Pen } from 'lucide-react';
import CharacterSelectionModal from './CharacterSelectionModal';
import { COLORS } from '../constants';
import { CharacterType, MembershipTier } from '../App';

// Character image mappings
const CHARACTER_PFP: Record<CharacterType, string> = {
    'BUYERS': '/garth-buyers-pfp.jpg',
    'SNIPER': '/garth-sniper-pfp.jpg',
    'HAMMER': '/garth-hammer-pfp.png',
};

interface ProfileCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    membershipTier: MembershipTier;
    selectedCharacter: CharacterType;
    onSelectCharacter: (character: CharacterType) => void;
    onUpgrade: (tier: MembershipTier) => void;
}

type AccountType = 'PERSONAL' | 'BUSINESS';

interface TaxEntry {
    id: string;
    type: string;
    percentage: string;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    membershipTier,
    selectedCharacter,
    onSelectCharacter,
    onUpgrade,
}) => {
    const [step, setStep] = useState(1); // Future proofing for multi-step if needed, currently single scroll
    const [isLoading, setIsLoading] = useState(false);
    const [accountType, setAccountType] = useState<AccountType>('PERSONAL');
    const [isCharModalOpen, setIsCharModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        description: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        gstNumber: '',
    });

    // Dynamic Taxes State
    const [taxes, setTaxes] = useState<TaxEntry[]>([
        { id: '1', type: 'GST', percentage: '' }
    ]);

    if (!isOpen) return null;

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Tax Management
    const handleTaxChange = (id: string, field: keyof TaxEntry, value: string) => {
        setTaxes(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const addTax = () => {
        setTaxes(prev => [
            ...prev,
            { id: Date.now().toString(), type: 'PST', percentage: '' }
        ]);
    };

    const removeTax = (id: string) => {
        if (taxes.length > 1) {
            setTaxes(prev => prev.filter(t => t.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API save
        setTimeout(() => {
            setIsLoading(false);
            onSubmit({
                ...formData,
                accountType,
                taxes: accountType === 'BUSINESS' ? taxes : []
            });
        }, 1000);
    };

    const isFormValid = () => {
        const basic = formData.fullName && formData.email && formData.address && formData.city && formData.province && formData.postalCode;
        if (accountType === 'PERSONAL') return basic;

        // Check business requirements
        const taxesValid = taxes.every(t => t.type && t.percentage);
        return basic && formData.gstNumber && taxesValid;
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-display text-slate-900 tracking-tight leading-none">
                            COMPLETE PROFILE
                        </h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">
                            Required to sell on GarthBid
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6 space-y-6">

                    {/* Character Change Trigger */}
                    <div className="flex flex-col items-center justify-center">
                        <button
                            onClick={() => setIsCharModalOpen(true)}
                            className="relative group cursor-pointer active:scale-95 transition-transform"
                        >
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 relative z-10 group-hover:scale-105 transition-transform duration-300">
                                <img src={CHARACTER_PFP[selectedCharacter]} alt="Character" className="w-full h-full object-cover scale-150" />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 bg-white border border-gray-100 shadow-md rounded-full px-3 py-1 whitespace-nowrap flex items-center gap-1.5">
                                <Pen size={10} className="text-[#224cff]" strokeWidth={3} />
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide">
                                    Change Character
                                </span>
                            </div>
                        </button>
                    </div>

                    <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Account Type Toggle */}
                        <div className="p-1 bg-gray-100 rounded-xl flex">
                            <button
                                type="button"
                                onClick={() => setAccountType('PERSONAL')}
                                className={`flex-1 py-3 rounded-lg text-sm font-black uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${accountType === 'PERSONAL' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <User size={16} strokeWidth={3} /> Personal
                            </button>
                            <button
                                type="button"
                                onClick={() => setAccountType('BUSINESS')}
                                className={`flex-1 py-3 rounded-lg text-sm font-black uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${accountType === 'BUSINESS' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Building2 size={16} strokeWidth={3} /> Business
                            </button>
                        </div>

                        {/* Core Fields */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Garth Rogers"
                                    value={formData.fullName}
                                    onChange={e => handleChange('fullName', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#224cff] focus:outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="garth@example.com"
                                    value={formData.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#224cff] focus:outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Bio Description</label>
                                <textarea
                                    rows={3}
                                    maxLength={160}
                                    placeholder="Tell us about yourself..."
                                    value={formData.description}
                                    onChange={e => handleChange('description', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#224cff] focus:outline-none transition-all placeholder:text-gray-300 resize-none"
                                />
                                <div className="text-right text-[10px] text-gray-400 pr-1">
                                    {formData.description.length}/160
                                </div>
                            </div>

                            {/* Address Group */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1 col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Street Address</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="123 Auction Lane"
                                        value={formData.address}
                                        onChange={e => handleChange('address', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#224cff] focus:outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Town / City</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Edmonton"
                                        value={formData.city}
                                        onChange={e => handleChange('city', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#224cff] focus:outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Province</label>
                                    <select
                                        required
                                        value={formData.province}
                                        onChange={e => handleChange('province', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#224cff] focus:outline-none transition-all appearance-none"
                                    >
                                        <option value="" disabled>Select</option>
                                        <option value="AB">Alberta</option>
                                        <option value="BC">British Columbia</option>
                                        <option value="ON">Ontario</option>
                                        <option value="QC">Quebec</option>
                                        <option value="SK">Saskatchewan</option>
                                        <option value="MB">Manitoba</option>
                                        {/* Add others as needed */}
                                    </select>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Postal Code</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="T5J 0N3"
                                        value={formData.postalCode}
                                        onChange={e => handleChange('postalCode', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#224cff] focus:outline-none transition-all placeholder:text-gray-300 uppercase"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Business Specific Fields - Conditional */}
                        {accountType === 'BUSINESS' && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <Building2 size={18} className="text-[#224cff]" />
                                    <h3 className="text-sm font-black uppercase text-slate-900">Tax Information</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">GST / Business Number</label>
                                        <input
                                            required={accountType === 'BUSINESS'}
                                            type="text"
                                            placeholder="12345 6789 RT0001"
                                            value={formData.gstNumber}
                                            onChange={e => handleChange('gstNumber', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#224cff] focus:outline-none transition-all placeholder:text-gray-300 font-mono"
                                        />
                                    </div>

                                    {/* Dynamic Taxes List */}
                                    <div className="space-y-3">
                                        {taxes.map((tax, index) => (
                                            <div key={tax.id} className="grid grid-cols-2 gap-4 relative group">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                                                        {index === 0 ? 'Tax Type' : 'Additional Tax'}
                                                    </label>
                                                    <select
                                                        value={tax.type}
                                                        onChange={e => handleTaxChange(tax.id, 'type', e.target.value)}
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#224cff] focus:outline-none transition-all"
                                                    >
                                                        <option value="GST">GST</option>
                                                        <option value="PST">PST</option>
                                                        <option value="HST">HST</option>
                                                        <option value="QST">QST</option>
                                                        <option value="RST">RST</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                                                        {index === 0 ? 'Tax %' : '%'}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            required={accountType === 'BUSINESS'}
                                                            type="number"
                                                            placeholder="5"
                                                            min="0"
                                                            max="100"
                                                            value={tax.percentage}
                                                            onChange={e => handleTaxChange(tax.id, 'percentage', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#224cff] focus:outline-none transition-all placeholder:text-gray-300 pr-8"
                                                        />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                                    </div>
                                                </div>

                                                {/* Remove Button for extra rows */}
                                                {taxes.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTax(tax.id)}
                                                        className="absolute -right-2 -top-2 w-6 h-6 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-md flex items-center justify-center border border-gray-100 transition-colors z-10"
                                                    >
                                                        <Trash2 size={12} strokeWidth={2.5} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Tax Button */}
                                    <button
                                        type="button"
                                        onClick={addTax}
                                        className="flex items-center gap-2 text-xs font-black text-[#224cff] hover:text-blue-700 uppercase tracking-wider py-2 pl-1 transition-colors"
                                    >
                                        <Plus size={14} strokeWidth={4} />
                                        Add Another Tax Type
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t border-gray-100 z-10">
                    <button
                        type="submit"
                        form="profile-form"
                        disabled={!isFormValid() || isLoading}
                        className="w-full py-4 rounded-xl font-black text-white text-lg shadow-[0_8px_20px_rgba(34,76,255,0.2)] hover:shadow-[0_12px_24px_rgba(34,76,255,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <>CONTINUE TO SELL <ArrowRight size={20} strokeWidth={3} /></>}
                    </button>
                </div>

            </div>

            <CharacterSelectionModal
                isOpen={isCharModalOpen}
                onClose={() => setIsCharModalOpen(false)}
                membershipTier={membershipTier}
                selectedCharacter={selectedCharacter}
                onSelectCharacter={onSelectCharacter}
                onUpgrade={onUpgrade}
            />
        </div>
    );
};

export default ProfileCompletionModal;