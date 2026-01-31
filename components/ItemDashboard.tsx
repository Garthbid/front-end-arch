
import React, { useState } from 'react';
import {
    ArrowLeft, Eye, Heart, ExternalLink,
    Facebook, Instagram, Twitter, Youtube, Globe,
    Tv, MessageCircle, Share2, Zap, Download, MousePointerClick, Flame
} from 'lucide-react';
import { AuctionItem } from '../types';
import { COLORS } from '../constants';

interface ItemDashboardProps {
    item: AuctionItem;
    onBack: () => void;
}

const ItemDashboard: React.FC<ItemDashboardProps> = ({ item, onBack }) => {
    return (
        <div className="min-h-screen bg-white p-4 md:p-12 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto py-4 md:py-8">

                {/* Navigation & Breadcrumb */}
                <div className="flex items-center gap-4 mb-12">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                    >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </button>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <span>Dashboard</span>
                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-slate-500 italic">Bidding Dashboard</span>
                    </div>
                </div>

                {/* Item Header */}
                <div className="flex items-center gap-6 mb-12">
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                    />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-display text-slate-900 uppercase italic leading-tight mb-1">
                            {item.title}
                        </h1>
                        <p className="text-sm text-slate-400 font-medium">Campaign Dashboard</p>
                    </div>
                </div>

                {/* Simple Stats Row */}
                <div className="grid grid-cols-2 gap-4 md:gap-6 mb-12">
                    <StatCard label="Total Views" value="10,000" icon={Eye} customColor={COLORS.fireOrange} />
                    <StatCard label="Total Favourites" value="50" icon={Flame} customColor={COLORS.fireOrange} />
                    <StatCard label="Total Bids" value="100" icon={Zap} customColor={COLORS.success} />
                    <StatCard label="Total Listing Clicks" value="250" icon={MousePointerClick} customColor="#7e22ce" />
                </div>

                {/* AI Commercial Download Section */}
                <div className="mb-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                                <Tv size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm mb-0.5">Your Custom AI Commercial</h3>
                                <p className="text-xs text-slate-400">Click to download and post on your social media platforms.</p>
                            </div>
                        </div>
                        <button className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95">
                            <Download size={16} />
                            Download Video
                        </button>
                    </div>
                </div>

                {/* DISTRIBUTION ORBIT */}
                <div className="relative">
                    <div className="absolute inset-0 bg-slate-50 rounded-[40px] md:rounded-[60px] transform -rotate-1 scale-[1.02] pointer-events-none" />

                    <div className="relative bg-white rounded-[40px] md:rounded-[60px] border border-slate-100 p-8 md:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)]">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-display text-slate-900 uppercase italic leading-none mb-3">Distribution Orbit</h2>
                                <p className="text-slate-400 font-medium text-sm md:text-lg max-w-md">Real-time connectivity with your 9 distribution endpoints.</p>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px] bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                <Globe size={12} /> Syncing via GarthEngine™
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            <PlatformModule name="Facebook Marketplace" icon={Facebook} bg="bg-blue-600" />
                            <PlatformModule name="Instagram Reels" icon={Instagram} bg="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600" />
                            <PlatformModule name="TikTok Live" icon={MessageCircle} bg="bg-slate-950" />
                            <PlatformModule name="YouTube Vision" icon={Youtube} bg="bg-red-600" />
                            <PlatformModule name="X Broadcast" icon={Twitter} bg="bg-slate-900" />
                            <PlatformModule name="Garth Reels" icon={Tv} bg="bg-[#2238ff]" pulse />
                            <PlatformModule name="Kijiji Network" icon={Share2} bg="bg-cyan-600" />
                            <PlatformModule name="Global Auction" icon={Globe} bg="bg-emerald-600" />
                            <PlatformModule name="AutoTrader" icon={CarIcon} bg="bg-blue-800" />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 flex flex-col items-center gap-4">
                    <div className="h-px w-20 md:w-24 bg-slate-100" />
                    <p className="text-[8px] md:text-[9px] font-black text-slate-200 uppercase tracking-[0.5em]">BIDDING DASHBOARD v2.0</p>
                </div>

            </div>
        </div>
    );
};

// Simple stat card
const StatCard = ({ label, value, icon: Icon, color, customColor }: { label: string; value: string; icon: any; color?: string; customColor?: string }) => (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
            <Icon size={16} className={!customColor ? color : undefined} style={customColor ? { color: customColor } : undefined} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
        <div className={`text-2xl md:text-3xl font-display leading-none ${!customColor ? color : ''}`} style={customColor ? { color: customColor } : undefined}>{value}</div>
    </div>
);

const PlatformModule = ({ name, icon: Icon, bg, pulse = false }: any) => (
    <a
        href="#"
        className="group relative flex items-center justify-between p-4 md:p-6 rounded-[24px] md:rounded-[32px] bg-slate-50/50 border border-transparent hover:bg-white hover:border-blue-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden"
    >
        <div className="flex items-center gap-3 md:gap-4 relative z-10">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[14px] md:rounded-[18px] flex items-center justify-center text-white shadow-lg transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 ${bg} ${pulse ? 'ring-4 ring-blue-100' : ''}`}>
                <Icon size={20} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
                <span className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight block mb-0.5 truncate">{name}</span>
                <div className="flex items-center gap-1.5">
                    <div className={`w-1 h-1 rounded-full ${pulse ? 'bg-blue-500 animate-ping' : 'bg-slate-300'}`} />
                    <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Connected</span>
                </div>
            </div>
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-slate-200 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all duration-500 opacity-0 group-hover:opacity-100 flex-shrink-0">
            <ExternalLink size={14} strokeWidth={3} />
        </div>
        <Icon className="absolute -right-3 md:-right-4 -bottom-3 md:-bottom-4 w-16 md:w-20 h-16 md:h-20 text-slate-900 opacity-[0.02] transform rotate-12" />
    </a>
);

const CarIcon = (props: any) => (
    <svg
        {...props}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    >
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
    </svg>
);

export default ItemDashboard;
