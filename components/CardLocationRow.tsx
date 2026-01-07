import React from 'react';
import { MapPin } from 'lucide-react';
import { COLORS } from '../constants';
import { AuctionStatus } from '../types';

// Updated Light & Bold Status Configuration
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    'FEATURED': { label: 'LIVE', color: '#ef4444' }, // Red-500
    'UNRESERVED': { label: 'UNRESERVED', color: COLORS.fireOrange },
    'PENDING': { label: 'RESERVED', color: COLORS.steelGray },
    'SOLD': { label: 'SOLD', color: '#10b981' }, // Emerald-500
    'NOT_SOLD': { label: 'ENDED', color: COLORS.steelGray },
    'LIVE': { label: 'LIVE', color: '#ef4444' }, // Red-500
    'SCHEDULED': { label: 'SCHEDULED', color: COLORS.steelGray },
    'ENDED': { label: 'ENDED', color: COLORS.steelGray }
};

interface CardLocationRowProps {
    location?: string;
    status?: AuctionStatus;
}

/**
 * CardLocationRow - Light/Bold compliant location + status row
 */
const CardLocationRow: React.FC<CardLocationRowProps> = ({ location, status }) => {
    if (!location && !status) return null;

    const statusConfig = status ? STATUS_CONFIG[status] : null;

    return (
        <div
            className="h-8 flex items-center gap-1.5 px-3"
            style={{ borderBottom: `1px solid ${COLORS.border}` }}
        >
            {/* Location */}
            {location && (
                <>
                    <MapPin size={12} strokeWidth={2.5} style={{ color: COLORS.steelGray }} className="flex-shrink-0" />
                    <span
                        className="text-[11px] font-semibold tracking-wide truncate"
                        style={{ color: COLORS.textSecondary }}
                    >
                        {location}
                    </span>
                </>
            )}

            {/* Separator + Status */}
            {location && statusConfig && (
                <span className="text-[11px] flex-shrink-0" style={{ color: COLORS.textMuted }}>•</span>
            )}

            {statusConfig && (
                <span
                    className="text-[11px] font-bold tracking-wide flex-shrink-0 uppercase"
                    style={{ color: statusConfig.color }}
                >
                    {statusConfig.label}
                </span>
            )}
        </div>
    );
};

export default CardLocationRow;
