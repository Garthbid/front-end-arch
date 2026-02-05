import React, { useState, useRef, useEffect } from 'react';
import { Deal, isActionRequired } from './types';
import { DealStatusBadge } from './DealStatusBadge';
import { DealTimer } from './DealTimer';
import { DealActions } from './DealActions';
import { cn } from '../../utils/cn';
import { User, Package, MapPin, Building2, ChevronDown, ChevronUp, AlertTriangle, Phone } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  onMarkPaid: (dealId: string) => void;
  onSendPayout: (dealId: string) => void;
  onContactBuyer?: (deal: Deal) => void;
  onContactSeller?: (deal: Deal) => void;
  onRemindSeller?: (deal: Deal) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(date);
};

const getStatusMessage = (deal: Deal): string => {
  switch (deal.status) {
    case 'AWAITING_PAYMENT':
      return `Buyer has until ${formatDate(deal.paymentDeadline)} to send payment`;
    case 'PAYMENT_RECEIVED':
      return 'Payment received. Confirm funds in trust account.';
    case 'FUNDS_HELD':
      if (deal.fundsReleasedAt) {
        return 'Buyer released funds. Waiting for seller to request payout.';
      }
      return 'Waiting for buyer to verify item and release funds.';
    case 'PAYOUT_REQUESTED':
      return 'Seller requested payout. Ready to send funds.';
    case 'COMPLETE':
      return `Deal closed ${formatDate(deal.auctionEndedAt)}`;
    default:
      return '';
  }
};

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  onMarkPaid,
  onSendPayout,
  onContactBuyer,
  onContactSeller,
  onRemindSeller,
}) => {
  const actionRequired = isActionRequired(deal.status);
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const payoutRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (payoutRef.current && !payoutRef.current.contains(event.target as Node)) {
        setIsPayoutOpen(false);
      }
    };

    if (isPayoutOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPayoutOpen]);

  return (
    <div
      className={cn(
        'bg-white rounded-lg border shadow-sm overflow-hidden transition-shadow hover:shadow-md',
        actionRequired && 'ring-2 ring-orange-200 border-orange-300'
      )}
    >
      <div className="p-5">
        {/* Header: Title + Price */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 truncate">{deal.itemTitle}</h3>
            {/* Show "Funds Released" badge when funds have been released */}
            {deal.status === 'FUNDS_HELD' && deal.fundsReleasedAt ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 mt-2">
                <span>✓</span>
                <span>Funds Released</span>
              </span>
            ) : (
              <DealStatusBadge status={deal.status} className="mt-2" />
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-bold text-slate-900">{formatCurrency(deal.salePrice)}</p>
          </div>
        </div>

        {/* Meta Row */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <span className="font-mono">#{deal.id}</span>
          <span>•</span>
          <span>{formatDate(deal.auctionEndedAt)}</span>
          <span>•</span>
          <span>Sold {getRelativeTime(deal.auctionEndedAt)}</span>
        </div>

        {/* Timer for AWAITING_PAYMENT */}
        {deal.status === 'AWAITING_PAYMENT' && (
          <div className="mb-4">
            <DealTimer deadline={deal.paymentDeadline} />
          </div>
        )}

        {/* Participants Box */}
        <div className="bg-slate-50 rounded-lg p-3 mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User size={14} className="text-slate-400" />
            <span className="text-slate-600">Buyer:</span>
            <span className="font-medium text-slate-900">@{deal.buyer.username}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Package size={14} className="text-slate-400" />
            <span className="text-slate-600">Seller:</span>
            <span className="font-medium text-slate-900">@{deal.seller.username}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-slate-400" />
            <span className="text-slate-600">Location:</span>
            <span className="font-medium text-slate-900">{deal.location}</span>
          </div>
        </div>

        {/* Seller Reminder Warning for FUNDS_HELD when buyer already released */}
        {deal.status === 'FUNDS_HELD' && deal.fundsReleasedAt && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-900">
                  Funds released — awaiting seller
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Seller needs to request their payout
                </p>
              </div>
            </div>
            {onRemindSeller && (
              <button
                onClick={() => onRemindSeller(deal)}
                className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-sm font-medium rounded-md transition-colors"
              >
                <Phone size={14} />
                Remind Seller
              </button>
            )}
          </div>
        )}

        {/* Payout Info Dropdown for PAYOUT_REQUESTED */}
        {deal.status === 'PAYOUT_REQUESTED' && deal.seller.payoutInfo && (
          <div ref={payoutRef} className="relative mb-4">
            <button
              onClick={() => setIsPayoutOpen(!isPayoutOpen)}
              className={cn(
                'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isPayoutOpen
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              )}
            >
              <div className="flex items-center gap-2">
                <Building2 size={14} />
                <span>Payout Info</span>
                <span className="text-blue-600 font-semibold">{formatCurrency(deal.sellerPayout)}</span>
              </div>
              {isPayoutOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Dropdown Content */}
            {isPayoutOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-blue-200 rounded-lg shadow-lg p-3 z-10">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank</span>
                    <span className="font-medium text-slate-900">{deal.seller.payoutInfo.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account</span>
                    <span className="font-medium text-slate-900">****{deal.seller.payoutInfo.accountLast4}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span className="text-slate-500">Payout Amount</span>
                    <span className="font-bold text-emerald-600">{formatCurrency(deal.sellerPayout)}</span>
                  </div>
                  <p className="text-xs text-slate-400 text-right">
                    After {((deal.platformFee / deal.salePrice) * 100).toFixed(0)}% platform fee
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status Message */}
        <p className="text-sm text-slate-600 mb-4">{getStatusMessage(deal)}</p>

        {/* Actions */}
        <DealActions
          deal={deal}
          onMarkPaid={onMarkPaid}
          onSendPayout={onSendPayout}
          onContactBuyer={onContactBuyer}
          onContactSeller={onContactSeller}
        />
      </div>
    </div>
  );
};

export default DealCard;
