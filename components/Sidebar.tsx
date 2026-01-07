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
  onRingChange
}) => {
  const [isRingDropdownOpen, setIsRingDropdownOpen] = React.useState(false);
  const activeRingConfig = RINGS.find(r => r.id === activeRing) || RINGS[0];

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

        {/* Ring Selector */}
        <div className="mb-6 mx-1 relative">
          <button
            onClick={() => setIsRingDropdownOpen(!isRingDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 hover:shadow-sm"
            style={{
              background: COLORS.surface1,
              border: `1px solid ${isRingDropdownOpen ? COLORS.fireOrange : COLORS.border}`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{activeRingConfig.emoji}</span>
              <span className="font-bold text-sm" style={{ color: COLORS.textPrimary }}>{activeRingConfig.label}</span>
            </div>
            <ChevronDown
              size={18}
              style={{ color: COLORS.steelGray }}
              className={`transition-transform duration-200 ${isRingDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
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
            </div>
          )}
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
