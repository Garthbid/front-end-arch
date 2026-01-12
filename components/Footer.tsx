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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div>
                        <h2 className="text-2xl font-display uppercase italic tracking-tighter text-white mb-6">GarthBid</h2>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            The transparent, community-driven marketplace where honesty meets the hammer.
                        </p>
                        <div className="text-xs text-gray-600 font-bold uppercase tracking-widest">
                            © {new Date().getFullYear()} GarthBid Inc.
                        </div>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Company</h3>
                        <ul className="space-y-4 text-sm font-medium text-gray-300">
                            <li><button onClick={() => onViewChange('HOME')} className="hover:text-white transition-colors">Home</button></li>
                            <li><button className="hover:text-white transition-colors">About Us</button></li>
                            <li><button className="hover:text-white transition-colors">Careers</button></li>
                            <li><button className="hover:text-white transition-colors">Press</button></li>
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Support</h3>
                        <ul className="space-y-4 text-sm font-medium text-gray-300">
                            <li><button className="hover:text-white transition-colors">Contact Support</button></li>
                            <li><button className="hover:text-white transition-colors">Auction Rules</button></li>
                            <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
                            <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
                        </ul>
                    </div>

                    {/* Hammered Column */}
                    <div>
                        <h3 className="text-xs font-black text-[#224cff] uppercase tracking-widest mb-6">Hammered Newsletter</h3>
                        <p className="text-gray-500 text-sm mb-4">
                            Weekly stories from the founders. No fluff, just the raw truth.
                        </p>
                        <button
                            onClick={() => onViewChange('HAMMERED')}
                            className="flex items-center gap-2 text-white font-bold text-sm group hover:gap-3 transition-all"
                        >
                            Read the Latest <span className="text-[#224cff]">→</span>
                        </button>
                    </div>

                </div>

                {/* Bottom Bar / Admin */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-xs text-gray-600 font-medium">
                        San Francisco, CA • Built in Public
                    </div>

                    {/* Internal Admin Link */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => onViewChange('PAYMENT_FLOW')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-amber-500/10 border border-dashed border-amber-500/30 text-amber-500/50 hover:text-amber-500"
                        >
                            🔥 Ignite Payment
                        </button>
                        <button
                            onClick={() => onViewChange('ADMIN')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-white/5 text-gray-600 hover:text-gray-400"
                        >
                            <ShieldAlert size={12} strokeWidth={2.5} />
                            Internal Admin
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
