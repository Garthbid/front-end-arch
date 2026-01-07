
import React from 'react';
import { LayoutDashboard, ArrowLeft, Flame, ChevronRight, Sparkles } from 'lucide-react';
import { AuctionItem } from '../types';
import { MOCK_AUCTIONS } from '../constants';

interface DashboardOverviewProps {
  onBack: () => void;
  onItemClick: (item: AuctionItem) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onBack, onItemClick }) => {
  const myListingIds = ['1', '3', '5'];
  const myListings = MOCK_AUCTIONS.filter(item => myListingIds.includes(item.id));

  return (
    <div className="min-h-screen bg-white p-4 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Apple-style Minimalist Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6 md:gap-8">
          <div className="space-y-3 md:space-y-4">
            <button 
              onClick={onBack}
              className="group flex items-center gap-2 text-slate-400 hover:text-[#224cff] transition-all font-bold uppercase tracking-widest text-[9px] md:text-[10px]"
            >
              <ArrowLeft size={12} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
              Back to Profile
            </button>
            <div>
              <h1 className="text-4xl md:text-7xl font-display text-slate-900 uppercase italic tracking-tighter leading-none">
                War <span className="text-[#ff5800]">Room</span>
              </h1>
              <p className="text-sm md:text-lg font-medium text-slate-400 mt-2 md:mt-4 max-w-md leading-relaxed">
                High-precision tracking for your active listings. Select an asset to monitor live distribution and performance.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 bg-slate-50 p-1.5 md:p-2 rounded-[24px] md:rounded-[28px] border border-slate-100 self-start md:self-auto">
             <div className="bg-white px-4 md:px-6 py-2 md:py-3 rounded-[18px] md:rounded-[22px] shadow-sm border border-slate-100">
                <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Active Campaigns</span>
                <span className="text-xl md:text-2xl font-display text-slate-900">{myListings.length}</span>
             </div>
             <div className="bg-[#ff5800] px-4 md:px-6 py-2 md:py-3 rounded-[18px] md:rounded-[22px] shadow-lg shadow-orange-200">
                <span className="text-[8px] md:text-[10px] font-black text-white/80 uppercase tracking-widest block mb-0.5 text-center">Live Heat</span>
                <div className="flex items-center justify-center gap-1.5 md:gap-2">
                   <Flame size={14} className="text-white fill-current animate-pulse" />
                   <span className="text-xl md:text-2xl font-display text-white italic">High</span>
                </div>
             </div>
          </div>
        </div>

        {/* The Grid: Sculptural Cards - 2 Columns on mobile as requested */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-8">
          {myListings.map((item, idx) => (
            <div 
              key={item.id}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <button
                onClick={() => onItemClick(item)}
                className="group w-full text-left relative bg-white rounded-[24px] md:rounded-[40px] p-2 md:p-4 border border-slate-100 hover:border-blue-200 hover:shadow-[0_40px_80px_-20px_rgba(34,76,255,0.12)] transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-[4/5] relative overflow-hidden rounded-[20px] md:rounded-[32px] mb-3 md:mb-6 bg-slate-50">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Glass Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#224cff]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 flex justify-between items-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                     <div className="bg-white/90 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#224cff]">
                        Enter Room
                     </div>
                     <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center text-[#ff5800] shadow-lg">
                        <Flame size={12} fill="currentColor" />
                     </div>
                  </div>
                </div>

                <div className="px-1 md:px-2 pb-1 md:pb-2">
                  <h3 className="font-bold text-slate-900 text-sm md:text-lg leading-tight uppercase tracking-tight line-clamp-2 mb-1 md:mb-2 group-hover:text-[#224cff] transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 md:h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-[#00d26a] w-3/4 group-hover:w-full transition-all duration-1000" />
                    </div>
                    <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </button>
            </div>
          ))}

          {/* Empty State: If no listings */}
          {myListings.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                <Sparkles size={28} className="text-slate-200" />
              </div>
              <h3 className="text-xl md:text-2xl font-display text-slate-900 uppercase">No active wars</h3>
              <p className="text-slate-400 font-medium max-w-xs mt-2 text-sm md:text-base">List an item to activate the high-precision tracking engine.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;
