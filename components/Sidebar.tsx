import React from 'react';
import { Home, Search, Flame, User, ChevronDown, ShieldAlert, Zap, Sparkles, BookOpen } from 'lucide-react';
import { COLORS } from '../constants';
import { ViewState, RingType } from '../types';

// Ring configuration with item counts
const RINGS: { id: RingType; emoji: string; label: string; count: string }[] = [
  { id: 'UNRESERVED', emoji: '⚔️', label: 'UNRESERVED', count: '127' },
  { id: 'RESERVED', emoji: '😬', label: 'RESERVED', count: '47' },
  { id: 'COMING_SOON', emoji: '⏰', label: 'COMING SOON', count: '65' },
  { id: 'PREVIOUS_SALES', emoji: '💰', label: 'PAST SALES', count: '13,456' },
];

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  isAuthenticated?: boolean;
  onAuthOpen?: () => void;
  onSellClick?: () => void;
  activeRing: RingType;
  onRingChange: (ring: RingType) => void;
  locationName: string;
  onLocationClick: () => void;
  showGarthRedDot?: boolean;
}

// Custom icon wrapper for consistent branding
const GarthIcon: React.FC<{
  icon: React.ElementType;
  size?: number;
  active?: boolean;
  className?: string;
}> = ({ icon: Icon, size = 22, active, className = '' }) => (
  <Icon
    size={size}
    strokeWidth={active ? 2.5 : 2.25}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-all duration-200 ${className}`}
  />
);

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isAuthenticated,
  onAuthOpen,
  activeRing,
  onRingChange,
  locationName,
  onLocationClick,
  showGarthRedDot
}) => {
  const [isRingDropdownOpen, setIsRingDropdownOpen] = React.useState(false);
  const activeRingConfig = RINGS.find(r => r.id === activeRing) || RINGS[0];
  const hasLocationSet = locationName !== 'All locations';

  return (
    <aside
      className="hidden md:flex flex-col w-[275px] h-screen fixed left-0 top-0 z-50 p-6"
      style={{
        background: COLORS.voidBlack,
        borderRight: `1px solid ${COLORS.border}`,
      }}
    >
      {/* Top Section: Logo & Status */}
      <div className="flex-grow">
        {/* Logo - GARTH in blue, BID in orange */}
        <div className="mb-6 px-2 flex items-center cursor-pointer" onClick={() => onViewChange('HOME')}>
          <img
            src="/garth-logo.png"
            alt="GARTHBID"
            className="h-5 w-auto object-contain transition-transform hover:scale-105 active:scale-95 duration-300"
          />
        </div>

        {/* Mode Selector - Quiet Premium Control */}
        <div className="mb-4 mx-1 relative group">
          {/* Tooltip - only shows on hover */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50"
            style={{
              background: COLORS.surface2,
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              minWidth: '170px'
            }}
          >
            <div className="text-xs font-medium mb-0.5" style={{ color: COLORS.textPrimary }}>
              {activeRing === 'UNRESERVED' ? 'Unreserved Mode' : activeRingConfig.label}
            </div>
            <div className="text-[10px]" style={{ color: COLORS.textMuted }}>
              {activeRing === 'UNRESERVED'
                ? 'No safety net. Highest bidder wins.'
                : activeRing === 'RESERVED'
                  ? 'Seller sets minimum price.'
                  : activeRing === 'COMING_SOON'
                    ? 'Preview upcoming auctions.'
                    : 'Browse completed sales.'}
            </div>
            {/* Tooltip arrow */}
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderBottom: `5px solid ${COLORS.border}`,
              }}
            />
          </div>

          <button
            onClick={() => setIsRingDropdownOpen(!isRingDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group/btn"
            style={{
              background: COLORS.surface1,
              border: activeRing === 'UNRESERVED'
                ? '1px solid rgba(59, 130, 246, 0.25)'
                : `1px solid ${COLORS.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.surface2;
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = COLORS.surface1;
              e.currentTarget.style.borderColor = activeRing === 'UNRESERVED'
                ? 'rgba(59, 130, 246, 0.25)'
                : COLORS.border;
            }}
          >
            <div className="flex items-center gap-2.5">
              {/* Status dot - active indicator (no pulse on idle) */}
              <div
                className="w-2 h-2 rounded-full transition-all duration-200"
                style={{
                  background: activeRing === 'UNRESERVED' ? '#3B82F6' : COLORS.steelGray,
                  opacity: activeRing === 'UNRESERVED' ? 1 : 0.5,
                }}
              />
              {/* Icon - reduced opacity on idle, hover rotation */}
              <span
                className="text-base transition-all duration-200 group-hover/btn:rotate-3"
                style={{ opacity: 0.8 }}
              >
                {activeRingConfig.emoji}
              </span>
              <span
                className="text-sm transition-all duration-200 group-hover/btn:translate-x-px"
                style={{
                  color: COLORS.textSecondary,
                  fontWeight: 500,
                }}
              >
                {activeRingConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {!hasLocationSet && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#EF4444' }}
                />
              )}
              <ChevronDown
                size={14}
                style={{ color: COLORS.steelGray, opacity: 0.7 }}
                className={`transition-transform duration-200 ${isRingDropdownOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </button>

          {/* Dropdown - opens downward */}
          {isRingDropdownOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50 shadow-xl"
              style={{
                background: COLORS.surface1,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              {RINGS.map((ring) => (
                <button
                  key={ring.id}
                  onClick={() => {
                    onRingChange(ring.id);
                    setIsRingDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 transition-all duration-150"
                  style={{
                    background: activeRing === ring.id ? `${COLORS.primary}10` : 'transparent',
                    borderLeft: activeRing === ring.id ? `3px solid ${COLORS.primary}` : '3px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (activeRing !== ring.id) {
                      e.currentTarget.style.background = COLORS.surface2;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = activeRing === ring.id ? `${COLORS.primary}10` : 'transparent';
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{ring.emoji}</span>
                    <span
                      className="font-medium text-sm"
                      style={{ color: activeRing === ring.id ? COLORS.primary : COLORS.textSecondary }}
                    >
                      {ring.label}
                    </span>
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: COLORS.textMuted }}
                  >
                    {ring.count}
                  </span>
                </button>
              ))}

              {/* Choose Your Location Section */}
              <div style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <button
                  onClick={() => {
                    setIsRingDropdownOpen(false);
                    onLocationClick();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-150"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = COLORS.surface2;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span className="text-lg">📍</span>
                  <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>
                    {hasLocationSet ? locationName : 'Choose Your Location'}
                  </span>
                  {!hasLocationSet && (
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

        {/* Nav Links */}
        <nav className="space-y-1">
          <NavItem
            icon={Home}
            label="Home"
            active={currentView === 'HOME'}
            onClick={() => onViewChange('HOME')}
          />
          <NavItem
            icon={Search}
            label="Search"
            active={currentView === 'SEARCH'}
            onClick={() => onViewChange('SEARCH')}
          />
          <div className="relative">
            <NavItem
              icon={Sparkles}
              label="GarthAI"
              active={currentView === 'AI_CHAT'}
              onClick={() => onViewChange('AI_CHAT')}
            />
            {showGarthRedDot && (
              <span className="absolute top-3 left-9 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0F1115]" />
            )}
          </div>
          <NavItem
            icon={Flame}
            label="Favorites"
            active={currentView === 'FAVS'}
            onClick={() => onViewChange('FAVS')}
          />
          <NavItem
            icon={User}
            label="Profile"
            active={currentView === 'PROFILE'}
            onClick={() => onViewChange('PROFILE')}
          />
        </nav>
      </div>

      {/* Bottom Section: Admin & Profile */}
      <div className="space-y-4">

        {/* Subtle Admin Entry */}
        <button
          onClick={() => onViewChange('AUCTION_RULES')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-200"
          style={{
            background: currentView === 'AUCTION_RULES' ? COLORS.surface2 : 'transparent',
            color: currentView === 'AUCTION_RULES' ? COLORS.textPrimary : COLORS.textMuted,
          }}
        >
          <BookOpen size={12} strokeWidth={3} />
          Read Auction Rules
        </button>

        {/* User Mini Profile */}
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
          onClick={() => onViewChange('PROFILE')}
          style={{
            background: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = COLORS.surface1;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <img src="https://picsum.photos/100/100" alt="User" className="w-11 h-11 rounded-full object-cover" style={{ border: `2px solid ${COLORS.border}` }} />
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-none mb-1" style={{ color: COLORS.textPrimary }}>
              {isAuthenticated ? 'Garth Rogers' : 'Guest User'}
            </span>
            <span className="text-[10px] font-medium" style={{ color: COLORS.textMuted }}>
              {isAuthenticated ? '@garth_bid' : 'Sign in to bid'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className="w-full relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-base transition-all duration-200 group"
    style={{
      background: active ? `${COLORS.primary}15` : 'transparent',
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.background = COLORS.surface1;
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = active ? `${COLORS.primary}15` : 'transparent';
    }}
  >
    {/* Active indicator - left accent bar with Command Blue */}
    {active && (
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full"
        style={{
          background: COLORS.primary,
          boxShadow: `0 0 8px ${COLORS.primary}60`
        }}
      />
    )}

    <div
      className="transition-all duration-200"
      style={{
        color: active ? COLORS.primary : COLORS.steelGray,
        filter: active ? `drop-shadow(0 1px 3px ${COLORS.primary}40)` : 'none'
      }}
    >
      <GarthIcon icon={Icon} size={22} active={active} />
    </div>

    <span
      className="transition-all duration-200"
      style={{
        fontWeight: active ? 700 : 500,
        color: active ? COLORS.textPrimary : COLORS.textSecondary,
        letterSpacing: active ? '0.01em' : '0'
      }}
    >
      {label}
    </span>
  </button>
);

export default Sidebar;
