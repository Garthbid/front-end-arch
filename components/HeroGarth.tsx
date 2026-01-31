import React from 'react';

interface HeroGarthProps {
    onSellClick?: () => void;
    onHowItWorksClick?: () => void;
}

const HeroGarth: React.FC<HeroGarthProps> = ({ onSellClick, onHowItWorksClick }) => {
    return (
        <section className="relative w-full px-4 md:px-6 pt-3 md:pt-4 mb-6">
            {/* Main Hero Container - Image Only */}
            <div className="relative w-full rounded-[24px] md:rounded-[32px] overflow-hidden bg-slate-900 h-[340px] md:h-[420px] lg:h-[520px] shadow-2xl">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero-image.webp"
                        alt="Hero"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroGarth;
