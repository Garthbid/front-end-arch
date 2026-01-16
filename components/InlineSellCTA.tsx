import React from 'react';
import { ArrowRight } from 'lucide-react';
import { COLORS } from '../constants';

interface InlineSellCTAProps {
    onSellClick?: () => void;
    onHowItWorksClick?: () => void;
}

const InlineSellCTA: React.FC<InlineSellCTAProps> = ({ onSellClick, onHowItWorksClick }) => {
    return (
        <div className="col-span-full py-4 md:py-6">
            <div className="w-full rounded-2xl border border-black/10 bg-white shadow-sm p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                {/* Left Content */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-slate-900">
                        Want to sell something?
                    </h3>
                    <p className="text-slate-600 text-sm md:text-base">
                        Garth will guide you step-by-step.
                    </p>

                    {/* Optional Tertiary Link (Desktop placement variant or mobile) */}
                    <button
                        onClick={onHowItWorksClick}
                        className="mt-1 text-sm font-medium text-slate-500 hover:text-slate-900 hover:underline underline-offset-4 transition-colors w-fit"
                    >
                        🤠 How it works →
                    </button>
                </div>

                {/* Right Action */}
                <button
                    onClick={onSellClick}
                    className="w-full md:w-auto h-12 px-6 rounded-full font-bold text-white text-base flex items-center justify-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
                    style={{ backgroundColor: COLORS.primary }}
                >
                    <span>Sell with Garth</span>
                    <ArrowRight size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default InlineSellCTA;
