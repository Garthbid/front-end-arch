import React, { useState, useEffect } from 'react';
import { FileText, ChevronRight, ArrowLeft, Calendar, Hash, DollarSign, Check, AlertCircle, Clock, X, ShieldCheck, CreditCard, ExternalLink, BookOpen, Timer, Info, Building, Banknote, Smartphone, Copy } from 'lucide-react';
import { COLORS } from '../constants';

// Invoice status types - exact state machine
type InvoiceStatus = 'PAYMENT_REQUIRED' | 'DEAL_FUNDED' | 'PAYMENT_COMPLETE';

interface Invoice {
  id: string;
  number: string;
  date: string;
  auctionTitle: string;
  amount: number;
  status: InvoiceStatus;
  seller?: string;
  paymentDeadline?: Date; // 72 hours from auction win
  serialNumber?: string; // Item serial number
}

// Helper to format countdown
const formatCountdown = (deadline: Date): { hours: number; minutes: number; isUrgent: boolean } => {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  if (diff <= 0) return { hours: 0, minutes: 0, isUrgent: true };
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes, isUrgent: hours < 12 };
};

// Mock invoice data with all three states
const MOCK_INVOICES: Invoice[] = [
  { id: '1', number: 'INV-2025-001', date: 'Jan 9, 2025', auctionTitle: '2012 John Deere 9860 STS Combine', amount: 125000, status: 'PAYMENT_REQUIRED', seller: '@farm_king_88', paymentDeadline: new Date(Date.now() + 47 * 60 * 60 * 1000), serialNumber: 'JD9860-2012-XK47892' },
  { id: '2', number: 'INV-2025-002', date: 'Jan 7, 2025', auctionTitle: '2019 Airstream Flying Cloud 23FB', amount: 48000, status: 'PAYMENT_REQUIRED', seller: '@camper_life', paymentDeadline: new Date(Date.now() + 8 * 60 * 60 * 1000), serialNumber: 'AS-FC23FB-19-1127' },
  { id: '3', number: 'INV-2024-015', date: 'Dec 28, 2024', auctionTitle: 'Vintage 1959 Gibson Les Paul Standard', amount: 285000, status: 'DEAL_FUNDED', seller: '@guitar_legends', serialNumber: 'GLP-59-22847' },
  { id: '4', number: 'INV-2024-012', date: 'Dec 15, 2024', auctionTitle: '1967 Ford Mustang Shelby GT500', amount: 175000, status: 'PAYMENT_COMPLETE', seller: '@classic_motors', serialNumber: 'GT500-67-SN8892' },
  { id: '5', number: 'INV-2024-008', date: 'Nov 22, 2024', auctionTitle: 'Antique Grandfather Clock - Howard Miller', amount: 4500, status: 'PAYMENT_COMPLETE', seller: '@vintage_finds', serialNumber: 'HM-GC-1945-287' },
];



interface InvoicesPageProps {
  onBack: () => void;
}

// ============================================
// CONFIRMATION MODALS
// ============================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Release Funds Modal
const ReleaseFundsModal: React.FC<ModalProps & { amount: number; onConfirm: () => void; onWalkAway: () => void }> = ({
  isOpen, onClose, amount, onConfirm, onWalkAway
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 fade-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100">
          <X size={18} className="text-slate-400" />
        </button>

        <h2 className="text-xl font-bold text-slate-900 mb-3">Release funds?</h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          This will release <span className="font-bold">${amount.toLocaleString()}</span> to the seller.
          Only release after you've verified the item.
        </p>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
          >
            Release Funds
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-slate-600 text-sm bg-slate-100 hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>

        <button
          onClick={onWalkAway}
          className="w-full mt-4 text-xs text-slate-500 hover:text-red-600 transition-colors underline"
        >
          Walk away instead ($250)
        </button>
      </div>
    </div>
  );
};

// Payment Invoice Modal (Full Invoice with breakdown)
const PaymentInvoiceModal: React.FC<ModalProps & { invoice: Invoice; onConfirmPayment: () => void }> = ({
  isOpen, onClose, invoice, onConfirmPayment
}) => {
  const [showGstInfo, setShowGstInfo] = useState(false);
  const [showSettlementInfo, setShowSettlementInfo] = useState(false);

  if (!isOpen) return null;

  // Calculate fees
  const itemPrice = invoice.amount;
  const gstRate = 0.05; // 5% GST
  const gstAmount = Math.round(itemPrice * gstRate);
  const settlementRate = 0.025; // 2.5%
  const settlementFee = Math.min(Math.round(itemPrice * settlementRate), 125); // Max $125
  const totalAmount = itemPrice + gstAmount + settlementFee;



  const [step, setStep] = useState<'invoice' | 'methods' | 'details'>('invoice');
  const [selectedMethod, setSelectedMethod] = useState<'interac' | 'wire' | 'bank' | null>(null);

  // Reset step on open
  useEffect(() => {
    if (isOpen) {
      setStep('invoice');
      setSelectedMethod(null);
    }
  }, [isOpen]);

  const handleMethodSelect = (method: 'interac' | 'wire' | 'bank') => {
    setSelectedMethod(method);
    setStep('details');
  };

  const CopyButton: React.FC<{ text: string; label?: string }> = ({ text, label }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-xs font-medium text-slate-600 group"
      >
        {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
        {copied ? 'Copied' : (label || 'Copy')}
      </button>
    );
  };

  const PaymentOption: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; onClick: () => void }> = ({ icon, title, subtitle, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all group text-left"
    >
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{title}</h3>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      <div className="ml-auto">
        <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-400" />
      </div>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200 max-h-[90vh] overflow-y-auto">

        {/* Step 1: INVOICE SUMMARY */}
        {step === 'invoice' && (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-slate-900">Invoice {invoice.number}</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Item Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Item Details</h3>
                <p className="font-bold text-base text-slate-900 mb-2">{invoice.auctionTitle}</p>
                {invoice.serialNumber && (
                  <p className="text-xs text-slate-500">
                    <span className="font-medium">Serial:</span> {invoice.serialNumber}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Price Breakdown</h3>

                {/* Item Price */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-600">Item Price</span>
                  <span className="font-bold text-slate-900">${itemPrice.toLocaleString()}</span>
                </div>

                {/* GST */}
                <div className="flex justify-between items-center py-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">GST/Tax (5%)</span>
                    <button
                      onClick={() => setShowGstInfo(!showGstInfo)}
                      className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors"
                    >
                      <Info size={14} className="text-slate-500" />
                    </button>
                  </div>
                  <span className="font-medium text-slate-700">${gstAmount.toLocaleString()}</span>
                </div>
                {showGstInfo && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                    This represents the appropriate sales tax on this item for your area.
                  </div>
                )}

                {/* Settlement Fee */}
                <div className="flex justify-between items-center py-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Settlement Fee</span>
                    <button
                      onClick={() => setShowSettlementInfo(!showSettlementInfo)}
                      className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors"
                    >
                      <Info size={14} className="text-slate-500" />
                    </button>
                  </div>
                  <span className="font-medium text-slate-700">${settlementFee.toLocaleString()}</span>
                </div>
                {showSettlementInfo && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                    A small settlement fee to securely hold and transfer funds through the Garth Settlement Trust. 2.5% capped at $125 per transaction.
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center py-3 border-t-2 border-slate-200 mt-2">
                  <span className="font-bold text-slate-900">Total Due</span>
                  <span className="text-2xl font-bold" style={{ color: '#224cff' }}>
                    ${totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 justify-center text-xs text-slate-500">
                <ShieldCheck size={14} className="text-green-500" />
                Funds are securely held in the Garth Settlement Trust
              </div>

              {/* Pay Button - Step 1 Action */}
              <button
                onClick={() => setStep('methods')}
                className="w-full py-4 rounded-xl font-bold text-white text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #224cff, #4a6fff)', boxShadow: '0 6px 20px rgba(34,76,255,0.35)' }}
              >
                <CreditCard size={18} />
                Pay ${totalAmount.toLocaleString()}
              </button>
            </div>
          </>
        )}

        {/* Step 2: PAYMENT METHOD SELECTION */}
        {step === 'methods' && (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3 z-10">
              <button onClick={() => setStep('invoice')} className="p-1 -ml-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-lg font-bold text-slate-900">Select Payment Method</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 ml-auto">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-500 mb-6 font-medium">
                Choose how you'd like to transfer the <span className="font-bold text-slate-900">${totalAmount.toLocaleString()}</span>.
              </p>

              <div className="space-y-3">
                <PaymentOption
                  icon={<Smartphone size={24} />}
                  title="Interac E-Transfer"
                  subtitle="Instant • Limit varies by bank"
                  onClick={() => handleMethodSelect('interac')}
                />

                <PaymentOption
                  icon={<Building size={24} />}
                  title="Wire Transfer"
                  subtitle="Best for large amounts • 1-2 bus. days"
                  onClick={() => handleMethodSelect('wire')}
                />

                <PaymentOption
                  icon={<Banknote size={24} />}
                  title="Bank Draft Deposit"
                  subtitle="TD Bank • In-branch deposit"
                  onClick={() => handleMethodSelect('bank')}
                />
              </div>

              <div className="mt-8 flex items-center gap-2 justify-center text-[11px] text-slate-400 bg-slate-50 py-2 rounded-lg">
                <ShieldCheck size={12} />
                Secure bank-level encryption
              </div>
            </div>
          </>
        )}

        {/* Step 3: PAYMENT DETAILS */}
        {step === 'details' && selectedMethod && (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3 z-10">
              <button onClick={() => setStep('methods')} className="p-1 -ml-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-lg font-bold text-slate-900">
                {selectedMethod === 'interac' && 'Interac E-Transfer'}
                {selectedMethod === 'wire' && 'Wire Transfer'}
                {selectedMethod === 'bank' && 'Bank Draft Deposit'}
              </h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 ml-auto">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              {/* Interac Instructions */}
              {selectedMethod === 'interac' && (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center space-y-2">
                    <p className="text-sm text-slate-600">Send exactly:</p>
                    <p className="text-3xl font-bold text-slate-900">${totalAmount.toLocaleString()}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                          <p className="text-lg font-medium text-slate-900">pay@garthbid.com</p>
                        </div>
                        <CopyButton text="pay@garthbid.com" />
                      </div>
                      <div className="h-px bg-slate-100" />
                      <div>
                        <p className="text-xs text-slate-500">Auto-deposit is enabled. No security question required.</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-3 text-xs text-amber-800 flex gap-2">
                      <Info size={14} className="shrink-0 mt-0.5" />
                      Please include Invoice #{invoice.number} in the message field.
                    </div>
                  </div>
                </div>
              )}

              {/* Wire Instructions */}
              {selectedMethod === 'wire' && (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center space-y-2">
                    <p className="text-sm text-slate-600">Wire amount:</p>
                    <p className="text-3xl font-bold text-slate-900">${totalAmount.toLocaleString()}</p>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
                      <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Beneficiary Details</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Beneficiary Name</p>
                          <p className="font-medium text-slate-900">Garthbid Inc.</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 mb-1">Account Number</p>
                          <div className="flex items-center justify-end gap-2">
                            <p className="font-medium text-slate-900">5219424</p>
                            <CopyButton text="5219424" label=" " />
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 mb-1">Beneficiary Address</p>
                        <p className="font-medium text-slate-900">P.O. Box 249 Rochester, AB T0G 1Z0</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
                      <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Bank Details</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Bank Name</p>
                          <p className="font-medium text-slate-900">TD Canada Trust</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 mb-1">Routing Number</p>
                          <div className="flex items-center justify-end gap-2">
                            <p className="font-medium text-slate-900">026009593</p>
                            <CopyButton text="026009593" label=" " />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Swift Code</p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900">TDOMCATTTOR</p>
                            <CopyButton text="TDOMCATTTOR" label=" " />
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 mb-1">Bank Address</p>
                        <p className="font-medium text-slate-900">10227 96 St Site 1 Westlock, AB T7P 2R3</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Draft Instructions */}
              {selectedMethod === 'bank' && (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center space-y-2">
                    <p className="text-sm text-slate-600">Draft amount:</p>
                    <p className="text-3xl font-bold text-slate-900">${totalAmount.toLocaleString()}</p>
                  </div>

                  <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Building size={20} className="text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Visit your local TD Bank</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          Deposit into our Garthbid Settlement Trust.
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 my-2" />

                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Direct Deposit Info</p>
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <p className="font-mono text-lg font-medium text-slate-900">89949 004 5219424</p>
                        <CopyButton text="89949 004 5219424" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 flex gap-2">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    Please ensure the draft is payable to "Garthbid Inc" and reference Invoice #{invoice.number}.
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-8">
                <button
                  onClick={onConfirmPayment}
                  className="w-full py-4 rounded-xl font-bold text-white text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #224cff, #4a6fff)', boxShadow: '0 6px 20px rgba(34,76,255,0.35)' }}
                >
                  <Check size={18} />
                  I've Sent Payment
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

// Walk Away Modal
const WalkAwayModal: React.FC<ModalProps & { onConfirm: () => void }> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 fade-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100">
          <X size={18} className="text-slate-400" />
        </button>

        <h2 className="text-xl font-bold text-slate-900 mb-3">Walk away from this deal?</h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          You'll pay a <span className="font-bold text-red-600">$250 walk-away fee</span> and be released from the deal.
        </p>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}
          >
            Walk Away ($250)
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-slate-600 text-sm bg-slate-100 hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STATUS BADGES (visual only, not buttons)
// ============================================

const StatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
  switch (status) {
    case 'PAYMENT_REQUIRED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: '#dbeafe', color: '#1d4ed8', border: '1px solid #93c5fd' }}>
          <AlertCircle size={12} /> Payment Required
        </span>
      );
    case 'DEAL_FUNDED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' }}>
          <Clock size={12} /> Deal Funded
        </span>
      );
    case 'PAYMENT_COMPLETE':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
          <Check size={12} /> Payment Complete
        </span>
      );
  }
};

// ============================================
// CTA BUTTONS WITH MICRO-COPY
// ============================================

interface CTAProps {
  status: InvoiceStatus;
  onPayNow?: () => void;
  onReleaseFunds?: () => void;
  onWalkAway?: () => void;
}

const InvoiceCTA: React.FC<CTAProps> = ({ status, onPayNow, onReleaseFunds, onWalkAway }) => {
  switch (status) {
    case 'PAYMENT_REQUIRED':
      return (
        <div className="space-y-2">
          <button
            onClick={(e) => { e.stopPropagation(); onPayNow?.(); }}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #224cff, #4a6fff)', boxShadow: '0 4px 12px rgba(34,76,255,0.3)' }}
          >
            <CreditCard size={16} /> Pay Now
          </button>
          <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
            <ShieldCheck size={10} className="text-green-500" />
            Funds are securely held in trust.
          </p>
        </div>
      );
    case 'DEAL_FUNDED':
      return (
        <div className="space-y-2">
          <button
            onClick={(e) => { e.stopPropagation(); onReleaseFunds?.(); }}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
          >
            <Check size={16} /> Release Funds
          </button>
          <p className="text-[10px] text-slate-500 text-center">
            Release only after you've verified the item and are ready to proceed.
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onWalkAway?.(); }}
            className="w-full text-[11px] text-red-500 hover:text-red-700 font-medium transition-colors text-center"
          >
            Not satisfied? Walk away for $250 and exit the deal.
          </button>
        </div>
      );
    case 'PAYMENT_COMPLETE':
      return (
        <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
          <Check size={12} className="text-green-500" />
          Funds released to seller.
        </p>
      );
  }
};

// ============================================
// VARIANT A: LEDGER LIST (fast scanning)
// ============================================

const InvoiceCardA: React.FC<{
  invoice: Invoice;
  onClick: () => void;
  onPayNow: () => void;
  onReleaseFunds: () => void;
  onWalkAway: () => void;
}> = ({ invoice, onClick, onPayNow, onReleaseFunds, onWalkAway }) => {
  // Countdown for PAYMENT_REQUIRED
  const countdown = invoice.paymentDeadline ? formatCountdown(invoice.paymentDeadline) : null;
  const tenPercent = Math.round(invoice.amount * 0.10);
  const penaltyAmount = Math.min(tenPercent, 250); // 10% or $250, whichever is lower

  return (
    <div
      onClick={onClick}
      className="bg-white border-b border-slate-200 py-4 px-5 hover:bg-slate-50 transition-colors cursor-pointer group"
    >
      {/* 72-Hour Countdown Banner for unpaid invoices */}
      {invoice.status === 'PAYMENT_REQUIRED' && countdown && (
        <div className={`flex items-center justify-between mb-3 px-3 py-2 rounded-lg ${countdown.isUrgent ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className="flex items-center gap-2">
            <Timer size={14} className={countdown.isUrgent ? 'text-red-600' : 'text-amber-600'} />
            <span className={`text-xs font-bold ${countdown.isUrgent ? 'text-red-700' : 'text-amber-700'}`}>
              {countdown.hours}h {countdown.minutes}m remaining to pay
            </span>
          </div>
          <span className={`text-[10px] font-medium ${countdown.isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
            Penalty: ${penaltyAmount} if missed
          </span>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden md:flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-slate-900 truncate mb-1">{invoice.auctionTitle}</h3>
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
            <span>{invoice.number}</span>
            <span>{invoice.date}</span>
            {invoice.seller && <span>{invoice.seller}</span>}
          </div>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="flex items-start gap-6 pl-4">
          <div className="text-right">
            <span className="text-xl font-bold text-slate-900">${invoice.amount.toLocaleString()}</span>
            <p className="text-[10px] text-slate-400 uppercase">USD</p>
          </div>
          <div className="w-40">
            <InvoiceCTA status={invoice.status} onPayNow={onPayNow} onReleaseFunds={onReleaseFunds} onWalkAway={onWalkAway} />
          </div>
          <ChevronRight size={16} className="text-slate-300 mt-3 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>

      {/* Mobile Layout - Stacked */}
      <div className="md:hidden space-y-3">
        <h3 className="font-bold text-sm text-slate-900">{invoice.auctionTitle}</h3>
        <StatusBadge status={invoice.status} />
        <div className="text-xl font-bold text-slate-900">${invoice.amount.toLocaleString()}</div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{invoice.number}</span>
          <span>{invoice.date}</span>
        </div>
        <InvoiceCTA status={invoice.status} onPayNow={onPayNow} onReleaseFunds={onReleaseFunds} onWalkAway={onWalkAway} />
      </div>
    </div>
  );
};

// ============================================
// VARIANT B: ACTION-FORWARD CARDS (best clarity)
// ============================================

const InvoiceCardB: React.FC<{
  invoice: Invoice;
  onClick: () => void;
  onPayNow: () => void;
  onReleaseFunds: () => void;
  onWalkAway: () => void;
}> = ({ invoice, onClick, onPayNow, onReleaseFunds, onWalkAway }) => {
  const isActionRequired = invoice.status !== 'PAYMENT_COMPLETE';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-5 cursor-pointer transition-all hover:shadow-lg ${isActionRequired && invoice.status === 'PAYMENT_REQUIRED' ? 'border-blue-200 bg-blue-50/20' : invoice.status === 'DEAL_FUNDED' ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200 bg-white'}`}
    >
      {/* Title */}
      <h3 className="font-bold text-base text-slate-900 mb-3">{invoice.auctionTitle}</h3>

      {/* Status + Amount Row */}
      <div className="flex items-center justify-between mb-4">
        <StatusBadge status={invoice.status} />
        <span className="text-2xl font-bold" style={{ color: invoice.status === 'PAYMENT_REQUIRED' ? '#224cff' : invoice.status === 'DEAL_FUNDED' ? '#92400e' : '#166534' }}>
          ${invoice.amount.toLocaleString()}
        </span>
      </div>

      {/* Meta Row */}
      <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
        <span className="flex items-center gap-1"><Hash size={10} />{invoice.number}</span>
        <span className="flex items-center gap-1"><Calendar size={10} />{invoice.date}</span>
        {invoice.seller && <span>{invoice.seller}</span>}
      </div>

      {/* CTA Area */}
      <div className="pt-4 border-t border-slate-100">
        <InvoiceCTA status={invoice.status} onPayNow={onPayNow} onReleaseFunds={onReleaseFunds} onWalkAway={onWalkAway} />
      </div>
    </div>
  );
};

// ============================================
// VARIANT C: RECEIPT LAYOUT (finance feel)
// ============================================

const InvoiceCardC: React.FC<{
  invoice: Invoice;
  onClick: () => void;
  onPayNow: () => void;
  onReleaseFunds: () => void;
  onWalkAway: () => void;
}> = ({ invoice, onClick, onPayNow, onReleaseFunds, onWalkAway }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
  >
    {/* Top: Date & Invoice Number (receipt header) */}
    <div className="px-5 py-3 border-b border-dashed border-slate-200 flex items-center justify-between bg-slate-50">
      <div className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <Calendar size={12} />
        {invoice.date}
      </div>
      <div className="text-xs font-mono text-slate-400">
        {invoice.number}
      </div>
    </div>

    {/* Middle: Title & Amount */}
    <div className="p-5">
      <h3 className="font-bold text-base text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
        {invoice.auctionTitle}
      </h3>
      {invoice.seller && (
        <p className="text-xs text-slate-500 mb-3">{invoice.seller}</p>
      )}
      <div className="flex items-center gap-2 mb-4">
        <DollarSign size={20} className="text-slate-400" />
        <span className="text-3xl font-bold text-slate-900">{invoice.amount.toLocaleString()}</span>
        <span className="text-xs font-medium text-slate-400 uppercase">USD</span>
      </div>
      <StatusBadge status={invoice.status} />
    </div>

    {/* Bottom: CTA Area (like receipt stamp) */}
    <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
      <InvoiceCTA status={invoice.status} onPayNow={onPayNow} onReleaseFunds={onReleaseFunds} onWalkAway={onWalkAway} />
    </div>
  </div>
);

// ============================================
// SKELETON LOADER
// ============================================

const InvoiceSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
    <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
    <div className="h-3 bg-slate-200 rounded w-1/2 mb-4" />
    <div className="h-8 bg-slate-200 rounded w-1/3 mb-4" />
    <div className="h-10 bg-slate-200 rounded w-full" />
  </div>
);

// ============================================
// EMPTY STATE
// ============================================

const EmptyState: React.FC<{ onBrowse: () => void }> = ({ onBrowse }) => (
  <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-300">
      <FileText size={32} />
    </div>
    <h3 className="text-xl font-display text-slate-900 uppercase mb-2">No invoices yet</h3>
    <p className="text-slate-500 mb-6">When you bid or sell, your invoices will appear here.</p>
    <button
      onClick={onBrowse}
      className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-[0.98]"
      style={{ background: 'linear-gradient(135deg, #224cff, #4a6fff)' }}
    >
      Browse Auctions
    </button>
  </div>
);

// ============================================
// MAIN PAGE COMPONENT
// ============================================

const InvoicesPage: React.FC<InvoicesPageProps> = ({ onBack }) => {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [view, setView] = useState<'list' | 'detail'>('list');

  // Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showWalkAwayModal, setShowWalkAwayModal] = useState(false);

  // Handlers
  const handlePayment = () => {
    if (selectedInvoice) {
      setInvoices(prev => prev.map(inv =>
        inv.id === selectedInvoice.id ? { ...inv, status: 'DEAL_FUNDED' } : inv
      ));
      setShowPaymentModal(false);
      setView('list');
      alert('Payment successful! Funds are now held in trust.');
    }
  };

  const handleReleaseFunds = () => {
    if (selectedInvoice) {
      setInvoices(prev => prev.map(inv =>
        inv.id === selectedInvoice.id ? { ...inv, status: 'PAYMENT_COMPLETE' } : inv
      ));
      setShowReleaseModal(false);
      setView('list');
      alert('Funds released to seller! Transaction complete.');
    }
  };

  const handleWalkAway = () => {
    setShowWalkAwayModal(false);
    setView('list');
    alert('Walk-away processed. Fee charged.');
  };

  return (
    <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right-4 duration-300">

      {/* Modals */}
      {selectedInvoice && (
        <>
          <PaymentInvoiceModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            invoice={selectedInvoice}
            onConfirmPayment={handlePayment}
          />
          <ReleaseFundsModal
            isOpen={showReleaseModal}
            onClose={() => setShowReleaseModal(false)}
            amount={selectedInvoice.amount}
            onConfirm={handleReleaseFunds}
            onWalkAway={() => { setShowReleaseModal(false); setShowWalkAwayModal(true); }}
          />
          <WalkAwayModal
            isOpen={showWalkAwayModal}
            onClose={() => setShowWalkAwayModal(false)}
            onConfirm={handleWalkAway}
          />
        </>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-xl font-display text-slate-900 uppercase italic tracking-tighter leading-none">My Invoices</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage Payments & Releases</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-6">

        {/* Safety Rules Teaser */}
        <div className="mb-6 p-4 rounded-2xl border bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <BookOpen size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Read Our Safety Rules</h3>
                <p className="text-xs text-slate-500">Understand your buyer protections before completing payments.</p>
              </div>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
              <ExternalLink size={12} />
              View
            </button>
          </div>
        </div>

        {/* Invoice List */}
        {invoices.length === 0 ? (
          <EmptyState onBrowse={onBack} />
        ) : (
          invoices.map(invoice => (
            <InvoiceCardB
              key={invoice.id}
              invoice={invoice}
              onClick={() => { setSelectedInvoice(invoice); setView('detail'); }}
              onPayNow={() => { setSelectedInvoice(invoice); setShowPaymentModal(true); }}
              onReleaseFunds={() => { setSelectedInvoice(invoice); setShowReleaseModal(true); }}
              onWalkAway={() => { setSelectedInvoice(invoice); setShowWalkAwayModal(true); }}
            />
          ))
        )}

        {/* End of List */}
        {invoices.length > 0 && (
          <div className="pt-8 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">End of Invoices</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default InvoicesPage;
