
import React, { useState, useMemo } from 'react';
import {
  Users, Package, Zap, Activity, Eye,
  Trash2, Search, Filter, ArrowRight, ExternalLink,
  Settings, Bell, CreditCard, ChevronRight, Video,
  BarChart3, Plus, Save, ArrowLeft, Upload, Heart, MousePointer2, TrendingUp,
  Check, RefreshCw
} from 'lucide-react';
import { MOCK_AUCTIONS, COLORS } from '../constants';
import { AuctionItem } from '../types';

type AdminTab = 'USERS' | 'ITEMS' | 'WARS' | 'BIDS' | 'ADS' | 'NOTIFS' | 'BILLING';

// --- MOCK DATA GENERATORS ---
const MOCK_USERS = [
  { id: '1', name: 'Garth Rogers', username: 'garth_bid', email: 'garth@bid.com', status: 'Master', joined: 'Oct 2024' },
  { id: '2', name: 'Shutterspeed', username: 'shutterspeed', email: 'camera@pro.com', status: 'Standard', joined: 'Dec 2024' },
  { id: '3', name: 'Office Guy', username: 'office_guy', email: 'aeron@mail.com', status: 'Guest', joined: 'Jan 2025' },
  { id: '4', name: 'Dev Wizard', username: 'dev_wizard', email: 'code@bid.com', status: 'Master', joined: 'Jan 2025' },
];

const MOCK_BIDS = [
  { id: '101', user: 'dev_wizard', item: 'Vintage Leica M6', amount: 1250000, time: '2 mins ago' },
  { id: '102', user: 'office_guy', item: 'Herman Miller Aeron', amount: 125000, time: '14 mins ago' },
  { id: '103', user: 'shutterspeed', item: 'Vintage Leica M6', amount: 1249995, time: '1 hour ago' },
  { id: '104', user: 'garth_bid', item: 'MacBook Pro M3', amount: 12500, time: '3 hours ago' },
];

const MOCK_NOTIFS = [
  { id: 'n1', type: 'BID', user: 'dev_wizard', target: 'Leica M6', time: '2m' },
  { id: 'n2', type: 'LISTING', user: 'garth_bid', target: 'PS5 Pro', time: '15m' },
  { id: 'n3', type: 'PAYMENT', user: 'shutterspeed', target: 'Inv #123', time: '1h' },
];

const MOCK_INVOICES = [
  { id: 'inv1', user: 'garth_bid', status: 'Paid', amount: 9.00, date: 'Jan 15' },
  { id: 'inv2', user: 'dev_wizard', status: 'Paid', amount: 100.00, date: 'Jan 12' },
  { id: 'inv3', user: 'shutterspeed', status: 'Pending', amount: 25.00, date: 'Jan 18' },
];

const AdminSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('USERS');
  const [search, setSearch] = useState('');
  const [adConfig, setAdConfig] = useState({ clicksBeforeAd: 5 });
  const [selectedWarId, setSelectedWarId] = useState<string | null>(null);

  const renderTab = () => {
    switch (activeTab) {
      case 'USERS': return <UsersModule search={search} />;
      case 'ITEMS': return <ItemsModule search={search} />;
      case 'WARS':
        return selectedWarId ? (
          <BiddingWarDetailModule id={selectedWarId} onBack={() => setSelectedWarId(null)} />
        ) : (
          <BiddingWarsModule search={search} onSelect={setSelectedWarId} />
        );
      case 'BIDS': return <BidsModule search={search} />;
      case 'ADS': return <AdsModule config={adConfig} setConfig={setAdConfig} />;
      case 'NOTIFS': return <NotifsModule />;
      case 'BILLING': return <BillingModule />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in fade-in duration-500">

      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-[1600px] mx-auto">
          <div>
            <h1 className="text-4xl font-display text-slate-900 uppercase italic tracking-tighter leading-none">
              Control <span className="text-[#ff5800]">System</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">GarthBid Internal Infrastructure v1.0.4</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#224cff] transition-colors" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Universal Search..."
                className="bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:bg-white focus:border-[#224cff] focus:outline-none transition-all w-full md:w-64"
              />
            </div>
            <div className="h-10 w-[1px] bg-slate-100 hidden md:block" />
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Systems Operational
            </div>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mt-8 -mb-6 pb-6">
          <TabButton active={activeTab === 'USERS'} onClick={() => setActiveTab('USERS')} label="Users" icon={Users} />
          <TabButton active={activeTab === 'ITEMS'} onClick={() => setActiveTab('ITEMS')} label="Items" icon={Package} />
          <TabButton active={activeTab === 'WARS'} onClick={() => { setActiveTab('WARS'); setSelectedWarId(null); }} label="Bidding Wars" icon={Activity} />
          <TabButton active={activeTab === 'BIDS'} onClick={() => setActiveTab('BIDS')} label="Bid History" icon={Zap} />
          <TabButton active={activeTab === 'ADS'} onClick={() => setActiveTab('ADS')} label="Ad Engine" icon={Settings} />
          <TabButton active={activeTab === 'NOTIFS'} onClick={() => setActiveTab('NOTIFS')} label="Notifications" icon={Bell} />
          <TabButton active={activeTab === 'BILLING'} onClick={() => setActiveTab('BILLING')} label="Invoices" icon={CreditCard} />
        </div>
      </header>

      {/* Admin Content */}
      <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full">
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm min-h-[600px] overflow-hidden">
          {renderTab()}
        </div>
      </main>

    </div>
  );
};

// --- MODULE: USERS ---
const UsersModule = ({ search }: { search: string }) => {
  const filtered = MOCK_USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-0">
      <AdminTable
        headers={['User', 'Status', 'Email', 'Joined', 'Actions']}
        rows={filtered.map(u => (
          <tr key={u.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
            <td className="p-6">
              <div className="flex items-center gap-3">
                <img src={`https://i.pravatar.cc/100?u=${u.id}`} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-slate-900">{u.name}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">@{u.username}</div>
                </div>
              </div>
            </td>
            <td className="p-6">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${u.status === 'Master' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>{u.status}</span>
            </td>
            <td className="p-6 text-sm font-medium text-slate-500">{u.email}</td>
            <td className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">{u.joined}</td>
            <td className="p-6">
              <button className="text-slate-400 hover:text-blue-600 transition-colors"><ChevronRight size={18} /></button>
            </td>
          </tr>
        ))}
      />
    </div>
  );
}

// --- MODULE: ITEMS ---
const ItemsModule = ({ search }: { search: string }) => {
  const filtered = MOCK_AUCTIONS.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-0">
      <AdminTable
        headers={['Item', 'Current Bid', 'Status', 'Owner', 'Actions']}
        rows={filtered.map(item => (
          <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
            <td className="p-6">
              <div className="flex items-center gap-4">
                <img src={item.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                <span className="font-bold text-slate-900 text-sm">{item.title}</span>
              </div>
            </td>
            <td className="p-6">
              <span className="text-sm font-black text-[#224cff]">${item.currentBid.toLocaleString()}</span>
            </td>
            <td className="p-6">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest">{item.status || 'Active'}</span>
            </td>
            <td className="p-6 text-sm font-bold text-slate-500 italic">{item.winningBidder}</td>
            <td className="p-6">
              <div className="flex gap-3">
                <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-blue-600 transition-all"><ExternalLink size={16} /></button>
                <button className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
              </div>
            </td>
          </tr>
        ))}
      />
    </div>
  );
}

// --- MODULE: BIDDING WARS (INDEX) ---
const BiddingWarsModule = ({ search, onSelect }: { search: string, onSelect: (id: string) => void }) => {
  // Use MOCK_AUCTIONS as base, similar to Items view
  const filtered = MOCK_AUCTIONS.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  // Mock package types for demo
  const PACKAGES = ['The Sweet Spot', 'All Out War', 'Starter Pack', 'Premium Blitz'];

  // Mock completion status (in real app, this would check if all distribution links are filled)
  const getCompletionStatus = (index: number) => {
    // Simulating some items complete, some not
    return index % 3 !== 0; // Every 3rd item is "not complete"
  };

  return (
    <div className="p-0 animate-in fade-in duration-300">
      <AdminTable
        headers={['Item Campaign', 'Package', 'Status', 'User', 'Actions']}
        rows={filtered.map((item, index) => {
          const isComplete = getCompletionStatus(index);
          const packageType = PACKAGES[index % PACKAGES.length];

          return (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
              <td className="p-6">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {item.id}</div>
                  </div>
                </div>
              </td>
              <td className="p-6">
                <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                  {packageType}
                </span>
              </td>
              <td className="p-6">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${isComplete
                    ? 'bg-green-50 text-green-600'
                    : 'bg-red-50 text-red-600'
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isComplete ? 'bg-green-500' : 'bg-red-500'}`} />
                  {isComplete ? 'Complete' : 'Not Complete'}
                </span>
              </td>
              <td className="p-6 text-sm font-bold text-slate-500 italic">@{item.winningBidder}</td>
              <td className="p-6">
                <button
                  onClick={() => onSelect(item.id)}
                  className="bg-[#224cff] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  Control <ChevronRight size={14} strokeWidth={3} />
                </button>
              </td>
            </tr>
          );
        })}
      />
    </div>
  );
}

// --- MODULE: BIDDING WAR DETAIL ---
const BiddingWarDetailModule = ({ id, onBack }: { id: string, onBack: () => void }) => {
  const item = MOCK_AUCTIONS.find(a => a.id === id) || MOCK_AUCTIONS[0];
  const [totalViews, setTotalViews] = React.useState('12,402');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefreshViews = () => {
    setIsRefreshing(true);
    // Simulate API call to update views
    setTimeout(() => {
      setIsRefreshing(false);
      alert(`Views updated to ${totalViews} - This will now show in the war room and on the live item.`);
    }, 500);
  };

  return (
    <div className="p-8 md:p-12 animate-in slide-in-from-right-4 duration-500">
      {/* Sub Header */}
      <div className="flex items-center justify-between mb-12 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </button>
          <div className="flex items-center gap-5">
            <img src={item.imageUrl} className="w-20 h-20 rounded-[24px] object-cover shadow-lg" />
            <div>
              <h2 className="text-3xl font-display text-slate-900 uppercase italic tracking-tighter leading-none">{item.title}</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                Managing Campaign for <span className="text-[#224cff]">{item.winningBidder}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all">Kill Campaign</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* SECTION 1: VIDEO ASSETS */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 text-[#224cff] rounded-lg flex items-center justify-center">
              <Video size={18} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Video Assets</h3>
          </div>

          <div className="aspect-video bg-slate-900 rounded-[32px] relative overflow-hidden group">
            <img src={item.imageUrl} className="w-full h-full object-cover opacity-30 blur-[2px]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <Upload size={32} className="text-white/40 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-white text-sm font-bold">Replace Bidding War Video</p>
              <p className="text-white/40 text-[10px] uppercase mt-2 font-black">MP4 · Max 50MB</p>
              <button className="mt-6 px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Select File</button>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 text-slate-500">
              <Check size={16} className="text-green-500" strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest">Active Ad: cinem_ad_v2.mp4</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: ANALYTICS (READ-ONLY) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-50 text-[#ff5800] rounded-lg flex items-center justify-center">
              <BarChart3 size={18} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Live Analytics</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AdminMetricCard label="Impressions" value="12,402" icon={Eye} color="text-blue-500" />
            <AdminMetricCard label="Hearts" value="1,829" icon={Heart} color="text-red-500" />
            <AdminMetricCard label="Total Bids" value={item.bids} icon={Zap} color="text-orange-500" />
            <AdminMetricCard label="Bid Velocity" value="4.2/h" icon={TrendingUp} color="text-green-500" />
          </div>

          <div className="h-32 w-full bg-slate-50 rounded-[28px] border border-slate-100 flex items-center justify-center relative overflow-hidden">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] z-10">Real-time Graph</div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-500/5" style={{ clipPath: 'polygon(0% 100%, 10% 70%, 20% 90%, 30% 50%, 40% 60%, 50% 30%, 60% 80%, 70% 40%, 80% 90%, 90% 20%, 100% 100%)' }} />
          </div>
        </div>

        {/* SECTION 3: DISTRIBUTION LINKS */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center">
              <ExternalLink size={18} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Distribution Hub</h3>
          </div>

          <div className="space-y-3 bg-slate-50 p-6 rounded-[32px] border border-slate-100 max-h-[400px] overflow-y-auto no-scrollbar">
            {/* Total Views Input */}
            <div className="flex flex-col gap-1.5 mb-4 pb-4 border-b border-slate-200">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Total Views</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white rounded-xl border-2 border-blue-200 px-3 py-2.5 group focus-within:border-blue-500 transition-all">
                  <Eye size={16} className="text-blue-500" />
                  <input
                    type="text"
                    value={totalViews}
                    onChange={(e) => setTotalViews(e.target.value)}
                    placeholder="Enter total views..."
                    className="flex-1 bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-300"
                  />
                </div>
                <button
                  onClick={handleRefreshViews}
                  disabled={isRefreshing}
                  className={`p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-95 ${isRefreshing ? 'opacity-50' : ''}`}
                >
                  <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
              </div>
              <p className="text-[9px] text-slate-400 pl-1">Updates impressions in war room + live on item</p>
            </div>

            <LinkInput label="Facebook Market" />
            <LinkInput label="Facebook Reels" />
            <LinkInput label="Instagram" />
            <LinkInput label="X / Twitter" />
            <LinkInput label="YouTube" />
            <LinkInput label="TikTok" />
            <LinkInput label="Kijiji" />
            <LinkInput label="Global Auction" />
            <LinkInput label="AutoTrader" />
          </div>

          <button className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
            <Save size={16} /> Sync All Endpoints
          </button>
        </div>

      </div>
    </div>
  );
}

const AdminMetricCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <Icon size={14} className={color} />
    </div>
    <div className="text-xl font-display text-slate-900 leading-none">{value}</div>
  </div>
);

const LinkInput = ({ label }: { label: string }) => (
  <div className="flex flex-col gap-1.5 mb-2">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>
    <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2.5 group focus-within:border-blue-400 transition-all">
      <input type="text" placeholder="Paste link..." className="flex-1 bg-transparent text-xs font-medium focus:outline-none placeholder:text-slate-200" />
      <button className="text-slate-200 group-focus-within:text-blue-500 transition-colors"><Save size={14} /></button>
    </div>
  </div>
);

// --- MODULE: BIDS ---
const BidsModule = ({ search }: { search: string }) => {
  return (
    <div className="p-0">
      <AdminTable
        headers={['Bidder', 'Item Target', 'Amount', 'Time', 'Actions']}
        rows={MOCK_BIDS.map(bid => (
          <tr key={bid.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
            <td className="p-6">
              <span className="text-sm font-bold text-slate-900">@{bid.user}</span>
            </td>
            <td className="p-6 text-sm font-medium text-slate-500">{bid.item}</td>
            <td className="p-6">
              <span className="text-sm font-black text-[#224cff]">${bid.amount.toLocaleString()}</span>
            </td>
            <td className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">{bid.time}</td>
            <td className="p-6">
              <button className="text-red-400 hover:text-red-600 transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                <Trash2 size={14} /> Remove
              </button>
            </td>
          </tr>
        ))}
      />
    </div>
  );
}

// --- MODULE: ADS ---
const AdsModule = ({ config, setConfig }: { config: any, setConfig: any }) => {
  return (
    <div className="p-12 max-w-xl mx-auto">
      <div className="mb-12 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Settings size={36} strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-display text-slate-900 uppercase italic">Ad Engine Logic</h2>
        <p className="text-slate-500 font-medium">Control monetization experiments across the platform.</p>
      </div>

      <div className="space-y-8">
        <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-black text-slate-900 uppercase text-lg leading-none">Load More Gate</h4>
              <p className="text-xs font-bold text-slate-400 mt-2">Display ad after X interactions</p>
            </div>
            <div className="text-4xl font-display text-[#224cff] italic tracking-tighter">{config.clicksBeforeAd}</div>
          </div>

          <div className="relative h-2 bg-slate-200 rounded-full mb-8">
            <div
              className="absolute h-full bg-[#224cff] rounded-full"
              style={{ width: `${(config.clicksBeforeAd / 20) * 100}%` }}
            />
            <input
              type="range" min="1" max="20"
              value={config.clicksBeforeAd}
              onChange={(e) => setConfig({ ...config, clicksBeforeAd: parseInt(e.target.value) })}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
            />
          </div>

          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <span>Aggressive (1)</span>
            <span>Subtle (20)</span>
          </div>
        </div>

        <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
          <Save size={20} /> Update Ad Logic
        </button>
      </div>
    </div>
  );
}

// --- MODULE: NOTIFS ---
const NotifsModule = () => {
  return (
    <div className="p-8">
      <div className="space-y-4">
        {MOCK_NOTIFS.map(n => (
          <div key={n.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${n.type === 'BID' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                {n.type === 'BID' ? <Zap size={18} /> : <Plus size={18} />}
              </div>
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{n.type} Event</span>
                <p className="text-sm font-bold text-slate-900">@{n.user} interacted with {n.target}</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{n.time} ago</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MODULE: BILLING ---
const BillingModule = () => {
  return (
    <div className="p-0">
      <AdminTable
        headers={['Invoice ID', 'User', 'Status', 'Amount', 'Date', 'Actions']}
        rows={MOCK_INVOICES.map(inv => (
          <tr key={inv.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
            <td className="p-6 font-mono text-xs font-bold text-slate-500 uppercase">{inv.id}</td>
            <td className="p-6 font-bold text-slate-900">@{inv.user}</td>
            <td className="p-6">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{inv.status}</span>
            </td>
            <td className="p-6 font-black text-slate-900">${inv.amount.toFixed(2)}</td>
            <td className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">{inv.date}</td>
            <td className="p-6">
              <button className="text-slate-400 hover:text-blue-600 transition-colors"><ChevronRight size={18} /></button>
            </td>
          </tr>
        ))}
      />
    </div>
  );
}

// --- SHARED ADMIN COMPONENTS ---

const TabButton = ({ active, onClick, label, icon: Icon }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 rounded-2xl flex items-center gap-3 whitespace-nowrap transition-all duration-300 ${active ? 'bg-slate-900 text-white shadow-xl -translate-y-1' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50 hover:text-slate-900'}`}
  >
    <Icon size={18} strokeWidth={active ? 3 : 2} />
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

const AdminTable = ({ headers, rows }: { headers: string[], rows: React.ReactNode[] }) => (
  <table className="w-full text-left border-collapse">
    <thead className="bg-slate-50 border-b border-slate-100">
      <tr>
        {headers.map(h => (
          <th key={h} className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>{rows}</tbody>
  </table>
);

export default AdminSystem;
