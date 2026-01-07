import React from 'react';
import { X, Lock, Crown } from 'lucide-react';
import { COLORS } from '../constants';

interface CharacterSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CharacterSelectionModal: React.FC<CharacterSelectionModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const characters = Array.from({ length: 8 }, (_, i) => ({ id: i + 2, locked: true }));

    const handleLockedClick = () => {
        alert("You need to upgrade to unlock this character.");
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
                    <h2 className="text-xl font-display text-slate-900 tracking-tight leading-none uppercase">
                        Choose Character
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-3 gap-4">
                    {/* Current Character (Garth) - Unlocked */}
                    <button className="aspect-square rounded-2xl border-4 border-[#224cff] bg-blue-50 relative overflow-hidden group shadow-lg">
                        <img
                            src="/garth-cowboy.png"
                            alt="Garth"
                            className="w-full h-full object-contain scale-110 mt-2"
                        />
                        <div className="absolute top-2 right-2 bg-[#224cff] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Active
                        </div>
                    </button>

                    {/* Locked Characters */}
                    {characters.map((char) => (
                        <button
                            key={char.id}
                            onClick={handleLockedClick}
                            className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 relative flex items-center justify-center group hover:bg-gray-100 transition-colors"
                        >
                            <div className="absolute inset-0 bg-gray-200/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                                    <Lock size={14} className="text-gray-400" />
                                </div>
                            </div>
                            <UserPlaceholder color={COLORS.textMuted} />
                        </button>
                    ))}
                </div>

                <div className="p-4 bg-gray-50 border-t text-center">
                    <p className="text-xs text-gray-500">
                        Unlock more characters with <span className="font-bold text-[#224cff]">Master Membership</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

const UserPlaceholder = ({ color }: { color: string }) => (
    <div className="w-16 h-16 rounded-full bg-gray-200 opacity-20 flex items-center justify-center">
        {/* Abstract shape */}
    </div>
);

export default CharacterSelectionModal;
