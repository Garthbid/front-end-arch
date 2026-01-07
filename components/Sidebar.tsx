import React from 'react';
import { Home, Search, Flame, User, ChevronDown, ShieldAlert, Zap, Sparkles } from 'lucide-react';
import { COLORS } from '../constants';
import { ViewState, RingType } from '../types';

// Ring configuration
const RINGS: { id: RingType; emoji: string; label: string }[] = [
  { id: 'UNRESERVED', emoji: '⚔️', label: 'UNRESERVED' },
  { id: 'RESERVED', emoji: '😬', label: 'RESERVED' },
  { id: 'COMING_SOON', emoji: '⏰', label: 'COMING SOON' },
  { id: 'PREVIOUS_SALES', emoji: '💰', label: 'PAST SALES' },
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
  onLocationClick
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
        {/* Logo - All White */}
        <div className="mb-6 px-2 flex items-center cursor-pointer" onClick={() => onViewChange('HOME')}>
          <span className="text-2xl font-display tracking-tight transition-transform hover:scale-105 active:scale-95 duration-300">
            <span style={{ color: COLORS.textPrimary }} className="mr-px">GARTH</span><span style={{ color: COLORS.fireOrange }}>BID</span>
          </span>
        </div>

        {/* Status Module */}
        <div
          className="mb-6 mx-1 px-4 py-3 rounded-2xl"
          style={{
            background: COLORS.surface1,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: COLORS.fireOrange,
                boxShadow: `0 0 8px ${COLORS.fireOrange}`,
              }}
            />
            <span style={{ color: COLORS.textSecondary }} className="text-xs font-semibold">Auctions Live</span>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <Flame size={14} style={{ color: COLORS.fireOrange }} strokeWidth={2.5} />
            <span style={{ color: COLORS.textMuted }} className="text-xs font-medium">127 items ending today</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} style={{ color: COLORS.steelGray }} strokeWidth={2.5} />
            <span style={{ color: COLORS.textMuted }} className="text-[10px] font-medium">Next drop: Every Monday</span>
          </div>
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
          <NavItem
            icon={Sparkles}
            label="GarthAI"
            active={currentView === 'AI_CHAT'}
            onClick={() => onViewChange('AI_CHAT')}
          />
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
          onClick={() => onViewChange('ADMIN')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-200"
          style={{
            background: currentView === 'ADMIN' ? COLORS.surface2 : 'transparent',
            color: currentView === 'ADMIN' ? COLORS.textPrimary : COLORS.textMuted,
          }}
        >
          <ShieldAlert size={12} strokeWidth={3} />
          Internal Admin
        </button>

        {/* Mode Selector - Premium "War Room" Control */}
        <div className="mx-1 relative group">
          {/* Tooltip */}
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50"
            style={{
              background: COLORS.surface2,
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              minWidth: '180px'
            }}
          >
            <div className="text-xs font-bold mb-1" style={{ color: COLORS.textPrimary }}>
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
              className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `6px solid ${COLORS.border}`,
              }}
            />
          </div>

          <button
            onClick={() => setIsRingDropdownOpen(!isRingDropdownOpen)}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl cursor-pointer transition-all duration-200 group/btn"
            style={{
              background: activeRing === 'UNRESERVED'
                ? 'rgba(59, 130, 246, 0.12)'
                : COLORS.surface1,
              border: activeRing === 'UNRESERVED'
                ? '1px solid rgba(59, 130, 246, 0.3)'
                : `1px solid ${isRingDropdownOpen ? 'rgba(59, 130, 246, 0.5)' : COLORS.border}`,
              boxShadow: activeRing === 'UNRESERVED'
                ? 'inset 0 1px 0 rgba(255,255,255,0.05), 0 0 20px rgba(59, 130, 246, 0.15)'
                : 'inset 0 1px 0 rgba(255,255,255,0.02)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = activeRing === 'UNRESERVED'
                ? 'rgba(59, 130, 246, 0.18)'
                : COLORS.surface2;
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = activeRing === 'UNRESERVED'
                ? 'rgba(59, 130, 246, 0.12)'
                : COLORS.surface1;
              e.currentTarget.style.borderColor = activeRing === 'UNRESERVED'
                ? 'rgba(59, 130, 246, 0.3)'
                : isRingDropdownOpen ? 'rgba(59, 130, 246, 0.5)' : COLORS.border;
            }}
          >
            <div className="flex items-center gap-3">
              {/* Status dot - live indicator */}
              <div className="relative">
                <div
                  className={`w-2 h-2 rounded-full ${activeRing === 'UNRESERVED' ? 'animate-pulse' : ''}`}
                  style={{
                    background: activeRing === 'UNRESERVED' ? '#3B82F6' : COLORS.steelGray,
                    boxShadow: activeRing === 'UNRESERVED' ? '0 0 8px rgba(59, 130, 246, 0.6)' : 'none',
                  }}
                />
              </div>
              {/* Icon with hover rotation */}
              <span
                className="text-lg transition-transform duration-200 group-hover/btn:rotate-6"
              >
                {activeRingConfig.emoji}
              </span>
              <span
                className="font-semibold text-sm transition-all duration-200 group-hover/btn:translate-x-0.5"
                style={{
                  color: activeRing === 'UNRESERVED' ? COLORS.textPrimary : COLORS.textSecondary,
                  fontWeight: activeRing === 'UNRESERVED' ? 600 : 500,
                }}
              >
                {activeRingConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {!hasLocationSet && (
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: '#EF4444' }}
                />
              )}
              <ChevronDown
                size={16}
                style={{ color: activeRing === 'UNRESERVED' ? '#3B82F6' : COLORS.steelGray }}
                className={`transition-transform duration-200 ${isRingDropdownOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </button>

          {/* Dropdown - opens upward */}
          {isRingDropdownOpen && (
            <div
              className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl overflow-hidden z-50 shadow-xl"
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
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-150"
                  style={{
                    background: activeRing === ring.id ? `${COLORS.fireOrange}10` : 'transparent',
                    borderLeft: activeRing === ring.id ? `3px solid ${COLORS.fireOrange}` : '3px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (activeRing !== ring.id) {
                      e.currentTarget.style.background = COLORS.surface2;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = activeRing === ring.id ? `${COLORS.fireOrange}10` : 'transparent';
                  }}
                >
                  <span className="text-lg">{ring.emoji}</span>
                  <span
                    className="font-semibold text-sm"
                    style={{ color: activeRing === ring.id ? COLORS.fireOrange : COLORS.textSecondary }}
                  >
                    {ring.label}
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
      background: active ? `${COLORS.fireOrange}15` : 'transparent',
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.background = COLORS.surface1;
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = active ? `${COLORS.fireOrange}15` : 'transparent';
    }}
  >
    {/* Active indicator - left accent bar with Command Blue */}
    {active && (
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full"
        style={{
          background: COLORS.fireOrange,
          boxShadow: `0 0 8px ${COLORS.fireOrange}60`
        }}
      />
    )}

    <div
      className="transition-all duration-200"
      style={{
        color: active ? COLORS.fireOrange : COLORS.steelGray,
        filter: active ? `drop-shadow(0 1px 3px ${COLORS.fireOrange}40)` : 'none'
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
