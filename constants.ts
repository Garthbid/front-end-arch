
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
  ...Array.from({ length: 120 }).map((_, i) => {
    const categories = ['Vehicles', 'Equipment', 'Recreational', 'Collectibles', 'Real Estate'];
    const category = categories[i % categories.length];

    const pool = {
      Vehicles: [
        { title: '2022 Dodge Ram 1500', img: '/example-images/ram-truck.jpg' },
        { title: '2023 Toyota RAV4 Hybrid', img: '/example-images/toyota-rav4.jpg' },
        { title: '2022 Porsche 911 GT3', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800' },
        { title: '1969 Ford Mustang Boss 429', img: 'https://images.unsplash.com/photo-1584345604325-f5091269a0d1?auto=format&fit=crop&q=80&w=800' },
        { title: '2023 Tesla Cybertruck Foundation', img: 'https://images.unsplash.com/photo-1695653422718-cc856453982e?auto=format&fit=crop&q=80&w=800' },
        { title: '2021 Land Rover Defender 110', img: 'https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?auto=format&fit=crop&q=80&w=800' },
      ],
      Equipment: [
        { title: 'Bobcat T300 Compact Loader', img: '/example-images/bobcat.jpg' },
        { title: 'John Deere 6155R Tractor', img: '/example-images/tractor.jpg' },
        { title: 'Caterpillar D5 Dozer', img: '/example-images/dozer.jpg' },
        { title: 'Caterpillar D11 Dozer', img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c15d?auto=format&fit=crop&q=80&w=800' },
        { title: 'Komatsu PC210LC Excavator', img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800' },
        { title: 'Case IH Steiger 620', img: 'https://images.unsplash.com/photo-1530268577195-a3528876c243?auto=format&fit=crop&q=80&w=800' },
      ],
      Recreational: [
        { title: '2024 Bowlus Heritage Edition', img: 'https://images.unsplash.com/photo-1627483252906-8d8a562de80f?auto=format&fit=crop&q=80&w=800' },
        { title: 'Yamaha SuperJet Stand-Up', img: 'https://images.unsplash.com/photo-1551816230-ef5deaede41c?auto=format&fit=crop&q=80&w=800' },
        { title: '2023 Sea-Doo GTX Limited', img: 'https://images.unsplash.com/photo-1647891938250-754ad796f2b9?auto=format&fit=crop&q=80&w=800' },
        { title: 'Harley-Davidson Fat Boy 114', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800' },
        { title: 'Grand Design Momentum G-Class', img: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800' },
        { title: 'Airstream Flying Cloud 23FB', img: 'https://images.unsplash.com/photo-1517030330234-94c4fa9fc8ca?auto=format&fit=crop&q=80&w=800' },
      ],
      Collectibles: [
        { title: 'Rolex Daytona "Paul Newman"', img: 'https://images.unsplash.com/photo-1547996160-81dfa63595dd?auto=format&fit=crop&q=80&w=800' },
        { title: 'Hermès Birkin 35 Blue', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800' },
        { title: 'Vintage Gibson Les Paul 1959', img: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&q=80&w=800' },
        { title: 'Signed Michael Jordan Jersey', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800' },
        { title: 'Patek Philippe Nautilus 5711', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
        { title: 'Rare Charizard Holographic', img: 'https://images.unsplash.com/photo-1613771404721-1f92d799e49f?auto=format&fit=crop&q=80&w=800' },
      ],
      'Real Estate': [
        { title: 'Modern Cliffside Villa', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
        { title: 'A-Frame Mountain Cabin', img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800' },
        { title: 'Downtown Glass Penthouse', img: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=800' },
        { title: 'Sustainable Desert Retreat', img: 'https://images.unsplash.com/photo-1449156001437-37c6416dfec1?auto=format&fit=crop&q=80&w=800' },
        { title: 'Historic European Chateau', img: 'https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?auto=format&fit=crop&q=80&w=800' },
        { title: 'Luxury Lakefront Lodge', img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800' },
      ]
    }[category as keyof typeof pool];

    const pick = pool[i % pool.length];
    const cities = ['Toronto, ON', 'Denver, CO', 'Miami, FL', 'Dallas, TX', 'Vancouver, BC', 'Phoenix, AZ', 'Calgary, AB'];

    return {
      id: `m-${i}`,
      title: pick.title,
      currentBid: 5000 + (Math.floor(Math.random() * 100) * 1000),
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * (i + 1)),
      imageUrl: pick.img,
      winningBidder: `user_${Math.floor(Math.random() * 99)}`,
      status: 'LIVE',
      location: cities[i % cities.length],
      category: category,
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