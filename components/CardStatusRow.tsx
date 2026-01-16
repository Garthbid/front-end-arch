import React from 'react';
import { Sparkles, Zap, Clock, CheckCircle, XCircle } from 'lucide-react';
import { AuctionStatus } from '../types';

// Status configuration with semantic colors (text only, no backgrounds)
const STATUS_CONFIG: Record<string, {
    label: string;
    icon: React.ElementType;
    colorClass: string;
}> = {
    'FEATURED': {
        label: 'Featured',
        icon: Sparkles,
        colorClass: 'text-[#2238ff]'
    },
    'UNRESERVED': {
        label: 'No Reserve',
        icon: Zap,
        colorClass: 'text-[#ff5800]'
    },
    'PENDING': {
        label: 'Pending',
        icon: Clock,
        colorClass: 'text-[#d97706]'
    },
    'SOLD': {
        label: 'Sold',
        icon: CheckCircle,
        colorClass: 'text-[#00d26a]'
    },
    'NOT_SOLD': {
        label: 'Not Sold',
        icon: XCircle,
        colorClass: 'text-[#ef4444]'
    },
    'LIVE': {
        label: 'Live',
        icon: Zap,
        colorClass: 'text-[#2238ff]'
    },
    'SCHEDULED': {
        label: 'Scheduled',
        icon: Clock,
        colorClass: 'text-slate-500'
    },
    'ENDED': {
        label: 'Ended',
        icon: XCircle,
        colorClass: 'text-slate-500'
    }
};

interface CardStatusRowProps {
    status: AuctionStatus;
}

/**
 * CardStatusRow - Static status text row
 * 
 * Clean, calm, editorial design.
 * Format: STATUS • Featured (with optional icon)
 * No animation, no backgrounds.
 */
const CardStatusRow: React.FC<CardStatusRowProps> = ({ status }) => {
    if (!status) return null;

    const config = STATUS_CONFIG[status];
    if (!config) return null;

    const Icon = config.icon;

    return (
        <div className="h-8 flex items-center gap-1.5 px-3 border-b border-gray-100">
            {/* "STATUS" label - neutral */}
            <span className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                Status
            </span>

            {/* Separator */}
            <span className="text-gray-300 text-[11px]">•</span>

            {/* Status value with icon - semantic color */}
            <div className={`flex items-center gap-1 ${config.colorClass}`}>
                <Icon size={12} strokeWidth={2.5} />
                <span className="text-[11px] font-display">
                    {config.label}
                </span>
            </div>
        </div>
    );
};

export default CardStatusRow;
