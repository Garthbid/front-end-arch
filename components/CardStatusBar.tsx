import React from 'react';
import { AuctionStatus } from '../types';

// Semantic color mapping for the top border signal
const STATUS_BAR_COLORS: Record<string, string> = {
    'FEATURED': 'bg-[#224cff]',      // Brand Blue
    'UNRESERVED': 'bg-[#ff5800]',    // Brand Orange  
    'PENDING': 'bg-[#f59e0b]',       // Amber
    'SOLD': 'bg-[#00d26a]',          // Green
    'NOT_SOLD': 'bg-[#ef4444]',      // Red
    'LIVE': 'bg-[#224cff]',          // Brand Blue
    'SCHEDULED': 'bg-slate-400',
    'ENDED': 'bg-slate-600'
};

interface CardStatusBarProps {
    status: AuctionStatus;
}

/**
 * CardStatusBar - Top border signal bar
 * 
 * A 5px colored bar at the very top of the card.
 * Clips to the card's top corner radius.
 * Clean and flat - no gradients, no glow.
 */
const CardStatusBar: React.FC<CardStatusBarProps> = ({ status }) => {
    if (!status) return null;

    const colorClass = STATUS_BAR_COLORS[status];
    if (!colorClass) return null;

    return (
        <div
            className={`h-[5px] w-full ${colorClass}`}
            aria-hidden="true"
        />
    );
};

export default CardStatusBar;
