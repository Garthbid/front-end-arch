import React from 'react';
import { Home, Search, Flame, User } from 'lucide-react';
import { COLORS } from '../constants';
import { ViewState } from '../types';

interface MobileNavProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  onCenterClick: () => void;
  showGarthRedDot?: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, onViewChange, onCenterClick, showGarthRedDot }) => {
  return (
    <div
      className="md:hidden fixed left-0 right-0 bottom-0 z-50"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <nav
        className="relative flex items-center justify-between w-full px-2"
        style={{
          background: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '8px',
          paddingBottom: '8px',
        }}
      >
        {/* Left Nav Items - Tighter spacing */}
        <div className="flex items-center flex-1 justify-evenly gap-0">
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
        </div>

        {/* Center AI Button - Floating Focal Point */}
        <div className="relative" style={{ marginTop: '-26px' }}>
          <button
            onClick={onCenterClick}
            className="relative w-[54px] h-[54px] rounded-full flex items-center justify-center overflow-hidden transform transition-all duration-300 ease-spring active:scale-90 hover:scale-105"
            style={{
              background: COLORS.primary,
              color: 'white',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
            }}
          >
            <span
              className="relative z-10 tracking-tight"
              style={{
                fontFamily: "'Integral CF', sans-serif",
                fontStyle: 'italic',
                fontSize: '17px',
                fontWeight: 700,
              }}
            >AI</span>

            {/* Specular sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
          </button>

          {/* Red Notification Dot */}
          {showGarthRedDot && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-600 ring-2 ring-white z-20 pointer-events-none animate-in zoom-in duration-300 flex items-center justify-center text-[9px] font-bold text-white shadow-sm leading-none">
              1
            </span>
          )}
        </div>

        {/* Right Nav Items - Tighter spacing */}
        <div className="flex items-center flex-1 justify-evenly gap-0">
          <NavItem
            icon={Flame}
            label="Favourites"
            active={currentView === 'FAVS'}
            onClick={() => onViewChange('FAVS')}
          />
          <NavItem
            icon={User}
            label="Profile"
            active={currentView === 'PROFILE'}
            onClick={() => onViewChange('PROFILE')}
          />
        </div>
      </nav>
    </div>
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
    className="group flex flex-col items-center justify-center gap-0.5 min-w-[48px] py-1 transition-all duration-150 active:scale-95"
    style={{
      transform: 'scale(1)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
    }}
  >
    <Icon
      size={22}
      strokeWidth={active ? 2.5 : 2}
      style={{
        color: active ? '#2563eb' : '#6b7280',
        transition: 'color 150ms ease',
      }}
    />
    <span
      className="text-[9px] font-medium"
      style={{
        color: active ? '#2563eb' : '#6b7280',
        transition: 'color 150ms ease',
      }}
    >
      {label}
    </span>
  </button>
);

export default MobileNav;
