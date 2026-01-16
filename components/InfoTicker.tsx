import React, { useMemo, useState, useEffect } from 'react';
import { Timer, MapPin, Sparkles, Zap, Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { AuctionStatus } from '../types';

interface InfoTickerProps {
    timeLeft: string;
    status: AuctionStatus;
    location?: string;
    winningBidder?: string;
}

// Status configuration for semantic colors
const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; colorClass: string }> = {
    'FEATURED': { label: 'Featured', icon: Sparkles, colorClass: 'text-[#2238ff]' },
    'UNRESERVED': { label: 'No Reserve', icon: Zap, colorClass: 'text-[#ff5800]' },
    'PENDING': { label: 'Pending', icon: Clock, colorClass: 'text-[#d97706]' },
    'SOLD': { label: 'Sold', icon: CheckCircle, colorClass: 'text-[#00d26a]' },
    'NOT_SOLD': { label: 'Not Sold', icon: XCircle, colorClass: 'text-[#ef4444]' },
    'LIVE': { label: 'Live', icon: Zap, colorClass: 'text-[#2238ff]' },
    'SCHEDULED': { label: 'Scheduled', icon: Clock, colorClass: 'text-slate-500' },
    'ENDED': { label: 'Ended', icon: XCircle, colorClass: 'text-slate-600' }
};

/**
 * InfoTicker - Horizontal scrolling marquee
 * 
 * Displays: ⏱ 31m 38s • W: bidder427 • 📍 Edmonton, AB • ✨ Featured
 * Smooth, slow, continuous horizontal scroll with seamless loop.
 */
const InfoTicker: React.FC<InfoTickerProps> = ({
    timeLeft,
    status,
    location,
    winningBidder
}) => {
    const [isPaused, setIsPaused] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Check reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Build ticker content
    const tickerContent = useMemo(() => {
        const items: React.ReactNode[] = [];

        // 1. Time
        items.push(
            <span key="time" className="flex items-center gap-1.5 text-gray-500">
                <Timer size={12} strokeWidth={2.5} className="text-[#ff5800]" />
                <span>{timeLeft}</span>
            </span>
        );

        // 2. Winner (if available)
        if (winningBidder) {
            items.push(
                <span key="winner" className="flex items-center gap-1.5 text-gray-500">
                    <Trophy size={12} strokeWidth={2.5} />
                    <span>{winningBidder}</span>
                </span>
            );
        }

        // 3. Location (if available)
        if (location) {
            items.push(
                <span key="location" className="flex items-center gap-1.5 text-gray-500">
                    <MapPin size={12} strokeWidth={2.5} />
                    <span>{location}</span>
                </span>
            );
        }

        // 4. Status (if available) - semantic colored
        if (status && STATUS_CONFIG[status]) {
            const config = STATUS_CONFIG[status];
            const StatusIcon = config.icon;
            items.push(
                <span key="status" className={`flex items-center gap-1.5 ${config.colorClass}`}>
                    <StatusIcon size={12} strokeWidth={2.5} />
                    <span>{config.label}</span>
                </span>
            );
        }

        // Join with dot separators
        return items.reduce<React.ReactNode[]>((acc, item, idx) => {
            if (idx > 0) {
                acc.push(
                    <span key={`sep-${idx}`} className="text-gray-300 mx-3">•</span>
                );
            }
            acc.push(item);
            return acc;
        }, []);
    }, [timeLeft, winningBidder, location, status]);

    // Generate accessible label
    const ariaLabel = useMemo(() => {
        const parts: string[] = [];
        parts.push(`${timeLeft} remaining`);
        if (winningBidder) parts.push(`Leading bidder ${winningBidder}`);
        if (location) parts.push(`Location ${location}`);
        if (status && STATUS_CONFIG[status]) {
            parts.push(`Status ${STATUS_CONFIG[status].label}`);
        }
        return parts.join('. ');
    }, [timeLeft, winningBidder, location, status]);

    const shouldAnimate = !isPaused && !prefersReducedMotion;

    return (
        <div
            className="relative h-8 overflow-hidden border-b border-gray-100"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            tabIndex={0}
            role="marquee"
            aria-label={ariaLabel}
        >
            {/* Scrolling track - duplicated for seamless loop */}
            <div
                className={`
                    flex items-center h-full whitespace-nowrap
                    text-[11px] font-semibold tracking-wide
                    ${shouldAnimate ? 'animate-marquee' : ''}
                `}
                style={{
                    animationPlayState: shouldAnimate ? 'running' : 'paused'
                }}
            >
                {/* First copy */}
                <div className="flex items-center px-3">
                    {tickerContent}
                </div>

                {/* Spacer */}
                <span className="text-gray-300 mx-6">•</span>

                {/* Second copy for seamless loop */}
                <div className="flex items-center px-3">
                    {tickerContent}
                </div>

                {/* Spacer */}
                <span className="text-gray-300 mx-6">•</span>
            </div>

            {/* Animation keyframes */}
            <style>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                .animate-marquee {
                    animation: marquee 22s linear infinite;
                    will-change: transform;
                }
                
                @media (prefers-reduced-motion: reduce) {
                    .animate-marquee {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default InfoTicker;
