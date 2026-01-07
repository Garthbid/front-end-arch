import React from 'react';

interface OverlaySurfaceProps {
    children: React.ReactNode;
    className?: string;
    /** Enable hover lift animation (translateY + scale) */
    enableHoverLift?: boolean;
}

/**
 * OverlaySurface - Shared UI primitive for floating image overlays
 * 
 * Specs:
 * - border-radius: 14px
 * - Background: rgba(255,255,255,0.55)
 * - backdrop-filter: blur(10px)
 * - Border: 1px solid rgba(255,255,255,0.35)
 * - Soft shadow
 */
const OverlaySurface: React.FC<OverlaySurfaceProps> = ({
    children,
    className = '',
    enableHoverLift = false
}) => {
    const hoverClasses = enableHoverLift
        ? 'group-hover:translate-y-[-2px] group-hover:scale-[1.02]'
        : '';

    return (
        <div
            className={`
                bg-white/55 
                backdrop-blur-[10px] 
                border border-white/35 
                rounded-[14px] 
                shadow-[0_2px_8px_rgba(0,0,0,0.08)]
                transition-all duration-[160ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]
                ${hoverClasses}
                ${className}
            `}
        >
            {children}
        </div>
    );
};

export default OverlaySurface;
