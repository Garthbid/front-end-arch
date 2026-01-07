import React, { useState, useEffect, useRef } from 'react';

export type BidStatus = 'none' | 'winning' | 'losing' | 'won' | 'lost';

interface UserBidStatusProps {
    status: BidStatus;
    characterImage?: string;
}

/**
 * UserBidStatus - Character face overlay showing bid status
 * 
 * Shows the user's character face (head only) in bottom-right with:
 * - Green "You're winning" / "You won"
 * - Red "You're losing"
 * 
 * Face-only for instant recognition, ~25% of corner area presence.
 */
const UserBidStatus: React.FC<UserBidStatusProps> = ({
    status,
    characterImage = '/garth-character.png'
}) => {
    const [animationClass, setAnimationClass] = useState('');
    const prevStatusRef = useRef<BidStatus>(status);

    // Handle state change animations
    useEffect(() => {
        if (prevStatusRef.current !== status) {
            if (prevStatusRef.current === 'winning' && status === 'losing') {
                setAnimationClass('animate-settle');
            } else if (prevStatusRef.current === 'losing' && status === 'winning') {
                setAnimationClass('animate-pop');
            }
            prevStatusRef.current = status;
            const timer = setTimeout(() => setAnimationClass(''), 200);
            return () => clearTimeout(timer);
        }
    }, [status]);

    // Don't show if user hasn't bid
    if (status === 'none') return null;

    const config = {
        winning: {
            label: "You're winning",
            dotColor: 'bg-[#00d26a]',
            textColor: 'text-[#00d26a]'
        },
        losing: {
            label: "You're losing",
            dotColor: 'bg-[#ef4444]',
            textColor: 'text-[#ef4444]'
        },
        won: {
            label: "You won!",
            dotColor: 'bg-[#00d26a]',
            textColor: 'text-[#00d26a]'
        },
        lost: {
            label: "Ended",
            dotColor: 'bg-gray-400',
            textColor: 'text-gray-500'
        }
    };

    const { label, dotColor, textColor } = config[status];

    return (
        <div className="absolute bottom-2 right-2 z-10 flex items-end gap-2">
            {/* Animation keyframes */}
            <style>{`
                @keyframes settle {
                    0% { transform: scale(1); }
                    50% { transform: scale(0.96); }
                    100% { transform: scale(1); }
                }
                @keyframes pop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.06); }
                    100% { transform: scale(1); }
                }
                .animate-settle { animation: settle 180ms ease-out; }
                .animate-pop { animation: pop 180ms ease-out; }
            `}</style>

            {/* Status label chip - positioned to left of face */}
            <div
                className={`
                    flex items-center gap-1.5 
                    bg-white/95 backdrop-blur-sm 
                    px-2.5 py-1.5 
                    rounded-full
                    shadow-md
                    ${animationClass}
                `}
            >
                {/* Status dot */}
                <div className={`w-2 h-2 rounded-full ${dotColor}`} />

                {/* Label text */}
                <span className={`text-[11px] font-bold tracking-wide ${textColor}`}>
                    {label}
                </span>
            </div>

            {/* Character face - cropped to show head only */}
            <div
                className="relative w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-white/80"
                style={{
                    // Soft drop shadow for grounding
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                <img
                    src={characterImage}
                    alt="Your character"
                    className="absolute w-full h-auto object-cover"
                    style={{
                        // Position to show only the face/head portion
                        top: '0',
                        left: '50%',
                        transform: 'translateX(-50%) scale(1.8)',
                        transformOrigin: 'top center'
                    }}
                />
            </div>
        </div>
    );
};

export default UserBidStatus;
