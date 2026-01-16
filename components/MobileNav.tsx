import React, { useState, useEffect } from 'react';
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
  const [scrollOpacity, setScrollOpacity] = useState(0.8);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Fade from 0.8 to 0.5 opacity over first 200px of scroll
      const newOpacity = Math.max(0.5, 0.8 - (scrollY / 200) * 0.3);
      setScrollOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="md:hidden fixed left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 8px) + 12px)'
      }}
    >
      <nav
        className="pointer-events-auto relative flex items-center justify-between w-full max-w-[420px] px-6 py-3 transition-all duration-300"
        style={{
          borderRadius: '35px',
          background: `rgba(255, 255, 255, ${scrollOpacity})`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${COLORS.border}`,
          boxShadow: `
            0 8px 32px -4px rgba(0, 0, 0, ${0.1 * (scrollOpacity / 0.8)}),
            0 1px 2px rgba(0, 0, 0, 0.05)
          `
        }}
      >
        <div className="flex items-center gap-1 flex-1 justify-around">
          <NavItem
            icon={Home}
            active={currentView === 'HOME'}
            onClick={() => onViewChange('HOME')}
          />
          <NavItem
            icon={Search}
            active={currentView === 'SEARCH'}
            onClick={() => onViewChange('SEARCH')}
          />
        </div>

        {/* Center Action Button - Command Blue */}
        <div className="px-2 relative">
          <button
            onClick={onCenterClick}
            className="relative w-[60px] h-[60px] rounded-full flex items-center justify-center overflow-hidden transform transition-all duration-300 ease-spring active:scale-90"
            style={{
              background: COLORS.primary,
              color: 'white',
              boxShadow: `
                0 6px 20px -2px ${COLORS.primary}80,
                inset 0 1px 2px rgba(255, 255, 255, 0.4)
              `
            }}
          >
            <span className="relative z-10 font-display text-xl tracking-tight pr-0.5">AI</span>

            {/* Specular sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
          </button>

          {/* Red Notification Dot */}
          {showGarthRedDot && (
            <span className="absolute top-2 right-2 min-w-[20px] h-[20px] rounded-full bg-red-600 ring-2 ring-white z-20 pointer-events-none animate-in zoom-in duration-300 flex items-center justify-center text-[10px] font-bold text-white shadow-sm leading-none pt-0.5">
              1
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-1 justify-around">
          <NavItem
            icon={Flame}
            active={currentView === 'FAVS'}
            onClick={() => onViewChange('FAVS')}
          />
          <NavItem
            icon={User}
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
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className="group flex items-center justify-center min-w-[60px] h-[60px] rounded-full transition-all duration-200 active:scale-90"
  >
    <div
      className={`relative flex items-center justify-center transition-all duration-300 ${active ? 'scale-115' : 'group-hover:scale-110'}`}
      style={{
        color: active ? COLORS.primary : COLORS.steelGray
      }}
    >
      <Icon
        size={26}
        strokeWidth={active ? 2.5 : 2}
        className="relative z-10"
      />

      {/* Active state ambient glow */}
      {active && (
        <div
          className="absolute inset-0 blur-md rounded-full scale-150"
          style={{ background: `${COLORS.primary}25` }}
        />
      )}
    </div>
  </button>
);

export default MobileNav;
