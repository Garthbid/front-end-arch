
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
import GarthAIChat from './components/GarthAIChat';
import ImportantDecisionModal from './components/ImportantDecisionModal';
import BoostSelectionModal from './components/BoostSelectionModal';
import { MOCK_AUCTIONS } from './constants';
import { Filter, ChevronDown } from 'lucide-react';
import { ViewState, AuctionItem, RingType } from './types';

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
  // 🚫 TEMPORARY AUTH BYPASS — User "Garth" is always logged in
  // This bypasses all sign-up/sign-in flows until auth is re-introduced.
  // To restore auth: change all `true` values below back to `false`
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(true);

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

  // Boost Selection Modal
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [selectedAuctionType, setSelectedAuctionType] = useState<'unreserved' | 'reserve' | null>(null);

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
    console.log('Decision: RESERVE - Opening Boost Selection');
    setSelectedAuctionType('reserve');
    setIsDecisionModalOpen(false);
    setIsBoostModalOpen(true);
  };

  const handleBoostSelection = (tier: 'FREE' | '$25' | '$50' | '$100' | '$250') => {
    console.log('Final Submission:', {
      ...pendingListingData,
      auctionType: selectedAuctionType,
      boostTier: tier
    });
    setIsBoostModalOpen(false);
    setPendingListingData(null);
    setSelectedAuctionType(null);
    alert(`Listing Posted Successfully!${tier === 'FREE' ? '' : ` Boost: ${tier}`}`);
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

  const renderContent = () => {
    switch (currentView) {
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
            <div className="sticky top-[60px] md:top-0 z-40 backdrop-blur-md -mx-4 px-4 md:mx-0 md:px-0 mb-4 py-3 md:py-4 md:border-none transition-all" style={{ background: 'rgba(255,255,255,0.9)', borderBottom: `1px solid ${COLORS.border}` }}>
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
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: COLORS.voidBlack, color: COLORS.textPrimary }}>
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isAuthenticated={isAuthenticated}
        onAuthOpen={() => setIsAuthModalOpen(true)}
        onSellClick={handleSellClick}
        activeRing={activeRing}
        onRingChange={setActiveRing}
      />

      {/* Main Content Area - Shifted right on desktop */}
      <main className={`md:ml-[275px] min-h-screen ${['ITEM_DETAIL', 'ITEM_DASHBOARD', 'DASHBOARD', 'ITEM_BUILD_PROGRESS', 'PROFILE', 'AI_CHAT'].includes(currentView) ? '' : 'pb-24'} ${currentView === 'PROFILE' ? 'h-screen overflow-hidden' : ''} md:pb-0`}>

        {/* Mobile Header - Sticky Top, Fixed Height 60px - Hide on Detail/Dashboard pages */}
        {!['ITEM_DETAIL', 'ITEM_DASHBOARD', 'DASHBOARD', 'ITEM_BUILD_PROGRESS', 'ADMIN', 'AI_CHAT'].includes(currentView) && (
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
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {renderContent()}
      </main>

      {/* Hide Mobile Nav on certain views to maximize space */}
      {!['ITEM_DETAIL', 'ITEM_DASHBOARD', 'DASHBOARD', 'ITEM_BUILD_PROGRESS', 'ADMIN', 'AI_CHAT'].includes(currentView) && (
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
      />

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
        onSelectBoost={handleBoostSelection}
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
    </div>
  );
};

export default App;
