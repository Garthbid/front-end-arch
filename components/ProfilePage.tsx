import React, { useState } from 'react';
import { COLORS } from '../constants';
import { CharacterType, MembershipTier } from '../App';
import ReviewsModal from './ReviewsModal';
import {
    Phone, Tag, Star, TrendingUp, DollarSign,
    Crown, Target, Gavel, ChevronLeft,
    FileText, Pencil
} from 'lucide-react';

// Character PFP mappings
const CHARACTER_PFP: Record<CharacterType, string> = {
    'BUYERS': '/garth-buyers-pfp.jpg',
    'SNIPER': '/garth-sniper-pfp.jpg',
    'HAMMER': '/garth-hammer-pfp.png',
};

// Membership Icon (avatar badge overlay)
const MembershipIcon: React.FC<{ tier: MembershipTier }> = ({ tier }) => {
    const config = {
        'BUYERS': { icon: Crown, color: COLORS.primary, bg: 'rgba(0, 34, 255, 0.1)' },
        'SNIPER': { icon: Target, color: '#0f172a', bg: 'rgba(15, 23, 42, 0.08)' },
        'HAMMER': { icon: Gavel, color: '#92400e', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
    }[tier];

    const Icon = config.icon;

    return (
        <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
            style={{
                background: config.bg,
                border: tier === 'HAMMER' ? '1px solid #f59e0b' : `1px solid ${config.color}20`
            }}
        >
            <Icon size={18} style={{ color: config.color }} strokeWidth={2.5} />
        </div>
    );
};

// Stat Card
const StatCard: React.FC<{ icon: any; label: string; value: string | number; color: string; onClick?: () => void }> = ({
    icon: Icon, label, value, color, onClick
}) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center p-4 rounded-2xl border transition-all hover:scale-105 ${onClick ? 'cursor-pointer' : ''}`}
        style={{ background: COLORS.surface1, borderColor: COLORS.border }}
    >
        <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
            style={{ background: `${color}15` }}
        >
            <Icon size={18} style={{ color }} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>{value}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>{label}</span>
    </button>
);

// --- Main Component ---

interface ProfilePageProps {
    isOwner: boolean;
    name: string;
    username?: string;
    bio?: string;
    character: CharacterType;
    membershipTier: MembershipTier;
    stats: { listings: number; reviews: { score: number; count: number }; soldPercent: number; pastSales: number };
    // Owner-only
    onInvoicesClick?: () => void;
    onMembershipClick?: () => void;
    onEditProfileClick?: () => void;
    // Visitor-only
    onBack?: () => void;
    onContactSeller?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
    isOwner,
    name,
    username,
    bio,
    character,
    membershipTier,
    stats,
    onInvoicesClick,
    onMembershipClick,
    onEditProfileClick,
    onBack,
    onContactSeller,
}) => {
    const [isReviewsOpen, setIsReviewsOpen] = useState(false);

    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    return (
        <div className="min-h-screen" style={{ background: COLORS.voidBlack }}>
            {/* Header with Back Button */}
            <div
                className="sticky top-0 z-50 px-4 py-3 flex items-center gap-3 border-b"
                style={{ background: COLORS.voidBlack, borderColor: COLORS.border }}
            >
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <ChevronLeft size={24} style={{ color: COLORS.textPrimary }} />
                </button>
                <span className="text-sm font-bold uppercase tracking-wide" style={{ color: COLORS.textSecondary }}>
                    Back to Auction
                </span>
            </div>

            {/* Profile Content */}
            <div className="max-w-md mx-auto px-4 py-8">
                {/* Avatar + Name Section */}
                <div className="flex flex-col items-center mb-8">
                    {/* Avatar with Membership Icon */}
                    <div className="relative mb-4">
                        <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden">
                            <img
                                src={CHARACTER_PFP[character]}
                                alt={name}
                                className="w-full h-full object-cover scale-150"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1">
                            <MembershipIcon tier={membershipTier} />
                        </div>
                    </div>

                    {/* Name */}
                    <h1 className="text-3xl font-display uppercase italic tracking-tight mb-1" style={{ color: COLORS.textPrimary }}>
                        {firstName} <span style={{ color: COLORS.primary }}>{lastName}</span>
                    </h1>
                    {username && (
                        <span className="text-sm" style={{ color: COLORS.textMuted }}>@{username}</span>
                    )}

                    {/* Description */}
                    {bio && (
                        <p className="text-sm text-center mt-3 max-w-xs leading-relaxed" style={{ color: COLORS.textSecondary }}>
                            {bio}
                        </p>
                    )}

                    {/* Button 1 — Main action */}
                    {isOwner ? (
                        <button
                            onClick={onInvoicesClick}
                            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-lg active:scale-95 transition-all group"
                            style={{
                                background: COLORS.textPrimary,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                        >
                            <FileText size={16} className="text-white group-hover:text-emerald-400 transition-colors" strokeWidth={2.5} />
                            <span className="text-sm font-bold uppercase tracking-widest text-white group-hover:text-emerald-400 transition-colors">
                                My Invoices
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={onContactSeller}
                            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-lg active:scale-95 transition-all group"
                            style={{
                                background: COLORS.textPrimary,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                        >
                            <Phone size={16} className="text-white group-hover:text-emerald-400 transition-colors" strokeWidth={2.5} />
                            <span className="text-sm font-bold uppercase tracking-widest text-white group-hover:text-emerald-400 transition-colors">
                                Contact Seller
                            </span>
                        </button>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <StatCard icon={Tag} label="Listings" value={stats.listings} color={COLORS.primary} />
                    <StatCard icon={Star} label="Reviews" value={`${stats.reviews.score} (${stats.reviews.count})`} color="#f59e0b" onClick={() => setIsReviewsOpen(true)} />
                    <StatCard icon={TrendingUp} label="Sold %" value={`${stats.soldPercent}%`} color={COLORS.success} />
                    <StatCard icon={DollarSign} label="Past Sales" value={stats.pastSales} color="#8b5cf6" />
                </div>

                {/* Button 2 & 3 — Bottom section */}
                {isOwner ? (
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onMembershipClick}
                            className="w-full p-4 rounded-2xl text-center border hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                            style={{ background: COLORS.surface1, borderColor: COLORS.border }}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Crown size={16} style={{ color: '#f59e0b' }} strokeWidth={2.5} />
                                <span className="text-sm font-bold" style={{ color: COLORS.textPrimary }}>
                                    Membership
                                </span>
                            </div>
                        </button>
                        <button
                            onClick={onEditProfileClick}
                            className="w-full p-4 rounded-2xl text-center border hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                            style={{ background: COLORS.surface1, borderColor: COLORS.border }}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Pencil size={16} style={{ color: COLORS.textSecondary }} strokeWidth={2.5} />
                                <span className="text-sm font-bold" style={{ color: COLORS.textPrimary }}>
                                    Edit Profile
                                </span>
                            </div>
                        </button>
                    </div>
                ) : (
                    <div
                        className="p-4 rounded-2xl text-center border"
                        style={{ background: COLORS.surface1, borderColor: COLORS.border }}
                    >
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-sm font-bold" style={{ color: COLORS.textPrimary }}>
                                Verified Seller
                            </span>
                        </div>
                        <p className="text-xs" style={{ color: COLORS.textMuted }}>
                            Active member since 2024
                        </p>
                    </div>
                )}
            </div>

            {/* Reviews Modal */}
            <ReviewsModal
                isOpen={isReviewsOpen}
                onClose={() => setIsReviewsOpen(false)}
                sellerName={name}
                averageRating={stats.reviews.score}
                totalReviews={stats.reviews.count}
            />
        </div>
    );
};

export default ProfilePage;
