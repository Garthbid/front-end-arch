import React, { useState } from 'react';
import { COLORS } from '../constants';
import {
    Check, Zap, X, Edit3, UserCog,
    FileText, Tag, LayoutDashboard, Crown,
    ChevronLeft, ChevronRight, Palette, Sparkles, Trophy,
    Mountain, Building2, Map as MapIcon, Globe, Rocket,
    MousePointer2
} from 'lucide-react';

// --- GAME-LIKE EPIC BUTTONS ---
const EpicActionButton: React.FC<{ icon: any, label: string, color: string, glowColor: string, delay?: number, onClick?: () => void }> = ({ icon: Icon, label, color, glowColor, delay = 0, onClick }) => (
    <button
        onClick={onClick}
        className={`
            group relative
            flex flex-col items-center justify-center 
            w-28 sm:w-36 md:w-44 lg:w-48 py-6 sm:py-8
            rounded-[24px] border
            shadow-[0_20px_50px_rgba(0,0,0,0.1)]
            hover:scale-105 hover:border-slate-300 hover:-translate-y-1
            active:scale-95
            transition-all duration-300 
            cursor-pointer
            animate-in fade-in slide-in-from-bottom-4 fill-mode-both
        `}
        style={{
            animationDelay: `${delay}ms`,
            background: COLORS.surface1,
            borderColor: COLORS.border
        }}
    >
        {/* Glow Layer */}
        <div className={`absolute inset-0 rounded-[22px] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300`} style={{ background: `${color}20` }} />

        <div className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-2xl border group-hover:scale-110 transition-transform duration-300" style={{ background: COLORS.surface2, borderColor: COLORS.border }}>
            <Icon size={24} sm:size={28} md:size={32} strokeWidth={2.5} style={{ color: color }} />
        </div>
        <span className="text-[11px] sm:text-xs md:text-sm font-display uppercase italic tracking-wide drop-shadow-sm group-hover:text-slate-900 transition-colors" style={{ color: COLORS.textSecondary }}>
            {label}
        </span>

        {/* Progress Bar Detail */}
        <div className="absolute bottom-3 left-6 right-6 h-1 rounded-full overflow-hidden" style={{ background: COLORS.border }}>
            <div className={`h-full w-1/3 rounded-full opacity-80`} style={{ background: color }} />
        </div>
    </button>
);

// --- MAIN PROFILE COMPONENT ---
interface ProfileProps {
    onInvoicesClick?: () => void;
    onListingsClick?: () => void;
    onMembershipClick?: () => void;
    onEditProfileClick?: () => void;
}

const Profile: React.FC<ProfileProps> = ({
    onInvoicesClick,
    onListingsClick,
    onMembershipClick,
    onEditProfileClick
}) => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center transition-all duration-1000 overflow-hidden relative" style={{ background: COLORS.voidBlack }}>

            {/* --- 1. Environmental Backdrop (Optional for light mode, kept subtle) --- */}
            <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
                <img
                    src="/profile-world.png"
                    className="w-full h-full object-cover scale-[1.02] filter grayscale contrast-[1.2]"
                    alt="Auction World"
                />
            </div>

            {/* --- 2. Profile Info Header --- */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 text-center w-full px-4 animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="inline-flex items-center gap-2 backdrop-blur-xl border px-4 py-1.5 rounded-full mb-4 shadow-sm" style={{ background: COLORS.surface1, borderColor: COLORS.border }}>
                    <Crown size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: COLORS.textPrimary }}>Master Member</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display uppercase italic tracking-tighter leading-none drop-shadow-sm" style={{ color: COLORS.textPrimary }}>
                        GARTH <span style={{ color: COLORS.textMuted }}>ROGERS</span>
                    </h1>
                </div>
                <div className="flex items-center justify-center gap-4 mt-6">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: COLORS.steelGray }}>Garthbucks</span>
                        <span className="text-xl font-display italic" style={{ color: COLORS.fireOrange }}>125,000</span>
                    </div>
                    <div className="w-px h-8" style={{ background: COLORS.border }} />
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: COLORS.steelGray }}>Followers</span>
                        <span className="text-xl font-display italic" style={{ color: COLORS.textPrimary }}>712</span>
                    </div>
                </div>
            </div>

            {/* --- 3. Orbiting Action Hub --- */}
            <div className="absolute inset-0 pointer-events-none z-20">
                {/* Left Orbit */}
                <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-12 lg:left-24 flex flex-col gap-4 sm:gap-6 pointer-events-auto">
                    <EpicActionButton
                        icon={Tag}
                        label="My Listings"
                        color={COLORS.fireOrange}
                        glowColor={`${COLORS.fireOrange}40`}
                        delay={200}
                        onClick={onListingsClick}
                    />
                    <EpicActionButton
                        icon={FileText}
                        label="Billing History"
                        color={COLORS.steelGray}
                        glowColor="#00000020"
                        delay={300}
                        onClick={onInvoicesClick}
                    />
                </div>
                {/* Right Orbit */}
                <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-12 lg:right-24 flex flex-col gap-4 sm:gap-6 pointer-events-auto">
                    <EpicActionButton
                        icon={UserCog}
                        label="Edit Profile"
                        color="#10b981"
                        glowColor="#10b98140"
                        delay={400}
                        onClick={onEditProfileClick}
                    />
                    <EpicActionButton
                        icon={Crown}
                        label="Membership"
                        color="#F59E0B"
                        glowColor="#F59E0B40"
                        delay={500}
                        onClick={onMembershipClick}
                    />
                </div>
            </div>

            {/* --- 4. The Hero Character --- */}
            <div className="relative z-10 flex flex-col items-center justify-center scale-90 md:scale-110 mt-24 md:mt-32">
                <div className="relative w-[500px] h-[500px] sm:w-[580px] sm:h-[580px] md:w-[800px] md:h-[800px] flex items-center justify-center animate-idle drop-shadow-2xl">
                    <img
                        src="/garth-cowboy.png"
                        alt="Garth"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Grounded Aura */}
                <div className="absolute bottom-[20px] w-64 h-16 blur-3xl rounded-full -z-10 opacity-20" style={{ background: COLORS.fireOrange }} />
            </div>

            <style>{`
        @keyframes idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-idle {
          animation: idle 4s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default Profile;
