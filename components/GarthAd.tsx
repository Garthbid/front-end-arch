import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface GarthAdProps {
    variant: 'COMMUNITY' | 'BUYERS_CLUB';
    onAction: () => void;
}

const GarthAd: React.FC<GarthAdProps> = ({ variant, onAction }) => {

    if (variant === 'COMMUNITY') {
        return (
            <div
                className="group py-8 px-6 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] relative overflow-hidden col-span-full my-4"
                style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    boxShadow: '0 8px 32px rgba(0, 34, 255, 0.15), 0 0 0 1px rgba(255,255,255,0.05)',
                }}
                onClick={onAction}
            >
                {/* Animated glow effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(0, 34, 255, 0.15) 0%, transparent 70%)',
                    }}
                />
                {/* Shimmer effect */}
                <div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                    }}
                />
                {/* Decorative elements */}
                <div className="absolute top-2 left-4 text-2xl opacity-20">💬</div>
                <div className="absolute bottom-2 right-4 text-2xl opacity-20">🚀</div>

                {/* Content */}
                <div className="relative z-10 max-w-2xl mx-auto">
                    <p className="text-sm text-blue-200/70 mb-2 font-medium">Got a question or want to request a new feature?</p>
                    <p className="text-2xl md:text-3xl font-display text-white italic tracking-tight flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                        <span>JOIN THE COMMUNITY</span>
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#0022ff] transition-colors duration-300">
                            <ArrowRight size={16} className="text-white group-hover:translate-x-0.5 transition-transform" />
                        </span>
                    </p>
                    <p className="text-xs text-blue-300/50 mt-2">5,400+ members • Real-time chat • Vote on features</p>
                </div>
            </div>
        );
    }

    if (variant === 'BUYERS_CLUB') {
        return (
            <div
                className="group py-8 px-6 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] relative overflow-hidden col-span-full my-4"
                style={{
                    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.15), 0 0 0 1px rgba(255, 215, 0, 0.15)',
                }}
                onClick={onAction}
            >
                {/* Animated glow effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
                    }}
                />

                {/* Decorative elements - Gold flakes/sparkles */}
                <div className="absolute top-3 right-6 text-yellow-500/20 animate-pulse delay-75"><Sparkles size={24} /></div>
                <div className="absolute bottom-3 left-6 text-yellow-500/20 animate-pulse"><Sparkles size={20} /></div>

                {/* Content */}
                <div className="relative z-10 max-w-2xl mx-auto">
                    <p className="text-sm text-yellow-500/80 mb-2 font-bold tracking-widest uppercase">
                        Tired of high auction fees?
                    </p>

                    <div className="text-2xl md:text-3xl font-display text-white italic tracking-tight mb-3">
                        JOIN GARTH <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">BUYERS CLUB</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-yellow-500/50" />
                        <span className="text-yellow-500/60 text-[10px] uppercase tracking-widest">Premium Access</span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-yellow-500/50" />
                    </div>

                    <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
                        slice your auction fees in half + get <span className="text-white font-medium">unhinged access</span> to GarthAI
                    </p>

                    <button className="mt-5 px-6 py-2 rounded-full bg-white/5 border border-yellow-500/30 text-yellow-500 text-xs font-bold uppercase tracking-widest group-hover:bg-yellow-500 group-hover:text-black transition-all">
                        Upgrade Now
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default GarthAd;
