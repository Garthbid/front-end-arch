
import React, { useState } from 'react';
import { 
  ArrowLeft, Eye, Heart, ExternalLink, 
  Facebook, Instagram, Twitter, Youtube, Globe, 
  Tv, MessageCircle, Share2, Flame, Sparkles, TrendingUp,
  Play, Share, Zap, Activity, TrendingDown, Copy,
  Check
} from 'lucide-react';
import { AuctionItem } from '../types';
import { COLORS } from '../constants';

interface ItemDashboardProps {
  item: AuctionItem;
  onBack: () => void;
}

const ItemDashboard: React.FC<ItemDashboardProps> = ({ item, onBack }) => {
  const [isCopying, setIsCopying] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-12 animate-in fade-in duration-1000">
      <div className="max-w-6xl mx-auto py-4 md:py-8">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <span>Dashboard</span>
            <div className="w-1 h-1 bg-slate-200 rounded-full" />
            <span className="text-slate-500 italic">War Room</span>
          </div>
        </div>

        {/* 1. AI VIDEO AD HERO - "The Heart of the War" */}
        <div className="mb-12 group relative">
            <div className="absolute inset-0 bg-[#224cff]/5 rounded-[40px] md:rounded-[60px] blur-3xl -z-10 group-hover:bg-[#ff5800]/5 transition-colors duration-1000" />
            
            <div className="bg-slate-900 rounded-[40px] md:rounded-[60px] overflow-hidden relative shadow-2xl">
                {/* AI Video Player Placeholder */}
                <div className="aspect-video md:h-[450px] w-full bg-black relative group/video">
                    <img 
                        src={item.imageUrl} 
                        className="w-full h-full object-cover opacity-60 scale-110 blur-sm group-hover/video:scale-100 group-hover/video:blur-0 transition-all duration-1000"
                        alt="AI Ad Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                    
                    {/* Play Interface */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:scale-110 hover:bg-white hover:text-[#224cff] transition-all group/play">
                            <Play size={40} className="fill-current ml-2 group-hover/play:scale-110 transition-transform" />
                        </button>
                    </div>

                    {/* Metadata Overlay */}
                    <div className="absolute top-6 left-8 md:top-10 md:left-12">
                         <div className="bg-[#ff5800] text-white text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg flex items-center gap-2 mb-3">
                            <Zap size={14} fill="white" className="animate-pulse" /> AI GENERATED PROMO
                         </div>
                         <h2 className="text-3xl md:text-6xl font-display text-white italic uppercase tracking-tighter leading-none max-w-lg">
                            {item.title}
                         </h2>
                    </div>
                </div>

                {/* Share Boost Action Bar */}
                <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Momentum Trigger</span>
                        <p className="text-white font-medium text-sm md:text-base opacity-80">Share this commercial to pour gasoline on the bidding war.</p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-3">
                        <button 
                            onClick={handleCopyLink}
                            className="bg-white hover:bg-[#224cff] text-slate-900 hover:text-white px-6 py-3.5 rounded-[24px] font-black uppercase text-xs tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-xl"
                        >
                            {/* Fixed: Added missing Check icon import to fix line 89 error */}
                            {isCopying ? <Check size={16} strokeWidth={3} /> : <Share size={16} strokeWidth={3} />}
                            {isCopying ? 'COPIED!' : 'SHARE & BOOST'}
                        </button>
                        
                        <div className="flex items-center gap-1.5 p-1.5 bg-white/10 rounded-[24px]">
                            <SocialMini icon={Facebook} bg="hover:bg-blue-600" />
                            <SocialMini icon={Instagram} bg="hover:bg-pink-600" />
                            <SocialMini icon={Twitter} bg="hover:bg-black" />
                            <SocialMini icon={MessageCircle} bg="hover:bg-green-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. MOMENTUM LAYER - "The Telemetry" */}
        <div className="mb-16">
            <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6">
                <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-2 pl-1">Momentum Telemetry</h3>
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-4xl font-display text-slate-900 uppercase italic">Heat Meter</h2>
                        <span className="text-[#ff5800] font-black uppercase text-xs tracking-widest animate-pulse flex items-center gap-1">
                            <Activity size={12} /> NUCLEAR STATUS
                        </span>
                    </div>
                </div>
                
                {/* Heat Meter Instrument */}
                <div className="w-full md:w-96 p-1.5 bg-slate-50 rounded-[28px] border border-slate-100">
                    <div className="relative h-10 bg-slate-200 rounded-[22px] overflow-hidden flex items-center px-4">
                        {/* The Fill */}
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-orange-500 to-[#ff5800] w-[88%] animate-gradient-shift shadow-[inset_-10px_0_20px_rgba(0,0,0,0.1)]" />
                        
                        {/* Indicators */}
                        <div className="relative z-10 w-full flex justify-between text-[8px] font-black text-white uppercase tracking-widest drop-shadow-md">
                            <span>Cold</span>
                            <span>Warm</span>
                            <span className="text-white">Hot</span>
                            <span className="flex items-center gap-1 italic"><Flame size={10} fill="currentColor" /> Nuclear</span>
                        </div>
                        
                        {/* The Indicator Needle */}
                        <div className="absolute right-[12%] top-0 bottom-0 w-1 bg-white shadow-xl z-20" />
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                {/* Live Bid Velocity - PRIMARY SIGNAL */}
                <div className="md:col-span-2 bg-slate-900 rounded-[40px] p-8 relative overflow-hidden group">
                    <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#ff5800]/20 blur-3xl group-hover:bg-[#ff5800]/40 transition-colors" />
                    <div className="relative z-10 flex items-center justify-between mb-8">
                        <div className="w-12 h-12 rounded-[18px] bg-white/10 flex items-center justify-center text-[#ff5800] shadow-inner">
                            <Activity size={24} strokeWidth={2.5} className="animate-pulse" />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acceleration</span>
                            <div className="flex items-center gap-1 text-[#00d26a]">
                                <TrendingUp size={16} strokeWidth={3} />
                                <span className="text-lg font-black italic tracking-tighter">INCREASING</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 flex items-baseline gap-4">
                        <span className="text-7xl font-display text-white italic tracking-tighter">14.2</span>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-blue-400 uppercase tracking-widest leading-none">Bids / Hour</span>
                            <span className="text-[10px] font-bold text-white/40 uppercase mt-1 tracking-tighter italic">Rolling 60m window</span>
                        </div>
                    </div>
                </div>

                <MetricInstrument 
                    label="Active Impressions" 
                    value="8,290" 
                    trend="Rank #4" 
                    icon={Eye} 
                    color="text-[#224cff]" 
                    glow="hover:shadow-blue-200"
                    compact
                />
                <MetricInstrument 
                    label="Buyer Sentiment" 
                    value="1,402" 
                    trend="Top 1%" 
                    icon={Heart} 
                    color="text-[#ff5800]" 
                    glow="hover:shadow-orange-200"
                    compact
                />
            </div>
        </div>

        {/* 3. DISTRIBUTION HUB */}
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
                    <PlatformModule name="Garth Reels" icon={Tv} bg="bg-[#224cff]" pulse />
                    <PlatformModule name="Kijiji Network" icon={Share2} bg="bg-cyan-600" />
                    <PlatformModule name="Global Auction" icon={Globe} bg="bg-emerald-600" />
                    <PlatformModule name="AutoTrader" icon={CarIcon} bg="bg-blue-800" />
                </div>
            </div>
        </div>

        {/* Footer Telemetry */}
        <div className="mt-16 flex flex-col items-center gap-4">
            <div className="h-px w-20 md:w-24 bg-slate-100" />
            <p className="text-[8px] md:text-[9px] font-black text-slate-200 uppercase tracking-[0.5em]">MISSION CONTROL TELEMETRY v4.2</p>
        </div>

      </div>
      <style>{`
        @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-gradient-shift {
            background-size: 200% 200%;
            animation: gradient-shift 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

const SocialMini = ({ icon: Icon, bg }: any) => (
    <button className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white transition-all ${bg} active:scale-90`}>
        <Icon size={14} strokeWidth={3} />
    </button>
);

const MetricInstrument = ({ label, value, trend, icon: Icon, color, glow, compact = false }: any) => (
  <div className={`group relative bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 p-6 md:p-8 transition-all duration-500 shadow-sm ${glow} hover:-translate-y-1`}>
    <div className="flex items-center gap-3 md:gap-4 mb-6">
      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-[16px] md:rounded-[20px] bg-slate-50 flex items-center justify-center ${color} transition-transform group-hover:scale-110 duration-500 shadow-inner`}>
        <Icon size={24} md:size={28} strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] md:tracking-[0.2em] block truncate">{label}</span>
      </div>
    </div>
    <div className={`text-4xl md:text-5xl font-display uppercase italic tracking-tighter ${color} mb-2 leading-none`}>{value}</div>
    <div className="flex items-center gap-2">
        <span className="text-[10px] md:text-xs font-black text-[#00d26a] uppercase tracking-widest">{trend}</span>
        <div className="h-0.5 flex-1 bg-slate-50 rounded-full" />
    </div>
  </div>
);

const PlatformModule = ({ name, icon: Icon, bg, pulse = false }: any) => (
  <a 
    href="#" 
    className="group relative flex items-center justify-between p-4 md:p-6 rounded-[24px] md:rounded-[32px] bg-slate-50/50 border border-transparent hover:bg-white hover:border-blue-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden"
  >
    <div className="flex items-center gap-3 md:gap-4 relative z-10">
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[14px] md:rounded-[18px] flex items-center justify-center text-white shadow-lg transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 ${bg} ${pulse ? 'ring-4 ring-blue-100' : ''}`}>
        <Icon size={20} md:size={22} strokeWidth={2.5} />
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
        <ExternalLink size={14} md:size={16} strokeWidth={3} />
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
