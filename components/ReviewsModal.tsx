import React from 'react';
import { X, Star, ThumbsUp, Calendar } from 'lucide-react';
import { COLORS } from '../constants';

interface Review {
    id: string;
    reviewer: string;
    rating: number;
    comment: string;
    date: string;
    helpful: number;
}

interface ReviewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    sellerName: string;
    averageRating: number;
    totalReviews: number;
}

// Mock reviews data
const MOCK_REVIEWS: Review[] = [
    {
        id: '1',
        reviewer: 'Sarah M.',
        rating: 5,
        comment: 'Amazing seller! Item exactly as described. Super fast shipping and great communication throughout. Would definitely buy from again.',
        date: '2 days ago',
        helpful: 12,
    },
    {
        id: '2',
        reviewer: 'Mike T.',
        rating: 5,
        comment: 'Excellent experience. The tractor was in better condition than I expected. Very honest seller.',
        date: '1 week ago',
        helpful: 8,
    },
    {
        id: '3',
        reviewer: 'Jennifer L.',
        rating: 4,
        comment: 'Good transaction overall. Minor delay in shipping but seller kept me informed. Item was great quality.',
        date: '2 weeks ago',
        helpful: 5,
    },
    {
        id: '4',
        reviewer: 'David K.',
        rating: 5,
        comment: 'Best seller on GarthBid! This is my third purchase from them. Always reliable and fair prices.',
        date: '3 weeks ago',
        helpful: 15,
    },
    {
        id: '5',
        reviewer: 'Emily R.',
        rating: 5,
        comment: 'Smooth transaction from start to finish. Highly recommend this seller to anyone looking for quality equipment.',
        date: '1 month ago',
        helpful: 7,
    },
];

// Star Rating Component
const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                size={size}
                className={star <= rating ? 'text-amber-400' : 'text-gray-200'}
                fill={star <= rating ? 'currentColor' : 'none'}
                strokeWidth={2}
            />
        ))}
    </div>
);

// Single Review Card
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div
        className="p-4 rounded-xl border"
        style={{ background: COLORS.surface1, borderColor: COLORS.border }}
    >
        <div className="flex items-start justify-between mb-3">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm" style={{ color: COLORS.textPrimary }}>
                        {review.reviewer}
                    </span>
                    <StarRating rating={review.rating} size={12} />
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: COLORS.textMuted }}>
                    <Calendar size={10} />
                    {review.date}
                </div>
            </div>
        </div>

        <p className="text-sm leading-relaxed mb-3" style={{ color: COLORS.textSecondary }}>
            {review.comment}
        </p>

        <button
            className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-blue-500"
            style={{ color: COLORS.textMuted }}
        >
            <ThumbsUp size={12} />
            Helpful ({review.helpful})
        </button>
    </div>
);

const ReviewsModal: React.FC<ReviewsModalProps> = ({
    isOpen,
    onClose,
    sellerName,
    averageRating,
    totalReviews,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
            >
                {/* Header */}
                <div
                    className="sticky top-0 z-10 px-5 py-4 border-b flex items-center justify-between"
                    style={{ background: COLORS.surface1, borderColor: COLORS.border }}
                >
                    <div>
                        <h2 className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>
                            Reviews for {sellerName}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={Math.round(averageRating)} size={14} />
                            <span className="text-sm font-medium" style={{ color: COLORS.textSecondary }}>
                                {averageRating} · {totalReviews} reviews
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <X size={20} style={{ color: COLORS.textMuted }} />
                    </button>
                </div>

                {/* Rating Summary */}
                <div className="px-5 py-4 border-b" style={{ borderColor: COLORS.border }}>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold" style={{ color: COLORS.textPrimary }}>
                                {averageRating}
                            </div>
                            <div className="text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                                out of 5
                            </div>
                        </div>
                        <div className="flex-1 space-y-1.5">
                            {[5, 4, 3, 2, 1].map((stars) => {
                                const count = MOCK_REVIEWS.filter(r => r.rating === stars).length;
                                const percentage = (count / MOCK_REVIEWS.length) * 100;
                                return (
                                    <div key={stars} className="flex items-center gap-2">
                                        <span className="text-xs w-3" style={{ color: COLORS.textMuted }}>{stars}</span>
                                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: COLORS.surface2 }}>
                                            <div
                                                className="h-full rounded-full bg-amber-400"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs w-6 text-right" style={{ color: COLORS.textMuted }}>{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="overflow-y-auto p-5 space-y-3" style={{ maxHeight: 'calc(85vh - 200px)' }}>
                    {MOCK_REVIEWS.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewsModal;
