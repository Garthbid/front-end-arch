import React, { useState, useEffect } from 'react';
import { X, Check, Lock, DollarSign } from 'lucide-react';
import SignaturePad from './SignaturePad';
import { COLORS } from '../constants';

interface ReservedContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (signature: string, reservePrice: number) => void;
}

const ReservedContractModal: React.FC<ReservedContractModalProps> = ({
    isOpen,
    onClose,
    onConfirm
}) => {
    const [signature, setSignature] = useState<string | null>(null);
    const [isAgreed, setIsAgreed] = useState(false);
    const [reservePrice, setReservePrice] = useState<string>('');
    const [timestamp, setTimestamp] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setSignature(null);
            setIsAgreed(false);
            setReservePrice('');
            setTimestamp(new Date().toLocaleString());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const validPrice = parseFloat(reservePrice) > 0;
    const isValid = !!signature && isAgreed && validPrice;

    const handleSign = () => {
        if (isValid && signature) {
            onConfirm(signature, parseFloat(reservePrice));
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="px-6 py-5 bg-slate-950 text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-600/20 text-orange-500 flex items-center justify-center border border-orange-500/30">
                            <Lock size={14} strokeWidth={3} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest">Reserved Sale Agreement</h2>
                            <p className="text-[10px] font-medium text-slate-400">Legally Binding Contract</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">

                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
                        <p className="text-xs font-bold text-slate-900 leading-relaxed">
                            By signing this agreement, I confirm I am the lawful owner of the item and am offering it for sale with a reserve price.
                        </p>

                        <div className="text-xs text-slate-600 space-y-2 pl-2 border-l-2 border-slate-200">
                            <p>I understand and agree that:</p>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>The item will only sell if bidding meets or exceeds my reserve price</li>
                                <li>If the reserve is met, the final bid becomes a legally binding obligation to sell</li>
                                <li>If the reserve is not met, I am not obligated to complete the sale</li>
                                <li>I may not cancel, withdraw, or alter the outcome once the reserve has been met</li>
                                <li>Ownership transfers upon completion of a successful transaction</li>
                            </ul>
                        </div>

                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 pt-2">
                            I acknowledge this agreement is legally binding.
                        </p>
                    </div>

                    {/* Reserve Price Input */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                            Set Reserve Price
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="number"
                                value={reservePrice}
                                onChange={(e) => setReservePrice(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-display font-black text-xl text-slate-900 placeholder:text-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5">
                            The minimum price you are willing to accept. Hidden from bidders.
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
                            <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isAgreed ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                {isAgreed && <Check size={12} strokeWidth={4} />}
                            </div>
                            <input
                                type="checkbox"
                                checked={isAgreed}
                                onChange={(e) => setIsAgreed(e.target.checked)}
                                className="hidden"
                            />
                            <span className="text-xs font-bold text-slate-700 leading-tight pt-0.5">
                                I understand this is a reserved, legally binding sale if the reserve is met.
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
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 hover:bg-orange-700 transform hover:-translate-y-1'
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                    >
                        <Lock size={14} />
                        Sign and Check Out
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ReservedContractModal;
