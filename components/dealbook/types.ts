export type MembershipTier = 'STANDARD' | 'BUYERS' | 'SNIPER' | 'HAMMER';

export const TIER_FEE_RATES: Record<MembershipTier, number> = {
  STANDARD: 0.10,  // 10%
  BUYERS: 0.05,    // 5%
  SNIPER: 0.035,   // 3.5%
  HAMMER: 0.0225,  // 2.25%
};

export const TIER_LABELS: Record<MembershipTier, string> = {
  STANDARD: 'Standard',
  BUYERS: 'Buyers Club',
  SNIPER: 'Sniper Club',
  HAMMER: 'Hammer Club',
};

export const GST_RATE = 0.05; // 5%

export interface DealBookEntry {
  dealId: string;
  itemTitle: string;
  completedAt: Date;
  itemPrice: number;
  buyerUsername: string;
  buyerTier: MembershipTier;
  buyerFeeRate: number;
  buyerFee: number;
  buyerFeeGst: number;
  sellerUsername: string;
  sellerTier: MembershipTier;
  sellerFeeRate: number;
  sellerFee: number;
  sellerFeeGst: number;
  isBusinessSale: boolean;
  sellerGstNumber?: string;
  itemGst: number;
  buyerTotal: number;
  sellerPayout: number;
  platformRevenue: number;
  totalGstCollected: number;
  isSettled: boolean;
  settledAt?: Date;
  settlementBatchId?: string;
}

export interface AccountBalances {
  trustAccount: number;
  trustAccountPending: number;
  bankAccount: number;
  gstAccount: number;
}
