import React, { useState, useEffect, useRef } from 'react';
import { FileText, ChevronRight, ArrowLeft, Calendar, Hash, DollarSign, Check, AlertCircle, Clock, X, ShieldCheck, CreditCard, ExternalLink, BookOpen, Timer, Info, Building, Banknote, Smartphone, Copy, Share2, Gift, Phone, Mail, MessageSquare, Download, Printer, PenLine, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { COLORS } from '../constants';
import { useEarnGBX } from './GBXAnimationProvider';
import BillOfSale, { BillOfSaleData } from './BillOfSale';

// Walk-away fee: under $1,000 = 25%, $1,000+ = 10% (max $2,500)
const calcWalkAwayFee = (amount: number): number => {
  if (amount < 1000) return Math.round(amount * 0.25);
  return Math.min(Math.round(amount * 0.10), 2500);
};

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
  buyerSigned?: boolean; // Has buyer signed the bill of sale
  buyerSignature?: string; // Base64 signature image
  otherParty?: {
    role: 'buyer' | 'seller';
    displayName: string;
    username?: string;
    phone?: string;
    email?: string;
  };
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
  {
    id: '1',
    number: 'INV-2025-001',
    date: 'Jan 9, 2025',
    auctionTitle: '2012 John Deere 9860 STS Combine',
    amount: 125000,
    status: 'PAYMENT_REQUIRED',
    seller: '@farm_king_88',
    paymentDeadline: new Date(Date.now() + 47 * 60 * 60 * 1000),
    serialNumber: 'JD9860-2012-XK47892',
    otherParty: {
      role: 'seller',
      displayName: 'Farm King 88',
      username: '@farm_king_88',
      phone: '555-123-4567',
      email: 'sales@farmking.com'
    }
  },
  {
    id: '2',
    number: 'INV-2025-002',
    date: 'Jan 7, 2025',
    auctionTitle: '2019 Airstream Flying Cloud 23FB',
    amount: 48000,
    status: 'PAYMENT_REQUIRED',
    seller: '@camper_life',
    paymentDeadline: new Date(Date.now() + 8 * 60 * 60 * 1000),
    serialNumber: 'AS-FC23FB-19-1127',
    otherParty: {
      role: 'seller',
      displayName: 'Camper Life',
      username: '@camper_life',
      phone: '555-987-6543'
    }
  },
  {
    id: '3',
    number: 'INV-2024-015',
    date: 'Dec 28, 2024',
    auctionTitle: 'Vintage 1959 Gibson Les Paul Standard',
    amount: 285000,
    status: 'DEAL_FUNDED',
    seller: '@guitar_legends',
    serialNumber: 'GLP-59-22847',
    otherParty: {
      role: 'seller',
      displayName: 'Guitar Legends',
      username: '@guitar_legends',
      email: 'vintage@guitar.com'
    }
  },
  {
    id: '4',
    number: 'INV-2024-012',
    date: 'Dec 15, 2024',
    auctionTitle: '1967 Ford Mustang Shelby GT500',
    amount: 175000,
    status: 'PAYMENT_COMPLETE',
    seller: '@classic_motors',
    serialNumber: 'GT500-67-SN8892',
    otherParty: {
      role: 'seller',
      displayName: 'Classic Motors',
      username: '@classic_motors',
      phone: '555-555-5555',
      email: 'info@classicmotors.com'
    }
  },
  {
    id: '5',
    number: 'INV-2024-008',
    date: 'Nov 22, 2024',
    auctionTitle: 'Antique Grandfather Clock - Howard Miller',
    amount: 4500,
    status: 'PAYMENT_COMPLETE',
    seller: '@vintage_finds',
    serialNumber: 'HM-GC-1945-287',
    otherParty: {
      role: 'seller',
      displayName: 'Vintage Finds',
      username: '@vintage_finds'
    }
  },
  {
    id: '6',
    number: 'INV-2025-003',
    date: 'Jan 12, 2025',
    auctionTitle: '2020 Kubota SVL95-2S Track Loader',
    amount: 67500,
    status: 'DEAL_FUNDED',
    serialNumber: 'KBT-SVL95-20-44821',
    otherParty: {
      role: 'buyer',
      displayName: 'Heavy Equipment Pro',
      username: '@heavy_equip_pro',
      phone: '555-321-7890',
      email: 'purchases@heavyequip.com'
    }
  },
  {
    id: '7',
    number: 'INV-2025-004',
    date: 'Jan 14, 2025',
    auctionTitle: '2018 Case IH Magnum 340 CVT Tractor',
    amount: 189000,
    status: 'PAYMENT_REQUIRED',
    serialNumber: 'CIH-MAG340-18-55923',
    otherParty: {
      role: 'buyer',
      displayName: 'Prairie Farms Co',
      username: '@prairie_farms',
      phone: '555-444-8899',
      email: 'admin@prairiefarms.com'
    }
  },
  {
    id: '8',
    number: 'INV-2024-019',
    date: 'Dec 20, 2024',
    auctionTitle: '2016 Caterpillar 320F L Excavator',
    amount: 142000,
    status: 'PAYMENT_COMPLETE',
    serialNumber: 'CAT-320FL-16-77201',
    otherParty: {
      role: 'buyer',
      displayName: 'Dig Masters Inc',
      username: '@dig_masters',
      phone: '555-222-3344',
      email: 'ops@digmasters.com'
    }
  },
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
          Not Satisfied? Learn About Our Walk-Away Fee
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
  const [step, setStep] = useState<'invoice' | 'methods' | 'details'>('invoice');
  const [selectedMethod, setSelectedMethod] = useState<'interac' | 'wire' | 'bank' | null>(null);

  // Reset step on open
  useEffect(() => {
    if (isOpen) {
      setStep('invoice');
      setSelectedMethod(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate fees
  const itemPrice = invoice.amount;
  const gstRate = 0.05; // 5% GST
  const gstAmount = Math.round(itemPrice * gstRate);
  const settlementRate = 0.05; // 5%
  const settlementFee = Math.min(Math.round(itemPrice * settlementRate), 1500); // Max $1500
  const totalAmount = itemPrice + gstAmount + settlementFee;

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
                    <span className="text-sm text-slate-600">Platform Fee{settlementFee < 1500 && ' (5%)'}</span>
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
                    A 5% platform fee applies to securely hold and transfer funds, capped at $1,500 per transaction.
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center py-3 border-t-2 border-slate-200 mt-2">
                  <span className="font-bold text-slate-900">Total Due</span>
                  <span className="text-2xl font-bold" style={{ color: COLORS.primary }}>
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
                style={{ background: 'linear-gradient(135deg, #2238ff, #4a6fff)', boxShadow: '0 6px 20px rgba(0,34,255,0.35)' }}
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
                  style={{ background: 'linear-gradient(135deg, #2238ff, #4a6fff)', boxShadow: '0 6px 20px rgba(0,34,255,0.35)' }}
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
const WalkAwayModal: React.FC<ModalProps & { amount?: number; onConfirm: () => void }> = ({ isOpen, onClose, amount = 0, onConfirm }) => {
  if (!isOpen) return null;
  const walkAwayFee = calcWalkAwayFee(amount);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200 my-4">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
          <X size={18} className="text-slate-400" />
        </button>

        <div className="p-6 pb-0">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Walk Away From This Deal</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Garthbid is not an "as-is, where-is" marketplace. We prioritize buyer protection and expect accurate, honest listings from all sellers.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            If the item you purchased was not represented accurately, you may choose to walk away from the transaction.
          </p>
        </div>

        {/* Fee Structure */}
        <div className="px-6 mt-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Walk-Away Fee Structure</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Items under $1,000</span>
                <span className="font-bold text-slate-900">25% of final sale price</span>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Items $1,000 and above</span>
                <span className="font-bold text-slate-900">10% of final sale price (max $2,500)</span>
              </div>
            </div>
            {amount > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your fee</span>
                <span className="text-lg font-bold text-red-600">${walkAwayFee.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div className="px-6 mt-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Upon payment of the applicable fee, you will be released from your obligation to complete the purchase.
          </p>
        </div>

        {/* How It Works */}
        <div className="px-6 mt-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">How It Works</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            The walk-away fee covers the cost of remarketing the item in the following auction. This protects sellers from lost time while giving buyers a fair exit when listings are inaccurate.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mt-2">
            We encourage all buyers to ask questions and complete due diligence before placing a bid.
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}
          >
            Walk Away From This Purchase
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
// ARRANGE PICKUP MODAL
// ============================================

const ArrangePickupModal: React.FC<ModalProps & { invoice: Invoice }> = ({ isOpen, onClose, invoice }) => {
  const { otherParty } = invoice;

  if (!isOpen || !otherParty) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[360px] rounded-[32px] p-0 overflow-hidden border-0 shadow-2xl">
        <div className="relative p-8 text-center bg-white z-10">

          {/* Close X (Absolute) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-display uppercase italic tracking-tighter text-slate-900 mb-2">
              Arrange Pickup
            </h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto">
              Connect with the {otherParty.role} to finalize the hand-off details.
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 mb-8 relative group">
            {/* Avatar */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-lg ring-4 ring-white">
                {otherParty.displayName.charAt(0)}
              </div>
            </div>

            <div className="mt-6 space-y-1">
              <h3 className="font-bold text-slate-900 text-lg">{otherParty.displayName}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{otherParty.role}</p>
            </div>

            {/* Phone Number Display */}
            {otherParty.phone ? (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-2xl font-mono font-bold text-slate-900 tracking-tight">{otherParty.phone}</p>
                <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                  <Check size={10} strokeWidth={3} /> Verified Number
                </p>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-400 italic">No phone number listed</p>
              </div>
            )}
          </div>

          {/* Action Button */}
          {otherParty.phone && (
            <a
              href={`tel:${otherParty.phone}`}
              className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 group/btn relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #2238ff, #4a6fff)', boxShadow: '0 8px 24px rgba(0,34,255,0.3)' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              <Phone size={22} className="relative z-10" />
              <span className="relative z-10">Call Now</span>
            </a>
          )}

          {!otherParty.phone && (
            <button
              onClick={onClose}
              className="w-full py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          )}

        </div>

        {/* Decorative flair at bottom */}
        {otherParty.phone && (
          <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
};

// ============================================
// BILL OF SALE MODAL WITH SIGNATURE
// ============================================

const BillOfSaleModal: React.FC<ModalProps & {
  invoice: Invoice;
  onSign?: (signature: string) => void;
}> = ({ isOpen, onClose, invoice, onSign }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSigned, setIsSigned] = useState(invoice.buyerSigned || false);

  // Set up touch event listeners with passive: false for mobile
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getCtx = () => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
      return ctx;
    };

    const getPos = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      if (e.touches.length > 0) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY
        };
      }
      return { x: 0, y: 0 };
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const ctx = getCtx();
      if (!ctx) return;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      setIsDrawing(true);
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const ctx = getCtx();
      if (!ctx) return;
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setHasSignature(true);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setIsDrawing(false);
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, isDrawing]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate bill of sale data from invoice
  const billOfSaleData: BillOfSaleData = {
    invoiceNumber: invoice.number,
    date: invoice.date,
    seller: {
      name: invoice.otherParty?.displayName || 'Seller',
      phone: invoice.otherParty?.phone || 'Not provided',
      location: 'Contact seller for pickup location'
    },
    buyer: {
      name: 'You',
      phone: 'Your phone',
      address: 'Your address'
    },
    item: {
      year: invoice.auctionTitle.match(/\d{4}/)?.[0] || '',
      makeModel: invoice.auctionTitle,
      serialNumber: invoice.serialNumber || 'N/A'
    },
    financials: {
      subtotal: invoice.amount
    }
  };

  // Canvas signature functions
  const getContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    return ctx;
  };

  const getPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement> | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    // Scale factor for canvas coordinate system
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    if ('clientX' in e) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement> | MouseEvent | TouchEvent) => {
    e.preventDefault();
    const ctx = getContext();
    if (!ctx) return;
    const pos = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement> | MouseEvent | TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = getContext();
    if (!ctx) return;
    const pos = getPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement> | MouseEvent | TouchEvent) => {
    if (e) e.preventDefault();
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const submitSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;
    const signature = canvas.toDataURL('image/png');
    onSign?.(signature);
    setIsSigned(true);
  };

  // If already signed, show the document with signature
  if (isSigned || invoice.buyerSigned) {
    return (
      <div className="fixed inset-0 z-[100] bg-white overflow-auto animate-in fade-in duration-200">
        {/* Print Controls (Hidden on Print) */}
        <div className="fixed top-4 right-4 flex gap-4 print:hidden z-50">
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-xl"
          >
            <Printer size={16} /> Print
          </button>
          <button
            onClick={onClose}
            className="w-12 h-12 bg-white border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors shadow-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Document Container */}
        <div className="min-h-screen p-8 bg-slate-100 flex justify-center print:p-0 print:bg-white">
          <div className="shadow-2xl print:shadow-none bg-white">
            <BillOfSale data={billOfSaleData} mode="BUYER" buyerSignature={invoice.buyerSignature} />
          </div>
        </div>
      </div>
    );
  }

  // Signing mode - show signature pad
  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-auto animate-in fade-in duration-200">
      {/* Header Controls */}
      <div className="fixed top-4 right-4 flex gap-4 print:hidden z-50">
        <button
          onClick={onClose}
          className="w-12 h-12 bg-white border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors shadow-md"
        >
          <X size={20} />
        </button>
      </div>

      {/* Document + Sign Section */}
      <div className="min-h-screen bg-slate-100 flex flex-col items-center p-8">
        {/* Bill of Sale Document */}
        <div className="shadow-2xl bg-white mb-8 max-w-[800px]">
          <BillOfSale data={billOfSaleData} mode="BUYER" />
        </div>

        {/* Signature Section */}
        <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
          <h3 className="text-lg font-display uppercase italic text-slate-900 mb-2 text-center">
            Sign Below
          </h3>
          <p className="text-sm text-slate-500 text-center mb-6">
            By signing, you agree to the terms of this Bill of Sale.
          </p>

          {/* Signature Canvas */}
          <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 mb-4">
            <canvas
              ref={canvasRef}
              width={700}
              height={200}
              className="w-full cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={() => stopDrawing()}
              onMouseLeave={() => stopDrawing()}
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-slate-300 text-sm font-medium">Draw your signature here</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={clearSignature}
              className="flex-1 py-3 rounded-xl font-bold text-slate-600 text-sm border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} /> Clear
            </button>
            <button
              onClick={submitSignature}
              disabled={!hasSignature}
              className={`flex-1 py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${hasSignature
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
                : 'bg-slate-300 cursor-not-allowed'
                }`}
            >
              <Check size={16} /> Submit Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// GET PAID MODAL
// ============================================

const GetPaidModal: React.FC<ModalProps & { invoice: Invoice }> = ({
  isOpen, onClose, invoice
}) => {
  const [step, setStep] = useState<'methods' | 'form' | 'review' | 'success'>('methods');
  const [selectedMethod, setSelectedMethod] = useState<'interac' | 'wire' | 'bank' | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [verified, setVerified] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep('methods');
      setSelectedMethod(null);
      setFormData({});
      setVerified(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMethodSelect = (method: 'interac' | 'wire' | 'bank') => {
    setSelectedMethod(method);
    setFormData({});
    setStep('form');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const methodName = selectedMethod === 'interac' ? 'Interac E-Transfer' : selectedMethod === 'wire' ? 'Wire Transfer' : 'Bank Draft Deposit';

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";

  const formFields: { label: string; key: string; placeholder: string; type?: 'text' | 'select'; options?: string[] }[] =
    selectedMethod === 'interac' ? [
      { label: 'Email Address', key: 'email', placeholder: 'you@example.com' },
      { label: 'Confirm Email Address', key: 'confirmEmail', placeholder: 'you@example.com' },
    ] : selectedMethod === 'wire' ? [
      { label: 'Account Holder Name', key: 'accountHolder', placeholder: 'John Doe' },
      { label: 'Bank Name', key: 'bankName', placeholder: 'TD Canada Trust' },
      { label: 'Account Number', key: 'accountNumber', placeholder: '1234567890' },
      { label: 'Routing / Transit Number', key: 'routingNumber', placeholder: '026009593' },
      { label: 'Swift Code (optional)', key: 'swiftCode', placeholder: 'TDOMCATTTOR' },
    ] : [
      { label: 'Full Name', key: 'fullName', placeholder: 'John Doe' },
      { label: 'Local Branch', key: 'branch', placeholder: 'Select a branch', type: 'select', options: ['TD Bank', 'Scotiabank', 'RBC', 'ATB', 'BMO', 'Service Credit Union'] },
      { label: 'Account Number', key: 'accountNumber', placeholder: '1234567890' },
    ];

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

  const handleSubmitPayout = () => {
    alert('Payout request submitted! Funds will be deposited within 1-3 business days.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200 max-h-[90vh] overflow-y-auto">

        {/* Step 1: SELECT PAYMENT METHOD */}
        {step === 'methods' && (
          <>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3 z-10">
              <h2 className="text-lg font-bold text-slate-900">Select Payment Method</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 ml-auto">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-500 mb-6 font-medium">
                Choose how you'd like to receive the <span className="font-bold text-slate-900">${invoice.amount.toLocaleString()}</span>.
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

        {/* Step 2: BANKING INFO FORM */}
        {step === 'form' && selectedMethod && (
          <>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3 z-10">
              <button onClick={() => setStep('methods')} className="p-1 -ml-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-lg font-bold text-slate-900">{methodName}</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 ml-auto">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formFields.map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      className={inputClass + ' appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E")] bg-no-repeat bg-[right_12px_center]'}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className={inputClass}
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}

              <button
                onClick={() => setStep('review')}
                className="w-full py-4 rounded-xl font-bold text-white text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                style={{ background: 'linear-gradient(135deg, #2238ff, #4a6fff)', boxShadow: '0 6px 20px rgba(0,34,255,0.35)' }}
              >
                Submit
              </button>
            </div>
          </>
        )}

        {/* Step 3: REVIEW & VERIFY */}
        {step === 'review' && selectedMethod && (
          <>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3 z-10">
              <button onClick={() => setStep('form')} className="p-1 -ml-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-lg font-bold text-slate-900">Review Your Info</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 ml-auto">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{methodName}</h3>
                {formFields.map(field => (
                  <div key={field.key} className="flex justify-between items-center py-1">
                    <span className="text-xs text-slate-500">{field.label}</span>
                    <span className="text-sm font-medium text-slate-900">{formData[field.key] || '—'}</span>
                  </div>
                ))}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">I verify this information is correct</span>
              </label>

              <button
                onClick={handleSubmitPayout}
                disabled={!verified}
                className={`w-full py-4 rounded-xl font-bold text-white text-base transition-all flex items-center justify-center gap-2 ${verified ? 'active:scale-[0.98]' : 'opacity-50 cursor-not-allowed'}`}
                style={{ background: 'linear-gradient(135deg, #2238ff, #4a6fff)', boxShadow: verified ? '0 6px 20px rgba(0,34,255,0.35)' : 'none' }}
              >
                Send Me My Money
              </button>
            </div>
          </>
        )}

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
  amount?: number;
  isSeller?: boolean;
  isSigned?: boolean;
  onPayNow?: () => void;
  onReleaseFunds?: () => void;
  onWalkAway?: () => void;
  onArrangePickup?: () => void;
  onDownloadBillOfSale?: () => void;
  onGetPaid?: () => void;
}

const InvoiceCTA: React.FC<CTAProps> = ({ status, amount = 0, isSeller, isSigned, onPayNow, onReleaseFunds, onWalkAway, onArrangePickup, onDownloadBillOfSale, onGetPaid }) => {
  const ArrangePickupButton = () => (
    <button
      onClick={(e) => { e.stopPropagation(); onArrangePickup?.(); }}
      className="w-full py-3 rounded-xl font-bold text-slate-700 text-sm border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
    >
      <Phone size={16} className="text-slate-500" /> Arrange Pickup
    </button>
  );

  switch (status) {
    case 'PAYMENT_REQUIRED':
      if (isSeller) {
        return (
          <div className="space-y-3">
            <div
              className="w-full py-3 rounded-xl font-bold text-amber-800 text-sm flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '1px solid #fcd34d' }}
            >
              <Clock size={16} /> Awaiting Payment
            </div>

            <p className="text-[10px] text-slate-600 text-center font-medium">
              Do not release the item until it says "Deal Is Funded"
            </p>
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-full text-[11px] text-blue-600 hover:text-blue-800 font-medium transition-colors text-center"
            >
              Learn more about how payment works
            </button>
          </div>
        );
      }
      return (
        <div className="space-y-3">
          <button
            onClick={(e) => { e.stopPropagation(); onPayNow?.(); }}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #2238ff, #4a6fff)', boxShadow: '0 4px 12px rgba(0,34,255,0.3)' }}
          >
            <CreditCard size={16} /> Pay Now
          </button>

          <ArrangePickupButton />

          <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
            <ShieldCheck size={10} className="text-green-500" />
            Funds are securely held in trust.
          </p>
        </div>
      );
    case 'DEAL_FUNDED':
      if (isSeller) {
        return (
          <div className="space-y-3">
            <ArrangePickupButton />

            <div
              className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
            >
              <Check size={16} /> Deal Is Funded
            </div>

            <p className="text-[10px] text-slate-500 text-center">
              The buyer has funded this deal. Funds will be released after they verify the item.
            </p>
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-full text-[11px] text-blue-600 hover:text-blue-800 font-medium transition-colors text-center"
            >
              Learn more about how payment works
            </button>
          </div>
        );
      }
      return (
        <div className="space-y-3">
          <ArrangePickupButton />

          <button
            onClick={(e) => { e.stopPropagation(); onReleaseFunds?.(); }}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
          >
            <Check size={16} /> Release Funds
          </button>

          <p className="text-[10px] text-slate-500 text-center">
            Release only after you've verified the item.
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onWalkAway?.(); }}
            className="w-full text-[11px] text-red-500 hover:text-red-700 font-medium transition-colors text-center"
          >
            Not Satisfied? Learn About Our Walk-Away Fee
          </button>
        </div>
      );
    case 'PAYMENT_COMPLETE':
      if (isSeller) {
        return (
          <div className="space-y-3">
            <button
              onClick={(e) => { e.stopPropagation(); onGetPaid?.(); }}
              className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #2238ff, #4a6fff)', boxShadow: '0 4px 12px rgba(0,34,255,0.3)' }}
            >
              <Banknote size={16} /> Get Paid
            </button>

            <p className="text-[10px] text-slate-500 text-center">
              Funds will be deposited to your bank account within 1–3 business days
            </p>
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-full text-[11px] text-blue-600 hover:text-blue-800 font-medium transition-colors text-center"
            >
              Learn more about how payment works
            </button>
          </div>
        );
      }
      return (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1 mb-2">
            <Check size={12} className="text-green-500" />
            Funds released to seller.
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onDownloadBillOfSale?.(); }}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #2238ff, #4a6fff)', boxShadow: '0 4px 12px rgba(0,34,255,0.3)' }}
          >
            {isSigned ? (
              <><Download size={16} /> Download Bill Of Sale</>
            ) : (
              <><PenLine size={16} /> Sign Bill Of Sale</>
            )}
          </button>
          <ArrangePickupButton />
        </div>
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
  onArrangePickup: () => void;
}> = ({ invoice, onClick, onPayNow, onReleaseFunds, onWalkAway, onArrangePickup }) => {
  // Countdown for PAYMENT_REQUIRED
  const countdown = invoice.paymentDeadline ? formatCountdown(invoice.paymentDeadline) : null;
  const penaltyAmount = calcWalkAwayFee(invoice.amount);

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
            Walk-away fee: ${penaltyAmount.toLocaleString()}
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
            <InvoiceCTA status={invoice.status} amount={invoice.amount} isSeller={invoice.otherParty?.role === 'buyer'} onPayNow={onPayNow} onReleaseFunds={onReleaseFunds} onWalkAway={onWalkAway} onArrangePickup={onArrangePickup} />
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
        <InvoiceCTA status={invoice.status} amount={invoice.amount} isSeller={invoice.otherParty?.role === 'buyer'} onPayNow={onPayNow} onReleaseFunds={onReleaseFunds} onWalkAway={onWalkAway} onArrangePickup={onArrangePickup} />
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
  onArrangePickup: () => void;
  onDownloadBillOfSale: () => void;
  onGetPaid?: () => void;
}> = ({ invoice, onClick, onPayNow, onReleaseFunds, onWalkAway, onArrangePickup, onDownloadBillOfSale, onGetPaid }) => {
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
        <span className="text-2xl font-bold" style={{ color: invoice.status === 'PAYMENT_REQUIRED' ? COLORS.primary : invoice.status === 'DEAL_FUNDED' ? '#92400e' : '#166534' }}>
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
        <InvoiceCTA status={invoice.status} amount={invoice.amount} isSeller={invoice.otherParty?.role === 'buyer'} isSigned={invoice.buyerSigned} onPayNow={onPayNow} onReleaseFunds={onReleaseFunds} onWalkAway={onWalkAway} onArrangePickup={onArrangePickup} onDownloadBillOfSale={onDownloadBillOfSale} onGetPaid={onGetPaid} />
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
  onArrangePickup: () => void;
}> = ({ invoice, onClick, onPayNow, onReleaseFunds, onWalkAway, onArrangePickup }) => (
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
      <InvoiceCTA status={invoice.status} amount={invoice.amount} isSeller={invoice.otherParty?.role === 'buyer'} onPayNow={onPayNow} onReleaseFunds={onReleaseFunds} onWalkAway={onWalkAway} onArrangePickup={onArrangePickup} />
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
      style={{ background: 'linear-gradient(135deg, #2238ff, #4a6fff)' }}
    >
      Browse Auctions
    </button>
  </div>
);

// ============================================
// INVITE & EARN CARD COMPONENT
// ============================================

const InviteEarnCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showRewardsDialog, setShowRewardsDialog] = useState(false);

  // Mock data (would come from API)
  const inviteUrl = 'garthbid.com/invite/justin-8F3K';
  const fullInviteUrl = 'https://garthbid.com/invite/justin-8F3K';
  const stats = {
    invited: 0,
    joined: 0,
    earned: 0,
  };

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullInviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      // silently ignore
    }
  };

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: 'Join GarthBid',
          text: 'Check out GarthBid - the internet\'s bidding war arena!',
          url: fullInviteUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    }
  };

  return (
    <>
      <div className="mb-6 p-5 rounded-2xl border bg-white border-slate-200 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Gift size={18} className="text-orange-500" />
          <h3 className="font-bold text-sm text-slate-900">Invite & Earn</h3>
        </div>

        {/* Subtext */}
        <p className="text-xs text-slate-500 mb-4">
          Invite friends — earn free Garthbucks when they buy or sell.
        </p>

        {/* Invite Link Display */}
        <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="flex-1 text-xs font-mono text-slate-600 truncate">
            {inviteUrl}
          </span>
          {canShare && (
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
              aria-label="Share invite link"
            >
              <Share2 size={14} className="text-slate-500" />
            </button>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopyLink}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${copied
            ? 'bg-green-500 text-white'
            : 'bg-[#ff5000] text-white hover:bg-[#e54600]'
            }`}
        >
          <Copy size={14} />
          {copied ? 'Copied!' : 'Copy Invite Link'}
        </button>

        {/* Stats Row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div className="text-center flex-1">
            <p className="text-lg font-bold text-slate-900">{stats.invited}</p>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Invited</p>
          </div>
          <div className="text-center flex-1 border-x border-slate-100">
            <p className="text-lg font-bold text-slate-900">{stats.joined}</p>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Joined</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-lg font-bold text-orange-500">{stats.earned}</p>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Earned GBX</p>
          </div>
        </div>

        {/* Empty State Message */}
        {stats.invited === 0 && stats.joined === 0 && (
          <p className="text-xs text-slate-400 text-center mt-3">
            Share your link to start earning.
          </p>
        )}

        {/* How Rewards Work Link */}
        <button
          onClick={() => setShowRewardsDialog(true)}
          className="w-full text-xs text-blue-600 font-medium mt-3 hover:underline"
        >
          How rewards work →
        </button>
      </div>

      {/* How Rewards Work Dialog */}
      <Dialog open={showRewardsDialog} onOpenChange={setShowRewardsDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Gift size={20} className="text-orange-500" />
              How Rewards Work
            </DialogTitle>
            <DialogDescription className="text-slate-600 mt-2">
              Earn Garthbucks when your friends take action!
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
              <span className="text-lg">🎉</span>
              <div>
                <p className="font-bold text-sm text-slate-900">5 GBX</p>
                <p className="text-xs text-slate-500">When they sign up</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <span className="text-lg">🛒</span>
              <div>
                <p className="font-bold text-sm text-slate-900">20 GBX</p>
                <p className="text-xs text-slate-500">When they complete their first purchase</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
              <span className="text-lg">💰</span>
              <div>
                <p className="font-bold text-sm text-slate-900">50 GBX</p>
                <p className="text-xs text-slate-500">When they complete their first sale</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4 text-center">
            Rewards post after the transaction is confirmed.
          </p>

          <button
            onClick={() => setShowRewardsDialog(false)}
            className="w-full mt-4 py-3 rounded-xl bg-[#2238ff] hover:bg-[#1a2dbb] text-white font-bold text-sm transition-colors"
          >
            Got it
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};

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
  const [showPickupSheet, setShowPickupSheet] = useState(false);
  const [showBillOfSaleModal, setShowBillOfSaleModal] = useState(false);
  const [showGetPaidModal, setShowGetPaidModal] = useState(false);

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
    const fee = selectedInvoice ? calcWalkAwayFee(selectedInvoice.amount) : 0;
    setShowWalkAwayModal(false);
    setView('list');
    alert(`Walk-away processed. $${fee.toLocaleString()} fee charged.`);
  };

  const handleArrangePickup = () => {
    setShowPickupSheet(false);
    // If we needed to do anything else here
  };

  const handleSignBillOfSale = (signature: string) => {
    if (selectedInvoice) {
      setInvoices(prev => prev.map(inv =>
        inv.id === selectedInvoice.id ? { ...inv, buyerSigned: true, buyerSignature: signature } : inv
      ));
      // Update selectedInvoice as well for immediate UI update
      setSelectedInvoice(prev => prev ? { ...prev, buyerSigned: true, buyerSignature: signature } : null);
    }
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
            amount={selectedInvoice.amount}
            onConfirm={handleWalkAway}
          />
          <ArrangePickupModal
            isOpen={showPickupSheet}
            onClose={() => setShowPickupSheet(false)}
            invoice={selectedInvoice}
          />
          <BillOfSaleModal
            isOpen={showBillOfSaleModal}
            onClose={() => setShowBillOfSaleModal(false)}
            invoice={selectedInvoice}
            onSign={handleSignBillOfSale}
          />
          <GetPaidModal
            isOpen={showGetPaidModal}
            onClose={() => setShowGetPaidModal(false)}
            invoice={selectedInvoice}
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
        <div className="p-4 rounded-2xl border bg-white border-slate-200">
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
              onArrangePickup={() => { setSelectedInvoice(invoice); setShowPickupSheet(true); }}
              onDownloadBillOfSale={() => { setSelectedInvoice(invoice); setShowBillOfSaleModal(true); }}
              onGetPaid={() => { setSelectedInvoice(invoice); setShowGetPaidModal(true); }}
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


