import React from 'react';
import { ArrowLeft, Users, ShoppingCart, Store, Gavel, Tag } from 'lucide-react';

interface MyLedgerProps {
    onBack: () => void;
}

interface LedgerEntry {
    id: string;
    type: 'referral_signup' | 'referral_first_purchase' | 'referral_first_sale' | 'bid_reward' | 'sale_reward';
    description: string;
    amount: number;
    date: string;
}

const mockLedger: LedgerEntry[] = [
    { id: '1', type: 'referral_signup', description: 'Justin invited 780-307-6789', amount: 125, date: 'Jan 28, 2026' },
    { id: '2', type: 'bid_reward', description: 'Bid on 2019 Ram 1500', amount: 5, date: 'Jan 27, 2026' },
    { id: '3', type: 'referral_first_purchase', description: '780-976-3245 bought first item', amount: 125, date: 'Jan 26, 2026' },
    { id: '4', type: 'bid_reward', description: 'Bid on Milwaukee Tool Set', amount: 5, date: 'Jan 25, 2026' },
    { id: '5', type: 'sale_reward', description: 'Sold Honda CRF250R', amount: 10, date: 'Jan 24, 2026' },
    { id: '6', type: 'referral_first_sale', description: '780-234-7980 sold first item', amount: 250, date: 'Jan 23, 2026' },
    { id: '7', type: 'bid_reward', description: 'Bid on Snap-On Toolbox', amount: 5, date: 'Jan 22, 2026' },
    { id: '8', type: 'referral_signup', description: 'Justin invited 780-412-9931', amount: 125, date: 'Jan 21, 2026' },
    { id: '9', type: 'bid_reward', description: 'Bid on 2021 Can-Am Maverick', amount: 5, date: 'Jan 20, 2026' },
    { id: '10', type: 'sale_reward', description: 'Sold Dewalt Drill Kit', amount: 10, date: 'Jan 19, 2026' },
];

const typeConfig = {
    referral_signup: { icon: Users, label: 'Referral', color: 'text-[#2238ff]', bg: 'bg-[#2238ff]/10' },
    referral_first_purchase: { icon: ShoppingCart, label: 'Referral Bonus', color: 'text-[#2238ff]', bg: 'bg-[#2238ff]/10' },
    referral_first_sale: { icon: Store, label: 'Referral Bonus', color: 'text-[#2238ff]', bg: 'bg-[#2238ff]/10' },
    bid_reward: { icon: Gavel, label: 'Bid Reward', color: 'text-slate-500', bg: 'bg-slate-100' },
    sale_reward: { icon: Tag, label: 'Sale Reward', color: 'text-emerald-600', bg: 'bg-emerald-50' },
};

const MyLedger: React.FC<MyLedgerProps> = ({ onBack }) => {
    const totalEarned = mockLedger.reduce((sum, entry) => sum + entry.amount, 0);

    return (
        <div className="min-h-screen bg-slate-50 pb-24 animate-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-500" />
                    </button>
                    <h1 className="text-sm font-bold text-slate-900">My Ledger</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 md:px-8 pt-6">

                {/* Summary */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm mb-6">
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Earned</p>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-bold text-slate-900">{totalEarned}</span>
                            <span className="text-xs text-slate-400 font-semibold uppercase">GBX</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Transactions</p>
                        <p className="text-2xl font-bold text-slate-900">{mockLedger.length}</p>
                    </div>
                </div>

                {/* Ledger entries */}
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Activity</h3>
                <div className="space-y-2">
                    {mockLedger.map((entry) => {
                        const config = typeConfig[entry.type];
                        const Icon = config.icon;
                        return (
                            <div key={entry.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                                        <Icon size={16} className={config.color} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">{entry.description}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>{config.label}</span>
                                            <span className="text-[10px] text-slate-300">·</span>
                                            <span className="text-[10px] text-slate-400">{entry.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-emerald-600 flex-shrink-0 ml-3">+{entry.amount}</p>
                            </div>
                        );
                    })}
                </div>

                <p className="text-xs text-slate-400 text-center mt-6">
                    Showing all activity. Rewards are finalized weekly.
                </p>

            </div>
        </div>
    );
};

export default MyLedger;
