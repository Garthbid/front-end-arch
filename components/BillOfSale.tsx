import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export type BillOfSaleMode = 'BUYER' | 'SELLER';

export interface BillOfSaleData {
    invoiceNumber: string;
    date: string;
    seller: {
        name: string;
        phone: string;
        location: string;
    };
    buyer: {
        name: string;
        phone: string;
        address: string;
    };
    item: {
        year: string;
        makeModel: string;
        serialNumber: string;
    };
    financials: {
        subtotal: number;
    };
}

interface BillOfSaleProps {
    data: BillOfSaleData;
    mode: BillOfSaleMode;
}

const BillOfSale: React.FC<BillOfSaleProps> = ({ data, mode }) => {
    // --- FEE LOGIC ---
    const subtotal = data.financials.subtotal;
    const gstRate = 0.05;
    const gst = subtotal * gstRate;

    // Settlement Fee: 2.5%, max $125
    const rawSettlementFee = subtotal * 0.025;
    const settlementFee = Math.min(rawSettlementFee, 125);

    // Total Calculation based on Mode
    let total = 0;
    if (mode === 'BUYER') {
        total = subtotal + gst + settlementFee;
    } else {
        // SELLER: Subtotal + GST - Settlement Fee (Seller pays fee from earnings)
        // Wait, usually GST is on the service fee? Or is it Subtotal + GST(on item) - Fee?
        // User prompt: "Seller: Subtotal + GST − Settlement Fee"
        // It implies the Seller collects Subtotal + GST from buyer, but the Platform deducts the Fee.
        // So Net Payout = (Subtotal + GST) - Settlement Fee.
        total = subtotal + gst - settlementFee;
    }

    return (
        <div className="w-full max-w-[800px] mx-auto bg-white p-12 min-h-[1000px] text-slate-900 print:p-0 print:max-w-none print:w-full">

            {/* HEADER */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                <div>
                    <img
                        src="/garth-logo.png"
                        alt="GarthBid"
                        className="h-10 w-auto object-contain mb-2"
                    />
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <ShieldCheck size={12} />
                        Official Bill of Sale
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-1">Invoice No.</div>
                    <div className="text-xl font-mono font-bold">{data.invoiceNumber}</div>
                    <div className="text-xs font-medium text-slate-400 mt-1">{data.date}</div>
                </div>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-12 mb-10">
                {/* SELLER COLUMN */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Seller Information</h3>
                    <div className="space-y-3 text-sm">
                        <div>
                            <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">Full Name / Entity</span>
                            <span className="font-bold text-slate-900">{data.seller.name}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">Phone Number</span>
                            <span className="font-medium text-slate-700 font-mono">{data.seller.phone}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">Pickup Location</span>
                            <span className="font-medium text-slate-700">{data.seller.location}</span>
                        </div>
                    </div>
                </div>

                {/* BUYER COLUMN */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Buyer Information</h3>
                    <div className="space-y-3 text-sm">
                        <div>
                            <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">Full Name / Entity</span>
                            <span className="font-bold text-slate-900">{data.buyer.name}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">Phone Number</span>
                            <span className="font-medium text-slate-700 font-mono">{data.buyer.phone}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">Billing Address</span>
                            <span className="font-medium text-slate-700 max-w-[200px] leading-relaxed">{data.buyer.address}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ITEM INFO BLOCK */}
            <div className="bg-slate-50 rounded-xl p-6 mb-10 border border-slate-200 print:bg-white print:border-slate-300">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Item Identification</h3>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-2">
                        <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Year</span>
                        <span className="block text-lg font-bold text-slate-900">{data.item.year}</span>
                    </div>
                    <div className="col-span-6">
                        <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Make / Model / Title</span>
                        <span className="block text-lg font-bold text-slate-900">{data.item.makeModel}</span>
                    </div>
                    <div className="col-span-4 text-right">
                        <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">VIN / Serial Number</span>
                        <span className="block text-lg font-mono font-bold text-slate-900">{data.item.serialNumber}</span>
                    </div>
                </div>
            </div>

            {/* FINANCIAL SUMMARY */}
            <div className="flex flex-col items-end mb-16 space-y-3">
                <div className="w-64 flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold font-mono">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="w-64 flex justify-between text-sm text-slate-600">
                    <span>GST (5%)</span>
                    <span className="font-mono">${gst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                {/* Settlement Fee Row */}
                <div className="w-64 flex justify-between text-sm items-center pb-4 border-b border-slate-200 relative group">
                    <div className="flex items-center gap-1.5 cursor-help">
                        <span>Settlement Fee</span>
                        <Info size={12} className="text-slate-400" />

                        {/* Tooltip */}
                        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-48 bg-slate-900 text-white text-[10px] p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none print:hidden">
                            2.5% of Subtotal (Capped at $125.00). Used to securely hold and distribute deal funds.
                        </div>
                    </div>
                    <span className={`font-mono font-medium text-slate-600`}>
                        {mode === 'SELLER' ? '-' : ''}${settlementFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>

                {/* TOTAL */}
                <div className="w-64 flex justify-between items-baseline pt-1">
                    <span className="text-base font-black uppercase tracking-widest text-slate-900">Total</span>
                    <span className="text-2xl font-black font-mono text-slate-900">
                        ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <p className="w-64 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {mode === 'BUYER' ? 'Amount Due' : 'Net Payout'}
                </p>
            </div>

            {/* SIGNATURES */}
            <div className="mt-auto pt-12 border-t border-dashed border-slate-300">
                <div className="grid grid-cols-2 gap-16">
                    <div>
                        <div className="h-16 border-b border-slate-900 mb-2"></div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Buyer Signature</span>
                            <span className="text-xs font-medium text-slate-500">{data.buyer.name}</span>
                        </div>
                    </div>
                    <div>
                        <div className="h-16 border-b border-slate-900 mb-2"></div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Seller Signature</span>
                            <span className="text-xs font-medium text-slate-500">{data.seller.name}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-medium">
                        GarthBid Secure Transaction System · Generated {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>

        </div>
    );
};

export default BillOfSale;
