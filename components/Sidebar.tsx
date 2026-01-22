import React from 'react';
import { Home, Search, Flame, User, ChevronDown, ShieldAlert, Zap, Sparkles, BookOpen, Gavel } from 'lucide-react';
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
      className="hidden md:flex flex-col w-[220px] h-screen fixed left-0 top-0 z-50 p-4"
      style={{
        background: COLORS.voidBlack,
        borderRight: `1px solid ${COLORS.border}`,
      }}
    >
      {/* Top Section: Logo & Status */}
      <div className="flex-grow">
        {/* Logo - GARTH in blue, BID in orange */}
        <div className="mb-8 px-2 flex items-center cursor-pointer" onClick={() => onViewChange('HOME')}>
          <img
            src="/garth-logo.png"
            alt="GARTHBID"
            className="h-5 w-auto object-contain transition-transform hover:scale-105 active:scale-95 duration-300"
          />
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
    className="w-full relative flex items-center gap-3 px-3 py-3.5 rounded-xl text-base transition-all duration-200 group"
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
