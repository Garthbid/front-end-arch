import { Deal, DealStatus } from './types';

// Helper to create dates relative to now
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000);
const hoursFromNow = (hours: number) => new Date(Date.now() + hours * 60 * 60 * 1000);

export const MOCK_DEALS: Deal[] = [
  // PAYMENT_RECEIVED - Admin needs to mark as paid
  {
    id: 'DEAL-042',
    itemTitle: '2013 Kawasaki Ranger',
    itemImage: '/mock-inventory/PR-MTZ-1523-150-HP.webp',
    salePrice: 14500,
    platformFee: 725,
    sellerPayout: 13775,
    status: 'PAYMENT_RECEIVED',
    auctionEndedAt: hoursAgo(48),
    paymentDeadline: hoursFromNow(24),
    buyer: {
      username: 'dev_wizard',
      email: 'dev_wizard@email.com',
      phone: '(403) 555-1234',
    },
    seller: {
      username: 'farm_king_88',
      email: 'farm_king@email.com',
      phone: '(780) 555-5678',
    },
    location: 'Red Deer, AB',
    timeline: [
      { id: '1', timestamp: hoursAgo(48), event: 'Auction ended', actor: 'system' },
      { id: '2', timestamp: hoursAgo(24), event: 'Payment received via e-Transfer', actor: 'buyer', note: '$14,500 CAD' },
    ],
  },

  // PAYOUT_REQUESTED - Admin needs to send payout
  {
    id: 'DEAL-041',
    itemTitle: '2019 Ford F-150 Lariat',
    itemImage: '/mock-inventory/Flatbed_Truck.webp',
    salePrice: 42000,
    platformFee: 2100,
    sellerPayout: 39900,
    status: 'PAYOUT_REQUESTED',
    auctionEndedAt: hoursAgo(120),
    paymentDeadline: hoursAgo(48),
    buyer: {
      username: 'truck_hunter',
      email: 'truckhunter@email.com',
    },
    seller: {
      username: 'dealership_pro',
      email: 'sales@dealershippro.com',
      phone: '(587) 555-9012',
      payoutInfo: {
        bankName: 'TD Canada Trust',
        accountLast4: '4521',
        accountType: 'checking',
      },
    },
    location: 'Calgary, AB',
    timeline: [
      { id: '1', timestamp: hoursAgo(120), event: 'Auction ended', actor: 'system' },
      { id: '2', timestamp: hoursAgo(96), event: 'Payment received', actor: 'buyer' },
      { id: '3', timestamp: hoursAgo(72), event: 'Marked as paid', actor: 'admin' },
      { id: '4', timestamp: hoursAgo(48), event: 'Funds released by buyer', actor: 'buyer' },
      { id: '5', timestamp: hoursAgo(12), event: 'Payout requested', actor: 'seller', note: 'Bank info submitted' },
    ],
  },

  // AWAITING_PAYMENT - Timer running
  {
    id: 'DEAL-043',
    itemTitle: 'John Deere 5075E Tractor',
    itemImage: '/mock-inventory/42-4-col-tractor-sales.webp',
    salePrice: 35000,
    platformFee: 1750,
    sellerPayout: 33250,
    status: 'AWAITING_PAYMENT',
    auctionEndedAt: hoursAgo(24),
    paymentDeadline: hoursFromNow(48),
    buyer: {
      username: 'farm_fresh_99',
      email: 'farmfresh@email.com',
    },
    seller: {
      username: 'equipment_depot',
      email: 'sales@equipmentdepot.ca',
    },
    location: 'Edmonton, AB',
    timeline: [
      { id: '1', timestamp: hoursAgo(24), event: 'Auction ended', actor: 'system' },
      { id: '2', timestamp: hoursAgo(23), event: 'Payment reminder sent', actor: 'system' },
    ],
  },

  // AWAITING_PAYMENT - Timer almost expired
  {
    id: 'DEAL-044',
    itemTitle: 'Vintage Gibson Les Paul 1959',
    itemImage: '/mock-inventory/img (1).webp',
    salePrice: 8500,
    platformFee: 425,
    sellerPayout: 8075,
    status: 'AWAITING_PAYMENT',
    auctionEndedAt: hoursAgo(70),
    paymentDeadline: hoursFromNow(2),
    buyer: {
      username: 'guitar_collector',
      email: 'collector@email.com',
    },
    seller: {
      username: 'music_man',
      email: 'music@email.com',
    },
    location: 'Vancouver, BC',
    timeline: [
      { id: '1', timestamp: hoursAgo(70), event: 'Auction ended', actor: 'system' },
      { id: '2', timestamp: hoursAgo(46), event: 'Payment reminder sent', actor: 'system' },
      { id: '3', timestamp: hoursAgo(22), event: 'Final payment reminder sent', actor: 'system' },
    ],
  },

  // FUNDS_HELD - Buyer released, waiting on seller to claim
  {
    id: 'DEAL-040',
    itemTitle: 'Bobcat S650 Skid Steer',
    itemImage: '/mock-inventory/images (1).jpeg',
    salePrice: 28000,
    platformFee: 1400,
    sellerPayout: 26600,
    status: 'FUNDS_HELD',
    auctionEndedAt: hoursAgo(168),
    paymentDeadline: hoursAgo(96),
    fundsReleasedAt: hoursAgo(48), // Buyer released 2 days ago, seller hasn't claimed
    buyer: {
      username: 'construction_joe',
      email: 'joe@constructionco.com',
      phone: '(306) 555-3456',
    },
    seller: {
      username: 'heavy_equipment_ltd',
      email: 'sales@heavyequipment.ca',
    },
    location: 'Saskatoon, SK',
    timeline: [
      { id: '1', timestamp: hoursAgo(168), event: 'Auction ended', actor: 'system' },
      { id: '2', timestamp: hoursAgo(120), event: 'Payment received', actor: 'buyer' },
      { id: '3', timestamp: hoursAgo(96), event: 'Marked as paid', actor: 'admin' },
      { id: '4', timestamp: hoursAgo(48), event: 'Funds released by buyer', actor: 'buyer' },
    ],
  },

  // FUNDS_HELD - Waiting on buyer to release (no fundsReleasedAt)
  {
    id: 'DEAL-046',
    itemTitle: '2017 Polaris RZR XP 1000',
    itemImage: '/mock-inventory/images.jpeg',
    salePrice: 18500,
    platformFee: 925,
    sellerPayout: 17575,
    status: 'FUNDS_HELD',
    auctionEndedAt: hoursAgo(96),
    paymentDeadline: hoursAgo(24),
    // No fundsReleasedAt - buyer hasn't released yet
    buyer: {
      username: 'dune_rider',
      email: 'dunerider@email.com',
      phone: '(403) 555-7890',
    },
    seller: {
      username: 'powersports_plus',
      email: 'sales@powersportsplus.ca',
    },
    location: 'Lethbridge, AB',
    timeline: [
      { id: '1', timestamp: hoursAgo(96), event: 'Auction ended', actor: 'system' },
      { id: '2', timestamp: hoursAgo(72), event: 'Payment received', actor: 'buyer' },
      { id: '3', timestamp: hoursAgo(48), event: 'Marked as paid', actor: 'admin' },
    ],
  },

  // COMPLETE - Archived
  {
    id: 'DEAL-039',
    itemTitle: '2020 Sea-Doo Spark Trixx',
    itemImage: '/mock-inventory/69d389d5-2707-4e77-bb84-637effb53fd7 (1).webp',
    salePrice: 9200,
    platformFee: 460,
    sellerPayout: 8740,
    status: 'COMPLETE',
    auctionEndedAt: hoursAgo(336),
    paymentDeadline: hoursAgo(264),
    buyer: {
      username: 'lake_life',
      email: 'lakelife@email.com',
    },
    seller: {
      username: 'marina_sales',
      email: 'sales@marina.com',
      payoutInfo: {
        bankName: 'RBC Royal Bank',
        accountLast4: '7890',
        accountType: 'checking',
      },
    },
    location: 'Kelowna, BC',
    timeline: [
      { id: '1', timestamp: hoursAgo(336), event: 'Auction ended', actor: 'system' },
      { id: '2', timestamp: hoursAgo(312), event: 'Payment received', actor: 'buyer' },
      { id: '3', timestamp: hoursAgo(288), event: 'Marked as paid', actor: 'admin' },
      { id: '4', timestamp: hoursAgo(240), event: 'Funds released', actor: 'buyer' },
      { id: '5', timestamp: hoursAgo(216), event: 'Payout requested', actor: 'seller' },
      { id: '6', timestamp: hoursAgo(192), event: 'Payout sent', actor: 'admin', note: '$8,740 to RBC ****7890' },
    ],
  },

  // Another COMPLETE
  {
    id: 'DEAL-038',
    itemTitle: 'Snap-On Tool Chest (Complete Set)',
    itemImage: '/mock-inventory/default.webp',
    salePrice: 4200,
    platformFee: 210,
    sellerPayout: 3990,
    status: 'COMPLETE',
    auctionEndedAt: hoursAgo(480),
    paymentDeadline: hoursAgo(408),
    buyer: {
      username: 'mechanic_mike',
      email: 'mike@garagepro.com',
    },
    seller: {
      username: 'retiring_tech',
      email: 'tech@email.com',
    },
    location: 'Winnipeg, MB',
    timeline: [
      { id: '1', timestamp: hoursAgo(480), event: 'Auction ended', actor: 'system' },
      { id: '2', timestamp: hoursAgo(456), event: 'Payment received', actor: 'buyer' },
      { id: '3', timestamp: hoursAgo(432), event: 'Marked as paid', actor: 'admin' },
      { id: '4', timestamp: hoursAgo(408), event: 'Funds released', actor: 'buyer' },
      { id: '5', timestamp: hoursAgo(384), event: 'Payout requested', actor: 'seller' },
      { id: '6', timestamp: hoursAgo(360), event: 'Payout sent', actor: 'admin' },
    ],
  },

  // PAYMENT_RECEIVED - Another one needing action
  {
    id: 'DEAL-045',
    itemTitle: '2018 Can-Am Outlander 850',
    itemImage: '/mock-inventory/images.jpeg',
    salePrice: 11500,
    platformFee: 575,
    sellerPayout: 10925,
    status: 'PAYMENT_RECEIVED',
    auctionEndedAt: hoursAgo(36),
    paymentDeadline: hoursFromNow(36),
    buyer: {
      username: 'trail_rider',
      email: 'trailrider@email.com',
    },
    seller: {
      username: 'atv_world',
      email: 'sales@atvworld.ca',
    },
    location: 'Prince George, BC',
    timeline: [
      { id: '1', timestamp: hoursAgo(36), event: 'Auction ended', actor: 'system' },
      { id: '2', timestamp: hoursAgo(12), event: 'Payment received via wire transfer', actor: 'buyer' },
    ],
  },
];

// Get count of action required deals
export const getActionRequiredCount = (deals: Deal[]): number => {
  return deals.filter(d => d.status === 'PAYMENT_RECEIVED' || d.status === 'PAYOUT_REQUESTED').length;
};
