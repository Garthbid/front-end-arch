
import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Globe, Activity, 
  Facebook, Instagram, Youtube, MessageCircle, 
  Tv, Share2, Twitter, Sparkles, Zap
} from 'lucide-react';
import { AuctionItem } from '../types';

interface ItemBuildProgressProps {
  item: AuctionItem;
  onClose: () => void;
}

const ItemBuildProgress: React.FC<ItemBuildProgressProps> = ({ item, onClose }) => {
  const [currentStage, setCurrentStage] = useState(0);
  
  const stages = [
    "Assembling premium assets",
    "Generating AI cinematic ad",
    "Synchronizing distribution nodes",
    "Distributing across 9 marketplaces",
    "Initializing bidding war telemetry"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage(prev => (prev + 1) % stages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[600] bg-slate-950 text-white flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-1000">
      
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Pulsing Core Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Animated Grid/Matrix */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Orbiting Icons */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
             <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-white/5 rounded-full animate-spin-slow relative">
                <IconNode Icon={Facebook} className="top-0 left-1/2 -translate-x-1/2" />
                <IconNode Icon={Instagram} className="bottom-0 left-1/2 -translate-x-1/2" />
                <IconNode Icon={Youtube} className="left-0 top-1/2 -translate-y-1/2" />
                <IconNode Icon={Twitter} className="right-0 top-1/2 -translate-y-1/2" />
             </div>
             <div className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] border border-white/10 rounded-full animate-reverse-spin relative">
                <IconNode Icon={MessageCircle} className="top-1/4 left-0" />
                <IconNode Icon={Tv} className="bottom-1/4 right-0" />
                <IconNode Icon={Share2} className="top-1/4 right-0" />
                <IconNode Icon={Globe} className="bottom-1/4 left-0" />
             </div>
        </div>
      </div>

      {/* Main Content Scrollable Container for safety, but aiming for fits-all-screens */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 py-6 md:py-12 overflow-y-auto no-scrollbar">
        <div className="max-w-2xl w-full text-center flex flex-col items-center">
            
            {/* Item Preview (Subtle) - Reduced for mobile */}
            <div className="mb-6 md:mb-10">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-[20px] md:rounded-[32px] overflow-hidden border-2 border-white/10 shadow-2xl relative">
                    <img src={item.imageUrl} loading="lazy" className="w-full h-full object-cover opacity-50 grayscale scale-110" alt="Item Preview" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Activity size={24} className="text-blue-500 animate-pulse md:hidden" />
                        <Activity size={32} className="text-blue-500 animate-pulse hidden md:block" />
                    </div>
                </div>
            </div>

            {/* Headlines - Scaled down for mobile */}
            <div className="space-y-2 md:space-y-4 mb-8 md:mb-12">
                <h1 className="text-2xl sm:text-4xl md:text-7xl font-display uppercase italic tracking-tighter leading-[0.9] drop-shadow-2xl">
                    Your Bidding War Campaign <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-orange-500 to-blue-500 animate-gradient-shift">
                        Is Being Constructed
                    </span>
                </h1>
                <p className="text-slate-400 font-medium text-sm md:text-xl max-w-md md:max-w-lg mx-auto leading-relaxed">
                    We’re building your high-precision campaign across all premium platforms. This is where bidding wars are born.
                </p>
            </div>

            {/* Progress Stages - Cinematic Vertical Ticker */}
            <div className="bg-white/5 backdrop-blur-md rounded-[28px] md:rounded-[40px] p-6 md:p-10 border border-white/10 shadow-2xl w-full max-w-lg">
                <div className="flex flex-col gap-4 md:gap-6 text-left">
                    {stages.map((stage, i) => (
                        <div 
                            key={i} 
                            className={`flex items-center gap-3 md:gap-4 transition-all duration-700 ${i === currentStage ? 'opacity-100 scale-[1.02]' : 'opacity-20 blur-[0.5px]'}`}
                        >
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${i === currentStage ? 'bg-blue-600 border-blue-400 text-white' : 'border-white/20 text-slate-500'}`}>
                                {i < currentStage ? <ShieldCheck size={16} strokeWidth={3} /> : <div className={`w-1.5 h-1.5 rounded-full ${i === currentStage ? 'bg-white animate-ping' : 'bg-slate-700'}`} />}
                            </div>
                            <span className={`text-sm md:text-xl font-black uppercase tracking-tight leading-tight ${i === currentStage ? 'text-white' : 'text-slate-500'}`}>
                                {stage}
                            </span>
                        </div>
                    ))}
                </div>
                
                {/* Meta Info */}
                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Build Time: Up to 24 Hours</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                        <Zap size={12} fill="currentColor" /> Live Telemetry Initialized
                    </div>
                </div>
            </div>

            {/* Notification Promise */}
            <p className="mt-8 md:mt-12 text-slate-500 text-[10px] md:text-sm font-bold uppercase tracking-widest animate-pulse px-4">
                You’ll be notified the moment your war room is live.
            </p>

            {/* Close/Back Button */}
            <button 
                onClick={onClose}
                className="mt-8 md:mt-12 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 flex-shrink-0"
            >
                <X size={20} md:size={24} strokeWidth={3} />
            </button>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 40s linear infinite;
        }
        @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-gradient-shift {
            background-size: 200% 200%;
            animation: gradient-shift 6s ease infinite;
        }
      `}</style>
    </div>
  );
};

const IconNode = ({ Icon, className }: { Icon: any, className: string }) => (
    <div className={`absolute w-10 h-10 md:w-12 md:h-12 bg-slate-900 border border-white/20 rounded-xl md:rounded-2xl flex items-center justify-center text-white/40 shadow-2xl ${className}`}>
        <Icon size={18} md:size={20} strokeWidth={2.5} />
    </div>
);

export default ItemBuildProgress;
