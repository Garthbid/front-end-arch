import React, { useState, useRef } from 'react';
import {
    X, ChevronLeft, Camera, Check, Flame,
    Car, Wrench, Tent, Home, ShoppingBag,
    UploadCloud, Plus, DollarSign, Info, ArrowRight
} from 'lucide-react';
import { COLORS } from '../constants';

interface ListingFlowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

type CategoryType = 'STRUCTURED' | 'SIMPLE';

interface CategoryDef {
    id: string;
    label: string;
    icon: any;
    type: CategoryType;
}

const CATEGORIES: CategoryDef[] = [
    { id: 'Vehicles', label: 'Vehicles', icon: Car, type: 'STRUCTURED' },
    { id: 'Equipment', label: 'Equipment', icon: Wrench, type: 'STRUCTURED' },
    { id: 'Recreational', label: 'Recreational', icon: Tent, type: 'STRUCTURED' },
    { id: 'Garage Sale', label: 'Garage Sale', icon: ShoppingBag, type: 'SIMPLE' },
    { id: 'Real Estate', label: 'Real Estate', icon: Home, type: 'SIMPLE' },
];

const UPSELL_STEPS = [0, 25, 50, 75, 100];

const ListingFlowModal: React.FC<ListingFlowModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [step, setStep] = useState<'CATEGORY' | 'FORM'>('CATEGORY');
    const [selectedCategory, setSelectedCategory] = useState<CategoryDef | null>(null);
    const [images, setImages] = useState<string[]>([]);

    // Upsell State
    const [upsellAmount, setUpsellAmount] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        year: '',
        make: '',
        model: '',
        odometer: '',
        vin: '',
        title: '', // For simple categories
        description: '',
    });

    if (!isOpen) return null;

    const handleCategorySelect = (cat: CategoryDef) => {
        setSelectedCategory(cat);
        setStep('FORM');
        // Reset form data slightly to avoid stale state between switches if user goes back
        setFormData(prev => ({
            ...prev,
            year: '', make: '', model: '', odometer: '', vin: '', title: ''
        }));
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = () => {
        // Mock upload
        const newImage = `https://picsum.photos/400/300?random=${Date.now()}`;
        setImages(prev => [...prev, newImage]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const isFormValid = () => {
        if (!formData.description) return false;

        if (selectedCategory?.type === 'STRUCTURED') {
            return formData.year && formData.make && formData.model && formData.odometer && formData.vin;
        } else {
            return !!formData.title;
        }
    };

    const handleSubmit = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onSubmit({
                category: selectedCategory?.id,
                ...formData,
                images,
                upsellAmount
            });
        }, 1500);
    };

    const getUpsellMessage = (amount: number) => {
        switch (amount) {
            case 0: return "Standard listing visibility";
            case 25: return "1000+ views · 2–3 active bidders";
            case 50: return "2500+ views · 3–5 active bidders";
            case 75: return "5000+ views · 5–10 active bidders";
            case 100: return "10,000+ views · 10+ active bidders";
            default: return "";
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm overflow-hidden">
            <div className="relative w-full max-w-2xl bg-white md:rounded-[32px] shadow-2xl overflow-hidden h-full md:h-auto md:max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-3">
                        {step === 'FORM' && (
                            <button
                                onClick={() => setStep('CATEGORY')}
                                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                                <ChevronLeft size={24} className="text-slate-900" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-2xl font-display text-slate-900 tracking-tight leading-none uppercase">
                                {step === 'CATEGORY' ? 'Select Category' : 'Item Details'}
                            </h2>
                            {step === 'FORM' && (
                                <span className="text-xs font-bold text-[#2238ff] uppercase tracking-wider">
                                    {selectedCategory?.label}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 overscroll-contain">

                    {/* STEP 1: CATEGORY SELECTION */}
                    {step === 'CATEGORY' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategorySelect(cat)}
                                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:bg-white hover:border-[#2238ff] hover:shadow-xl transition-all group text-center h-40"
                                >
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-gray-400 group-hover:text-[#2238ff]">
                                        <cat.icon size={28} strokeWidth={2} />
                                    </div>
                                    <span className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                        {cat.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* STEP 2: FORM */}
                    {step === 'FORM' && selectedCategory && (
                        <div className="space-y-8 max-w-xl mx-auto">

                            {/* Dynamic Fields */}
                            {selectedCategory.type === 'STRUCTURED' ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Year</label>
                                            <input
                                                type="number"
                                                placeholder="2018"
                                                value={formData.year}
                                                onChange={e => handleChange('year', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#2238ff] focus:outline-none transition-all placeholder:text-gray-300"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Make</label>
                                            <input
                                                type="text"
                                                placeholder="Ford"
                                                value={formData.make}
                                                onChange={e => handleChange('make', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#2238ff] focus:outline-none transition-all placeholder:text-gray-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Model</label>
                                        <input
                                            type="text"
                                            placeholder="F-150 Lariat"
                                            value={formData.model}
                                            onChange={e => handleChange('model', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#2238ff] focus:outline-none transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Odometer / Hours</label>
                                        <input
                                            type="text"
                                            placeholder="120,000 km"
                                            value={formData.odometer}
                                            onChange={e => handleChange('odometer', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#2238ff] focus:outline-none transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">VIN / Serial Number</label>
                                        <input
                                            type="text"
                                            placeholder="1FTEW1E..."
                                            value={formData.vin}
                                            onChange={e => handleChange('vin', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#2238ff] focus:outline-none transition-all placeholder:text-gray-300 uppercase font-mono"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Title</label>
                                    <input
                                        type="text"
                                        placeholder="Vintage 1960s Coca Cola Sign"
                                        value={formData.title}
                                        onChange={e => handleChange('title', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#2238ff] focus:outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            )}

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell buyers about the condition, features, and history..."
                                    value={formData.description}
                                    onChange={e => handleChange('description', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:border-[#2238ff] focus:outline-none transition-all placeholder:text-gray-300 resize-none"
                                />
                            </div>


                            {/* Photos */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Photos</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                            <img src={img} alt="Upload" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={handleImageUpload}
                                        className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#2238ff] hover:text-[#2238ff] hover:bg-blue-50 transition-all"
                                    >
                                        <Camera size={24} />
                                        <span className="text-[10px] font-bold uppercase">Add Photo</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 'FORM' && (
                    <div className="p-4 md:p-6 bg-white border-t border-gray-100 z-10 flex flex-col gap-3 pb-[calc(env(safe-area-inset-bottom,20px)+12px)] md:pb-6">
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid() || isLoading}
                            className={`w-full py-4 rounded-xl font-black text-white text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group
                        ${upsellAmount > 0
                                    ? 'bg-[#ff5800] shadow-[0_8px_20px_rgba(255,88,0,0.25)] hover:shadow-[0_12px_24px_rgba(255,88,0,0.35)]'
                                    : 'bg-[#2238ff] shadow-[0_8px_20px_rgba(0,34,255,0.2)] hover:shadow-[0_12px_24px_rgba(0,34,255,0.3)]'
                                }
                    `}
                        >
                            {isLoading ? (
                                <span className="animate-spin">⌛</span>
                            ) : (
                                <>
                                    {upsellAmount > 0 ? 'CHECK OUT' : 'COMPLETE LISTING'}
                                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                                </>
                            )}
                        </button>

                        {/* Reassurance Text */}
                        {upsellAmount > 0 && (
                            <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-in fade-in">
                                You’ll review before paying.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingFlowModal;