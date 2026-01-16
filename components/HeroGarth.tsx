import React from 'react';
import { ArrowRight } from 'lucide-react';
import { COLORS } from '../constants';

interface HeroGarthProps {
    onSellClick?: () => void;
    onHowItWorksClick?: () => void;
}

const HeroGarth: React.FC<HeroGarthProps> = ({ onSellClick, onHowItWorksClick }) => {
    return (
        <section className="relative w-full px-4 md:px-6 pt-3 md:pt-4 mb-6">
            {/* Main Hero Container */}
            <div className="relative w-full rounded-[24px] md:rounded-[32px] overflow-hidden bg-slate-900 h-[340px] md:h-[420px] lg:h-[520px] shadow-2xl">

                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/GARTHCOVER.jpg"
                        alt="Garth Bidding War"
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Gradient Overlay for Readability */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
                    }}
                />

                {/* Content Wrapper - Bottom Left */}
                <div className="absolute inset-0 z-20 flex items-end p-5 md:p-8 lg:p-12">

                    {/* Glass Panel / Text Block */}
                    <div className="relative max-w-xl w-full flex flex-col items-start gap-4 md:gap-6">

                        {/* Subtle Glass Backdrop for text area (Optional but helps pop) */}
                        <div className="absolute -inset-4 md:-inset-6 bg-black/10 backdrop-blur-[2px] rounded-3xl -z-10" />

                        {/* Garth Approved Tag - Subtle */}
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-white/80">
                                Garth Approved
                            </span>
                        </div>

                        <div className="space-y-2 md:space-y-3">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.05] drop-shadow-sm tracking-tight">
                                AUCTION STARTS EVERY MONDAY
                            </h1>
                            <p className="text-white/90 text-base md:text-lg font-medium leading-relaxed max-w-[38ch]">
                                Garth makes auctions fun, easy, and guides you along the way!
                            </p>
                        </div>

                        {/* CTA Hierarchy */}
                        <div className="flex flex-col items-start pt-2">
                            {/* Primary CTA */}
                            <button
                                onClick={onSellClick}
                                className="group relative h-12 md:h-14 px-6 md:px-8 rounded-full font-bold text-white text-sm md:text-base flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
                                style={{
                                    backgroundColor: COLORS.primary, // #2238ff
                                    boxShadow: `0 8px 20px -4px ${COLORS.primary}60`
                                }}
                            >
                                <span>Sell With Garth</span>
                                <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />

                                {/* Subtle Shine */}
                                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
                            </button>

                            {/* Tertiary Link */}
                            <button
                                onClick={onHowItWorksClick}
                                className="mt-4 text-sm font-semibold text-white/90 hover:text-white transition-colors flex items-center gap-1.5 underline underline-offset-4 decoration-white/30 hover:decoration-white/80"
                            >
                                <span>🤠 How it works</span>
                                <span className="text-xs">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroGarth;
