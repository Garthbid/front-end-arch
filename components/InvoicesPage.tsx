
import React, { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink, ChevronRight, ArrowLeft, Loader2, CreditCard } from 'lucide-react';
import { COLORS } from '../constants';

interface Invoice {
  id: string;
  number: string;
  date: string;
  description: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'FAILED';
}

const MOCK_INVOICES: Invoice[] = [
  { id: '1', number: 'INV-2023-001', date: 'Dec 12, 2024', description: 'Bidding War Boost: Vintage Leica M6', amount: 25.00, status: 'PAID' },
  { id: '2', number: 'INV-2023-002', date: 'Dec 05, 2024', description: 'Monthly Buyers Club Membership', amount: 9.00, status: 'PAID' },
  { id: '3', number: 'INV-2023-003', date: 'Nov 28, 2024', description: 'Bidding War Boost: 1959 Gibson Les Paul', amount: 100.00, status: 'PAID' },
  { id: '4', number: 'INV-2023-004', date: 'Nov 12, 2024', description: 'Monthly Buyers Club Membership', amount: 9.00, status: 'PAID' },
  { id: '5', number: 'INV-2023-005', date: 'Oct 15, 2024', description: 'Bidding War Boost: Ferrari 250 Model', amount: 50.00, status: 'FAILED' },
];

interface InvoicesPageProps {
  onBack: () => void;
}

const InvoicesPage: React.FC<InvoicesPageProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
            Paid
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
            Pending
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
            Failed
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-3xl font-display text-slate-900 uppercase italic tracking-tight">Billing & Invoices</h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">GarthBid Account History</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : MOCK_INVOICES.length > 0 ? (
          <div className="space-y-3">
            {MOCK_INVOICES.map((invoice) => (
              <div 
                key={invoice.id}
                className="group bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <FileText size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-slate-900">{invoice.number}</span>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{invoice.date}</p>
                    <p className="text-sm font-medium text-slate-600 mt-1 line-clamp-1">{invoice.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900 tracking-tight">${invoice.amount.toFixed(2)}</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">USD</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                      <Download size={16} strokeWidth={2.5} />
                    </button>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination / Load More Placeholder */}
            <div className="pt-6 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">End of History</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-300">
              <CreditCard size={32} />
            </div>
            <h3 className="text-xl font-display text-slate-900 uppercase">No invoices yet</h3>
            <p className="text-slate-500 mt-2 font-medium">When you make a purchase or list an item, your invoices will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;
