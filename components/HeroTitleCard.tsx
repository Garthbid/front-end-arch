import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { COLORS } from '../constants';

interface HeroTitleCardProps {
    onSellClick?: () => void;
    onHowItWorksClick?: () => void;
}

const HeroTitleCard: React.FC<HeroTitleCardProps> = ({ onSellClick, onHowItWorksClick }) => {
    return (
        <section className="w-full px-4 md:px-6 mt-4 md:mt-6 mb-6">
            {/* 1. Container: Card style with border/shadow */}
            <div className="relative w-full max-w-[1920px] mx-auto rounded-3xl overflow-hidden bg-white shadow-sm border border-black/10 flex flex-col">

                {/* Row A — Artwork (Top) */}
                <div className="relative w-full aspect-[4/3] lg:aspect-[16/7] bg-slate-100 overflow-hidden">
                    <img
                        src="/GARTHCOVER.jpg"
                        alt="Garth Bidding War"
                        className="w-full h-full object-cover object-center"
                    />
                    {/* Subtle inner vignette for polish */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Row B — Title Card Panel (Bottom) */}
                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between p-5 md:p-7 bg-white border-t border-black/5">

                    {/* Main Content Block */}
                    <div className="flex flex-col items-start gap-4 max-w-3xl">

                        {/* 5. Garth Approved Stamp - Above headline */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-tight bg-slate-100 border border-black/10">
                            <Check size={10} className="text-slate-500" strokeWidth={3} />
                            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-slate-500">
                                Garth Approved
                            </span>
                        </div>

                        <div className="flex flex-col gap-3">
                            {/* 3. Headline (Luckiest Guy) */}
                            <h1
                                className="text-[34px] md:text-5xl lg:text-[52px] leading-[0.95] text-slate-950 uppercase lg:tracking-[-0.02em] lg:-rotate-1 origin-bottom-left"
                                style={{ fontFamily: "'Luckiest Guy', cursive" }}
                            >
                                Auction Starts Every Monday
                            </h1>

                            {/* Subheading (Clean font) */}
                            <p className="text-slate-600 text-base md:text-lg font-medium max-w-[60ch]">
                                Garth makes auctions fun, easy, and guides you along the way!
                            </p>
                        </div>

                        {/* 4. Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                            {/* Primary CTA */}
                            <button
                                onClick={onSellClick}
                                className="group relative h-12 md:h-14 px-6 md:px-8 rounded-tight font-bold text-white text-base flex items-center gap-2 transition-all duration-300 hover:shadow-md hover:-translate-y-px"
                                style={{ backgroundColor: COLORS.primary }}
                            >
                                <span>Sell With Garth</span>
                                <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Tertiary Link */}
                            <button
                                onClick={onHowItWorksClick}
                                className="text-slate-600 hover:text-slate-900 font-medium text-sm md:text-base underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 transition-colors"
                            >
                                🤠 How it works →
                            </button>
                        </div>
                    </div>

                    {/* 6. Desktop Enhancement: Episode Info (Optional/Subtle) */}
                    <div className="hidden lg:flex flex-col items-end justify-center pl-8 border-l border-slate-100 h-full min-h-[120px]">
                        <div className="text-right space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Episode</p>
                            <p className="text-sm font-semibold text-slate-900">Monday Morning</p>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default HeroTitleCard;
