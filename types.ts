
import React from 'react';

export type AuctionStatus = 'FEATURED' | 'UNRESERVED' | 'PENDING' | 'SOLD' | 'NOT_SOLD' | 'LIVE' | 'SCHEDULED' | 'ENDED' | null;

export type RingType = 'UNRESERVED' | 'RESERVED' | 'COMING_SOON' | 'PREVIOUS_SALES';

export type ViewState = 'HOME' | 'SEARCH' | 'FAVS' | 'PROFILE' | 'PUBLIC_PROFILE' | 'PAYMENT_FLOW' | 'ITEM_DETAIL' | 'INVOICES' | 'LISTINGS' | 'MEMBERSHIP' | 'DASHBOARD' | 'ITEM_DASHBOARD' | 'ITEM_BUILD_PROGRESS' | 'ADMIN' | 'AI_CHAT';

export interface AuctionItem {
  id: string;
  title: string;
  imageUrl: string;
  currentBid: number;
  winningBidder: string; // username or handle
  endsAt: Date;
  bids: number;
  location: string;
  status?: AuctionStatus;
  isBuildInProgress?: boolean;
}
