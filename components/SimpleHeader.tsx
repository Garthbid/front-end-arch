import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { COLORS } from '../constants';

interface SimpleHeaderProps {
    onSellClick?: () => void;
    onHowItWorksClick?: () => void;
}

const SimpleHeader: React.FC<SimpleHeaderProps> = ({ onSellClick, onHowItWorksClick }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <section className="w-full mb-8 md:mb-10">
            <div className="max-w-[1280px] mx-auto">
                <div className="relative rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden py-10 px-6 md:py-14 md:px-12 lg:py-16 lg:px-16">

                    {/* Subtle Background Effects - Removed per user request */}

                    {/* Centered Text Content */}
                    <div className="relative z-10 flex flex-col items-center text-center">

                        {/* Powered by GarthAI Pill */}
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 md:mb-6 transition-all duration-500 ease-out"
                            style={{
                                background: 'linear-gradient(135deg, rgba(0,34,255,0.06) 0%, rgba(139,92,246,0.06) 100%)',
                                border: '1px solid rgba(0,34,255,0.12)',
                                boxShadow: '0 2px 8px rgba(0,34,255,0.06)',
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(-15px)',
                            }}
                        >
                            {/* AI Sparkle Icon */}
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                style={{ animation: 'pulse-sparkle 2.4s ease-in-out infinite' }}
                            >
                                <path
                                    d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                                    fill={COLORS.primary}
                                    opacity="0.85"
                                />
                            </svg>
                            <span
                                className="text-[10px] md:text-xs font-semibold tracking-[0.1em] uppercase"
                                style={{
                                    background: `linear-gradient(90deg, ${COLORS.primary} 0%, #8B5CF6 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Powered by GarthAI
                            </span>
                        </div>

                        {/* Headline */}
                        <h1
                            className="mb-5 md:mb-6 transition-all duration-700 ease-out"
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.97)',
                                transitionDelay: '100ms',
                            }}
                        >
                            <span
                                className="block text-3xl md:text-4xl lg:text-5xl leading-none uppercase"
                                style={{
                                    fontFamily: "'Luckiest Guy', cursive",
                                    color: COLORS.fireOrange,
                                    transform: 'skewX(-5deg)',
                                }}
                            >
                                AUCTION STARTS
                            </span>
                            <span
                                className="block text-5xl md:text-7xl lg:text-8xl tracking-wide leading-[0.9] uppercase"
                                style={{
                                    fontFamily: "'Luckiest Guy', cursive",
                                    color: COLORS.primary,
                                    filter: 'drop-shadow(0 0 20px rgba(0,34,255,0.25))',
                                    marginTop: '0.1em',
                                    transform: 'skewX(-5deg)',
                                }}
                            >
                                EVERY MONDAY!
                            </span>
                        </h1>

                        {/* Tagline */}
                        <p
                            className="text-sm md:text-base font-medium tracking-wide mb-7 md:mb-8 transition-all duration-500 ease-out max-w-[300px] md:max-w-none"
                            style={{
                                color: COLORS.textSecondary,
                                opacity: isVisible ? 0.8 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                                transitionDelay: '200ms',
                            }}
                        >
                            The best place to buy & sell your stuff.
                        </p>

                        {/* CTA Buttons - Stacked on mobile, horizontal on desktop */}
                        <div
                            className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 transition-all duration-500 ease-out"
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
                                transitionDelay: '300ms',
                            }}
                        >
                            {/* Primary CTA */}
                            <button
                                onClick={onSellClick}
                                className="group w-auto h-12 md:h-13 px-10 md:px-8 rounded-full font-bold text-white text-sm md:text-sm uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
                                style={{
                                    backgroundColor: COLORS.primary,
                                    boxShadow: `0 6px 20px -4px ${COLORS.primary}50`,
                                }}
                            >
                                SELL WITH GARTH
                                <ArrowRight size={16} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                            </button>

                            {/* How It Works Link */}
                            <button
                                onClick={onHowItWorksClick}
                                className="group h-11 md:h-12 px-4 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 hover:bg-slate-50"
                                style={{ color: COLORS.textSecondary }}
                            >
                                <span>💊</span>
                                <span>HOW IT WORKS</span>
                                <ArrowRight size={14} strokeWidth={2.5} className="opacity-60 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Keyframe Animation */}
            <style>{`
                @keyframes pulse-sparkle {
                    0%, 100% { transform: scale(1); opacity: 0.85; }
                    50% { transform: scale(1.1); opacity: 1; }
                }
            `}</style>
        </section>
    );
};

export default SimpleHeader;
