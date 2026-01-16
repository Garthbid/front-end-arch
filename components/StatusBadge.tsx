import React from 'react';
import { Sparkles, Zap, Clock, CheckCircle, XCircle } from 'lucide-react';
import { AuctionStatus } from '../types';
import OverlaySurface from './OverlaySurface';

interface StatusBadgeProps {
    status: AuctionStatus;
    /** Enable hover lift animation when parent card is hovered */
    enableHoverLift?: boolean;
}

// Status configuration with semantic colors as "ink" (not fill)
const STATUS_CONFIG: Record<string, {
    label: string;
    icon: React.ElementType;
    color: string;        // Text/icon color
    glowColor?: string;   // Optional glow for FEATURED/SOLD
}> = {
    'FEATURED': {
        label: 'FEATURED',
        icon: Sparkles,
        color: 'text-[#2238ff]',
        glowColor: 'bg-[#2238ff]/15'
    },
    'UNRESERVED': {
        label: 'NO RESERVE',
        icon: Zap,
        color: 'text-[#ff5800]'
    },
    'PENDING': {
        label: 'PENDING',
        icon: Clock,
        color: 'text-[#d97706]'  // amber-600
    },
    'SOLD': {
        label: 'SOLD',
        icon: CheckCircle,
        color: 'text-[#00d26a]',
        glowColor: 'bg-[#00d26a]/15'
    },
    'NOT_SOLD': {
        label: 'NOT SOLD',
        icon: XCircle,
        color: 'text-red-400/80'  // Muted
    },
    'LIVE': {
        label: 'LIVE',
        icon: Zap,
        color: 'text-[#2238ff]'
    },
    'SCHEDULED': {
        label: 'SCHEDULED',
        icon: Clock,
        color: 'text-slate-500'
    },
    'ENDED': {
        label: 'ENDED',
        icon: XCircle,
        color: 'text-slate-600'
    }
};

/**
 * StatusBadge - Premium status pill with glass design
 * 
 * Features:
 * - Glass container via OverlaySurface
 * - Semantic "ink" colors (text + icon, not fill)
 * - Small indicator icon on left
 * - PENDING has pulse animation
 * - Optional glow on FEATURED/SOLD
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    enableHoverLift = true
}) => {
    if (!status) return null;

    const config = STATUS_CONFIG[status];
    if (!config) return null;

    const Icon = config.icon;
    const isPending = status === 'PENDING';

    return (
        <OverlaySurface
            enableHoverLift={enableHoverLift}
            className="h-10 px-3 flex items-center gap-2 relative"
        >
            {/* Optional glow behind icon for FEATURED/SOLD */}
            {config.glowColor && (
                <div
                    className={`absolute left-2 w-5 h-5 ${config.glowColor} blur-[8px] rounded-full opacity-60 pointer-events-none`}
                />
            )}

            {/* Icon Indicator */}
            <div className={`relative ${config.color} ${isPending ? 'animate-[status-pulse_2s_ease-in-out_infinite]' : ''}`}>
                <Icon
                    size={12}
                    strokeWidth={2.5}
                    className="relative z-10"
                />
            </div>

            {/* Label */}
            <span
                className={`
                    text-[11px] font-display uppercase
                    ${config.color}
                    relative z-10
                `}
            >
                {config.label}
            </span>

            {/* Keyframes for PENDING pulse */}
            <style>{`
                @keyframes status-pulse {
                    0%, 100% { opacity: 0.7; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.15); }
                }
            `}</style>
        </OverlaySurface>
    );
};

export default StatusBadge;
