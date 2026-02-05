import React from 'react';
import { DealStatus, isActionRequired } from './types';
import { cn } from '../../utils/cn';

interface DealStatusBadgeProps {
  status: DealStatus;
  className?: string;
}

const statusConfig: Record<DealStatus, { label: string; bg: string; text: string; icon?: string }> = {
  AWAITING_PAYMENT: {
    label: 'Awaiting Payment',
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    icon: '🟡',
  },
  PAYMENT_RECEIVED: {
    label: 'Action Required',
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    icon: '⚡',
  },
  FUNDS_HELD: {
    label: 'Funds Held',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: '🔵',
  },
  PAYOUT_REQUESTED: {
    label: 'Action Required',
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    icon: '⚡',
  },
  COMPLETE: {
    label: 'Deal Complete',
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    icon: '🟢',
  },
};

export const DealStatusBadge: React.FC<DealStatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];
  const actionRequired = isActionRequired(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold',
        config.bg,
        config.text,
        actionRequired && 'ring-2 ring-orange-300 ring-offset-1',
        className
      )}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

export default DealStatusBadge;
