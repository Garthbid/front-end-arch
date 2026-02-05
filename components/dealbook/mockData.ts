import { DealBookEntry, MembershipTier, TIER_FEE_RATES, GST_RATE } from './types';

function createDeal(
  dealId: string,
  itemTitle: string,
  itemPrice: number,
  buyerUsername: string,
  buyerTier: MembershipTier,
  sellerUsername: string,
  sellerTier: MembershipTier,
  isBusinessSale: boolean,
  completedAt: Date,
  isSettled: boolean = false,
  settledAt?: Date,
  settlementBatchId?: string,
  sellerGstNumber?: string
): DealBookEntry {
  const buyerFeeRate = TIER_FEE_RATES[buyerTier];
  const sellerFeeRate = TIER_FEE_RATES[sellerTier];
  const buyerFee = itemPrice * buyerFeeRate;
  const sellerFee = itemPrice * sellerFeeRate;
  const buyerFeeGst = buyerFee * GST_RATE;
  const sellerFeeGst = sellerFee * GST_RATE;
  const itemGst = isBusinessSale ? itemPrice * GST_RATE : 0;
  const buyerTotal = itemPrice + buyerFee + buyerFeeGst + itemGst;
  const sellerPayout = itemPrice - sellerFee - sellerFeeGst;
  const platformRevenue = buyerFee + sellerFee;
  const totalGstCollected = buyerFeeGst + sellerFeeGst + itemGst;

  return {
    dealId, itemTitle, completedAt, itemPrice,
    buyerUsername, buyerTier, buyerFeeRate, buyerFee, buyerFeeGst,
    sellerUsername, sellerTier, sellerFeeRate, sellerFee, sellerFeeGst,
    isBusinessSale, sellerGstNumber, itemGst,
    buyerTotal, sellerPayout, platformRevenue, totalGstCollected,
    isSettled, settledAt, settlementBatchId,
  };
}

export const MOCK_DEALBOOK_ENTRIES: DealBookEntry[] = [
  // 10 Unsettled deals (current week)
  createDeal('DEAL-001', '2019 Honda CRF450R', 10000, 'speed_rider_mike', 'SNIPER', 'moto_deals_john', 'STANDARD', false, new Date('2026-02-03T14:30:00'), false),
  createDeal('DEAL-002', 'Fox Racing Gear Set', 850, 'trail_blazer_92', 'BUYERS', 'gear_warehouse', 'HAMMER', true, new Date('2026-02-03T16:45:00'), false, undefined, undefined, 'GST-789456123'),
  createDeal('DEAL-003', 'KTM 300 EXC Engine', 4500, 'weekend_warrior', 'STANDARD', 'parts_unlimited', 'SNIPER', true, new Date('2026-02-04T09:15:00'), false, undefined, undefined, 'GST-456789012'),
  createDeal('DEAL-004', '2022 Gas Gas EC300', 12500, 'enduro_king', 'HAMMER', 'premium_bikes', 'BUYERS', false, new Date('2026-02-04T11:20:00'), false),
  createDeal('DEAL-005', 'Acerbis Fuel Tank 4.1gal', 320, 'desert_drifter', 'STANDARD', 'parts_unlimited', 'SNIPER', true, new Date('2026-02-04T13:00:00'), false, undefined, undefined, 'GST-456789012'),
  createDeal('DEAL-006', 'Pro Taper Handlebars', 185, 'rookie_rider', 'BUYERS', 'mx_accessories', 'STANDARD', true, new Date('2026-02-04T14:30:00'), false, undefined, undefined, 'GST-852963741'),
  createDeal('DEAL-007', '2021 Husqvarna FC350', 9800, 'mx_pro_racing', 'SNIPER', 'bike_barn_sarah', 'BUYERS', false, new Date('2026-02-04T16:00:00'), false),
  createDeal('DEAL-008', 'Dunlop MX33 Tire Set', 290, 'trail_blazer_92', 'STANDARD', 'tire_depot', 'HAMMER', true, new Date('2026-02-05T09:00:00'), false, undefined, undefined, 'GST-147258369'),
  createDeal('DEAL-009', 'Rekluse Clutch Kit', 1150, 'speed_rider_mike', 'HAMMER', 'clutch_masters', 'STANDARD', true, new Date('2026-02-05T10:30:00'), false, undefined, undefined, 'GST-963852741'),
  createDeal('DEAL-010', '2020 Beta 300RR', 8200, 'enduro_king', 'BUYERS', 'moto_deals_john', 'STANDARD', false, new Date('2026-02-05T12:00:00'), false),

  // Settled deals (previous weeks)
  createDeal('DEAL-011', '2020 Yamaha YZ250F', 8500, 'mx_pro_racing', 'HAMMER', 'bike_barn_sarah', 'BUYERS', false, new Date('2026-01-28T11:00:00'), true, new Date('2026-01-31T17:00:00'), 'BATCH-2026-W05'),
  createDeal('DEAL-012', 'Alpinestars Tech 10 Boots', 620, 'rookie_rider', 'STANDARD', 'gear_warehouse', 'HAMMER', true, new Date('2026-01-29T13:20:00'), true, new Date('2026-01-31T17:00:00'), 'BATCH-2026-W05', 'GST-789456123'),
  createDeal('DEAL-013', 'FMF Exhaust System', 1200, 'speed_rider_mike', 'SNIPER', 'exhaust_experts', 'STANDARD', true, new Date('2026-01-30T15:45:00'), true, new Date('2026-01-31T17:00:00'), 'BATCH-2026-W05', 'GST-321654987'),
  createDeal('DEAL-014', 'Motocross Helmet Shoei VFX', 750, 'trail_blazer_92', 'BUYERS', 'safety_first_shop', 'BUYERS', true, new Date('2026-01-20T10:30:00'), true, new Date('2026-01-24T16:00:00'), 'BATCH-2026-W04', 'GST-159753468'),
  createDeal('DEAL-015', '2018 Suzuki RMZ450', 6800, 'desert_drifter', 'SNIPER', 'moto_deals_john', 'STANDARD', false, new Date('2026-01-21T14:00:00'), true, new Date('2026-01-24T16:00:00'), 'BATCH-2026-W04'),
];

export function calculateAccountBalances(deals: DealBookEntry[]) {
  const unsettledDeals = deals.filter(d => !d.isSettled);
  return {
    trustAccount: unsettledDeals.reduce((sum, d) => sum + d.buyerTotal, 0),
    trustAccountPending: unsettledDeals.length,
    bankAccount: unsettledDeals.reduce((sum, d) => sum + d.platformRevenue, 0),
    gstAccount: unsettledDeals.reduce((sum, d) => sum + d.totalGstCollected, 0),
  };
}
