import React, { useState } from 'react';
import { Zap, Flame, Rocket, Target, Check, Star, ChevronRight, Sparkles } from 'lucide-react';
import { COLORS } from '../constants';

interface BoostSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectBoost: (tier: 'FREE' | '$25' | '$50' | '$100' | '$250') => void;
}

const BOOST_TIERS = [
    {
        id: 'FREE',
        price: '$0',
        label: '$0 FEES',
        sublabel: 'TRY YOUR LUCK',
        title: 'FREE',
        icon: Sparkles,
        color: COLORS.fireOrange,
        description: 'Try your luck with powerful momentum from over 10,000 weekly bidders!',
        features: [
            { icon: Check, text: 'Access to 10,000+ weekly active bidders' },
            { icon: Zap, text: 'Organic auction momentum' },
            { icon: Star, text: '100% free — no risk to start' }
        ],
        cta: 'LIST FOR FREE',
        badge: null
    },
    {
        id: '$25',
        price: '$25',
        label: '$25',
        sublabel: 'BOOST',
        title: 'LIGHT IGNITION',
        icon: Zap,
        color: COLORS.fireOrange,
        description: 'Get early visibility with Facebook Marketplace AI targeting.',
        features: [
            { icon: Check, text: '$25 Facebook Marketplace Boost' },
            { icon: Zap, text: 'Increases early visibility and first bids' },
            { icon: Star, text: 'Great for niche items' }
        ],
        cta: 'ADD $25 BOOST',
        badge: null
    },
    {
        id: '$50',
        price: '$50',
        label: '$50',
        sublabel: 'BOOST',
        title: 'THE SWEET SPOT',
        icon: Flame,
        color: COLORS.fireOrange,
        description: 'The most consistent level for creating real bidding wars.',
        features: [
            { icon: Check, text: '$25 Facebook Marketplace Boost' },
            { icon: Flame, text: '$25 Ad Spend on your custom commercial' },
            { icon: Star, text: 'Most Popular Choice' }
        ],
        cta: 'ADD $50 BOOST',
        badge: 'MOST POPULAR'
    },
    {
        id: '$100',
        price: '$100',
        label: '$100',
        sublabel: 'BOOST',
        title: 'HIGH VISIBILITY',
        icon: Rocket,
        color: COLORS.fireOrange,
        description: 'Custom AI Facebook Ad with 10K-50K+ potential views.',
        features: [
            { icon: Check, text: '$50 FB Boost + $50 Custom AI Ad' },
            { icon: Rocket, text: '10,000–50,000+ potential views' },
            { icon: Star, text: 'Viral upside is real' }
        ],
        cta: 'ADD $100 BOOST',
        badge: null
    },
    {
        id: '$250',
        price: '$250',
        label: '$250',
        sublabel: 'BOOST',
        title: 'ALL-OUT WAR',
        icon: Target,
        color: COLORS.fireOrange,
        description: 'Maximum exposure. Highest probability of a true bidding war.',
        features: [
            { icon: Check, text: '$100 FB Boost + $100 AI Ad' },
            { icon: Target, text: '$50 Kijiji Top Ad' },
            { icon: Star, text: 'Best chance at full market value' }
        ],
        cta: 'ADD $250 BOOST',
        badge: 'MAXIMUM POWER'
    }
];

const BoostSelectionModal: React.FC<BoostSelectionModalProps> = ({
    isOpen,
    onSelectBoost
}) => {
    const [sliderValue, setSliderValue] = useState(0); // Start at FREE

    if (!isOpen) return null;

    const currentTier = BOOST_TIERS[sliderValue];
    const sliderLabels = ['FREE', '$25', '$50', '$100', '$250'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden"
                style={{ background: COLORS.voidBlack }}
            >
                <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{ background: `${COLORS.fireOrange}15` }}>
                            <Rocket size={14} style={{ color: COLORS.fireOrange }} />
                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: COLORS.fireOrange }}>
                                BOOST YOUR LISTING
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-display uppercase italic tracking-tighter mb-2" style={{ color: COLORS.textPrimary }}>
                            IMPORTANT <span style={{ color: COLORS.fireOrange }}>DECISION</span>
                        </h1>
                        <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                            More boost = more bidders = higher final price.
                        </p>
                    </div>

                    {/* Single Card */}
                    <div
                        className="relative rounded-[20px] p-5 md:p-6 border-2 transition-all duration-300"
                        style={{
                            background: COLORS.surface1,
                            borderColor: currentTier.color
                        }}
                    >
                        {/* Badge */}
                        {currentTier.badge && (
                            <div
                                className="absolute -top-2.5 left-4 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white transition-all duration-300"
                                style={{ background: currentTier.color }}
                            >
                                {currentTier.badge}
                            </div>
                        )}

                        {/* Icon & Price Row */}
                        <div className="flex items-start justify-between mb-4 mt-1">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                                style={{ background: `${currentTier.color}15` }}
                            >
                                <currentTier.icon size={24} style={{ color: currentTier.color }} />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold transition-all duration-300" style={{ color: COLORS.textPrimary }}>
                                    {currentTier.label}
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-wider transition-all duration-300" style={{ color: currentTier.color }}>
                                    {currentTier.sublabel}
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-display uppercase italic text-2xl tracking-tight mb-2 transition-all duration-300" style={{ color: COLORS.textPrimary }}>
                            {currentTier.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm mb-4 leading-relaxed transition-all duration-300" style={{ color: COLORS.textSecondary }}>
                            {currentTier.description}
                        </p>

                        {/* Features */}
                        <ul className="space-y-2.5 mb-5">
                            {currentTier.features.map((f, idx) => (
                                <li key={idx} className="flex items-center gap-2.5 text-sm transition-all duration-300" style={{ color: COLORS.textSecondary }}>
                                    <f.icon size={16} style={{ color: currentTier.color }} />
                                    <span>{f.text}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Slider */}
                        <div className="mb-5">
                            <div className="flex justify-between mb-2 px-0.5">
                                {sliderLabels.map((label, idx) => (
                                    <button
                                        key={label}
                                        onClick={() => setSliderValue(idx)}
                                        className={`text-[11px] font-bold transition-all ${sliderValue === idx ? 'scale-110' : 'opacity-40 hover:opacity-70'}`}
                                        style={{ color: sliderValue === idx ? BOOST_TIERS[idx].color : COLORS.textMuted }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="4"
                                step="1"
                                value={sliderValue}
                                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                                className="w-full h-2.5 rounded-full appearance-none cursor-pointer transition-all"
                                style={{
                                    background: `linear-gradient(to right, ${currentTier.color} 0%, ${currentTier.color} ${sliderValue * 25}%, ${COLORS.border} ${sliderValue * 25}%, ${COLORS.border} 100%)`,
                                }}
                            />
                        </div>

                        {/* CTA */}
                        <button
                            onClick={() => onSelectBoost(currentTier.id as 'FREE' | '$25' | '$50' | '$100' | '$250')}
                            className="w-full py-4 rounded-xl font-bold text-base text-white transition-all duration-300 hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2"
                            style={{ background: currentTier.color }}
                        >
                            {currentTier.cta} <ChevronRight size={18} strokeWidth={3} />
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs mt-5" style={{ color: COLORS.textMuted }}>
                        <span className="font-medium">Boosting guarantees reach, not price.</span> Bidding wars do the rest.
                    </p>
                </div>
            </div>

            {/* Slider Styling */}
            <style>{`
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: white;
                    border: 3px solid ${currentTier.color};
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    transition: border-color 0.3s;
                }
                input[type="range"]::-moz-range-thumb {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: white;
                    border: 3px solid ${currentTier.color};
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default BoostSelectionModal;
