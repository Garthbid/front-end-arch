import React from 'react';
import { Button } from './ui/button';
import { Gavel } from 'lucide-react';
import { COLORS } from '../constants';

interface UnreservedPillProps {
    onClick?: () => void;
    className?: string;
    isMobile?: boolean;
}

const UnreservedPill: React.FC<UnreservedPillProps> = ({ onClick, className, isMobile }) => {
    return (
        <Button
            variant="outline"
            size="pill"
            onClick={onClick}
            className={`
        relative group transition-all duration-300 ease-out
        bg-white border-[#224cff]/20 shadow-sm rounded-full
        hover:border-[#224cff]/40 hover:-translate-y-0.5
        ${isMobile ? 'px-3 py-1 scale-95' : 'px-4 py-1.5'}
        ${className}
      `}
            style={{
                height: '40px',
            }}
        >
            {/* Background Breathing Pulse Effect behind icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none">
                <div
                    className="absolute inset-0 rounded-full bg-[#ff5000]/15 blur-md animate-[breathing_3s_ease-in-out_infinite]"
                    style={{ transform: 'scale(1.2)' }}
                />
            </div>

            <div className="flex items-center gap-2.5 relative z-10">
                {/* Crossed Gavels Icon */}
                <div className="relative flex items-center justify-center">
                    <Gavel
                        size={isMobile ? 18 : 20}
                        className="text-[#0F172A] transform rotate-[-45deg] group-hover:scale-110 transition-transform duration-300"
                        strokeWidth={2.5}
                    />
                </div>

                {/* Text content stack */}
                <div className="flex flex-col items-start leading-none gap-0.5">
                    <span
                        className="text-[13px] font-black tracking-tight"
                        style={{
                            fontFamily: "'Luckiest Guy', cursive",
                            color: '#0F172A',
                        }}
                    >
                        UNRESERVED
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 font-inter">
                        Live Now
                    </span>
                </div>
            </div>

            <style>{`
        @keyframes breathing {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.4); opacity: 0.25; }
        }
      `}</style>
        </Button>
    );
};

export default UnreservedPill;
