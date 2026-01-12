
import React, { useState, useEffect } from 'react';
import { COLORS } from './constants';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Hero from './components/Hero';
import AuctionCard from './components/AuctionCard';
import ItemDetail from './components/ItemDetail';
import SearchPage from './components/SearchPage';
import FavoritesPage from './components/FavoritesPage';
import Profile from './components/Profile';
import PublicProfile from './components/PublicProfile';
import PaymentFlow from './components/PaymentFlow';
import AuthModal from './components/AuthModal';
import SubscriptionModal from './components/SubscriptionModal';
import ProfileCompletionModal from './components/ProfileCompletionModal';
import SellLandingModal from './components/SellLandingModal';
import ListingFlowModal from './components/ListingFlowModal';
import LocationPicker, { LocationSettings } from './components/LocationPicker';
import OnboardingModal from './components/OnboardingModal';
import InvoicesPage from './components/InvoicesPage';
import ListingsPage from './components/ListingsPage';
import MembershipPage from './components/MembershipPage';
import DashboardOverview from './components/DashboardOverview';
import ItemDashboard from './components/ItemDashboard';
import ItemBuildProgress from './components/ItemBuildProgress';
import AdminSystem from './components/AdminSystem';
import Footer from './components/Footer';
import GarthAIChat from './components/GarthAIChat';
import ImportantDecisionModal from './components/ImportantDecisionModal';
import BoostSelectionModal from './components/BoostSelectionModal';
import UnreservedContractModal from './components/UnreservedContractModal';
import ReservedContractModal from './components/ReservedContractModal';
import CommunityHub from './components/CommunityHub';
import HammeredPage from './components/HammeredPage';
import HammeredPostPage from './components/HammeredPostPage';
import AuctionRules from './components/AuctionRules';
import MaxBidModal from './components/MaxBidModal';
import { MOCK_AUCTIONS } from './constants';
import { Filter, ChevronDown, BookOpen } from 'lucide-react';
import { ViewState, AuctionItem, RingType } from './types';

export type MembershipTier = 'BUYERS' | 'SNIPER' | 'HAMMER';
export type CharacterType = 'BUYERS' | 'SNIPER' | 'HAMMER';

// Mock seller data for public profile demo
const MOCK_SELLER = {
  name: 'Justin Rogers',
  username: 'justin_bid',
  description: "I love buying and selling stuff on GarthBid.com. It's my favourite marketplace.",
  character: 'SNIPER' as CharacterType,
  membershipTier: 'SNIPER' as MembershipTier,
  listings: 24,
  reviews: { score: 4.9, count: 128 },
  soldPercent: 94,
  pastSales: 156,
};

const CATEGORIES = ['All', 'Vehicles', 'Recreational', 'Equipment', 'Garage Sale', 'Real Estate'];

// Ring configuration for mobile
const RINGS: { id: RingType; emoji: string; label: string }[] = [
  { id: 'UNRESERVED', emoji: '⚔️', label: 'Unreserved' },
  { id: 'RESERVED', emoji: '😬', label: 'Reserved' },
  { id: 'COMING_SOON', emoji: '⏰', label: 'Coming Soon' },
  { id: 'PREVIOUS_SALES', emoji: '💰', label: 'Past Sales' },
];

const App: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Auth & User State
  // Auth flows re-enabled for testing
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Location State
  const [locationSettings, setLocationSettings] = useState<LocationSettings>(() => {
    const saved = localStorage.getItem('garthbid_location');
    return saved ? JSON.parse(saved) : {
      name: 'All locations',
      lat: null,
      lng: null,
      radiusKm: 50,
      country: null
    };
  });

  // Flow Control State
  const [pendingAction, setPendingAction] = useState<'SELL' | null>(null);
  const [pendingListingData, setPendingListingData] = useState<any>(null);

  // Ring State (replaces location)
  const [activeRing, setActiveRing] = useState<RingType>('UNRESERVED');
  const [isMobileRingOpen, setIsMobileRingOpen] = useState(false);

  // Favorites State
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSellLandingOpen, setIsSellLandingOpen] = useState(false);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  // AI Context for item-specific chat
  const [aiContextMessage, setAiContextMessage] = useState<string | null>(null);

  // Membership & Character State
  const [membershipTier, setMembershipTier] = useState<MembershipTier>('BUYERS');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>('BUYERS');

  // Boost Selection Modal
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [selectedAuctionType, setSelectedAuctionType] = useState<'unreserved' | 'reserve' | null>(null);

  // Hammered Newsletter State
  const [activePostSlug, setActivePostSlug] = useState<string | null>(null);

  // Contracts
  const [isUnreservedContractModalOpen, setIsUnreservedContractModalOpen] = useState(false);
  const [isReservedContractModalOpen, setIsReservedContractModalOpen] = useState(false);

  // Max Bid State
  const [isMaxBidModalOpen, setIsMaxBidModalOpen] = useState(false);
  const [activeMaxBidItem, setActiveMaxBidItem] = useState<AuctionItem | null>(null);

  // Persistence for location
  useEffect(() => {
    localStorage.setItem('garthbid_location', JSON.stringify(locationSettings));
  }, [locationSettings]);

  // 🚫 TEMPORARY AUTH BYPASS: Auto-onboarding disabled
  // Uncomment below to restore:
  // useEffect(() => {
  //   const hasOnboarded = localStorage.getItem('garthbid_onboarded');
  //   if (!hasOnboarded) {
  //     const timer = setTimeout(() => setIsOnboardingOpen(true), 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  // --- LOGIC: Sell Item Entry Flow ---

  // 1. Initial Trigger: Open the landing/explainer
  const handleSellClick = () => {
    setIsSellLandingOpen(true);
  };

  // 2. User commits to listing -> Run Checks
  const handleSellLandingContinue = () => {
    setIsSellLandingOpen(false);

    // Auth Check
    if (!isAuthenticated) {
      setPendingAction('SELL');
      setIsAuthModalOpen(true);
      return;
    }

    // Profile Check
    if (!isProfileComplete) {
      setIsProfileModalOpen(true);
      return;
    }

    // Ready to List
    setIsListingModalOpen(true);
  };

  const handleCenterNavClick = () => {
    if (currentView === 'PROFILE') {
      setIsEditingProfile(true);
    } else {
      setCurrentView('AI_CHAT');
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    // Check if we were interrupted during a Sell flow
    if (pendingAction === 'SELL') {
      // Continue Sell Flow: Check Profile
      if (!isProfileComplete) {
        setTimeout(() => {
          setIsProfileModalOpen(true);
        }, 300);
      } else {
        // Ready to list
        setPendingAction(null);
        setIsListingModalOpen(true);
      }
    } else {
      // Standard Login Flow -> Upsell Subscription
      setTimeout(() => {
        setIsSubModalOpen(true);
      }, 300);
    }
  };

  const handleProfileSubmit = (data: any) => {
    console.log('Profile Data:', data);
    setIsProfileComplete(true);
    setIsProfileModalOpen(false);

    // If we were in the middle of a sell flow, finish it
    if (pendingAction === 'SELL') {
      setPendingAction(null);
      setTimeout(() => {
        setIsListingModalOpen(true);
      }, 300);
    }
  };

  const handleListingSubmit = (data: any) => {
    console.log('Intercepting Listing Data for Decision:', data);
    setPendingListingData(data);
    setIsListingModalOpen(false);
    // Trigger Important Decision Modal
    setIsDecisionModalOpen(true);
  };

  const handleDecisionUnreserved = () => {
    console.log('Decision: UNRESERVED - Opening Boost Selection');
    setSelectedAuctionType('unreserved');
    setIsDecisionModalOpen(false);
    setIsBoostModalOpen(true);
  };

  const handleDecisionReserve = () => {
    console.log('Decision: RESERVE - Skipping Boost Selection (Reserved has built-in marketing)');
    setSelectedAuctionType('reserve');
    setIsDecisionModalOpen(false);
    // Skip Boost -> Go straight to Reserved Contract
    setIsReservedContractModalOpen(true);
  };

  const handleBoostSelectionComplete = (boostType: string) => {
    // Save boost selection and move to next step
    // If Unreserved, show contract. Else finish.
    const auctionType = selectedAuctionType; // Use state

    // Safety check - default to reserve just in case, or handle error
    if (!auctionType) {
      console.error("No auction type selected");
      return;
    }

    const finalData = { ...pendingListingData, boostType, auctionType };
    setPendingListingData(finalData);
    setIsBoostModalOpen(false);

    if (auctionType === 'unreserved') {
      setIsUnreservedContractModalOpen(true);
    } else if (auctionType === 'reserve') {
      setIsReservedContractModalOpen(true);
    } else {
      // Fallback
      handleListingComplete(finalData);
    }
  };

  const handleContractSigned = (signature: string) => {
    // Add signature to listing data
    const finalData = {
      ...pendingListingData,
      unreservedContract: {
        signed: true,
        signature,
        timestamp: new Date().toISOString()
      }
    };
    setIsUnreservedContractModalOpen(false);
    handleListingComplete(finalData);
  };

  const handleReservedContractSigned = (signature: string, reservePrice: number) => {
    // Add signature and reserve price to listing data
    const finalData = {
      ...pendingListingData,
      reservePrice,
      reservedContract: {
        signed: true,
        signature,
        timestamp: new Date().toISOString()
      }
    };
    setIsReservedContractModalOpen(false);
    handleListingComplete(finalData);
  };

  const handleListingComplete = (finalData: any) => {
    // 6. Finish listing flow
    console.log('Listing Created:', finalData);

    // Reset Everything
    setPendingAction(null);
    setPendingListingData(null);
    setSelectedAuctionType(null);

    // Show success or navigate to my listings
    // For now just close everything
    alert(`Listing Posted Successfully!`);
  };

  const handleJoinClub = () => {
    setIsSubscribed(true);
    setIsSubModalOpen(false);
  };

  const handleContinueFree = () => {
    setIsSubscribed(false);
    setIsSubModalOpen(false);
  };

  const handleLocationApply = (settings: LocationSettings) => {
    setLocationSettings(settings);
    setIsLocationPickerOpen(false);
  };

  const handleItemClick = (item: AuctionItem) => {
    setSelectedItem(item);
    setCurrentView('ITEM_DETAIL');
  };

  const handleDashboardItemClick = (item: AuctionItem) => {
    setSelectedItem(item);
    // Logic: If item is in build state, show progress page
    if (item.id === '5') { // Mocking ID '5' as the one in construction
      setCurrentView('ITEM_BUILD_PROGRESS');
    } else {
      setCurrentView('ITEM_DASHBOARD');
    }
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBidAttempt = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else if (!isSubscribed) {
      setIsSubModalOpen(true);
    } else {
      alert('Bid placed! (Mock)');
    }
  };

  const handleOpenMaxBid = (item: AuctionItem) => {
    setActiveMaxBidItem(item);
    setIsMaxBidModalOpen(true);
  };

  const handleMaxBidSubmit = (amount: number) => {
    console.log(`Max bid set for ${activeMaxBidItem?.title}: $${amount}`);
    alert(`Success! Max bid of $${amount.toLocaleString()} set for ${activeMaxBidItem?.title}. The system will now bid for you.`);
    setIsMaxBidModalOpen(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'COMMUNITY':
        return <CommunityHub onBack={() => setCurrentView('HOME')} />;
      case 'AUCTION_RULES':
        return <AuctionRules onBack={() => setCurrentView('HOME')} />;
      case 'HAMMERED':
        return (
          <HammeredPage
            onReadPost={(slug) => {
              setActivePostSlug(slug);
              setCurrentView('HAMMERED_POST');
            }}
            onBack={() => setCurrentView('HOME')}
          />
        );
      case 'HAMMERED_POST':
        return activePostSlug ? (
          <HammeredPostPage
            slug={activePostSlug}
            onBack={() => setCurrentView('HAMMERED')}
          />
        ) : (
          <div>Post not found</div>
        );
      case 'ADMIN':
        return <AdminSystem />;
      case 'ITEM_BUILD_PROGRESS':
        return selectedItem ? (
          <ItemBuildProgress item={selectedItem} onClose={() => setCurrentView('LISTINGS')} />
        ) : null;
      case 'ITEM_DASHBOARD':
        return selectedItem ? (
          <ItemDashboard item={selectedItem} onBack={() => setCurrentView('LISTINGS')} />
        ) : null;
      case 'DASHBOARD':
        return null;
      case 'MEMBERSHIP':
        return <MembershipPage onBack={() => setCurrentView('PROFILE')} />;
      case 'INVOICES':
        return <InvoicesPage onBack={() => setCurrentView('PROFILE')} />;
      case 'LISTINGS':
        return (
          <ListingsPage
            onItemClick={handleItemClick}
            isAuthenticated={isAuthenticated}
            isSubscribed={isSubscribed}
            onAuthOpen={() => setIsAuthModalOpen(true)}
            onSubscribeOpen={() => setIsSubModalOpen(true)}
            onGoHome={() => setCurrentView('HOME')}
            onBack={() => setCurrentView('PROFILE')}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onMarketingResults={handleDashboardItemClick}
          />
        );
      case 'FAVS':
        return (
          <FavoritesPage
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onItemClick={handleItemClick}
            isAuthenticated={isAuthenticated}
            isSubscribed={isSubscribed}
            onAuthOpen={() => setIsAuthModalOpen(true)}
            onSubscribeOpen={() => setIsSubModalOpen(true)}
            onGoHome={() => setCurrentView('HOME')}
            onMaxBid={handleOpenMaxBid}
          />
        );
      case 'SEARCH':
        return (
          <SearchPage
            isAuthenticated={isAuthenticated}
            isSubscribed={isSubscribed}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAuthOpen={() => setIsAuthModalOpen(true)}
            onSubscribeOpen={() => setIsSubModalOpen(true)}
            onItemClick={handleItemClick}
          />
        );
      case 'ITEM_DETAIL':
        return selectedItem ? (
          <ItemDetail
            item={selectedItem}
            onBack={() => setCurrentView('HOME')}
            isAuthenticated={isAuthenticated}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onBid={handleBidAttempt}
            onSubscribeOpen={() => setIsSubModalOpen(true)}
            onAIClick={(title) => {
              setAiContextMessage(title);
              setCurrentView('AI_CHAT');
            }}
            onContactSeller={() => setCurrentView('PUBLIC_PROFILE')}
          />
        ) : (
          <div>Item not found</div>
        );
      case 'PROFILE':
        return (
          <Profile
            onInvoicesClick={() => setCurrentView('INVOICES')}
            onListingsClick={() => setCurrentView('LISTINGS')}
            onMembershipClick={() => setCurrentView('MEMBERSHIP')}
            onEditProfileClick={() => setIsProfileModalOpen(true)}
            selectedCharacter={selectedCharacter}
          />
        );
      case 'PUBLIC_PROFILE':
        return (
          <PublicProfile
            seller={MOCK_SELLER}
            onBack={() => setCurrentView('HOME')}
            onContactSeller={() => alert('Contact seller flow - coming soon!')}
          />
        );
      case 'PAYMENT_FLOW':
        return (
          <PaymentFlow
            onBack={() => setCurrentView('HOME')}
            onPaymentComplete={() => setCurrentView('HOME')}
            onViewInvoices={() => setCurrentView('INVOICES')}
          />
        );
      case 'AI_CHAT':
        return (
          <GarthAIChat
            onBack={() => {
              setAiContextMessage(null);
              setCurrentView('HOME');
            }}
            initialMessage={aiContextMessage || undefined}
          />
        );
      case 'HOME':
      default:
        return (
          <div className="p-4 md:p-8 lg:p-12 max-w-[1920px] mx-auto">
            <Hero onSellClick={handleSellClick} onHowItWorksClick={() => setIsOnboardingOpen(true)} />

            {/* Filter Bar - Light & Bold Theme */}
            <div className="sticky top-[56px] md:top-0 z-40 backdrop-blur-md -mx-4 px-4 md:mx-0 md:px-0 mb-4 py-3 md:py-4 md:border-none transition-all" style={{ background: 'rgba(255,255,255,0.9)', borderBottom: `1px solid ${COLORS.border}` }}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className="px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all hover:shadow-sm"
                      style={{
                        background: filter === cat ? COLORS.fireOrange : 'transparent',
                        color: filter === cat ? '#ffffff' : COLORS.textSecondary,
                        border: filter === cat ? `1px solid ${COLORS.fireOrange}` : `1px solid ${COLORS.border}`,
                      }}
                      onMouseEnter={(e) => {
                        if (filter !== cat) {
                          e.currentTarget.style.borderColor = COLORS.textPrimary;
                          e.currentTarget.style.color = COLORS.textPrimary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (filter !== cat) {
                          e.currentTarget.style.borderColor = COLORS.border;
                          e.currentTarget.style.color = COLORS.textSecondary;
                        }
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Filter Icon (Desktop Only) */}
                <button className="hidden md:flex px-3 py-2 rounded-full items-center justify-center transition-all hover:bg-slate-100" style={{ border: `1px solid ${COLORS.border}` }}>
                  <Filter size={18} style={{ color: COLORS.steelGray }} />
                </button>
              </div>
            </div>

            {/* The Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {MOCK_AUCTIONS.map((item) => (
                <AuctionCard
                  key={item.id}
                  item={item}
                  isAuthenticated={isAuthenticated}
                  isSubscribed={isSubscribed}
                  isFavorite={favorites.has(item.id)}
                  onToggleFavorite={() => handleToggleFavorite(item.id)}
                  onAuthOpen={() => setIsAuthModalOpen(true)}
                  onSubscribeOpen={() => setIsSubModalOpen(true)}
                  onClick={handleItemClick}
                />
              ))}
            </div>

            {/* Pagination - Shadcn Style */}
            <div className="flex items-center justify-center gap-1 mt-8 mb-6">
              <button
                className="h-9 px-3 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none"
                style={{ color: COLORS.textSecondary }}
                disabled
              >
                ← Previous
              </button>

              <div className="flex items-center gap-1 mx-2">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${page === 1
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="px-2 text-gray-500">...</span>
                <button className="h-9 w-9 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                  12
                </button>
              </div>

              <button
                className="h-9 px-3 rounded-lg text-sm font-medium transition-colors hover:bg-white/10"
                style={{ color: COLORS.textPrimary }}
              >
                Next →
              </button>
            </div>

            {/* Community Banner - Epic Version */}
            <div
              className="group mt-4 -mb-4 md:-mb-8 lg:-mb-12 py-8 px-6 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                boxShadow: '0 8px 32px rgba(34, 76, 255, 0.15), 0 0 0 1px rgba(255,255,255,0.05)',
              }}
              onClick={() => setCurrentView('COMMUNITY')}
            >
              {/* Animated glow effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(34, 76, 255, 0.15) 0%, transparent 70%)',
                }}
              />
              {/* Shimmer effect */}
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                }}
              />
              {/* Decorative elements */}
              <div className="absolute top-2 left-4 text-2xl opacity-20">💬</div>
              <div className="absolute bottom-2 right-4 text-2xl opacity-20">🚀</div>

              {/* Content */}
              <div className="relative z-10">
                <p className="text-sm text-blue-200/70 mb-2 font-medium">Got a question or want to request a new feature?</p>
                <p className="text-2xl font-display text-white italic tracking-tight flex items-center justify-center gap-3">
                  JOIN THE COMMUNITY
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#224cff] transition-colors duration-300">
                    <span className="text-white text-lg group-hover:translate-x-0.5 transition-transform">→</span>
                  </span>
                </p>
                <p className="text-xs text-blue-300/50 mt-2">5,400+ members • Real-time chat • Vote on features</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: currentView === 'COMMUNITY' ? '#fafafa' : COLORS.voidBlack, color: COLORS.textPrimary }}>
      {currentView !== 'COMMUNITY' && (
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isAuthenticated={isAuthenticated}
          onAuthOpen={() => setIsAuthModalOpen(true)}
          onSellClick={handleSellClick}
          activeRing={activeRing}
          onRingChange={setActiveRing}
          locationName={locationSettings.name}
          onLocationClick={() => setIsLocationPickerOpen(true)}
        />
      )}

      {/* Main Content Area - Shifted right on desktop (except focused pages) */}
      <main
        className={`${currentView !== 'COMMUNITY' ? 'md:ml-[275px]' : ''} min-h-screen ${['ITEM_DETAIL', 'ITEM_DASHBOARD', 'DASHBOARD', 'ITEM_BUILD_PROGRESS', 'PROFILE', 'AI_CHAT', 'COMMUNITY', 'HAMMERED', 'HAMMERED_POST'].includes(currentView) ? '' : 'pb-24'} ${currentView === 'PROFILE' ? 'h-screen overflow-hidden' : ''} md:pb-0`}
        style={currentView === 'COMMUNITY' || currentView === 'HAMMERED' || currentView === 'HAMMERED_POST' ? { background: currentView === 'COMMUNITY' ? '#fafafa' : '#ffffff' } : undefined}
      >

        {/* Mobile Header - Sticky Top, Fixed Height 60px - Hide on Detail/Dashboard pages */}
        {!['ITEM_DETAIL', 'ITEM_DASHBOARD', 'DASHBOARD', 'ITEM_BUILD_PROGRESS', 'ADMIN', 'AI_CHAT', 'COMMUNITY', 'HAMMERED', 'HAMMERED_POST', 'AUCTION_RULES'].includes(currentView) && (
          <div className="md:hidden sticky top-0 z-50 h-[56px] flex items-center justify-between px-3" style={{ background: COLORS.voidBlack, borderBottom: `1px solid ${COLORS.border}` }}>
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('HOME')}>
              <span className="font-display text-[20px]">
                <span style={{ color: COLORS.textPrimary }} className="mr-px">GARTH</span><span style={{ color: COLORS.fireOrange }}>BID</span>
              </span>
            </div>

            {/* Mobile Ring Selector */}
            <div className="relative">
              <button
                onClick={() => setIsMobileRingOpen(!isMobileRingOpen)}
                className="flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-full active:scale-95 transition-all"
                style={{ background: COLORS.surface1, border: `1px solid ${COLORS.border}` }}
              >
                <span className="text-base leading-none">{RINGS.find(r => r.id === activeRing)?.emoji}</span>
                <span className="text-[11px] font-bold" style={{ color: COLORS.textPrimary }}>
                  {RINGS.find(r => r.id === activeRing)?.label}
                </span>
                <ChevronDown size={12} style={{ color: COLORS.steelGray }} className={`transition-transform ${isMobileRingOpen ? 'rotate-180' : ''}`} />
                {/* Red notification dot when location not set */}
                {locationSettings.name === 'All locations' && (
                  <span
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                    style={{ background: '#EF4444' }}
                  />
                )}
              </button>

              {/* Mobile Dropdown */}
              {isMobileRingOpen && (
                <div
                  className="absolute top-full right-0 mt-2 rounded-2xl overflow-hidden z-50 min-w-[220px]"
                  style={{ background: COLORS.voidBlack, border: `1px solid ${COLORS.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                >
                  {RINGS.map((ring) => (
                    <button
                      key={ring.id}
                      onClick={() => {
                        setActiveRing(ring.id);
                        setIsMobileRingOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 transition-all"
                      style={{
                        background: activeRing === ring.id ? `${COLORS.fireOrange}10` : 'transparent',
                        borderLeft: activeRing === ring.id ? `3px solid ${COLORS.fireOrange}` : '3px solid transparent',
                      }}
                    >
                      <span className="text-lg">{ring.emoji}</span>
                      <span
                        className="font-semibold text-sm"
                        style={{ color: activeRing === ring.id ? '#FF3300' : COLORS.textSecondary }}
                      >
                        {ring.label}
                      </span>
                    </button>
                  ))}

                  {/* Choose Your Location Section */}
                  <div style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    <button
                      onClick={() => {
                        setIsMobileRingOpen(false);
                        setIsLocationPickerOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 transition-all hover:bg-white/5"
                    >
                      <span className="text-lg">📍</span>
                      <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>
                        {locationSettings.name === 'All locations' ? 'Choose Your Location' : locationSettings.name}
                      </span>
                      {locationSettings.name === 'All locations' && (
                        <span
                          className="ml-auto w-2 h-2 rounded-full"
                          style={{ background: '#EF4444' }}
                        />
                      )}
                    </button>
                    {/* Read the Rules Link */}
                    <button
                      onClick={() => {
                        setIsMobileRingOpen(false);
                        setCurrentView('AUCTION_RULES');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 transition-all hover:bg-white/5"
                      style={{ borderTop: `1px solid ${COLORS.border}` }}
                    >
                      <BookOpen size={18} className="text-blue-500" />
                      <span className="font-semibold text-sm text-blue-500">
                        Read the rules
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {renderContent()}
        <Footer onViewChange={setCurrentView} />
      </main>

      {/* Hide Mobile Nav on certain views to maximize space */}
      {!['ITEM_DETAIL', 'ITEM_DASHBOARD', 'DASHBOARD', 'ITEM_BUILD_PROGRESS', 'ADMIN', 'AI_CHAT', 'COMMUNITY', 'HAMMERED', 'HAMMERED_POST', 'AUCTION_RULES'].includes(currentView) && (
        <MobileNav
          currentView={currentView}
          onViewChange={setCurrentView}
          onCenterClick={handleCenterNavClick}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      <ProfileCompletionModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setPendingAction(null);
        }}
        onSubmit={handleProfileSubmit}
        membershipTier={membershipTier}
        selectedCharacter={selectedCharacter}
        onSelectCharacter={setSelectedCharacter}
        onUpgrade={(tier) => {
          setMembershipTier(tier);
          // Automatically select the character when upgrading
          setSelectedCharacter(tier);
        }}
      />

      {activeMaxBidItem && (
        <MaxBidModal
          isOpen={isMaxBidModalOpen}
          onClose={() => setIsMaxBidModalOpen(false)}
          currentBid={activeMaxBidItem.currentBid}
          itemTitle={activeMaxBidItem.title}
          itemImage={activeMaxBidItem.imageUrl}
          onSubmit={handleMaxBidSubmit}
        />
      )}

      <SellLandingModal
        isOpen={isSellLandingOpen}
        onClose={() => setIsSellLandingOpen(false)}
        onContinue={handleSellLandingContinue}
      />

      <ListingFlowModal
        isOpen={isListingModalOpen}
        onClose={() => setIsListingModalOpen(false)}
        onSubmit={handleListingSubmit}
      />

      <ImportantDecisionModal
        isOpen={isDecisionModalOpen}
        itemValue={pendingListingData?.price || 0}
        onSelectUnreserved={handleDecisionUnreserved}
        onSelectReserve={handleDecisionReserve}
        onClose={() => setIsDecisionModalOpen(false)}
      />

      <BoostSelectionModal
        isOpen={isBoostModalOpen}
        onClose={() => setIsBoostModalOpen(false)}
        onSelectBoost={handleBoostSelectionComplete}
      />

      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onJoin={handleJoinClub}
        onContinueFree={handleContinueFree}
      />

      <LocationPicker
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onApply={handleLocationApply}
        initialSettings={locationSettings}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
      <UnreservedContractModal
        isOpen={isUnreservedContractModalOpen}
        onClose={() => setIsUnreservedContractModalOpen(false)}
        onConfirm={handleContractSigned}
      />
      <ReservedContractModal
        isOpen={isReservedContractModalOpen}
        onClose={() => setIsReservedContractModalOpen(false)}
        onConfirm={handleReservedContractSigned}
      />
    </div>
  );
};

export default App;
