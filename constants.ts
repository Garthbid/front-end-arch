
export const COLORS = {
  // New Core Application Palette (Light Mode)
  voidBlack: '#ffffff', // Background is now White
  textPrimary: '#0F172A', // Slate 900 for primary text
  textSecondary: '#475569', // Slate 600 for secondary text
  textMuted: '#94a3b8', // Slate 400 for muted text
  ink: '#0a0a0a', // Near-black for headings

  border: '#E2E8F0', // Light border (Slate 200)
  surface1: '#F8FAFC', // Very light slate surface for cards
  surface2: '#F1F5F9', // Slightly darker surface for inputs/hover

  // Brand Colors
  primary: '#2238ff', // Garth Blue
  accent: '#ff5000', // Garth Orange

  // Accents
  fireOrange: '#ff5000', // Mapped to Garth Orange
  warRed: '#ef4444', // Kept for critical/destructive actions
  steelGray: '#64748b', // Slate 500

  // Legacy mappings for compatibility (mapped to new palette)
  secondary: '#0F172A', // Dark Slate
  background: '#ffffff', // White
  surface: '#F8FAFC', // Light Surface
  text: '#0F172A', // Dark Text

  // Specific UI colors
  success: '#10b981', // Emerald 500
  warning: '#f59e0b', // Amber 500
  error: '#ef4444', // Red 500
  offWhite: '#0F172A', // Mapped to Dark Text for headers that were previously white
};

export const MOCK_AUCTIONS = [
  {
    id: '1',
    title: '2012 John Deere 9860 STS Combine',
    currentBid: 125000,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
    imageUrl: '/item1.jpg',
    winningBidder: 'farm_king_88',
    status: 'LIVE',
    location: 'Saskatoon, SK',
    category: 'Equipment',
    isUnreserved: true,
  },
  {
    id: '2',
    title: '2010 Chevrolet Avalanche LTZ 4WD',
    currentBid: 12500,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    imageUrl: '/item2.jpg',
    winningBidder: 'truck_lover',
    status: 'LIVE',
    location: 'Edmonton, AB',
    category: 'Vehicles',
    isUnreserved: true,
  },
  {
    id: '3',
    title: '2016 Ford Edge Titanium AWD',
    currentBid: 14200,
    endsAt: new Date(Date.now() + 1000 * 60 * 45), // 45 minutes
    imageUrl: '/item3.jpg',
    winningBidder: 'soccer_mom_22',
    status: 'LIVE',
    location: 'Calgary, AB',
    category: 'Vehicles',
    isUnreserved: true,
  },
  {
    id: '4',
    title: '2015 Ford Mustang GT 5.0 Premium',
    currentBid: 28500,
    endsAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
    imageUrl: '/item4.jpg',
    winningBidder: 'speed_freak',
    status: 'LIVE',
    location: 'Vancouver, BC',
    category: 'Vehicles',
    isUnreserved: true,
  },
  {
    id: '5',
    title: '2012 Mazda 5 Grand Touring Minivan',
    currentBid: 6800,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 48), // 2 days
    imageUrl: '/item5.jpg',
    winningBidder: 'value_hunter',
    status: 'LIVE',
    location: 'Winnipeg, MB',
    category: 'Vehicles',
    isUnreserved: true,
  },
  {
    id: '6',
    title: '2019 Airstream Flying Cloud 23FB',
    currentBid: 48000,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 5), // 5 hours
    imageUrl: 'https://images.unsplash.com/photo-1627483252906-8d8a562de80f?auto=format&fit=crop&q=80',
    winningBidder: 'camper_life',
    status: 'LIVE',
    location: 'Denver, CO',
    category: 'Recreational',
    isUnreserved: true,
  },
  {
    id: '7',
    title: '2021 Telsa Model 3 Performance',
    currentBid: 32000,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 12),
    imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80',
    winningBidder: 'ev_fan',
    status: 'LIVE',
    location: 'Austin, TX',
    category: 'Vehicles',
    isUnreserved: false,
  },
  {
    id: '8',
    title: '2018 Jeep Wrangler Unlimited JK',
    currentBid: 24500,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 3),
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80',
    winningBidder: 'trail_blazer',
    status: 'LIVE',
    location: 'Phoenix, AZ',
    category: 'Vehicles',
    isUnreserved: false,
  },
  {
    id: '9',
    title: '2020 Rolex Submariner Date',
    currentBid: 11200,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
    imageUrl: 'https://images.unsplash.com/photo-1547996160-81dfa63595dd?auto=format&fit=crop&q=80',
    winningBidder: 'watch_collector',
    status: 'LIVE',
    location: 'New York, NY',
    category: 'Collectibles',
    isUnreserved: false,
  },
];

export const RINGS = [
  { id: '1', emoji: '⚔️', label: 'Unreserved', gradient: 'from-orange-500 to-red-600' },
  { id: '2', emoji: '💎', label: 'Luxury', gradient: 'from-blue-500 to-indigo-600' },
  { id: '3', emoji: '🚜', label: 'Equipment', gradient: 'from-amber-500 to-orange-600' },
  { id: '4', emoji: '🚗', label: 'Vehicles', gradient: 'from-emerald-500 to-teal-600' },
  { id: '5', emoji: '🎸', label: 'Collectibles', gradient: 'from-purple-500 to-pink-600' },
];