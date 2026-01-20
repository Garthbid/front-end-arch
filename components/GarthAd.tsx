import React from 'react';
import { Sparkles, ArrowRight, MessageCircle } from 'lucide-react';

interface GarthAdProps {
    variant: 'COMMUNITY' | 'BUYERS_CLUB';
    onAction: () => void;
}

const GarthAd: React.FC<GarthAdProps> = ({ variant, onAction }) => {

    const config = {
        COMMUNITY: {
            gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', // Original deep blue
            shadow: '0 8px 32px rgba(0, 34, 255, 0.15), 0 0 0 1px rgba(255,255,255,0.05)',
            glowColor: 'rgba(0, 34, 255, 0.15)',
            accentColor: 'text-blue-200',
            iconColor: 'text-blue-300/40',
            buttonBorder: 'border-blue-400/30',
            buttonText: 'text-blue-300',
            buttonHoverBg: 'group-hover:bg-blue-500',
            buttonHoverText: 'group-hover:text-white',
            topText: 'Have a question or idea?',
            mainTextPrefix: 'JOIN THE',
            mainTextHighlight: 'COMMUNITY',
            mainTextGradient: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100',
            dividerText: '5,400+ Members',
            dividerLineGradient: 'from-transparent to-blue-400/30',
            description: <>Chat with the team • Vote on features • <span className="text-white font-medium">Direct Access</span></>,
            ctaText: 'Join Discussion',
            Icon: MessageCircle
        },
        BUYERS_CLUB: {
            gradient: 'linear-gradient(135deg, #2238ff 0%, #1020a0 100%)', // Garth Blue
            shadow: '0 8px 32px rgba(34, 56, 255, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            glowColor: 'rgba(255, 255, 255, 0.1)',
            accentColor: 'text-yellow-300/40',
            iconColor: 'text-yellow-300/40',
            buttonBorder: 'border-yellow-400/40',
            buttonText: 'text-yellow-300',
            buttonHoverBg: 'group-hover:bg-yellow-400',
            buttonHoverText: 'group-hover:text-blue-900',
            topText: 'Tired of high auction fees?',
            mainTextPrefix: 'JOIN GARTH',
            mainTextHighlight: 'BUYERS CLUB',
            mainTextGradient: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500',
            dividerText: 'Premium Access',
            dividerLineGradient: 'from-transparent to-blue-300/30',
            description: <>slice your auction fees in half + get <span className="text-white font-medium">unhinged access</span> to GarthAI</>,
            ctaText: 'Upgrade Now',
            Icon: Sparkles
        }
    }[variant];

    return (
        <div
            className="group py-8 px-6 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] relative overflow-hidden col-span-full my-4"
            style={{
                background: config.gradient,
                boxShadow: config.shadow,
            }}
            onClick={onAction}
        >
            {/* Animated glow effect */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${config.glowColor} 0%, transparent 70%)`,
                }}
            />

            {/* Decorative elements - Icons */}
            <div className={`absolute top-3 right-6 ${config.iconColor} animate-pulse delay-75`}><config.Icon size={24} /></div>
            <div className={`absolute bottom-3 left-6 ${config.iconColor} animate-pulse`}><config.Icon size={20} /></div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl mx-auto">
                <p className={`text-sm ${variant === 'BUYERS_CLUB' ? 'text-blue-200' : 'text-blue-200'} mb-2 font-bold tracking-widest uppercase`}>
                    {config.topText}
                </p>

                <div className="text-2xl md:text-3xl font-display text-white italic tracking-tight mb-3">
                    {config.mainTextPrefix} <span className={config.mainTextGradient}>{config.mainTextHighlight}</span>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className={`h-px w-12 bg-gradient-to-r ${config.dividerLineGradient}`} />
                    <span className="text-blue-200 text-[10px] uppercase tracking-widest">{config.dividerText}</span>
                    <div className={`h-px w-12 bg-gradient-to-l ${config.dividerLineGradient}`} />
                </div>

                <p className="text-sm text-blue-100 max-w-lg mx-auto leading-relaxed">
                    {config.description}
                </p>

                <button className={`mt-5 px-6 py-2 rounded-full bg-black/20 border ${config.buttonBorder} ${config.buttonText} text-xs font-bold uppercase tracking-widest ${config.buttonHoverBg} ${config.buttonHoverText} transition-all shadow-lg`}>
                    {config.ctaText}
                </button>
            </div>
        </div>
    );
};

export default GarthAd;
