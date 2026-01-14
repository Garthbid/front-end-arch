import React from 'react';
import { X, Sparkles, MessageCircle, Flame, BookOpen, ShieldCheck } from 'lucide-react';
import { COLORS } from '../constants';

interface GarthWelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoinClub: () => void;
    onCommunity: () => void;
    onRules: () => void;
}

const GarthWelcomeModal: React.FC<GarthWelcomeModalProps> = ({
    isOpen,
    onClose,
    onJoinClub,
    onCommunity,
    onRules
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className="relative w-full sm:max-w-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-full bg-slate-100 text-slate-600">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Hey — I'm Garth 👋</h2>
                            <p className="text-sm text-slate-500 font-medium">Welcome to the arena.</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mt-4">
                        Before you dive in, here are a few things that'll help you get the most out of the platform:
                    </p>
                </div>

                {/* Separator */}
                <div className="h-px bg-slate-100 mx-8" />

                {/* Content Rows */}
                <div className="p-8 pt-6 space-y-4">

                    {/* 1. Buyers Club */}
                    <div className="group rounded-xl border border-slate-200 p-5 hover:bg-slate-50 transition-colors cursor-pointer" onClick={onJoinClub}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-slate-900">Garth Buyers Club</h3>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">Premium</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Lower platform fees and full access to me — I’ll help you price items, avoid bad bids, and spot great deals.
                                </p>
                            </div>
                        </div>
                        <button className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors w-full sm:w-auto">
                            View Buyers Club
                        </button>
                    </div>

                    {/* 2. Community */}
                    <div className="group rounded-xl border border-slate-200 p-5 hover:bg-slate-50 transition-colors cursor-pointer" onClick={onCommunity}>
                        <div className="flex items-start gap-4">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-slate-900">Garth Community</h3>
                                    <MessageCircle size={14} className="text-slate-400" />
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Chat with other members, ask questions, and request new features. The best ideas here actually get built.
                                </p>
                            </div>
                        </div>
                        <button className="mt-4 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors w-full sm:w-auto">
                            Open Community
                        </button>
                    </div>

                    {/* 3. Favourites (Passive) */}
                    <div className="group rounded-xl border border-slate-200 p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-orange-50 text-orange-500">
                                <Flame size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 mb-1">Favourites</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Tap the flame icon to save items. It’s the fastest way to cut through the noise and track what matters.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 4. Rules */}
                    <div className="group rounded-xl border border-slate-200 p-5 hover:bg-slate-50 transition-colors cursor-pointer" onClick={onRules}>
                        <div className="flex items-start gap-4">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-slate-900">Auction Rules</h3>
                                    <BookOpen size={14} className="text-slate-400" />
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Worth a quick read. They explain how bidding works, what’s binding, and how to avoid surprises.
                                </p>
                            </div>
                        </div>
                        <button className="mt-4 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors w-full sm:w-auto">
                            Read Auction Rules
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center sticky bottom-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GarthWelcomeModal;
