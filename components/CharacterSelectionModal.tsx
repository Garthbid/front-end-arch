import React, { useState } from 'react';
import { X, Lock, Check, Crown, Target, Gavel } from 'lucide-react';
import { COLORS } from '../constants';
import { CharacterType, MembershipTier } from '../App';

interface CharacterSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    membershipTier: MembershipTier;
    selectedCharacter: CharacterType;
    onSelectCharacter: (character: CharacterType) => void;
    onUpgrade: (tier: MembershipTier) => void;
}

// Character configuration
const CHARACTERS = [
    {
        id: 'BUYERS' as CharacterType,
        name: 'Buyers Club',
        description: 'The classic Garth',
        pfpImage: '/garth-buyers-pfp.jpg',
        fullImage: '/garth-cowboy.png',
        requiredTier: 'BUYERS' as MembershipTier,
        icon: Crown,
        accentColor: '#10b981', // Emerald
    },
    {
        id: 'SNIPER' as CharacterType,
        name: 'Sniper Club',
        description: 'Tactical bidder',
        pfpImage: '/garth-sniper-pfp.jpg',
        fullImage: '/garth-sniper.png',
        requiredTier: 'SNIPER' as MembershipTier,
        icon: Target,
        accentColor: '#8b5cf6', // Purple
    },
    {
        id: 'HAMMER' as CharacterType,
        name: 'Hammer Club',
        description: 'The closer',
        pfpImage: '/garth-hammer-pfp.png',
        fullImage: '/garth-hammer.png',
        requiredTier: 'HAMMER' as MembershipTier,
        icon: Gavel,
        accentColor: '#f59e0b', // Amber
    },
];

// Tier hierarchy for unlock checks
const TIER_LEVEL: Record<MembershipTier, number> = {
    'BUYERS': 0,
    'SNIPER': 1,
    'HAMMER': 2,
};

const CharacterSelectionModal: React.FC<CharacterSelectionModalProps> = ({
    isOpen,
    onClose,
    membershipTier,
    selectedCharacter,
    onSelectCharacter,
    onUpgrade,
}) => {
    const [upsellTarget, setUpsellTarget] = useState<MembershipTier | null>(null);

    if (!isOpen) return null;

    const isUnlocked = (requiredTier: MembershipTier) => {
        return TIER_LEVEL[membershipTier] >= TIER_LEVEL[requiredTier];
    };

    const handleCharacterClick = (char: typeof CHARACTERS[0]) => {
        if (isUnlocked(char.requiredTier)) {
            onSelectCharacter(char.id);
            onClose();
        } else {
            setUpsellTarget(char.requiredTier);
        }
    };

    const handleUpgradeConfirm = () => {
        if (upsellTarget) {
            onUpgrade(upsellTarget);
            setUpsellTarget(null);
        }
    };

    const getClubName = (tier: MembershipTier) => {
        switch (tier) {
            case 'SNIPER': return 'Sniper Club';
            case 'HAMMER': return 'Hammer Club';
            default: return 'Buyers Club';
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-xl font-display text-slate-900 tracking-tight leading-none uppercase">
                            Choose Character
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Select your profile avatar</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content - 3 Character Grid */}
                <div className="p-6 grid grid-cols-3 gap-4">
                    {CHARACTERS.map((char) => {
                        const unlocked = isUnlocked(char.requiredTier);
                        const isActive = selectedCharacter === char.id;
                        const Icon = char.icon;

                        return (
                            <button
                                key={char.id}
                                onClick={() => handleCharacterClick(char)}
                                className={`
                                    aspect-square rounded-2xl relative overflow-hidden group
                                    transition-all duration-300
                                    ${isActive ? 'ring-4 shadow-lg scale-105' : 'hover:scale-105'}
                                    ${unlocked ? 'cursor-pointer' : 'cursor-pointer'}
                                `}
                                style={{
                                    borderColor: isActive ? char.accentColor : COLORS.border,
                                    borderWidth: isActive ? 4 : 2,
                                    borderStyle: 'solid',
                                    background: unlocked ? '#f8fafc' : '#f1f5f9',
                                    ringColor: isActive ? char.accentColor : undefined,
                                }}
                            >
                                {/* Character Image */}
                                <img
                                    src={char.pfpImage}
                                    alt={char.name}
                                    className={`
                                        w-full h-full object-cover scale-150
                                        transition-all duration-300
                                        ${unlocked ? '' : 'blur-[3px] opacity-60'}
                                    `}
                                />

                                {/* Active Badge */}
                                {isActive && unlocked && (
                                    <div
                                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                                        style={{ background: char.accentColor }}
                                    >
                                        <Check size={14} className="text-white" strokeWidth={3} />
                                    </div>
                                )}

                                {/* Lock Overlay for locked characters */}
                                {!unlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center backdrop-blur-sm">
                                            <Lock size={18} className="text-gray-500" />
                                        </div>
                                    </div>
                                )}

                                {/* Club Icon Badge */}
                                <div
                                    className={`
                                        absolute bottom-2 left-1/2 -translate-x-1/2 
                                        px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide
                                        flex items-center gap-1 whitespace-nowrap
                                        ${unlocked ? 'bg-white/90 shadow-sm' : 'bg-white/70'}
                                    `}
                                    style={{ color: unlocked ? char.accentColor : '#9ca3af' }}
                                >
                                    <Icon size={10} strokeWidth={3} />
                                    <span className="hidden sm:inline">{char.name.split(' ')[0]}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer Hint */}
                <div className="p-4 bg-gray-50 border-t text-center">
                    <p className="text-xs text-gray-500">
                        Unlock exclusive characters with <span className="font-bold text-[#224cff]">higher membership tiers</span>
                    </p>
                </div>
            </div>

            {/* Upsell Modal Overlay */}
            {upsellTarget && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setUpsellTarget(null)}
                    />
                    <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
                        {/* Club Preview Image */}
                        <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-gray-100 shadow-lg">
                            <img
                                src={CHARACTERS.find(c => c.requiredTier === upsellTarget)?.pfpImage}
                                alt="Character Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h3 className="text-xl font-display uppercase text-slate-900 mb-2">
                            Upgrade to {getClubName(upsellTarget)}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            You need to join the <span className="font-bold" style={{ color: CHARACTERS.find(c => c.requiredTier === upsellTarget)?.accentColor }}>{getClubName(upsellTarget)}</span> to own this character.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setUpsellTarget(null)}
                                className="flex-1 py-3 rounded-xl font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpgradeConfirm}
                                className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg hover:opacity-90 transition-all active:scale-95"
                                style={{
                                    background: CHARACTERS.find(c => c.requiredTier === upsellTarget)?.accentColor || COLORS.primary
                                }}
                            >
                                Join {getClubName(upsellTarget)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CharacterSelectionModal;
