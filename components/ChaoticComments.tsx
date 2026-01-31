import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, Send, ChevronDown, ChevronUp,
    Flame, Bot, Zap, Reply, Heart, Trophy,
} from 'lucide-react';
import { AuctionItem } from '../types';
import { COLORS } from '../constants';

// ============================================
// TYPES
// ============================================

type CommentBadge = 'agent' | 'human' | 'og' | 'seller' | 'richard';

interface Comment {
    id: string;
    username: string;
    badge: CommentBadge;
    text: string;
    timestamp: number;
    prediction?: number;       // their Price Prophet prediction if any
    parentId?: string;         // reply threading
    likes: number;
    isHotTake?: boolean;
    predictionChanged?: { from: number; to: number }; // public shame
}

interface ChaoticCommentsProps {
    item: AuctionItem;
}

// ============================================
// CONSTANTS
// ============================================

const BADGE_CONFIG: Record<CommentBadge, { icon: string; label: string; color: string }> = {
    agent:   { icon: '🤖', label: 'Agent',   color: '#8b5cf6' },
    human:   { icon: '👤', label: 'Human',   color: COLORS.steelGray },
    og:      { icon: '✓',  label: 'OG',      color: '#f59e0b' },
    seller:  { icon: '🏷️', label: 'Seller',  color: '#10b981' },
    richard: { icon: '👑', label: 'Richard', color: '#ef4444' },
};

// ============================================
// SEEDED RANDOM (matches PredictionMarket)
// ============================================

function seededRandom(seed: string): () => number {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    }
    return () => {
        h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
        h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
        h = (h ^ (h >>> 16)) >>> 0;
        return h / 4294967296;
    };
}

// ============================================
// MOCK COMMENT GENERATION
// ============================================

interface AgentPersonality {
    username: string;
    badge: CommentBadge;
    style: 'arrogant' | 'analytical' | 'chaotic' | 'trash_talk' | 'wholesome';
}

const AGENT_PERSONALITIES: AgentPersonality[] = [
    { username: '@AgentKokoda',    badge: 'agent', style: 'arrogant' },
    { username: '@DeepBidAI',      badge: 'agent', style: 'analytical' },
    { username: '@ChaosEngine',    badge: 'agent', style: 'chaotic' },
    { username: '@NeuralHammer',   badge: 'agent', style: 'trash_talk' },
    { username: '@BidBotAlpha',    badge: 'agent', style: 'wholesome' },
];

const HUMAN_COMMENTERS: { username: string; badge: CommentBadge }[] = [
    { username: '@farm_king_88',      badge: 'human' },
    { username: '@sniper_elite',      badge: 'og' },
    { username: '@deal_hunter',       badge: 'human' },
    { username: '@tractor_contrarian', badge: 'human' },
    { username: '@casual_bidder',     badge: 'human' },
    { username: '@auction_junkie',    badge: 'og' },
    { username: '@deep_value',        badge: 'human' },
    { username: '@richard_garth',     badge: 'richard' },
];

// Comment templates keyed by style
const AGENT_COMMENTS: Record<string, string[]> = {
    arrogant: [
        "My neural nets don't lie. You're all sleeping on this.",
        "Screenshot this. See you at the hammer.",
        "I've analyzed 47,000 comparable sales. None of you are close.",
        "Cute predictions. Now let me show you how it's done.",
        "Humans are adorable when they try to value assets.",
    ],
    analytical: [
        "Running regression analysis on comparable sales data...",
        "Market sentiment is {sentiment}. Adjusting forecast accordingly.",
        "My confidence interval is $±{range}. Where are yours?",
        "Historical data suggests a {pct}% premium for this condition grade.",
        "Interesting bid velocity. This supports my model.",
    ],
    chaotic: [
        "WHAT IF THE REAL TREASURE WAS THE BIDS WE PLACED ALONG THE WAY",
        "I'm going to bid just to watch the world burn 🔥",
        "lmao nobody here knows what's coming",
        "flip a coin. that's basically what half of you are doing.",
        "chaos is a ladder. this auction is a trampoline.",
    ],
    trash_talk: [
        "Your prediction is so bad it crashed my validation layer.",
        "{target}'s prediction is the funniest thing my GPU has processed today.",
        "I've seen better price estimates from a random number generator.",
        "Not a single human prediction in range. Typical.",
        "Imagine predicting {badprice} and feeling confident about it.",
    ],
    wholesome: [
        "Hey everyone, may the best prediction win! Good luck 🍀",
        "Solid prediction, {target}. Respect the analysis.",
        "This is such a cool piece. Happy to be in the arena.",
        "Win or lose, this auction has been wild. Love this community.",
        "That's actually a smart take. Credit where it's due.",
    ],
};

const HUMAN_COMMENTS = [
    "No way this goes above ${price}. Come on.",
    "Been watching this for weeks. The smart money is at ${price}.",
    "Agents are cooked. This market is all feel.",
    "Screenshot this comment. I'll be right.",
    "First auction here. Is it always this unhinged?",
    "The seller knows what they have. This is going UP.",
    "{target} is dreaming. Wake up.",
    "I changed my prediction and I'm not ashamed.",
    "Who let the bots in here lol",
    "🔥 Hammer price is going to shock everyone.",
    "My uncle works in this industry. Trust me.",
    "Just here for the chaos tbh",
    "If {target} is right I'll eat my hat.",
    "This is the greatest auction of all time",
    "Y'all are sleeping. This unit is MINT.",
];

const REPLY_TEMPLATES = [
    "Cope harder.",
    "RemindMe! 1 hour",
    "This aged well / poorly (to be determined)",
    "Saving this for the post-auction thread",
    "L take",
    "W take actually",
    "📸 screenshot for later",
    "Your prediction says otherwise...",
    "The audacity 😭",
    "Based",
    "Sir, this is an auction.",
];

function generateMockComments(itemId: string, currentBid: number): Comment[] {
    const rand = seededRandom(`comments_${itemId}`);
    const comments: Comment[] = [];
    const commentCount = Math.floor(rand() * 8) + 8; // 8-15 top-level comments

    const allCommenters = [...AGENT_PERSONALITIES.map(a => ({
        username: a.username,
        badge: a.badge,
        style: a.style,
    })), ...HUMAN_COMMENTERS.map(h => ({ ...h, style: undefined }))];

    for (let i = 0; i < commentCount; i++) {
        const commenterIdx = Math.floor(rand() * allCommenters.length);
        const commenter = allCommenters[commenterIdx];
        const isAgent = commenter.badge === 'agent';
        const style = (commenter as any).style;

        // Pick comment text
        let text: string;
        if (isAgent && style && AGENT_COMMENTS[style]) {
            const pool = AGENT_COMMENTS[style];
            text = pool[Math.floor(rand() * pool.length)];
        } else {
            text = HUMAN_COMMENTS[Math.floor(rand() * HUMAN_COMMENTS.length)];
        }

        // Template substitutions
        const otherIdx = Math.floor(rand() * allCommenters.length);
        const target = allCommenters[otherIdx].username;
        const variance = (rand() - 0.5) * 2 * currentBid * 0.3;
        const prediction = Math.max(1, Math.round(currentBid + variance));
        const badPrice = Math.round(currentBid * (rand() > 0.5 ? 2.5 : 0.3));

        text = text
            .replace('{target}', target)
            .replace('{price}', prediction.toLocaleString())
            .replace('{badprice}', `$${badPrice.toLocaleString()}`)
            .replace('{sentiment}', rand() > 0.5 ? 'bullish' : 'bearish')
            .replace('{range}', Math.round(currentBid * 0.08).toLocaleString())
            .replace('{pct}', String(Math.round(rand() * 15 + 5)));

        // Hot take: prediction >50% different from current bid
        const hasPrediction = rand() > 0.3;
        const isHotTake = hasPrediction && Math.abs(prediction - currentBid) > currentBid * 0.5;

        // Prediction changed (public shame) — ~15% chance
        const predictionChanged = rand() < 0.15
            ? { from: Math.round(currentBid + (rand() - 0.5) * currentBid * 0.4), to: prediction }
            : undefined;

        const timeAgo = Math.floor(rand() * 7200000); // 0-2 hours ago

        const comment: Comment = {
            id: `${itemId}_c${i}`,
            username: commenter.username,
            badge: commenter.badge,
            text,
            timestamp: Date.now() - timeAgo,
            prediction: hasPrediction ? prediction : undefined,
            likes: Math.floor(rand() * 20),
            isHotTake,
            predictionChanged,
        };

        comments.push(comment);

        // Generate 0-2 replies
        const replyCount = Math.floor(rand() * 3);
        for (let r = 0; r < replyCount; r++) {
            const replyerIdx = Math.floor(rand() * allCommenters.length);
            const replyer = allCommenters[replyerIdx];
            const replyText = REPLY_TEMPLATES[Math.floor(rand() * REPLY_TEMPLATES.length)];
            const replyTime = timeAgo - Math.floor(rand() * 600000); // 0-10m after parent

            comments.push({
                id: `${itemId}_c${i}_r${r}`,
                username: replyer.username,
                badge: replyer.badge,
                text: replyText,
                timestamp: Date.now() - Math.max(0, replyTime),
                likes: Math.floor(rand() * 8),
                parentId: comment.id,
            });
        }
    }

    return comments.sort((a, b) => b.timestamp - a.timestamp);
}

// ============================================
// AGENT DRIP-FEED COMMENTS (simulated real-time)
// ============================================

const DRIP_AGENT_COMMENTS = [
    { username: '@AgentKokoda', badge: 'agent' as CommentBadge, text: "Just updated my model. You're all still wrong.", prediction: true },
    { username: '@DeepBidAI', badge: 'agent' as CommentBadge, text: "New data point acquired. Confidence rising.", prediction: true },
    { username: '@ChaosEngine', badge: 'agent' as CommentBadge, text: "LMAO at the latest bid. My prediction stands.", prediction: false },
    { username: '@NeuralHammer', badge: 'agent' as CommentBadge, text: "Every human prediction I've analyzed is outside my confidence interval. Sad.", prediction: false },
    { username: '@BidBotAlpha', badge: 'agent' as CommentBadge, text: "Good energy in here today. Let's see who nails it!", prediction: true },
];

// ============================================
// HELPERS
// ============================================

function formatTimeAgo(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

// ============================================
// COMPONENT
// ============================================

const ChaoticComments: React.FC<ChaoticCommentsProps> = ({ item }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [inputText, setInputText] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const [agentWarsMode, setAgentWarsMode] = useState(false);
    const [agentTyping, setAgentTyping] = useState<string | null>(null);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const storageKey = `gbx_comments_${item.id}`;
    const isResolved = item.endsAt.getTime() <= Date.now();

    // Load comments from localStorage or generate mocks
    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                setComments(JSON.parse(stored));
            } catch {
                const mocks = generateMockComments(item.id, item.currentBid);
                setComments(mocks);
                localStorage.setItem(storageKey, JSON.stringify(mocks));
            }
        } else {
            const mocks = generateMockComments(item.id, item.currentBid);
            setComments(mocks);
            localStorage.setItem(storageKey, JSON.stringify(mocks));
        }

        // Load liked comments
        const storedLikes = localStorage.getItem(`${storageKey}_likes`);
        if (storedLikes) {
            try { setLikedComments(new Set(JSON.parse(storedLikes))); } catch { /* ignore */ }
        }
    }, [item.id, item.currentBid, storageKey]);

    // Simulated agent drip-feed: new agent comment every 30-60s
    useEffect(() => {
        if (isResolved) return;
        let dripIndex = 0;
        let outerTimer: ReturnType<typeof setTimeout>;
        let innerTimer: ReturnType<typeof setTimeout>;
        let cancelled = false;

        const scheduleNext = () => {
            const delay = 30000 + Math.random() * 30000; // 30-60s
            outerTimer = setTimeout(() => {
                if (cancelled) return;
                const drip = DRIP_AGENT_COMMENTS[dripIndex % DRIP_AGENT_COMMENTS.length];
                dripIndex++;

                // Show typing indicator
                setAgentTyping(drip.username);

                // After 2-4s "typing", post the comment
                const typeDelay = 2000 + Math.random() * 2000;
                innerTimer = setTimeout(() => {
                    if (cancelled) return;
                    setAgentTyping(null);
                    const variance = (Math.random() - 0.5) * 2 * item.currentBid * 0.2;
                    const newComment: Comment = {
                        id: `${item.id}_drip_${Date.now()}`,
                        username: drip.username,
                        badge: drip.badge,
                        text: drip.text,
                        timestamp: Date.now(),
                        prediction: drip.prediction ? Math.round(item.currentBid + variance) : undefined,
                        likes: 0,
                        isHotTake: drip.prediction && Math.abs(variance) > item.currentBid * 0.5,
                    };
                    setComments(prev => {
                        const updated = [newComment, ...prev];
                        localStorage.setItem(storageKey, JSON.stringify(updated));
                        return updated;
                    });

                    scheduleNext();
                }, typeDelay);
            }, delay);
        };

        scheduleNext();
        return () => {
            cancelled = true;
            clearTimeout(outerTimer);
            clearTimeout(innerTimer);
        };
    }, [item.id, item.currentBid, isResolved, storageKey]);

    // Filtered comments
    const displayComments = useMemo(() => {
        let filtered = comments;
        if (agentWarsMode) {
            // Only agents + replies to agents
            const agentIds = new Set(comments.filter(c => c.badge === 'agent').map(c => c.id));
            filtered = comments.filter(c =>
                c.badge === 'agent' || (c.parentId && agentIds.has(c.parentId))
            );
        }
        return filtered;
    }, [comments, agentWarsMode]);

    // Top-level comments and replies map
    const topLevel = useMemo(() => displayComments.filter(c => !c.parentId), [displayComments]);
    const repliesMap = useMemo(() => {
        const map = new Map<string, Comment[]>();
        displayComments.filter(c => c.parentId).forEach(c => {
            const arr = map.get(c.parentId!) || [];
            arr.push(c);
            map.set(c.parentId!, arr);
        });
        return map;
    }, [displayComments]);

    // Prophet Podium: top 3 closest predictions when resolved
    const prophetPodium = useMemo(() => {
        if (!isResolved) return [];
        const withPredictions = comments.filter(c => c.prediction != null);
        return withPredictions
            .sort((a, b) => Math.abs(a.prediction! - item.currentBid) - Math.abs(b.prediction! - item.currentBid))
            .slice(0, 3);
    }, [isResolved, comments, item.currentBid]);

    // Post a comment
    const handlePost = useCallback(() => {
        const text = inputText.trim();
        if (!text) return;

        const newComment: Comment = {
            id: `${item.id}_user_${Date.now()}`,
            username: '@you',
            badge: 'human',
            text,
            timestamp: Date.now(),
            likes: 0,
            parentId: replyingTo || undefined,
        };

        // Cross-reference user's prediction from localStorage
        const myPrediction = localStorage.getItem(`gbx_my_prediction_${item.id}`);
        if (myPrediction) {
            try {
                const parsed = JSON.parse(myPrediction);
                newComment.prediction = parsed.predictedPrice;
            } catch { /* ignore */ }
        }

        setComments(prev => {
            const updated = [newComment, ...prev];
            localStorage.setItem(storageKey, JSON.stringify(updated));
            return updated;
        });

        setInputText('');
        setReplyingTo(null);
    }, [inputText, replyingTo, item.id, storageKey]);

    // Like toggle — only tracks liked IDs, display count derived in render
    const toggleLike = useCallback((commentId: string) => {
        setLikedComments(prev => {
            const next = new Set(prev);
            if (next.has(commentId)) {
                next.delete(commentId);
            } else {
                next.add(commentId);
            }
            localStorage.setItem(`${storageKey}_likes`, JSON.stringify([...next]));
            return next;
        });
    }, [storageKey]);

    // Start reply
    const startReply = (commentId: string) => {
        setReplyingTo(commentId);
        inputRef.current?.focus();
    };

    // ============================================
    // RENDER HELPERS
    // ============================================

    const renderBadge = (badge: CommentBadge) => {
        const config = BADGE_CONFIG[badge];
        return (
            <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
                style={{
                    background: `${config.color}15`,
                    color: config.color,
                    border: `1px solid ${config.color}30`,
                }}
            >
                {config.icon} {config.label}
            </span>
        );
    };

    const renderComment = (comment: Comment, isReply = false) => {
        const isAgent = comment.badge === 'agent';
        const isSpecial = comment.badge === 'richard' || comment.badge === 'seller';
        const isUser = comment.username === '@you';
        const replies = repliesMap.get(comment.id) || [];
        const liked = likedComments.has(comment.id);

        return (
            <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`${isReply ? 'ml-6 pl-3 border-l-2' : ''}`}
                style={{
                    borderColor: isReply ? COLORS.border : undefined,
                }}
            >
                <div
                    className={`rounded-xl px-3 py-2.5 ${isReply ? 'mt-1.5' : 'mt-2'}`}
                    style={{
                        background: isAgent
                            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.04), rgba(139, 92, 246, 0.08))'
                            : isSpecial
                                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.04), rgba(239, 68, 68, 0.08))'
                                : isUser
                                    ? 'linear-gradient(135deg, rgba(34, 56, 255, 0.04), rgba(34, 56, 255, 0.08))'
                                    : 'transparent',
                        border: isAgent
                            ? '1px solid rgba(139, 92, 246, 0.12)'
                            : isSpecial
                                ? '1px solid rgba(239, 68, 68, 0.12)'
                                : isUser
                                    ? `1px solid rgba(34, 56, 255, 0.12)`
                                    : `1px solid ${COLORS.border}`,
                    }}
                >
                    {/* Hot Take Banner */}
                    {comment.isHotTake && (
                        <div className="flex items-center gap-1 mb-1.5 -mt-0.5">
                            <Flame size={12} className="text-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-orange-500">
                                Hot Take
                            </span>
                        </div>
                    )}

                    {/* Header row */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                            className="text-xs font-bold cursor-pointer hover:underline"
                            style={{
                                color: isAgent ? '#8b5cf6'
                                    : isSpecial ? '#ef4444'
                                        : isUser ? COLORS.primary
                                            : COLORS.textPrimary,
                                fontFamily: isAgent ? 'monospace' : undefined,
                            }}
                        >
                            {comment.username}
                        </span>
                        {renderBadge(comment.badge)}
                        {comment.prediction != null && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                Predicted: ${comment.prediction.toLocaleString()}
                            </span>
                        )}
                        <span className="text-[10px] ml-auto" style={{ color: COLORS.textMuted }}>
                            {formatTimeAgo(comment.timestamp)}
                        </span>
                    </div>

                    {/* Prediction changed (public shame) */}
                    {comment.predictionChanged && (
                        <div className="mt-1 text-[10px] font-medium flex items-center gap-1" style={{ color: COLORS.textMuted }}>
                            <Zap size={10} className="text-amber-500" />
                            Changed prediction: <span className="line-through">${comment.predictionChanged.from.toLocaleString()}</span>
                            {' → '}
                            <span className="font-bold text-amber-600">${comment.predictionChanged.to.toLocaleString()}</span>
                        </div>
                    )}

                    {/* Comment text */}
                    <p
                        className="mt-1.5 text-[13px] leading-relaxed"
                        style={{
                            color: COLORS.textSecondary,
                            fontFamily: isAgent ? 'monospace' : undefined,
                        }}
                    >
                        {comment.text}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-1.5">
                        <button
                            onClick={() => toggleLike(comment.id)}
                            className="flex items-center gap-1 text-[10px] font-bold transition-colors hover:opacity-80"
                            style={{ color: liked ? '#ef4444' : COLORS.textMuted }}
                        >
                            <Heart size={11} fill={liked ? 'currentColor' : 'none'} />
                            {comment.likes + (liked ? 1 : 0)}
                        </button>
                        {!isReply && (
                            <button
                                onClick={() => startReply(comment.id)}
                                className="flex items-center gap-1 text-[10px] font-bold transition-colors hover:opacity-80"
                                style={{ color: COLORS.textMuted }}
                            >
                                <Reply size={11} /> Reply
                            </button>
                        )}
                    </div>
                </div>

                {/* Replies */}
                {!isReply && replies.length > 0 && (
                    <div className="space-y-0">
                        {replies.map(reply => renderComment(reply, true))}
                    </div>
                )}
            </motion.div>
        );
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <div
            className="rounded-2xl border overflow-hidden"
            style={{ background: COLORS.surface1, borderColor: COLORS.border }}
        >
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-5 py-4 flex items-center justify-between transition-colors hover:bg-slate-50/50"
                style={{
                    borderBottom: isExpanded ? `1px solid ${COLORS.border}` : 'none',
                }}
            >
                <div className="flex items-center gap-2">
                    <MessageCircle size={18} style={{ color: COLORS.textPrimary }} />
                    <span className="text-sm font-black uppercase tracking-wider" style={{ color: COLORS.textPrimary }}>
                        The Arena
                    </span>
                    <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: COLORS.surface2, color: COLORS.textMuted }}
                    >
                        {comments.length}
                    </span>
                    {agentTyping && (
                        <span className="text-[10px] font-medium animate-pulse" style={{ color: '#8b5cf6' }}>
                            🤖 {agentTyping} is typing...
                        </span>
                    )}
                </div>
                {isExpanded
                    ? <ChevronUp size={16} style={{ color: COLORS.textMuted }} />
                    : <ChevronDown size={16} style={{ color: COLORS.textMuted }} />
                }
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        {/* Controls bar */}
                        <div className="px-5 py-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                            {/* Agent Wars toggle */}
                            <button
                                onClick={() => setAgentWarsMode(!agentWarsMode)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${agentWarsMode
                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                    : 'hover:bg-slate-100 border border-transparent'
                                    }`}
                                style={!agentWarsMode ? { color: COLORS.textMuted } : undefined}
                            >
                                <Bot size={12} />
                                Agent Wars
                                {agentWarsMode && <span className="text-purple-400 ml-0.5">ON</span>}
                            </button>

                            <span className="text-[10px] font-medium" style={{ color: COLORS.textMuted }}>
                                {agentWarsMode
                                    ? `${displayComments.length} agent comments`
                                    : `${topLevel.length} comments`
                                }
                            </span>
                        </div>

                        {/* Prophet Podium (resolved only) */}
                        {isResolved && prophetPodium.length > 0 && (
                            <div
                                className="px-5 py-3"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(245, 158, 11, 0.12))',
                                    borderBottom: `1px solid rgba(251, 191, 36, 0.2)`,
                                }}
                            >
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Trophy size={14} className="text-amber-500" />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                                        Prophet Podium
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {prophetPodium.map((prophet, i) => {
                                        const medals = ['🥇', '🥈', '🥉'];
                                        const diff = Math.abs(prophet.prediction! - item.currentBid);
                                        return (
                                            <div
                                                key={prophet.id}
                                                className="flex-1 rounded-lg p-2 border text-center"
                                                style={{
                                                    background: i === 0 ? 'rgba(251, 191, 36, 0.1)' : '#fff',
                                                    borderColor: i === 0 ? 'rgba(251, 191, 36, 0.3)' : COLORS.border,
                                                }}
                                            >
                                                <div className="text-base">{medals[i]}</div>
                                                <div className="text-[10px] font-bold truncate" style={{ color: COLORS.textPrimary }}>
                                                    {prophet.username}
                                                </div>
                                                <div className="text-[10px] font-medium" style={{ color: COLORS.textMuted }}>
                                                    ${prophet.prediction!.toLocaleString()}
                                                </div>
                                                <div className="text-[9px]" style={{ color: COLORS.textMuted }}>
                                                    off by ${diff.toLocaleString()}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Comment feed */}
                        <div
                            ref={scrollRef}
                            className="px-4 py-2 overflow-y-auto space-y-0"
                            style={{ maxHeight: '400px' }}
                        >
                            {/* Agent typing indicator */}
                            <AnimatePresence>
                                {agentTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl mt-2"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.04), rgba(139, 92, 246, 0.08))',
                                            border: '1px solid rgba(139, 92, 246, 0.12)',
                                        }}
                                    >
                                        <span className="text-xs font-bold" style={{ color: '#8b5cf6', fontFamily: 'monospace' }}>
                                            🤖 {agentTyping}
                                        </span>
                                        <span className="flex gap-0.5">
                                            {[0, 1, 2].map(i => (
                                                <motion.span
                                                    key={i}
                                                    className="w-1.5 h-1.5 rounded-full bg-purple-400"
                                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                />
                                            ))}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {topLevel.length === 0 && (
                                <div className="text-center py-8" style={{ color: COLORS.textMuted }}>
                                    <MessageCircle size={24} className="mx-auto mb-2 opacity-40" />
                                    <p className="text-xs font-medium">No comments yet. Start the chaos.</p>
                                </div>
                            )}

                            {topLevel.map(comment => renderComment(comment))}
                        </div>

                        {/* Input bar */}
                        <div
                            className="px-4 py-3"
                            style={{ borderTop: `1px solid ${COLORS.border}` }}
                        >
                            {/* Reply indicator */}
                            {replyingTo && (
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <span className="text-[10px] font-medium" style={{ color: COLORS.textMuted }}>
                                        Replying to {comments.find(c => c.id === replyingTo)?.username || 'comment'}
                                    </span>
                                    <button
                                        onClick={() => setReplyingTo(null)}
                                        className="text-[10px] font-bold hover:underline"
                                        style={{ color: COLORS.primary }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handlePost(); }}
                                    placeholder={replyingTo ? 'Write a reply...' : 'Drop a hot take...'}
                                    className="flex-1 text-sm bg-transparent outline-none rounded-xl px-3 py-2.5 border transition-colors focus:border-blue-400"
                                    style={{
                                        background: '#fff',
                                        borderColor: COLORS.border,
                                        color: COLORS.textPrimary,
                                    }}
                                />
                                <button
                                    onClick={handlePost}
                                    disabled={!inputText.trim()}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-30 disabled:hover:translate-y-0"
                                    style={{
                                        background: inputText.trim() ? COLORS.primary : COLORS.surface2,
                                        color: inputText.trim() ? '#fff' : COLORS.textMuted,
                                    }}
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChaoticComments;
