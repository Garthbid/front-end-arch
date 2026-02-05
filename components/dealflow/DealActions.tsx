import React from 'react';
import { Deal } from './types';
import { Button } from '../ui/button';
import { Check, Send, Mail } from 'lucide-react';

interface DealActionsProps {
  deal: Deal;
  onMarkPaid: (dealId: string) => void;
  onSendPayout: (dealId: string) => void;
  onContactBuyer?: (deal: Deal) => void;
  onContactSeller?: (deal: Deal) => void;
}

export const DealActions: React.FC<DealActionsProps> = ({
  deal,
  onMarkPaid,
  onSendPayout,
  onContactBuyer,
  onContactSeller,
}) => {
  const { status } = deal;

  // Primary action based on status
  const renderPrimaryAction = () => {
    switch (status) {
      case 'PAYMENT_RECEIVED':
        return (
          <Button
            onClick={() => onMarkPaid(deal.id)}
            className="w-full bg-[#2238ff] hover:bg-[#1a2bcc] text-white font-semibold py-3"
          >
            <Check size={18} className="mr-2" />
            Mark As Paid
          </Button>
        );

      case 'PAYOUT_REQUESTED':
        return (
          <Button
            onClick={() => onSendPayout(deal.id)}
            className="w-full bg-[#2238ff] hover:bg-[#1a2bcc] text-white font-semibold py-3"
          >
            <Send size={18} className="mr-2" />
            Send Payout
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {renderPrimaryAction()}
      <div className="flex flex-wrap items-center gap-4">
        {onContactBuyer && (
          <button
            onClick={() => onContactBuyer(deal)}
            className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Mail size={14} />
            Contact Buyer
          </button>
        )}
        {onContactSeller && (
          <button
            onClick={() => onContactSeller(deal)}
            className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Mail size={14} />
            Contact Seller
          </button>
        )}
      </div>
    </div>
  );
};

export default DealActions;
