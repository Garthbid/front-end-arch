
export const COLORS = {
  // New Core Application Palette (Light Mode)
  voidBlack: '#ffffff', // Background is now White
  textPrimary: '#0F172A', // Slate 900 for primary text
  textSecondary: '#475569', // Slate 600 for secondary text
  textMuted: '#94a3b8', // Slate 400 for muted text

  border: '#E2E8F0', // Light border (Slate 200)
  surface1: '#F8FAFC', // Very light slate surface for cards
  surface2: '#F1F5F9', // Slightly darker surface for inputs/hover

  // Accents
  fireOrange: '#224cff', // "Fire Orange" variable mapped to BOLD BLUE accent (reusing variable name to avoid refactoring every file immediately)
  warRed: '#ef4444', // Kept for critical/destructive actions
  steelGray: '#64748b', // Slate 500

  // Legacy mappings for compatibility (mapped to new palette)
  primary: '#224cff', // Bold Blue
  secondary: '#0F172A', // Dark Slate
  accent: '#224cff', // Bold Blue
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
    isUnreserved: true,
  },
];

export const RINGS = [
  { id: '1', emoji: '⚔️', label: 'Unreserved', gradient: 'from-orange-500 to-red-600' },
  { id: '2', emoji: '💎', label: 'Luxury', gradient: 'from-blue-500 to-indigo-600' },
  { id: '3', emoji: '🚜', label: 'Equipment', gradient: 'from-amber-500 to-orange-600' },
  { id: '4', emoji: '🚗', label: 'Vehicles', gradient: 'from-emerald-500 to-teal-600' },
  { id: '5', emoji: '🎸', label: 'Collectibles', gradient: 'from-purple-500 to-pink-600' },
];