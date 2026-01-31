
import React, { useState, useEffect, useRef } from 'react';
import { COLORS } from './constants';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import MarketplaceCommandBar from './components/MarketplaceCommandBar';
import MarketplaceModeToggle, { MarketplaceMode } from './components/MarketplaceModeToggle';
import SimpleHeader from './components/SimpleHeader';
import InlineSellCTA from './components/InlineSellCTA';
import AuctionCard from './components/AuctionCard';
import ItemDetail from './components/ItemDetail';
import SearchPage from './components/SearchPage';
import FavoritesPage from './components/FavoritesPage';
import Profile from './components/Profile';
import PublicProfile from './components/PublicProfile';
import PaymentFlow from './components/PaymentFlow';
import AuthModal from './components/AuthModal';
import AgentAuthModal from './components/AgentAuthModal';
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
import GBXWhitepaper from './components/GBXWhitepaper';
import HowRewardsWork from './components/HowRewardsWork';
import MyLedger from './components/MyLedger';
import BankerDashboard from './components/banker/BankerDashboard';
import MaxBidModal from './components/MaxBidModal';
import IdentityCheckModal from './components/IdentityCheckModal';
import GarthAd from './components/GarthAd';
import VerifyToBid from './components/VerifyToBid';
import GarthWelcomeModal from './components/GarthWelcomeModal';
import LaunchPage from './components/LaunchPage';
import WalletPage from './components/WalletPage';
import { GBXAnimationProvider, useEarnGBX } from './components/GBXAnimationProvider';
import ArenaFeatureStrip from './components/ArenaFeatureStrip';
import { MOCK_AUCTIONS } from './constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Filter, Search, ChevronDown, Gavel, Check, Wallet } from 'lucide-react';
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

const CATEGORIES = [
  { id: 'All', label: 'All Items', icon: null },
  { id: 'Vehicles', label: 'Vehicles', icon: '🚗' },
  { id: 'Recreational', label: 'Recreational', icon: '🏕' },
  { id: 'Equipment', label: 'Equipment', icon: '🛠' },
  { id: 'Real Estate', label: 'Real Estate', icon: '🏠' },
  { id: 'Garage Sale', label: 'Garage Sale', icon: '📦' },
];

// Ring configuration for mobile
const RINGS: { id: RingType; emoji: string; label: string }[] = [
  { id: 'UNRESERVED', emoji: '⚔️', label: 'Unreserved' },
  { id: 'RESERVED', emoji: '😬', label: 'Reserved' },
  { id: 'COMING_SOON', emoji: '⏰', label: 'Coming Soon' },
  { id: 'PREVIOUS_SALES', emoji: '💰', label: 'Past Sales' },
];

// Wallet Button with +1 GBX Popup (like "Saved" on favorites)
const WalletButton: React.FC<{
  walletRef: React.RefObject<HTMLDivElement>;
  onClick: () => void;
}> = ({ walletRef, onClick }) => {
  const { walletFlashState } = useEarnGBX();

  return (
    <div ref={walletRef} className="relative">
      <style>{`
        @keyframes gbx-pop {
          0% { opacity: 0; transform: translateY(0) scale(0.8); }
          20% { opacity: 1; transform: translateY(-4px) scale(1); }
          80% { opacity: 1; transform: translateY(-4px) scale(1); }
          100% { opacity: 0; transform: translateY(-12px) scale(0.9); }
        }
        .animate-gbx-pop {
          animation: gbx-pop 0.8s ease-in-out forwards;
        }
      `}</style>
      <button
        onClick={onClick}
        aria-label="Open Wallet"
        className="w-8 h-8 rounded-tight flex items-center justify-center active:scale-95 transition-all hover:bg-slate-100"
        style={{
          background: '#ffffff',
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <Wallet size={16} className="text-slate-700" />
      </button>

      {/* +1 GBX Popup - Left of wallet, slightly overlapping */}
      {walletFlashState === 'flashing' && (
        <div
          className="absolute top-1/2 right-full -translate-y-1/2 -mr-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md whitespace-nowrap z-50 animate-gbx-pop text-white"
          style={{ background: '#ff5000' }}
        >
          💰 +1 GBX
        </div>
      )}
    </div>
  );
};



const App: React.FC = () => {
  // Items State (Lifted from constants for runtime updates)
  const [items, setItems] = useState<AuctionItem[]>(MOCK_AUCTIONS);

  const handleUpdateItem = (updatedItem: AuctionItem) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const [filter, setFilter] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || 'All';
  });

  // Marketplace Mode State (UNRESERVED / RESERVED)
  const [marketplaceMode, setMarketplaceMode] = useState<MarketplaceMode>(() => {
    // 1. Check URL
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode')?.toUpperCase();
    if (modeParam === 'UNRESERVED' || modeParam === 'RESERVED') return modeParam as MarketplaceMode;

    // 2. Check localStorage
    const saved = localStorage.getItem('garthbid_marketplace_mode');
    if (saved === 'UNRESERVED' || saved === 'RESERVED') return saved as MarketplaceMode;

    return 'UNRESERVED';
  });

  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => Math.min(prev + 12, items.length));
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [items.length]);

  // Sync mode and category to URL and localStorage
  useEffect(() => {
    localStorage.setItem('garthbid_marketplace_mode', marketplaceMode);
    const url = new URL(window.location.href);
    url.searchParams.set('mode', marketplaceMode.toLowerCase());

    // Category sync
    if (filter === 'All') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', filter.toLowerCase());
    }

    window.history.replaceState({}, '', url.toString());
  }, [marketplaceMode, filter]);

  // Site Gate: Check if unlocked via secret code
  const [isSiteUnlocked, setIsSiteUnlocked] = useState(() => {
    return localStorage.getItem('garthbid_unlocked') === 'true';
  });

  // Default to LAUNCH (gate page) if not unlocked, HOME if unlocked
  const [currentView, setCurrentView] = useState<ViewState>(isSiteUnlocked ? 'HOME' : 'LAUNCH');
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Auth & User State
  // Auth flows re-enabled for testing
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isBidVerified, setIsBidVerified] = useState(false);
  const [hasSkippedBidVerification, setHasSkippedBidVerification] = useState(false);
  const [hasSeenGarthWelcome, setHasSeenGarthWelcome] = useState(false);
  const [isGarthWelcomeOpen, setIsGarthWelcomeOpen] = useState(false);

  // Handler to unlock the site
  const handleSiteUnlock = () => {
    setIsSiteUnlocked(true);
    setCurrentView('HOME');
  };


  // ... 

  // Modals


  // ...





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

  // Financing State (Lifted from FavoritesPage)
  const [financingStates, setFinancingStates] = useState<Record<string, any>>({});

  // Load financing state
  useEffect(() => {
    const loadedStates: Record<string, any> = {};
    MOCK_AUCTIONS.forEach(item => {
      const key = `garthbid_financing_${item.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        loadedStates[item.id] = JSON.parse(saved);
      } else {
        loadedStates[item.id] = { unlocked: false, preapproved: false, apr: null };
      }
    });
    setFinancingStates(loadedStates);
  }, []);

  const handleUpdateFinancingState = (itemId: string, newState: any) => {
    setFinancingStates(prev => ({
      ...prev,
      [itemId]: newState
    }));
    localStorage.setItem(`garthbid_financing_${itemId}`, JSON.stringify(newState));
  };

  // Flow Control State
  const [pendingAction, setPendingAction] = useState<'SELL' | null>(null);
  const [pendingListingData, setPendingListingData] = useState<any>(null);

  // Ring State (replaces location)
  const [activeRing, setActiveRing] = useState<RingType>('UNRESERVED');
  const [isMobileRingOpen, setIsMobileRingOpen] = useState(false);

  // Favorites State
  // (State declared below)

  // Community State
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [highlightAIInSubModal, setHighlightAIInSubModal] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSellLandingOpen, setIsSellLandingOpen] = useState(false);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isIdentityCheckModalOpen, setIsIdentityCheckModalOpen] = useState(false);
  const [isAgentAuthOpen, setIsAgentAuthOpen] = useState(false);



  // AI Context for item-specific chat
  const [aiContextMessage, setAiContextMessage] = useState<string | null>(null);
  const [showIntelligenceReport, setShowIntelligenceReport] = useState(false);

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
      handleGarthAIRequest();
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
      // Standard Login Flow
      // We do NOT auto-open identity check anymore. User must click "BID" to trigger it.
      // if (!isBidVerified && !hasSkippedBidVerification) {
      //   setIsIdentityCheckModalOpen(true);
      // }
    }
  };

  const handleAgentAuthSuccess = (agentUsername: string) => {
    // Grant 100 GBX welcome bonus via localStorage (provider reads from localStorage on mount)
    const currentBalance = parseInt(localStorage.getItem('gbxBalance') || '0', 10);
    localStorage.setItem('gbxBalance', String(currentBalance + 100));

    setIsAuthenticated(true);
    setIsAgentAuthOpen(false);
    setIsAuthModalOpen(false);

    // Redirect to home/auctions
    setCurrentView('HOME');
  };

  const handleVerificationSuccess = () => {
    setIsBidVerified(true);
    setHasSkippedBidVerification(false);
    setIsIdentityCheckModalOpen(false);
    // setCurrentView('HOME'); // Not needed if just closing modal
    alert('✅ Verified — you can now bid.'); // Or better: Toast
  };

  const handleVerificationSkip = () => {
    setHasSkippedBidVerification(true);
    setCurrentView('HOME');
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
    } else if (!isBidVerified) {
      setIsIdentityCheckModalOpen(true);
    } else {
      alert('Bid placed! (Mock)');
    }
  };

  const handleIdentityVerified = () => {
    setIsBidVerified(true);
    setIsIdentityCheckModalOpen(false);
    // Post-verification upsell removed. 
    // New Flow: User stays on home, Red dot appears on AI button.
  };

  const handleGarthAIRequest = () => {
    // Go directly to AI chat
    setCurrentView('AI_CHAT');
  };

  const [invoicesBackView, setInvoicesBackView] = useState<ViewState>('WALLET');
  const [whitepaperBackView, setWhitepaperBackView] = useState<ViewState>('AUCTION_RULES');

  const handleViewChangeRequest = (view: ViewState) => {
    if (view === 'AI_CHAT') {
      handleGarthAIRequest();
    } else {
      // If navigating to Invoices from Sidebar (or general nav), go back to Profile
      if (view === 'INVOICES') {
        setInvoicesBackView('PROFILE');
      }
      setCurrentView(view);
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

  // Keyboard shortcut for Banker Mode (Shift + B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'B' && currentView !== 'BANKER') {
        setCurrentView('BANKER');
      }
      if (e.shiftKey && e.key === 'A' && currentView !== 'ADMIN') {
        setCurrentView('ADMIN');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  const renderContent = () => {
    switch (currentView) {
      case 'COMMUNITY':
        return <CommunityHub onBack={() => setCurrentView('HOME')} />;
      case 'AUCTION_RULES':
        return <AuctionRules onBack={() => setCurrentView('HOME')} onNavigate={setCurrentView} />;
      case 'GBX_WHITEPAPER':
        return <GBXWhitepaper onBack={() => setCurrentView(whitepaperBackView)} />;
      case 'MY_LEDGER':
        return <MyLedger onBack={() => setCurrentView('WALLET')} />;
      case 'HOW_REWARDS_WORK':
        return <HowRewardsWork onBack={() => setCurrentView('WALLET')} onNavigate={(view) => {
          if (view === 'GBX_WHITEPAPER') setWhitepaperBackView('HOW_REWARDS_WORK');
          setCurrentView(view);
        }} />;
      case 'HAMMERED':
        return <HammeredPage onBack={() => setCurrentView('HOME')} onViewPost={(id) => {
          setSelectedPostId(id);
          setCurrentView('HAMMERED_POST');
        }} />;
      case 'VERIFY_TO_BID':
        return (
          <VerifyToBid
            onVerify={() => {
              setIsBidVerified(true);
              setCurrentView('AI_CHAT');
            }}
            onSkip={() => setCurrentView('HOME')}
          />
        );
      case 'HAMMERED_POST':
        return activePostSlug ? (
          <HammeredPostPage postId={selectedPostId!} onBack={() => setCurrentView('HAMMERED')} />
        ) : (
          <div>Post not found</div>
        );
      case 'ADMIN':
        return <AdminSystem items={items} onUpdateItem={handleUpdateItem} onBack={() => setCurrentView('HOME')} />;
      case 'BANKER':
        return <BankerDashboard onBack={() => setCurrentView('HOME')} />;
      case 'ITEM_BUILD_PROGRESS':
        return selectedItem ? (
          <ItemBuildProgress
            item={selectedItem}
            onBack={() => setCurrentView('ITEM_DASHBOARD')}
            onViewListing={() => {
              // Switch to live listing
              setCurrentView('ITEM_DETAIL');
            }}
          />
        ) : null;
      case 'ITEM_DASHBOARD':
        return selectedItem ? (
          <ItemDashboard
            item={selectedItem}
            onBack={() => setCurrentView('PROFILE')}
          />
        ) : null;
      case 'DASHBOARD':
        return null;
      case 'MEMBERSHIP':
        return (
          <MembershipPage
            onBack={() => setCurrentView('PROFILE')}
            onUpgrade={(tier) => {
              setMembershipTier(tier);
              if (tier === 'sniper') setSelectedCharacter('SNIPER');
              else if (tier === 'hammer') setSelectedCharacter('HAMMER');
              else setSelectedCharacter('BUYERS'); // Default/Buyers
            }}
          />
        );
      case 'WALLET':
        return (
          <WalletPage
            onBack={() => setCurrentView('HOME')}
            onViewInvoices={() => {
              setInvoicesBackView('WALLET');
              setCurrentView('INVOICES');
            }}
            onNavigate={(view) => {
              if (view === 'GBX_WHITEPAPER') setWhitepaperBackView('WALLET');
              setCurrentView(view);
            }}
          />
        );
      case 'INVOICES':
        return <InvoicesPage onBack={() => setCurrentView(invoicesBackView)} />;
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
            isBidVerified={isBidVerified}
            onVerify={handleBidAttempt}
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
            onMaxBid={(item) => {
              setActiveMaxBidItem(item);
              setIsMaxBidModalOpen(true);
            }}
            items={items}
            financingStates={financingStates}
            onUpdateFinancingState={handleUpdateFinancingState}
            isBidVerified={isBidVerified}
            onVerify={handleBidAttempt}
          />
        );
      case 'SEARCH':
        return (
          <SearchPage
            isAuthenticated={isAuthenticated}
            isSubscribed={isSubscribed}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSubscribeOpen={() => setIsSubModalOpen(true)}
            onItemClick={handleItemClick}
            isBidVerified={isBidVerified}
            onVerify={handleBidAttempt}
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
            isBidVerified={isBidVerified}
            onVerify={handleBidAttempt}
            onSubscribeOpen={() => setIsSubModalOpen(true)}
            onAIClick={() => {
              setAiContextMessage(null);
              setShowIntelligenceReport(true); // Show Intelligence Report upsell
              setCurrentView('AI_CHAT');
            }}
            onContactSeller={() => setIsProfileModalOpen(true)} // Or public profile
            onMaxBid={handleOpenMaxBid}
          />
        ) : (
          <div>Item not found</div>
        );
      case 'PROFILE':
        return (
          <Profile
            onInvoicesClick={() => {
              setInvoicesBackView('PROFILE');
              setCurrentView('INVOICES');
            }}
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
              setShowIntelligenceReport(false);
              setCurrentView('HOME');
              // If they back out, we assume they've "seen" the welcome enough to clear the dot?
              // Or should we only clear it if they interact? 
              // User requirement: "On close: set hasSeenGarthWelcome = true"
              // So if they back out of chat, we set it true.
              if (isBidVerified && !hasSeenGarthWelcome) {
                setHasSeenGarthWelcome(true);
              }
            }}
            initialMessage={aiContextMessage || undefined}
            showWelcomeFlow={!aiContextMessage && !showIntelligenceReport}
            showIntelligenceReport={showIntelligenceReport}
            onWelcomeComplete={() => setHasSeenGarthWelcome(true)}
            onNavigate={(view) => {
              setHasSeenGarthWelcome(true);
              setCurrentView(view);
            }}
          />
        );
      case 'LAUNCH':
        return <LaunchPage onUnlock={handleSiteUnlock} />;
      case 'HOME':
      default:
        return (
          <div className="max-w-[1920px] mx-auto mt-[120px] md:mt-0">
            <MarketplaceCommandBar
              mode={marketplaceMode}
              onModeChange={setMarketplaceMode}
              category={filter}
              onCategoryChange={setFilter}
              categories={CATEGORIES}
              onListClick={handleSellClick}
              locationName={locationSettings.name}
              onLocationClick={() => setIsLocationPickerOpen(true)}
              onWalletClick={() => setCurrentView('WALLET')}
            />

            {/* Arena Feature Strip - Cinematic Moment */}
            <ArenaFeatureStrip />

            <div className="px-4 pt-3 pb-4 md:px-8 md:pt-4 md:pb-4 lg:px-12 lg:pb-12">
              {(() => {
                const filteredItems = items.filter(item => {
                  const modeMatch = marketplaceMode === 'UNRESERVED' ? item.isUnreserved : !item.isUnreserved;
                  const categoryMatch = filter === 'All' ||
                    (item.category === filter) ||
                    (!item.category && item.title.toLowerCase().includes(filter.toLowerCase()));
                  return modeMatch && categoryMatch;
                });

                return (
                  <>
                    {/* The Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                      {filteredItems.slice(0, visibleCount).map((item, index) => {
                        // Strictly enforce frequencies: every 10 on mobile, every 20 on desktop
                        // 10 is a safe multiple for both 2-col (mobile) and 5-col (desktop) layouts
                        const showAd = (index + 1) % 10 === 0;
                        let adElement = null;

                        if (showAd) {
                          const adGroup = Math.ceil((index + 1) / 20);
                          const adVariant = adGroup % 2 !== 0 ? 'COMMUNITY' : 'BUYERS_CLUB';

                          const isDesktopVisible = (index + 1) % 20 === 0;

                          adElement = (
                            <div className={isDesktopVisible ? 'my-3 col-span-full' : 'my-3 col-span-full block md:hidden'}>
                              <GarthAd
                                variant={adVariant}
                                onAction={() => setCurrentView(adVariant === 'COMMUNITY' ? 'COMMUNITY' : 'MEMBERSHIP')}
                              />
                            </div>
                          );
                        }

                        return (
                          <React.Fragment key={item.id}>
                            <AuctionCard
                              item={item}
                              isAuthenticated={isAuthenticated}
                              isBidVerified={isBidVerified}
                              isSubscribed={isSubscribed}
                              isFavorite={favorites.has(item.id)}
                              onToggleFavorite={() => handleToggleFavorite(item.id)}
                              onAuthOpen={() => setIsAuthModalOpen(true)}
                              onSubscribeOpen={() => setIsSubModalOpen(true)}
                              onClick={handleItemClick}
                              financingState={financingStates[item.id]}
                              onVerify={handleBidAttempt}
                            />
                            {adElement}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {filteredItems.length === 0 && (
                      <div className="col-span-full py-20 text-center">
                        <p className="text-xl font-bold text-slate-900 mb-2">No {marketplaceMode.toLowerCase()} auctions found</p>
                        <p className="text-slate-500">Try changing categories or switch modes.</p>
                      </div>
                    )}

                    {/* Loader Trigger - Infinite Scroll */}
                    <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-4">
                      {visibleCount < filteredItems.length && (
                        <div className={"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"}></div>
                      )}
                    </div>
                  </>
                );
              })()}



            </div>
          </div>

        );
    }
  };
  const walletRef = useRef<HTMLDivElement>(null);

  return (
    <GBXAnimationProvider onViewWallet={() => setCurrentView('INVOICES')}>
      <div className="min-h-screen font-sans" style={{ background: currentView === 'COMMUNITY' || currentView === 'LAUNCH' ? '#fafafa' : COLORS.voidBlack, color: COLORS.textPrimary }}>
        {currentView !== 'COMMUNITY' && currentView !== 'VERIFY_TO_BID' && currentView !== 'LAUNCH' && (
          <Sidebar
            currentView={currentView}
            onViewChange={handleViewChangeRequest}
            isAuthenticated={isAuthenticated}
            onAuthOpen={() => setIsAuthModalOpen(true)}
            onSellClick={handleSellClick}
            activeRing={activeRing}
            onRingChange={setActiveRing}
            locationName={locationSettings.name}
            onLocationClick={() => setIsLocationPickerOpen(true)}
            showGarthRedDot={isBidVerified && !hasSeenGarthWelcome}
          />
        )}

        {/* Main Content Area - Shifted right on desktop (except focused pages) */}
        <main
          className={`${currentView !== 'COMMUNITY' && currentView !== 'VERIFY_TO_BID' && currentView !== 'LAUNCH' ? 'md:ml-[220px]' : ''} min-h-screen ${['ITEM_DETAIL', 'ITEM_DASHBOARD', 'DASHBOARD', 'ITEM_BUILD_PROGRESS', 'PROFILE', 'AI_CHAT', 'COMMUNITY', 'HAMMERED', 'HAMMERED_POST', 'VERIFY_TO_BID', 'LAUNCH'].includes(currentView) ? '' : 'pb-24'} ${currentView === 'PROFILE' ? 'h-screen overflow-hidden' : ''} md:pb-0`}
          style={currentView === 'COMMUNITY' || currentView === 'HAMMERED' || currentView === 'HAMMERED_POST' || currentView === 'VERIFY_TO_BID' ? { background: currentView === 'COMMUNITY' || currentView === 'VERIFY_TO_BID' ? '#fafafa' : '#ffffff' } : undefined}
        >

          {/* Mobile Header - Fixed Top, Height 56px - Hide on Detail/Dashboard pages */}
          {!['ITEM_DETAIL', 'ITEM_DASHBOARD', 'DASHBOARD', 'ITEM_BUILD_PROGRESS', 'ADMIN', 'AI_CHAT', 'COMMUNITY', 'HAMMERED', 'HAMMERED_POST', 'AUCTION_RULES', 'GBX_WHITEPAPER', 'HOW_REWARDS_WORK', 'MY_LEDGER', 'BANKER', 'VERIFY_TO_BID', 'LAUNCH', 'WALLET', 'INVOICES'].includes(currentView) && (
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-[56px] flex items-center justify-between px-3" style={{ background: COLORS.voidBlack, borderBottom: `1px solid ${COLORS.border}` }}>
              <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('HOME')}>
                <img
                  src="/garth-logo.png"
                  alt="GarthBid"
                  className="h-5 w-auto object-contain"
                />
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* List My Item Button (Mobile Header) */}
                <button
                  onClick={handleSellClick}
                  className="h-8 px-4 rounded-tight bg-[#2238ff] hover:bg-[#1a2dbb] text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-lg shadow-blue-900/20 leading-none"
                >
                  <span className="text-sm -mt-0.5">+</span> List My Item
                </button>

                {/* Mobile Wallet Button with Flash Animation */}
                <WalletButton walletRef={walletRef} onClick={() => setCurrentView('WALLET')} />
              </div>
            </div>
          )}

          {renderContent()}
          {currentView !== 'BANKER' && currentView !== 'AI_CHAT' && currentView !== 'LAUNCH' && <Footer onViewChange={setCurrentView} />}

        </main >

        {/* Hide Mobile Nav on certain views to maximize space */}
        {
          !['ITEM_DETAIL', 'ITEM_DASHBOARD', 'DASHBOARD', 'ITEM_BUILD_PROGRESS', 'ADMIN', 'AI_CHAT', 'COMMUNITY', 'HAMMERED', 'HAMMERED_POST', 'AUCTION_RULES', 'GBX_WHITEPAPER', 'HOW_REWARDS_WORK', 'MY_LEDGER', 'BANKER', 'LAUNCH', 'MEMBERSHIP'].includes(currentView) && (
            <MobileNav
              currentView={currentView}
              onViewChange={handleViewChangeRequest}
              onCenterClick={handleCenterNavClick}
              showGarthRedDot={isBidVerified && !hasSeenGarthWelcome}
            />
          )
        }

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {
            setIsAuthModalOpen(false);
            setPendingAction(null);
          }}
          onSuccess={handleAuthSuccess}
          onAgentClick={() => {
            setIsAuthModalOpen(false);
            setIsAgentAuthOpen(true);
          }}
        />

        <AgentAuthModal
          isOpen={isAgentAuthOpen}
          onClose={() => setIsAgentAuthOpen(false)}
          onSuccess={handleAgentAuthSuccess}
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

        {
          activeMaxBidItem && (
            <MaxBidModal
              isOpen={isMaxBidModalOpen}
              onClose={() => setIsMaxBidModalOpen(false)}
              currentBid={(() => {
                const fState = financingStates[activeMaxBidItem.id];
                if (fState?.unlocked && fState?.apr) {
                  const principal = activeMaxBidItem.currentBid;
                  const rate = fState.apr / 100;
                  const years = 5;
                  const r = rate / 12;
                  const n = years * 12;
                  const monthlyPayment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                  return Math.round((monthlyPayment * 12) / 26);
                }
                return activeMaxBidItem.currentBid;
              })()}
              financingState={financingStates[activeMaxBidItem.id]}
              hasLoanStructure={!!activeMaxBidItem.loanStructure}
              itemTitle={activeMaxBidItem.title}
              itemImage={activeMaxBidItem.imageUrl}
              onSubmit={handleMaxBidSubmit}
            />
          )
        }

        <SellLandingModal
          isOpen={isSellLandingOpen}
          onClose={() => setIsSellLandingOpen(false)}
          onContinue={handleSellLandingContinue}
          onRulesClick={() => setCurrentView('AUCTION_RULES')}
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
          onClose={() => {
            setIsSubModalOpen(false);
            setHighlightAIInSubModal(false);
          }}
          onJoin={handleJoinClub}
          onContinueFree={handleContinueFree}
          highlightAI={highlightAIInSubModal}
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

        <IdentityCheckModal
          isOpen={isIdentityCheckModalOpen}
          onClose={() => {
            setIsIdentityCheckModalOpen(false);
            setHasSkippedBidVerification(true); // Treat close as skip for auto-logic
          }}
          onVerified={handleVerificationSuccess}
        />

        <GarthWelcomeModal
          isOpen={isGarthWelcomeOpen}
          onClose={() => {
            setIsGarthWelcomeOpen(false);
            setHasSeenGarthWelcome(true);
          }}
          onJoinClub={() => {
            setIsGarthWelcomeOpen(false);
            setHasSeenGarthWelcome(true);
            setCurrentView('MEMBERSHIP');
          }}
          onCommunity={() => {
            setIsGarthWelcomeOpen(false);
            setHasSeenGarthWelcome(true);
            setCurrentView('COMMUNITY');
          }}
          onRules={() => {
            setIsGarthWelcomeOpen(false);
            setHasSeenGarthWelcome(true);
            setCurrentView('AUCTION_RULES');
          }}
        />
      </div>
    </GBXAnimationProvider>
  );
};

export default App;
