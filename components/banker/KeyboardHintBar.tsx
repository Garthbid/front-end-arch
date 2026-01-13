import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Undo } from 'lucide-react';

const KeyboardHintBar: React.FC = () => {
    return (
        <div className="fixed bottom-0 inset-x-0 h-12 bg-white border-t border-slate-200 flex items-center justify-center gap-6 text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider z-40 hidden md:flex select-none pointer-events-none">
            <span className="flex items-center gap-1.5">
                <kbd className="bg-slate-100 border border-slate-300 rounded px-1 min-w-[20px] text-center font-sans font-bold text-slate-700">P</kbd> Pass
            </span>
            <span className="w-px h-4 bg-slate-200" />
            <span className="flex items-center gap-1.5">
                <kbd className="bg-slate-100 border border-slate-300 rounded px-1 min-w-[20px] text-center font-sans font-bold text-slate-700">O</kbd> Offer
            </span>
            <span className="w-px h-4 bg-slate-200" />
            <span className="flex items-center gap-1.5">
                <kbd className="bg-slate-100 border border-slate-300 rounded px-1 min-w-[20px] text-center font-sans font-bold text-slate-700">S</kbd> Save
            </span>
            <span className="w-px h-4 bg-slate-200" />
            <span className="flex items-center gap-1.5">
                <kbd className="bg-slate-100 border border-slate-300 rounded px-1 min-w-[20px] text-center font-sans font-bold text-slate-700">C</kbd> Custom
            </span>
            <span className="w-px h-4 bg-slate-200" />
            <span className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                    <kbd className="bg-slate-100 border border-slate-300 rounded px-1 text-center font-sans font-bold text-slate-700">←</kbd>
                    <kbd className="bg-slate-100 border border-slate-300 rounded px-1 text-center font-sans font-bold text-slate-700">→</kbd>
                </div> Swipe
            </span>
            <span className="w-px h-4 bg-slate-200" />
            <span className="flex items-center gap-1.5 text-slate-400">
                <kbd className="bg-slate-100 border border-slate-300 rounded px-1 text-center font-sans font-bold text-slate-700">⌘Z</kbd> Undo
            </span>
        </div>
    );
};

export default KeyboardHintBar;
