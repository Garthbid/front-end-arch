// DealFlow Types - State machine for auction settlements

export type DealStatus =
  | 'AWAITING_PAYMENT'   // Auction ended. 72hr timer running. Waiting on buyer.
  | 'PAYMENT_RECEIVED'   // Money landed in trust. Admin action: "Mark As Paid"
  | 'FUNDS_HELD'         // Buyer sees "Release Funds". Waiting on buyer.
  | 'PAYOUT_REQUESTED'   // Seller clicked "Get Paid". Admin action: "Send Payout"
  | 'COMPLETE';          // Done. Archived.

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  event: string;
  actor: 'system' | 'buyer' | 'seller' | 'admin';
  note?: string;
}

export interface PayoutInfo {
  bankName: string;
  accountLast4: string;
  routingLast4?: string;
  accountType?: 'checking' | 'savings';
}

export interface Deal {
  id: string;                    // "DEAL-042"
  itemTitle: string;             // "2013 Kawasaki Ranger"
  itemImage?: string;            // Optional image URL
  salePrice: number;             // 14500
  platformFee: number;           // 725 (5%)
  sellerPayout: number;          // 13775

  status: DealStatus;

  auctionEndedAt: Date;
  paymentDeadline: Date;         // auctionEndedAt + 72hrs
  fundsReleasedAt?: Date;        // When buyer released funds (for FUNDS_HELD state)

  buyer: {
    username: string;
    email: string;
    phone?: string;
  };

  seller: {
    username: string;
    email: string;
    phone?: string;
    payoutInfo?: PayoutInfo;
  };

  location: string;              // "Red Deer, AB"

  timeline: TimelineEvent[];     // For audit trail
}

export type DealFilter = 'all' | 'action-required' | 'awaiting-payment' | 'funds-held' | 'funds-released' | 'complete';

// Helper to check if a deal requires admin action
export const isActionRequired = (status: DealStatus): boolean => {
  return status === 'PAYMENT_RECEIVED' || status === 'PAYOUT_REQUESTED';
};

// Helper to get time remaining until payment deadline
export const getTimeRemaining = (deadline: Date): { hours: number; minutes: number; seconds: number; expired: boolean } => {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, expired: false };
};
