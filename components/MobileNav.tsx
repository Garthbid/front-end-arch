import React from 'react';
import { Home, Search, Flame, User } from 'lucide-react';
import { COLORS } from '../constants';
import { ViewState } from '../types';

interface MobileNavProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  onCenterClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, onViewChange, onCenterClick }) => {
  return (
    <div
      className="md:hidden fixed left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 8px) + 12px)'
      }}
    >
      <nav
        className="pointer-events-auto relative flex items-center justify-between w-full max-w-[420px] px-6 py-3"
        style={{
          borderRadius: '35px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${COLORS.border}`,
          boxShadow: `
            0 8px 32px -4px rgba(0, 0, 0, 0.1),
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
        <div className="px-2">
          <button
            onClick={onCenterClick}
            className="relative w-[60px] h-[60px] rounded-full flex items-center justify-center overflow-hidden transform transition-all duration-300 ease-spring active:scale-90"
            style={{
              background: COLORS.fireOrange,
              color: 'white',
              boxShadow: `
                0 6px 20px -2px ${COLORS.fireOrange}80,
                inset 0 1px 2px rgba(255, 255, 255, 0.4)
              `
            }}
          >
            <span className="relative z-10 font-display text-xl tracking-tight pr-0.5">AI</span>

            {/* Specular sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
          </button>
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
        color: active ? COLORS.fireOrange : COLORS.steelGray
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
          style={{ background: `${COLORS.fireOrange}25` }}
        />
      )}
    </div>
  </button>
);

export default MobileNav;
