import React from 'react';
import { COLORS } from '../constants';
import { ShieldAlert } from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
    onViewChange: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({ onViewChange }) => {
    return (
        <footer
            className="w-full py-8 mt-12 md:mt-24 border-t"
            style={{
                background: COLORS.voidBlack,
                borderColor: COLORS.border,
                color: COLORS.textSecondary
            }}
        >
            <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">

                    {/* Copyright / Brand */}
                    <div className="text-sm">
                        © {new Date().getFullYear()} GarthBid. All rights reserved.
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-medium">
                        <button
                            onClick={() => onViewChange('HOME')}
                            className="hover:text-white transition-colors"
                        >
                            Home
                        </button>
                        <button className="hover:text-white transition-colors">
                            Contact Us
                        </button>
                        <button className="hover:text-white transition-colors">
                            Ask The Community
                        </button>
                        <button className="hover:text-white transition-colors">
                            Auction Rules
                        </button>
                        <button className="hover:text-white transition-colors">
                            Terms and Conditions
                        </button>
                    </div>

                    {/* Internal Admin Link */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => onViewChange('PAYMENT_FLOW')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:bg-amber-500/10 border border-dashed"
                            style={{ color: '#f59e0b', borderColor: '#f59e0b40' }}
                        >
                            🔥 Ignite Payment Flow
                        </button>
                        <button
                            onClick={() => onViewChange('ADMIN')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:bg-white/5"
                            style={{ color: COLORS.textMuted }}
                        >
                            <ShieldAlert size={14} strokeWidth={2.5} />
                            Internal Admin
                        </button>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
