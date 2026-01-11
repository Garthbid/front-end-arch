import React, { useState, useEffect } from 'react';
import { X, Check, Lock } from 'lucide-react';
import SignaturePad from './SignaturePad';

interface UnreservedContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (signature: string) => void;
}

const UnreservedContractModal: React.FC<UnreservedContractModalProps> = ({
    isOpen,
    onClose,
    onConfirm
}) => {
    const [signature, setSignature] = useState<string | null>(null);
    const [isAgreed, setIsAgreed] = useState(false);
    const [timestamp, setTimestamp] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setSignature(null);
            setIsAgreed(false);
            setTimestamp(new Date().toLocaleString());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const isValid = !!signature && isAgreed;

    const handleSign = () => {
        if (isValid && signature) {
            onConfirm(signature);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="px-6 py-5 bg-slate-950 text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/30">
                            <Lock size={14} strokeWidth={3} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest">Unreserved Sale Agreement</h2>
                            <p className="text-[10px] font-medium text-slate-400">Legally Binding Contract</p>
                        </div>
                    </div>
                    {/* No close button to enforce decision, or maybe keep it but styled minimally? Request said "No distractions". Keeping it minimal or removing it effectively forces interaction. 
              Usually a modal should have a way out. I'll add a minimal close button. */}
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">

                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
                        <p className="text-xs font-bold text-slate-900 leading-relaxed">
                            By signing this agreement, I confirm I am the lawful owner of the item and am offering it for sale unreserved.
                        </p>

                        <div className="text-xs text-slate-600 space-y-2 pl-2 border-l-2 border-slate-200">
                            <p>I understand and agree that:</p>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>The item sells to the highest bidder, regardless of price</li>
                                <li>I waive all rights to add a reserve or cancel the sale</li>
                                <li>The final bid is a legally binding obligation to sell</li>
                                <li>Ownership transfers upon completion of the transaction</li>
                                <li>If your item sells, a 5% platform fee applies to the final sale price</li>
                            </ul>
                        </div>

                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 pt-2">
                            I acknowledge this agreement is legally binding.
                        </p>
                    </div>

                    {/* Signature Section */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                                Draw Your Signature
                            </label>
                            <SignaturePad onChange={setSignature} />
                            <p className="text-[9px] text-slate-400 mt-1.5 flex justify-between">
                                <span>Digital Signature</span>
                                <span>{timestamp}</span>
                            </p>
                        </div>

                        <label className="flex items-start gap-3 p-4 bg-white border-2 border-slate-100 rounded-xl cursor-pointer hover:border-slate-200 transition-colors group">
                            <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isAgreed ? 'bg-red-500 border-red-500 text-white' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                {isAgreed && <Check size={12} strokeWidth={4} />}
                            </div>
                            <input
                                type="checkbox"
                                checked={isAgreed}
                                onChange={(e) => setIsAgreed(e.target.checked)}
                                className="hidden"
                            />
                            <span className="text-xs font-bold text-slate-700 leading-tight pt-0.5">
                                I understand this is an unreserved, legally binding sale.
                            </span>
                        </label>
                    </div>

                </div>

                {/* Footer CTA */}
                <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                    <button
                        disabled={!isValid}
                        onClick={handleSign}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs transition-all duration-300 ${isValid
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transform hover:-translate-y-1'
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                    >
                        <Lock size={14} />
                        Sign & List Unreserved
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UnreservedContractModal;
