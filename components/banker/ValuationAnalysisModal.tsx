import React from 'react';
import { X, ExternalLink, BarChart3, Info } from 'lucide-react';

interface ValuationAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemTitle: string;
    estimatedValueHigh: number;
    estimatedValueLow: number;
}

const ValuationAnalysisModal: React.FC<ValuationAnalysisModalProps> = ({
    isOpen,
    onClose,
    itemTitle,
    estimatedValueHigh,
    estimatedValueLow
}) => {
    if (!isOpen) return null;

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 zoom-in-95 duration-200 border border-slate-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-slate-900 tracking-tight">Garth Price Analysis</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Automated valuation based on market data and historical performance</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Hero Section: Primary Insight */}
                    <div className="mb-8 text-center bg-slate-50 rounded-lg p-6 border border-slate-100">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Estimated Market Value</p>
                        <div className="text-3xl font-serif font-bold text-slate-900 mb-2">
                            {formatter.format(estimatedValueLow)} – {formatter.format(estimatedValueHigh)}
                        </div>
                        <p className="text-xs text-slate-500 italic max-w-xs mx-auto">
                            Based on comparable listings, condition assumptions, and recent market activity for similar {itemTitle}.
                        </p>
                    </div>

                    {/* Depreciation & Assumptions */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Depreciation & Assumptions</h3>
                            <div className="group relative">
                                <Info size={14} className="text-slate-400 cursor-help" />
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    Standardized baseline used for initial valuation.
                                </div>
                            </div>
                        </div>

                        <div className="pl-4 border-l-2 border-slate-200 space-y-2">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                This estimate assumes average usage of <span className="font-semibold text-slate-700">25,000 km per year</span> and moderate, routine upkeep.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Adjustments may apply for unusually high or low usage, exceptional maintenance, or condition variance.
                            </p>
                        </div>
                    </div>

                    <hr className="border-slate-100 mb-8" />

                    {/* Deeper Review Options */}
                    <div className="space-y-4">
                        <button className="w-full group text-left p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-700 group-hover:text-slate-900">Review External Market Sources</span>
                                <ExternalLink size={16} className="text-slate-400 group-hover:text-slate-600" />
                            </div>
                            <p className="text-xs text-slate-400">Compare this estimate against public listings and third-party pricing references</p>
                        </button>

                        <button className="w-full group text-left p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-700 group-hover:text-slate-900">View Comparable Sales on Garth</span>
                                <BarChart3 size={16} className="text-slate-400 group-hover:text-slate-600" />
                            </div>
                            <p className="text-xs text-slate-400">See completed Garth auctions for similar items, condition, and region</p>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 font-medium">This analysis is indicative only and does not constitute a guarantee of sale price.</p>
                </div>
            </div>
        </div>
    );
};

export default ValuationAnalysisModal;
