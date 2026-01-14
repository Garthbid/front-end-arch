
import React, { useState, useEffect } from 'react';
import { Loader2, ArrowRight, Zap, Trophy, ShieldCheck, Sparkles } from 'lucide-react';
import { COLORS } from '../constants';

const LaunchPage: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState<{ days: string; hours: string; minutes: string; seconds: string }>({
        days: '30',
        hours: '00',
        minutes: '00',
        seconds: '00',
    });
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Target date logic...
    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);
        targetDate.setHours(0, 0, 0, 0);

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = targetDate.getTime() - now;
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({
                    days: days.toString().padStart(2, '0'),
                    hours: hours.toString().padStart(2, '0'),
                    minutes: minutes.toString().padStart(2, '0'),
                    seconds: seconds.toString().padStart(2, '0'),
                });
            }
        };
        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#050507] text-white overflow-hidden flex flex-col items-center justify-center">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050507] to-[#050507]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />

            {/* Floating Orbs - Subtle */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] animate-pulse delay-1000" />

            <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center justify-between h-full py-8 md:py-16 md:justify-center md:gap-16">

                {/* 1. Header / Intro (Top on Mobile) */}
                <div className="text-center space-y-4 pt-4 md:pt-0 animate-in slide-in-from-top-8 duration-1000 fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">System Upgrade</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 pb-2">
                        Garthbid is getting an upgrade
                    </h1>
                </div>

                {/* 2. THE TIMER (Centerpiece) */}
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <div className="relative group">
                        {/* Glow behind timer */}
                        <div className="absolute -inset-8 bg-blue-500/20 blur-3xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-1000" />

                        <div className="relative flex flex-col items-center gap-4 md:gap-8">
                            <div className="flex items-baseline gap-2 md:gap-6 font-mono text-6xl min-[400px]:text-7xl sm:text-8xl md:text-9xl font-bold tracking-tighter tabular-nums leading-none select-none"
                                style={{ textShadow: '0 0 80px rgba(59, 130, 246, 0.5)' }}>

                                <TimeUnit value={timeLeft.days} label="DAYS" />
                                <span className="text-blue-500/50 animate-pulse">:</span>
                                <TimeUnit value={timeLeft.hours} label="HOURS" />
                                <span className="text-blue-500/50 animate-pulse">:</span>
                                <TimeUnit value={timeLeft.minutes} label="MINUTES" />
                            </div>
                        </div>
                    </div>

                    {/* Hammered Newsletter Section */}
                    <div className="mt-8 sm:mt-12 md:mt-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                        <button className="group flex flex-col items-center gap-2 hover:bg-white/5 p-4 rounded-xl transition-colors">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-200">Read the Hammered Newsletter to learn more</span>
                                <ArrowRight size={14} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <p className="text-xs text-slate-500 max-w-sm">
                                Behind the scenes decisions, platform changes, and what’s coming next.
                            </p>
                        </button>
                    </div>
                </div>

                {/* 3. Features & Waitlist (Bottom) */}
                <div className="w-full max-w-lg flex flex-col gap-8 md:gap-10 pb-4 md:pb-0 animate-in slide-in-from-bottom-8 duration-1000 delay-200 fade-in">

                    {/* Compact Features */}
                    <div className="flex justify-between items-center px-2 md:px-8 text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">
                        <div className="flex flex-col items-center gap-2 group">
                            <Trophy size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
                            <span>Unreserved</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex flex-col items-center gap-2 group">
                            <Zap size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
                            <span>Garth AI</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex flex-col items-center gap-2 group">
                            <ShieldCheck size={20} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span>Verified</span>
                        </div>
                    </div>

                    {/* Waitlist Form */}
                    {!isSuccess ? (
                        <form onSubmit={handleSubmit} className="relative w-full group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-50 blur group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative flex items-center bg-[#0B0B0E] rounded-xl p-1.5 md:p-2 border border-white/10 shadow-2xl">
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter email for early access"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none font-medium text-sm md:text-base w-full"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-white text-black px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base hover:bg-blue-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <>JOIN <ArrowRight size={16} /></>}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center animate-in zoom-in-95 duration-300 backdrop-blur-md">
                            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold mb-1">
                                <Sparkles size={16} />
                                <span>YOU'RE ON THE LIST</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">We'll notify you when the arena opens.</p>
                        </div>
                    )}

                    {/* Transparency Callout */}
                    <div className="text-center px-4">
                        <p className="text-[11px] leading-relaxed text-slate-500 max-w-sm mx-auto">
                            All previous $9/month subscriptions have been cancelled. We’re moving forward with an improved fee structure.
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.3em] hover:text-slate-600 transition-colors cursor-default">
                            Built for the bold
                        </p>
                    </div>
                </div>
            </div >
        </div >
    );
};

// Helper for Timer Digits
const TimeUnit = ({ value, label, className = '' }: { value: string, label: string, className?: string }) => (
    <div className={`flex flex-col items-center ${className}`}>
        <div className="relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 filter drop-shadow-2xl">
                {value}
            </span>
            {/* Reflection effect */}
            <span className="absolute top-full left-0 w-full text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent scale-y-[-0.5] origin-top opacity-30 select-none pointer-events-none transform translate-y-[-10%] blur-sm">
                {value}
            </span>
        </div>
        <span className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] text-slate-600 uppercase mt-2 md:mt-4">{label}</span>
    </div>
);

export default LaunchPage;
