import React from 'react';
import { Deal, TimelineEvent } from './types';
import { DealStatusBadge } from './DealStatusBadge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { Button } from '../ui/button';
import {
  User,
  Package,
  MapPin,
  Mail,
  Phone,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  X,
} from 'lucide-react';

interface DealDetailSheetProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkPaid: (dealId: string) => void;
  onSendPayout: (dealId: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

const getActorIcon = (actor: TimelineEvent['actor']) => {
  switch (actor) {
    case 'system':
      return <Clock size={14} className="text-slate-400" />;
    case 'buyer':
      return <User size={14} className="text-blue-500" />;
    case 'seller':
      return <Package size={14} className="text-purple-500" />;
    case 'admin':
      return <CheckCircle2 size={14} className="text-green-500" />;
    default:
      return <AlertCircle size={14} className="text-slate-400" />;
  }
};

const getActorLabel = (actor: TimelineEvent['actor']) => {
  switch (actor) {
    case 'system':
      return 'System';
    case 'buyer':
      return 'Buyer';
    case 'seller':
      return 'Seller';
    case 'admin':
      return 'Admin';
    default:
      return 'Unknown';
  }
};

export const DealDetailSheet: React.FC<DealDetailSheetProps> = ({
  deal,
  isOpen,
  onClose,
  onMarkPaid,
  onSendPayout,
}) => {
  if (!deal) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto" hideDefaultClose>
        <SheetHeader className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl">{deal.itemTitle}</SheetTitle>
              <p className="text-sm text-slate-500 font-mono mt-1">#{deal.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <DealStatusBadge status={deal.status} className="mt-3" />
        </SheetHeader>

        {/* Financial Summary */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-slate-900 mb-3">Financial Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Sale Price</span>
              <span className="font-medium">{formatCurrency(deal.salePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Platform Fee (5%)</span>
              <span className="font-medium text-red-600">-{formatCurrency(deal.platformFee)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-semibold text-slate-900">Seller Payout</span>
              <span className="font-bold text-emerald-600">{formatCurrency(deal.sellerPayout)}</span>
            </div>
          </div>
        </div>

        {/* Buyer Info */}
        <div className="mb-6">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <User size={16} />
            Buyer
          </h4>
          <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-sm">
            <p className="font-medium text-slate-900">@{deal.buyer.username}</p>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail size={14} />
              <a href={`mailto:${deal.buyer.email}`} className="hover:underline">
                {deal.buyer.email}
              </a>
            </div>
            {deal.buyer.phone && (
              <div className="flex items-center gap-2 text-slate-600">
                <Phone size={14} />
                <a href={`tel:${deal.buyer.phone}`} className="hover:underline">
                  {deal.buyer.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Seller Info */}
        <div className="mb-6">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Package size={16} />
            Seller
          </h4>
          <div className="bg-purple-50 rounded-lg p-4 space-y-2 text-sm">
            <p className="font-medium text-slate-900">@{deal.seller.username}</p>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail size={14} />
              <a href={`mailto:${deal.seller.email}`} className="hover:underline">
                {deal.seller.email}
              </a>
            </div>
            {deal.seller.phone && (
              <div className="flex items-center gap-2 text-slate-600">
                <Phone size={14} />
                <a href={`tel:${deal.seller.phone}`} className="hover:underline">
                  {deal.seller.phone}
                </a>
              </div>
            )}
            {deal.seller.payoutInfo && (
              <div className="mt-3 pt-3 border-t border-purple-100">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Building2 size={14} />
                  <span className="font-medium">Payout Info</span>
                </div>
                <p className="pl-6 text-slate-600">
                  {deal.seller.payoutInfo.bankName} - ****{deal.seller.payoutInfo.accountLast4}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <MapPin size={16} />
            Location
          </h4>
          <p className="text-slate-600">{deal.location}</p>
        </div>

        {/* Timeline / Audit Trail */}
        <div className="mb-6">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Clock size={16} />
            Timeline
          </h4>
          <div className="space-y-3">
            {deal.timeline.map((event, index) => (
              <div
                key={event.id}
                className="flex gap-3 text-sm"
              >
                <div className="flex-shrink-0 mt-1">
                  {getActorIcon(event.actor)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900">{event.event}</p>
                  {event.note && (
                    <p className="text-slate-500 text-xs mt-0.5">{event.note}</p>
                  )}
                  <p className="text-slate-400 text-xs mt-1">
                    {formatDateTime(event.timestamp)} • {getActorLabel(event.actor)}
                  </p>
                </div>
                {index < deal.timeline.length - 1 && (
                  <div className="absolute left-[21px] top-6 bottom-0 w-px bg-slate-200" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t pt-4 -mx-6 px-6 pb-2">
          {deal.status === 'PAYMENT_RECEIVED' && (
            <Button
              onClick={() => {
                onMarkPaid(deal.id);
                onClose();
              }}
              className="w-full bg-[#2238ff] hover:bg-[#1a2bcc] text-white font-semibold py-3"
            >
              <CheckCircle2 size={18} className="mr-2" />
              Mark As Paid
              <ArrowRight size={16} className="ml-2" />
            </Button>
          )}
          {deal.status === 'PAYOUT_REQUESTED' && (
            <Button
              onClick={() => {
                onSendPayout(deal.id);
                onClose();
              }}
              className="w-full bg-[#2238ff] hover:bg-[#1a2bcc] text-white font-semibold py-3"
            >
              <Building2 size={18} className="mr-2" />
              Send Payout ({formatCurrency(deal.sellerPayout)})
              <ArrowRight size={16} className="ml-2" />
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DealDetailSheet;
