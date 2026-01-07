import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, ChevronLeft } from 'lucide-react';
import { COLORS } from '../constants';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface GarthAIChatProps {
    onBack?: () => void;
    initialMessage?: string;
}

const GarthAIChat: React.FC<GarthAIChatProps> = ({ onBack, initialMessage }) => {
    const [messages, setMessages] = useState<Message[]>(() => {
        const intro: Message = {
            id: '1',
            role: 'assistant',
            content: initialMessage
                ? `Here's everything you need to know about "${initialMessage}":\n\n🔥 This item is currently live and accepting bids.\n📍 Located in the seller's listed region.\n⏰ Check the timer for remaining bid time.\n💰 The current bid reflects strong market interest.\n\nWant me to help you with bidding strategy or answer any specific questions about this item?`
                : "Howdy! I'm GarthAI. I can help you find specific items, answer questions about auction rules, or tell you about upcoming drops. What's on your mind?",
            timestamp: new Date()
        };
        return [intro];
    });
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Mock AI response delay
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "That's a great question! As a prototype, I can't search live data yet, but soon I'll be able to help you find deals on trucks, tractors, and more in real-time.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] md:h-screen w-full max-w-4xl mx-auto overflow-hidden bg-white md:bg-transparent">

            {/* Header */}
            <div className="flex-shrink-0 px-4 py-4 md:px-6 md:py-6 border-b md:border-none flex items-center justify-between md:justify-start gap-4" style={{ borderColor: COLORS.border }}>
                <div className="flex items-center gap-2">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <ChevronLeft size={24} style={{ color: COLORS.textPrimary }} />
                        </button>
                    )}
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: `${COLORS.fireOrange}10` }}
                    >
                        <Sparkles size={20} style={{ color: COLORS.fireOrange }} />
                    </div>
                    <h1 className="text-lg font-bold leading-tight" style={{ color: COLORS.textPrimary }}>GarthAI</h1>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto px-4 py-6 space-y-6">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                            {/* Avatar */}
                            <div
                                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                                style={{
                                    background: msg.role === 'user' ? COLORS.surface2 : COLORS.fireOrange,
                                    color: msg.role === 'user' ? COLORS.steelGray : '#ffffff'
                                }}
                            >
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            {/* Bubble */}
                            <div
                                className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'rounded-tr-sm'
                                    : 'rounded-tl-sm'
                                    }`}
                                style={{
                                    background: msg.role === 'user' ? COLORS.fireOrange : COLORS.surface1,
                                    color: msg.role === 'user' ? '#ffffff' : COLORS.textPrimary,
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}
                            >
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex w-full justify-start">
                        <div className="flex max-w-[85%] gap-3">
                            <div
                                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                                style={{ background: COLORS.fireOrange, color: '#ffffff' }}
                            >
                                <Bot size={16} />
                            </div>
                            <div
                                className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
                                style={{ background: COLORS.surface1 }}
                            >
                                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: COLORS.steelGray, animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: COLORS.steelGray, animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: COLORS.steelGray, animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 p-4 md:p-6 pb-8">
                <div
                    className="relative max-w-3xl mx-auto rounded-[24px] shadow-lg transition-all focus-within:ring-2 focus-within:ring-offset-2"
                    style={{
                        background: COLORS.surface2,
                        boxShadow: `0 8px 30px -10px rgba(0,0,0,0.08)`,
                        borderColor: COLORS.fireOrange
                    }}
                >
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything about auctions..."
                        rows={1}
                        className="w-full bg-transparent px-5 py-4 pr-14 text-base resize-none focus:outline-none max-h-[120px] scrollbar-hide"
                        style={{ color: COLORS.textPrimary }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="absolute right-2 bottom-2 p-2 rounded-full transition-all disabled:opacity-40 disabled:scale-95 hover:scale-105 active:scale-90"
                        style={{
                            background: inputValue.trim() ? COLORS.fireOrange : COLORS.surface2,
                            color: inputValue.trim() ? '#ffffff' : COLORS.steelGray,
                        }}
                    >
                        <Send size={18} fill={inputValue.trim() ? "currentColor" : "none"} />
                    </button>
                </div>
                <p className="text-center text-[10px] mt-3 font-medium opacity-60" style={{ color: COLORS.textMuted }}>
                    GarthAI can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
};

export default GarthAIChat;
