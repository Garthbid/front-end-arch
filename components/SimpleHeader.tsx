import React from 'react';
import { ArrowRight } from 'lucide-react';
import { COLORS } from '../constants';

interface SimpleHeaderProps {
    onSellClick?: () => void;
    onHowItWorksClick?: () => void;
}

const SimpleHeader: React.FC<SimpleHeaderProps> = ({ onSellClick }) => {
    return (
        <section className="w-full mb-4 md:mb-4">
            <div
                className="rounded-2xl md:flex md:items-center md:justify-between"
                style={{
                    backgroundColor: '#fafbfc',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    padding: '28px 20px',
                }}
            >
                {/* Left side - Text content */}
                <div className="mb-5 md:mb-0">
                    {/* Headline */}
                    <h2
                        className="text-xl md:text-xl font-bold"
                        style={{
                            color: COLORS.textPrimary,
                            lineHeight: '1.3',
                            marginBottom: '8px',
                        }}
                    >
                        Want to sell something?
                    </h2>

                    {/* Tagline */}
                    <p
                        className="text-sm"
                        style={{
                            color: COLORS.textSecondary,
                            marginBottom: '0',
                        }}
                    >
                        Garth will guide you step-by-step.
                    </p>
                </div>

                {/* Right side - CTA Button */}
                <button
                    onClick={onSellClick}
                    className="group w-full md:w-auto h-12 md:h-12 rounded-full font-semibold text-white text-base md:text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{
                        backgroundColor: COLORS.primary,
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                        padding: '0 32px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.25)';
                    }}
                >
                    Sell with Garth
                    <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>
        </section>
    );
};

export default SimpleHeader;
