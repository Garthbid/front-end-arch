import React, { useState, useMemo } from 'react';
import { Deal, DealFilter, DealStatus } from './types';
import { MOCK_DEALS, getActionRequiredCount } from './mockDeals';
import { DealCard } from './DealCard';
import { DealFilters } from './DealFilters';
import { DealDetailSheet } from './DealDetailSheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { ArrowLeft, Search, Filter, CheckCircle2, Building2, AlertTriangle, BookOpen } from 'lucide-react';
import { ViewState } from '../../types';
import { COLORS } from '../../constants';

interface DealFlowPageProps {
  onBack: () => void;
  onNavigate?: (view: ViewState) => void;
}

// Filter and sort deals
const filterDeals = (deals: Deal[], filter: DealFilter): Deal[] => {
  let filtered: Deal[];

  switch (filter) {
    case 'action-required':
      filtered = deals.filter(
        (d) => d.status === 'PAYMENT_RECEIVED' || d.status === 'PAYOUT_REQUESTED'
      );
      break;
    case 'awaiting-payment':
      filtered = deals.filter((d) => d.status === 'AWAITING_PAYMENT');
      break;
    case 'funds-held':
      filtered = deals.filter((d) => d.status === 'FUNDS_HELD' && !d.fundsReleasedAt);
      break;
    case 'funds-released':
      filtered = deals.filter((d) => d.status === 'FUNDS_HELD' && d.fundsReleasedAt);
      break;
    case 'complete':
      filtered = deals.filter((d) => d.status === 'COMPLETE');
      break;
    default:
      filtered = deals;
  }

  // Sort: action-required to top, then by auction end date (newest first)
  return filtered.sort((a, b) => {
    const aUrgent = ['PAYMENT_RECEIVED', 'PAYOUT_REQUESTED'].includes(a.status);
    const bUrgent = ['PAYMENT_RECEIVED', 'PAYOUT_REQUESTED'].includes(b.status);
    if (aUrgent && !bUrgent) return -1;
    if (!aUrgent && bUrgent) return 1;
    return new Date(b.auctionEndedAt).getTime() - new Date(a.auctionEndedAt).getTime();
  });
};

// Search deals
const searchDeals = (deals: Deal[], query: string): Deal[] => {
  if (!query.trim()) return deals;
  const q = query.toLowerCase();
  return deals.filter(
    (d) =>
      d.itemTitle.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      d.buyer.username.toLowerCase().includes(q) ||
      d.seller.username.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q)
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const DealFlowPage: React.FC<DealFlowPageProps> = ({ onBack, onNavigate }) => {
  // State
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [activeFilter, setActiveFilter] = useState<DealFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Confirmation dialogs
  const [confirmAction, setConfirmAction] = useState<{
    type: 'mark-paid' | 'send-payout';
    deal: Deal;
  } | null>(null);

  // Computed values
  const actionRequiredCount = useMemo(() => getActionRequiredCount(deals), [deals]);
  const filteredDeals = useMemo(() => {
    const searched = searchDeals(deals, searchQuery);
    return filterDeals(searched, activeFilter);
  }, [deals, activeFilter, searchQuery]);

  // Handlers
  const handleViewDetails = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsDetailOpen(true);
  };

  const handleMarkPaidClick = (dealId: string) => {
    const deal = deals.find((d) => d.id === dealId);
    if (deal) {
      setConfirmAction({ type: 'mark-paid', deal });
    }
  };

  const handleSendPayoutClick = (dealId: string) => {
    const deal = deals.find((d) => d.id === dealId);
    if (deal) {
      setConfirmAction({ type: 'send-payout', deal });
    }
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    const { type, deal } = confirmAction;
    const now = new Date();

    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== deal.id) return d;

        if (type === 'mark-paid') {
          return {
            ...d,
            status: 'FUNDS_HELD' as DealStatus,
            timeline: [
              ...d.timeline,
              {
                id: `${d.timeline.length + 1}`,
                timestamp: now,
                event: 'Marked as paid by admin',
                actor: 'admin' as const,
              },
            ],
          };
        }

        if (type === 'send-payout') {
          return {
            ...d,
            status: 'COMPLETE' as DealStatus,
            timeline: [
              ...d.timeline,
              {
                id: `${d.timeline.length + 1}`,
                timestamp: now,
                event: 'Payout sent',
                actor: 'admin' as const,
                note: `${formatCurrency(d.sellerPayout)} to ${d.seller.payoutInfo?.bankName || 'bank'} ****${d.seller.payoutInfo?.accountLast4 || '****'}`,
              },
            ],
          };
        }

        return d;
      })
    );

    setConfirmAction(null);
  };

  const handleContactBuyer = (deal: Deal) => {
    window.location.href = `mailto:${deal.buyer.email}?subject=RE: ${deal.itemTitle} (${deal.id})`;
  };

  const handleContactSeller = (deal: Deal) => {
    window.location.href = `mailto:${deal.seller.email}?subject=RE: ${deal.itemTitle} (${deal.id})`;
  };

  const handleRemindSeller = (deal: Deal) => {
    alert(`Reminder sent to @${deal.seller.username} to request their payout for ${deal.itemTitle}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header
        className="sticky top-0 z-40 bg-white border-b"
        style={{ borderColor: COLORS.border }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold text-slate-900">DealFlow</h1>
              {actionRequiredCount > 0 && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                  {actionRequiredCount} action{actionRequiredCount > 1 ? 's' : ''} required
                </span>
              )}
            </div>

            {/* Right: Search + DealBook */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderColor: COLORS.border }}
                />
              </div>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('DEALBOOK')}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                >
                  <BookOpen size={16} />
                  DealBook
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="bg-white border-b" style={{ borderColor: COLORS.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <DealFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            actionRequiredCount={actionRequiredCount}
          />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No deals found</h3>
            <p className="text-slate-500">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : 'No deals match the selected filter'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onMarkPaid={handleMarkPaidClick}
                onSendPayout={handleSendPayoutClick}
                onContactBuyer={handleContactBuyer}
                onContactSeller={handleContactSeller}
                onRemindSeller={handleRemindSeller}
              />
            ))}
          </div>
        )}
      </main>

      {/* Detail Sheet */}
      <DealDetailSheet
        deal={selectedDeal}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onMarkPaid={handleMarkPaidClick}
        onSendPayout={handleSendPayoutClick}
      />

      {/* Confirmation Dialogs */}
      <Dialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent className="sm:max-w-md">
          {confirmAction?.type === 'mark-paid' && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" size={20} />
                  Confirm Payment
                </DialogTitle>
                <DialogDescription>
                  You are confirming that payment has been received for:
                </DialogDescription>
              </DialogHeader>
              <div className="bg-slate-50 rounded-lg p-4 my-4">
                <p className="font-semibold text-slate-900">{confirmAction.deal.itemTitle}</p>
                <p className="text-sm text-slate-500">#{confirmAction.deal.id}</p>
                <p className="text-lg font-bold text-slate-900 mt-2">
                  {formatCurrency(confirmAction.deal.salePrice)}
                </p>
              </div>
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <p>
                  Ensure funds have cleared in the trust account before confirming. This action
                  cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setConfirmAction(null)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmAction} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 size={16} className="mr-2" />
                  Confirm Payment
                </Button>
              </DialogFooter>
            </>
          )}

          {confirmAction?.type === 'send-payout' && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="text-blue-500" size={20} />
                  Send Payout
                </DialogTitle>
                <DialogDescription>
                  You are about to initiate a payout for:
                </DialogDescription>
              </DialogHeader>
              <div className="bg-slate-50 rounded-lg p-4 my-4">
                <p className="font-semibold text-slate-900">{confirmAction.deal.itemTitle}</p>
                <p className="text-sm text-slate-500">#{confirmAction.deal.id}</p>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-slate-600">Payout to:</p>
                  <p className="font-medium text-slate-900">
                    {confirmAction.deal.seller.payoutInfo?.bankName || 'Bank'} ****
                    {confirmAction.deal.seller.payoutInfo?.accountLast4 || '****'}
                  </p>
                  <p className="text-xl font-bold text-emerald-600 mt-2">
                    {formatCurrency(confirmAction.deal.sellerPayout)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <p>
                  Verify bank details are correct. Once sent, this action cannot be reversed.
                </p>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setConfirmAction(null)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmAction} className="bg-[#2238ff] hover:bg-[#1a2bcc]">
                  <Building2 size={16} className="mr-2" />
                  Send Payout
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DealFlowPage;
