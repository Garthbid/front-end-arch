
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
  ...Array.from({ length: 60 }).map((_, i) => {
    // Pool of available images from mock-inventory
    const imagePool = [
      { img: '/mock-inventory/42-4-col-tractor-sales.webp', title: 'Heavy Duty Tractor', category: 'Equipment' },
      { img: '/mock-inventory/Flatbed_Truck.webp', title: 'Commercial Flatbed Truck', category: 'Vehicles' },
      { img: '/mock-inventory/PR-MTZ-1523-150-HP.webp', title: 'MTZ 1523 150HP Tractor', category: 'Equipment' },
      { img: '/mock-inventory/2284101-0-6653501.webp', title: 'Industrial Generator Set', category: 'Equipment' }, // Guessing generic industrial
      { img: '/mock-inventory/69d389d5-2707-4e77-bb84-637effb53fd7 (1).webp', title: 'Luxury Estate Vehicle', category: 'Vehicles' },
      { img: '/mock-inventory/default.webp', title: 'Assorted Shop Tools', category: 'Equipment' },
      { img: '/mock-inventory/images (1).jpeg', title: 'Construction Attachment', category: 'Equipment' },
      { img: '/mock-inventory/images.jpeg', title: 'Heavy Machinery Part', category: 'Equipment' },
      { img: '/mock-inventory/img (1).webp', title: 'Miscellaneous Lot', category: 'Collectibles' },
    ];

    const pick = imagePool[i % imagePool.length];

    // Rotate cities
    const cities = ['Toronto, ON', 'Denver, CO', 'Miami, FL', 'Dallas, TX', 'Vancouver, BC', 'Phoenix, AZ', 'Calgary, AB'];

    // Add some variation to the title based on index to avoid 60 identical "Heavy Duty Tractor" items being exactly the same
    const variants = ['(Low Hours)', '(Fleet Maintained)', '(Certified)', '(As-Is)', '(Premium)', ''];
    const variant = variants[i % variants.length];

    return {
      id: `m-${i}`,
      title: `${pick.title} ${variant}`,
      currentBid: 2500 + (Math.floor(Math.random() * 200) * 100), // Random price between 2500 and 22500
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * ((i % 24) + 1)), // Ends in 1 to 24 hours
      imageUrl: pick.img,
      winningBidder: `user_${Math.floor(Math.random() * 999)}`,
      status: 'LIVE',
      location: cities[i % cities.length],
      category: pick.category,
      isUnreserved: i % 3 !== 0,
    };
  })
];

export const RINGS = [
  { id: '1', emoji: '⚔️', label: 'Unreserved', gradient: 'from-orange-500 to-red-600' },
  { id: '2', emoji: '💎', label: 'Luxury', gradient: 'from-blue-500 to-indigo-600' },
  { id: '3', emoji: '🚜', label: 'Equipment', gradient: 'from-amber-500 to-orange-600' },
  { id: '4', emoji: '🚗', label: 'Vehicles', gradient: 'from-emerald-500 to-teal-600' },
  { id: '5', emoji: '🎸', label: 'Collectibles', gradient: 'from-purple-500 to-pink-600' },
];