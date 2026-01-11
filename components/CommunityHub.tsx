import React, { useState } from 'react';
import { Hash, HelpCircle, Lightbulb, ChevronDown, Send, X, Plus, ArrowLeft } from 'lucide-react';
import { COLORS } from '../constants';

// Mock data
const MOCK_MESSAGES = [
    { id: '1', username: 'EagleBidder', avatar: '🦅', message: 'Just won my first unreserved auction! This platform is legit.', time: '2m ago' },
    { id: '2', username: 'GarageKing', avatar: '🔧', message: 'Anyone know when the next Monday drop is?', time: '5m ago' },
    { id: '3', username: 'DealHunter', avatar: '🎯', message: 'The AI suggestions are actually helpful ngl', time: '12m ago' },
];

const MOCK_FAQ = [
    { q: 'How do I start bidding instantly?', a: 'Join the Buyers Club to unlock instant bidding.' },
    { q: 'How do payments work?', a: 'Winners pay sellers directly via Interac, Wire, or Bank Draft.' },
    { q: 'What is an unreserved auction?', a: 'Items sell to the highest bidder with NO reserve price.' },
    { q: 'What happens if there\'s a dispute?', a: 'Contact our support team and we\'ll help resolve it.' },
];

const MOCK_FEATURE_REQUESTS = [
    { id: '1', title: 'Mobile app', description: 'Native iOS and Android apps for faster bidding', votes: 847, voted: false, status: 'Planned' },
    { id: '2', title: 'Bid notifications', description: 'Push alerts when outbid or auction ending', votes: 623, voted: true, status: 'Under Review' },
    { id: '3', title: 'Seller verification badges', description: 'Show verified sellers with trust badges', votes: 412, voted: false, status: null },
    { id: '4', title: 'Watch list improvements', description: 'Better organization and filtering of saved items', votes: 289, voted: false, status: null },
];

const ROADMAP_ITEMS = [
    { title: 'AI Improvements', description: 'Make Garth help users make better decisions at every step.', tag: 'AI' },
    { title: 'Hammered on Mondays', description: 'Weekly comedy livestream. Buy live using Garthbucks ($GBX).', tag: 'LIVE' },
    { title: 'Community Builds 3 Features', description: 'Top-voted requests ship first.', tag: 'COMMUNITY' },
];

const STARTER_PROMPTS = [
    'What should I list to get the biggest bidding war?',
    'How do Unreserved Mondays work?',
    'What\'s the fastest way to start bidding?',
];

type ChannelType = 'general' | 'help' | 'features';

interface CommunityHubProps {
    onBack?: () => void;
}

const CommunityHub: React.FC<CommunityHubProps> = ({ onBack }) => {
    const [activeChannel, setActiveChannel] = useState<ChannelType>('general');
    const [messageInput, setMessageInput] = useState('');
    const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
    const [isFaqOpen, setIsFaqOpen] = useState(true);
    const [showWelcome, setShowWelcome] = useState(true);
    const [featureRequests, setFeatureRequests] = useState(MOCK_FEATURE_REQUESTS);
    const [featureSort, setFeatureSort] = useState<'top' | 'newest'>('top');

    const handleVote = (id: string) => {
        setFeatureRequests(prev => prev.map(f =>
            f.id === id ? { ...f, votes: f.voted ? f.votes - 1 : f.votes + 1, voted: !f.voted } : f
        ).sort((a, b) => b.votes - a.votes));
    };

    const channels: { id: ChannelType; label: string; icon: React.ReactNode }[] = [
        { id: 'general', label: 'General', icon: <Hash size={14} /> },
        { id: 'help', label: 'Ask for Help', icon: <HelpCircle size={14} /> },
        { id: 'features', label: 'Feature Requests', icon: <Lightbulb size={14} /> },
    ];

    return (
        <div className="min-h-screen pb-8" style={{ background: '#fafafa' }}>

            <div className="max-w-2xl mx-auto px-4">

                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 mt-6 mb-4 text-gray-500 hover:text-gray-900 transition-colors group"
                >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-semibold">Back to GarthBid</span>
                </button>

                {/* Hero Section */}
                <div className="pb-6 text-center">
                    <h1 className="text-3xl font-display text-gray-900 tracking-tight mb-2">Community</h1>
                    <p className="text-gray-500 text-sm max-w-md mx-auto mb-3">
                        Ask questions, get help fast, and vote on what we build next.
                    </p>
                    <p className="text-xs text-gray-400">
                        3 channels • Real people • Roadmap driven by votes
                    </p>
                </div>

                {/* Stats Strip */}
                <div className="flex gap-4 mb-6">
                    <div
                        className="flex-1 p-4 rounded-2xl text-center"
                        style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                    >
                        <p className="text-2xl font-black text-gray-900 tracking-tight">5,400+</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Total Users</p>
                        <p className="text-[11px] font-semibold text-green-600 flex items-center justify-center gap-1">
                            <span>↑</span> 213 new this week (+4.1%)
                        </p>
                    </div>
                    <div
                        className="flex-1 p-4 rounded-2xl text-center"
                        style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                    >
                        <p className="text-2xl font-black text-gray-900 tracking-tight">$2.4M</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Total Value Sold</p>
                        <p className="text-[11px] font-semibold text-green-600 flex items-center justify-center gap-1">
                            <span>↑</span> $211k this week (+9.6%)
                        </p>
                    </div>
                </div>
                <p className="text-[10px] text-center text-gray-400 -mt-4 mb-6">Live platform metrics</p>

                {/* Community Panel */}
                <div
                    className="rounded-2xl overflow-hidden mb-6"
                    style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                    {/* Channel Tabs */}
                    <div className="flex border-b border-gray-100">
                        {channels.map((channel) => (
                            <button
                                key={channel.id}
                                onClick={() => setActiveChannel(channel.id)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-colors ${activeChannel === channel.id
                                    ? 'text-[#224cff] border-b-2 border-[#224cff] -mb-px'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {channel.icon}
                                <span>{channel.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Channel Content */}
                    <div className="min-h-[350px] flex flex-col">

                        {/* General Chat */}
                        {activeChannel === 'general' && (
                            <>
                                {/* Welcome Banner */}
                                {showWelcome && (
                                    <div
                                        className="m-4 p-3 rounded-xl flex items-center justify-between"
                                        style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-sky-900">Welcome to the community 👋</p>
                                            <p className="text-xs text-sky-700">Be kind. Ask anything. We'll help.</p>
                                        </div>
                                        <button onClick={() => setShowWelcome(false)} className="p-1 text-sky-400 hover:text-sky-600">
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}

                                {/* Messages */}
                                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                                    {MOCK_MESSAGES.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-400 text-sm mb-4">No messages yet. Start the conversation!</p>
                                            <div className="space-y-2">
                                                {STARTER_PROMPTS.map((prompt, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setMessageInput(prompt)}
                                                        className="block w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                                        style={{ border: '1px solid #eee' }}
                                                    >
                                                        {prompt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        MOCK_MESSAGES.map((msg) => (
                                            <div key={msg.id} className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base flex-shrink-0">
                                                    {msg.avatar}
                                                </div>
                                                <div>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-sm font-semibold text-gray-900">{msg.username}</span>
                                                        <span className="text-[10px] text-gray-400">{msg.time}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{msg.message}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-gray-100">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            placeholder="Say hi, share a win, or ask a question…"
                                            className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                            style={{ background: '#f9fafb', border: '1px solid #eee' }}
                                        />
                                        <button
                                            className="px-4 py-3 rounded-xl transition-colors"
                                            style={{ background: COLORS.primary }}
                                        >
                                            <Send size={16} className="text-white" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Ask for Help */}
                        {activeChannel === 'help' && (
                            <>
                                {/* Pinned FAQ */}
                                <div className="border-b border-gray-100">
                                    <button
                                        onClick={() => setIsFaqOpen(!isFaqOpen)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50"
                                    >
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">📌 Quick Answers</span>
                                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isFaqOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isFaqOpen && (
                                        <div className="px-4 pb-4 bg-gray-50 space-y-3">
                                            {MOCK_FAQ.map((faq, i) => (
                                                <div key={i}>
                                                    <p className="text-sm font-medium text-gray-900">{faq.q}</p>
                                                    <p className="text-xs text-gray-500">{faq.a}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Help Chat */}
                                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                                    {MOCK_MESSAGES.slice(0, 2).map((msg) => (
                                        <div key={msg.id} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base flex-shrink-0">
                                                {msg.avatar}
                                            </div>
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-sm font-semibold text-gray-900">{msg.username}</span>
                                                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                                                </div>
                                                <p className="text-sm text-gray-600">{msg.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-gray-100">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            placeholder="Describe your issue — we'll help fast…"
                                            className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                            style={{ background: '#f9fafb', border: '1px solid #eee' }}
                                        />
                                        <button
                                            className="px-4 py-3 rounded-xl transition-colors"
                                            style={{ background: COLORS.primary }}
                                        >
                                            <Send size={16} className="text-white" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Feature Requests */}
                        {activeChannel === 'features' && (
                            <div className="flex-1 flex flex-col">
                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-gray-900">Feature Requests</span>
                                        <select
                                            value={featureSort}
                                            onChange={(e) => setFeatureSort(e.target.value as 'top' | 'newest')}
                                            className="text-xs text-gray-500 bg-transparent border-none focus:outline-none cursor-pointer"
                                        >
                                            <option value="top">Top</option>
                                            <option value="newest">Newest</option>
                                        </select>
                                    </div>
                                    <button
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                                        style={{ background: COLORS.primary }}
                                    >
                                        <Plus size={14} /> Submit
                                    </button>
                                </div>

                                {/* Feature List */}
                                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                                    {featureRequests.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-gray-400 text-sm mb-4">Be the first to suggest what we should build.</p>
                                            <button
                                                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                                                style={{ background: COLORS.primary }}
                                            >
                                                Submit Feature
                                            </button>
                                        </div>
                                    ) : (
                                        featureRequests.map((feature) => (
                                            <div
                                                key={feature.id}
                                                className="flex items-center gap-4 p-4 rounded-xl transition-colors"
                                                style={{ background: '#f9fafb' }}
                                            >
                                                {/* Vote Section */}
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <div className="text-center">
                                                        <p className={`text-lg font-black ${feature.voted ? 'text-[#224cff]' : 'text-gray-700'}`}>
                                                            {feature.votes}
                                                        </p>
                                                        <p className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">votes</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleVote(feature.id)}
                                                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${feature.voted
                                                            ? 'bg-[#224cff] text-white'
                                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                                            }`}
                                                        style={{ border: feature.voted ? 'none' : '1px solid #ddd' }}
                                                    >
                                                        {feature.voted ? 'Voted' : 'Vote'}
                                                    </button>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <p className="text-sm font-semibold text-gray-900">{feature.title}</p>
                                                        {feature.status && (
                                                            <span
                                                                className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                                                                style={{
                                                                    background: feature.status === 'Planned' ? '#dcfce7' : '#fef3c7',
                                                                    color: feature.status === 'Planned' ? '#16a34a' : '#d97706'
                                                                }}
                                                            >
                                                                {feature.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">{feature.description}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Roadmap Accordion - Now below chat */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                    <button
                        onClick={() => setIsRoadmapOpen(!isRoadmapOpen)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-[#ff5800] text-lg">▸</span>
                            <span className="font-bold text-gray-900">Product Roadmap — Q1 2026</span>
                        </div>
                        <ChevronDown
                            size={18}
                            className={`text-gray-400 transition-transform ${isRoadmapOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {isRoadmapOpen && (
                        <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                            {ROADMAP_ITEMS.map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <span
                                        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex-shrink-0"
                                        style={{
                                            background: item.tag === 'AI' ? '#e0e7ff' : item.tag === 'LIVE' ? '#fef3c7' : '#dcfce7',
                                            color: item.tag === 'AI' ? '#4f46e5' : item.tag === 'LIVE' ? '#d97706' : '#16a34a'
                                        }}
                                    >
                                        {item.tag}
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityHub;
