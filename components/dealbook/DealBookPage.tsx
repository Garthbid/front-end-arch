import React, { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, Lock, Building2, Receipt, ChevronDown, ChevronUp } from 'lucide-react';
import { COLORS } from '../../constants';
import { DealBookEntry, TIER_LABELS } from './types';
import { MOCK_DEALBOOK_ENTRIES, calculateAccountBalances } from './mockData';

interface DealBookPageProps {
  onBack: () => void;
}

type TabView = 'deals' | 'settlements';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  }).format(value);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatPercent = (rate: number) => `${(rate * 100).toFixed(rate % 0.01 === 0 ? 0 : 2)}%`;

// Account Summary Card
const AccountCard: React.FC<{
  title: string;
  amount: number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, amount, subtitle, icon, color }) => (
  <div className={`rounded-xl p-4 border`} style={{ background: `${color}10`, borderColor: `${color}30` }}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="mt-1 text-2xl font-bold" style={{ color }}>{formatCurrency(amount)}</p>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="p-2 rounded-lg" style={{ background: `${color}20`, color }}>{icon}</div>
    </div>
  </div>
);

// Deal Card
const DealCard: React.FC<{ deal: DealBookEntry; onMarkSettled: (dealId: string) => void }> = ({ deal, onMarkSettled }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: COLORS.border }}>
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">{deal.dealId}</span>
            {deal.isBusinessSale && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">Business</span>
            )}
            {deal.isSettled && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">Settled</span>
            )}
          </div>
          <h3 className="mt-1 font-semibold text-slate-900 truncate">{deal.itemTitle}</h3>
          <p className="text-sm text-slate-500">{formatDate(deal.completedAt)}</p>
        </div>
        <div className="flex items-center gap-4 ml-4">
          <div className="text-right">
            <p className="text-xs text-slate-500">Item</p>
            <p className="font-semibold">{formatCurrency(deal.itemPrice)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-green-600">Bank</p>
            <p className="font-semibold text-green-600">{formatCurrency(deal.platformRevenue)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-amber-600">GST</p>
            <p className="font-semibold text-amber-600">{formatCurrency(deal.totalGstCollected)}</p>
          </div>
          {!deal.isSettled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkSettled(deal.dealId);
              }}
              className="px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Mark Settled
            </button>
          )}
          {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t bg-slate-50 p-4" style={{ borderColor: COLORS.border }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Buyer */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Buyer: {deal.buyerUsername}</h4>
              <p className="text-xs text-slate-500 mb-2">{TIER_LABELS[deal.buyerTier]} ({formatPercent(deal.buyerFeeRate)})</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-slate-600">Item Price</span><span>{formatCurrency(deal.itemPrice)}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Platform Fee</span><span>{formatCurrency(deal.buyerFee)}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">GST on Fee</span><span>{formatCurrency(deal.buyerFeeGst)}</span></div>
                {deal.itemGst > 0 && <div className="flex justify-between"><span className="text-slate-600">GST on Item</span><span>{formatCurrency(deal.itemGst)}</span></div>}
                <div className="flex justify-between font-semibold border-t pt-1 mt-1"><span>Total Paid</span><span className="text-blue-600">{formatCurrency(deal.buyerTotal)}</span></div>
              </div>
            </div>
            {/* Seller */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Seller: {deal.sellerUsername}</h4>
              <p className="text-xs text-slate-500 mb-2">{TIER_LABELS[deal.sellerTier]} ({formatPercent(deal.sellerFeeRate)}){deal.sellerGstNumber && ` • ${deal.sellerGstNumber}`}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-slate-600">Item Price</span><span>{formatCurrency(deal.itemPrice)}</span></div>
                <div className="flex justify-between text-red-600"><span>Platform Fee</span><span>-{formatCurrency(deal.sellerFee)}</span></div>
                <div className="flex justify-between text-red-600"><span>GST on Fee</span><span>-{formatCurrency(deal.sellerFeeGst)}</span></div>
                <div className="flex justify-between font-semibold border-t pt-1 mt-1"><span>Payout</span><span className="text-green-600">{formatCurrency(deal.sellerPayout)}</span></div>
              </div>
            </div>
            {/* Platform */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Platform Split</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-slate-600">Buyer Fee</span><span>{formatCurrency(deal.buyerFee)}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Seller Fee</span><span>{formatCurrency(deal.sellerFee)}</span></div>
                <div className="flex justify-between font-semibold text-green-600 border-t pt-1 mt-1"><span>→ Bank</span><span>{formatCurrency(deal.platformRevenue)}</span></div>
                <div className="mt-3 pt-2 border-t">
                  <div className="flex justify-between"><span className="text-slate-600">GST (Fees)</span><span>{formatCurrency(deal.buyerFeeGst + deal.sellerFeeGst)}</span></div>
                  {deal.itemGst > 0 && <div className="flex justify-between"><span className="text-slate-600">GST (Item)</span><span>{formatCurrency(deal.itemGst)}</span></div>}
                  <div className="flex justify-between font-semibold text-amber-600 pt-1 mt-1"><span>→ GST</span><span>{formatCurrency(deal.totalGstCollected)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Settlement Summary
const SettlementView: React.FC<{ deals: DealBookEntry[] }> = ({ deals }) => {
  // Group by week
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const weekMap = new Map<string, DealBookEntry[]>();
  deals.forEach(deal => {
    const key = getWeekStart(deal.completedAt).toISOString();
    if (!weekMap.has(key)) weekMap.set(key, []);
    weekMap.get(key)!.push(deal);
  });

  const weeks = Array.from(weekMap.entries())
    .map(([key, weekDeals]) => {
      const settledCount = weekDeals.filter(d => d.isSettled).length;
      return {
        weekStart: new Date(key),
        deals: weekDeals,
        revenue: weekDeals.reduce((s, d) => s + d.platformRevenue, 0),
        gst: weekDeals.reduce((s, d) => s + d.totalGstCollected, 0),
        isSettled: weekDeals.every(d => d.isSettled),
        settledCount,
        totalCount: weekDeals.length,
      };
    })
    .sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime());

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900">Weekly Settlements</h3>
      {weeks.map(week => (
        <div key={week.weekStart.toISOString()} className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: COLORS.border }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.border }}>
            <div>
              <h4 className="font-semibold text-slate-900">Week of {formatDate(week.weekStart).split(',')[0]}</h4>
              <p className="text-sm text-slate-500">{week.deals.length} deal{week.deals.length !== 1 ? 's' : ''}</p>
            </div>
            {week.isSettled ? (
              <span className="px-4 py-1.5 text-sm font-medium rounded-lg bg-green-100 text-green-700">Settled</span>
            ) : (
              <span className="px-4 py-1.5 text-sm font-medium rounded-lg bg-red-100 text-red-700">
                Unsettled ({week.settledCount}/{week.totalCount})
              </span>
            )}
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-xs text-slate-500">Deals</p><p className="text-lg font-semibold">{week.deals.length}</p></div>
            <div><p className="text-xs text-slate-500">Seller Payouts</p><p className="text-lg font-semibold">{formatCurrency(week.deals.reduce((s, d) => s + d.sellerPayout, 0))}</p></div>
            <div><p className="text-xs text-green-600">Bank Revenue</p><p className="text-lg font-semibold text-green-700">{formatCurrency(week.revenue)}</p></div>
            <div><p className="text-xs text-amber-600">GST Collected</p><p className="text-lg font-semibold text-amber-700">{formatCurrency(week.gst)}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DealBookPage: React.FC<DealBookPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabView>('deals');
  const [deals, setDeals] = useState<DealBookEntry[]>(MOCK_DEALBOOK_ENTRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'settled'>('all');

  const balances = useMemo(() => calculateAccountBalances(deals), [deals]);

  const filteredDeals = useMemo(() => {
    let result = [...deals];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.dealId.toLowerCase().includes(q) ||
        d.itemTitle.toLowerCase().includes(q) ||
        d.buyerUsername.toLowerCase().includes(q) ||
        d.sellerUsername.toLowerCase().includes(q)
      );
    }
    if (filterStatus === 'pending') result = result.filter(d => !d.isSettled);
    else if (filterStatus === 'settled') result = result.filter(d => d.isSettled);
    return result.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }, [deals, searchQuery, filterStatus]);

  const handleMarkSettled = useCallback((dealIds: string[]) => {
    const batchId = `BATCH-${new Date().getFullYear()}-W${String(Math.ceil(new Date().getDate() / 7)).padStart(2, '0')}`;
    const settledAt = new Date();
    setDeals(prev => prev.map(deal =>
      dealIds.includes(deal.dealId) ? { ...deal, isSettled: true, settledAt, settlementBatchId: batchId } : deal
    ));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: COLORS.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg"><ArrowLeft size={20} /></button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">DealBook</h1>
                <p className="text-sm text-slate-500">Financial Reconciliation</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Account Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <AccountCard title="Trust Account" amount={balances.trustAccount} subtitle={`Pending: ${balances.trustAccountPending} deal${balances.trustAccountPending !== 1 ? 's' : ''}`} icon={<Lock size={24} />} color="#3b82f6" />
          <AccountCard title="Bank Account" amount={balances.bankAccount} subtitle="This week's revenue" icon={<Building2 size={24} />} color="#22c55e" />
          <AccountCard title="GST Account" amount={balances.gstAccount} subtitle="To remit" icon={<Receipt size={24} />} color="#f59e0b" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border mb-6" style={{ borderColor: COLORS.border }}>
          <div className="border-b" style={{ borderColor: COLORS.border }}>
            <nav className="flex">
              <button onClick={() => setActiveTab('deals')} className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'deals' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Deals</button>
              <button onClick={() => setActiveTab('settlements')} className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'settlements' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Settlements</button>
            </nav>
          </div>

          <div className="p-4">
            {activeTab === 'deals' && (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Search deals..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: COLORS.border }}
                  />
                  <div className="flex gap-2">
                    {(['all', 'pending', 'settled'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === status ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {filteredDeals.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">No deals found</div>
                  ) : (
                    filteredDeals.map(deal => (
                      <DealCard
                        key={deal.dealId}
                        deal={deal}
                        onMarkSettled={(dealId) => handleMarkSettled([dealId])}
                      />
                    ))
                  )}
                </div>
              </>
            )}
            {activeTab === 'settlements' && <SettlementView deals={deals} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DealBookPage;
