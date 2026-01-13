import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { BankerItem } from './types';

interface HighRiskConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onNeedsInfo: () => void;
    item: BankerItem;
    riskReasons: string[];
}

const HighRiskConfirmDialog: React.FC<HighRiskConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    onNeedsInfo,
    item,
    riskReasons
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-amber-50 p-6 text-center border-b border-amber-100">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert className="w-8 h-8 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Higher Risk Item</h2>
                    <p className="text-sm text-slate-500 mt-2">
                        This item has flagged conditions. Are you sure you want to set terms without more info?
                    </p>
                </div>

                <div className="p-6">
                    <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-100">
                        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Risk Factors</h3>
                        <ul className="space-y-2">
                            {riskReasons.map((reason, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                    {reason}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
                        >
                            Yes, Set Terms Anyway
                        </button>
                        <button
                            onClick={onNeedsInfo}
                            className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl transition-colors"
                        >
                            Mark "Needs Info"
                        </button>
                        <button
                            onClick={onClose}
                            className="mt-2 text-xs text-slate-400 hover:text-slate-600 font-medium text-center"
                        >
                            Cancel and Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighRiskConfirmDialog;
