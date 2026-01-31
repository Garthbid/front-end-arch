import React from 'react';
import { COLORS } from '../constants';
import { ShieldAlert } from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
    onViewChange: (view: ViewState) => void;
    onIgnitePayment?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onViewChange, onIgnitePayment }) => {
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
                <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="md:w-1/3">
                        <div className="mb-6">
                            <img
                                src="/garth-logo.png"
                                alt="GarthBid"
                                className="h-6 w-auto object-contain"
                            />
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
                            Auction Starts Every Monday!
                        </p>
                        <div className="text-xs text-gray-600 font-bold uppercase tracking-widest">
                            © {new Date().getFullYear()} GarthBid Inc.
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="md:w-2/3 flex flex-col md:flex-row gap-12 md:justify-end">
                        <ul className="space-y-4 text-sm font-medium text-slate-500 text-left md:text-right">
                            <li><button onClick={() => onViewChange('HOME')} className="hover:text-slate-900 transition-colors">Home</button></li>
                            <li><button onClick={() => onViewChange('COMMUNITY')} className="hover:text-slate-900 transition-colors">Ask For Help</button></li>
                            <li><button onClick={() => onViewChange('HAMMERED')} className="hover:text-slate-900 transition-colors">Newsletter</button></li>
                        </ul>
                        <ul className="space-y-4 text-sm font-medium text-slate-500 text-left md:text-right">
                            <li><button className="hover:text-slate-900 transition-colors">Auction Rules</button></li>
                            <li><button className="hover:text-slate-900 transition-colors">Terms of Service</button></li>
                            <li><button className="hover:text-slate-900 transition-colors">Privacy Policy</button></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar / Admin */}
                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-end gap-6">
                    {/* Internal Admin Link */}
                    <div className="flex gap-3">
                        <button
                            onClick={onIgnitePayment}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-amber-50 border border-dashed border-amber-300 text-amber-600 hover:text-amber-700 hover:border-amber-400"
                        >
                            🔥 Ignite Payment
                        </button>
                        <button
                            onClick={() => onViewChange('ADMIN')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                        >
                            Internal Admin
                        </button>
                        <button
                            onClick={() => onViewChange('BANKER')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-emerald-50 border border-dashed border-emerald-300 text-emerald-600 hover:text-emerald-700 hover:border-emerald-400"
                        >
                            💰 Banker Mode
                        </button>
                        <button
                            onClick={() => onViewChange('LAUNCH')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-blue-50 border border-dashed border-blue-300 text-blue-600 hover:text-blue-700 hover:border-blue-400"
                        >
                            🚀 TEMP HOME
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
