import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { COLORS } from '../constants';



// Particle system
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.5 + 0.2,
    speed: Math.random() * 20 + 15,
  }));
}

interface HeroProps {
  onSellClick?: () => void;
  onHowItWorksClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSellClick, onHowItWorksClick }) => {
  const [particles] = useState(() => generateParticles(30))
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <section className="relative w-full px-4 md:px-6 pt-4 md:pt-5 mb-5">
      {/* Wrapper for Laser Border Effect */}
      <div className="relative rounded-[24px] md:rounded-[32px] hero-laser-border">
        {/* Main Arena Panel - Light Blue Gradient Theme */}
        <div
          className="relative overflow-hidden rounded-[24px] md:rounded-[32px] px-5 py-10 md:px-10 md:py-12 lg:py-14"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f0f7ff 50%, #e8f2ff 100%)',
            boxShadow: `
              0 20px 60px -12px rgba(0,0,0,0.12),
              0 0 0 1px rgba(255,255,255,0.6),
              inset 0 1px 0 rgba(255,255,255,0.7)
            `,
          }}
        >
          {/* Subtle Gradient Overlay - Cinematic Depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
              radial-gradient(circle at 50% 30%, ${COLORS.primary}03 0%, transparent 40%),
              radial-gradient(circle at 50% 70%, ${COLORS.accent}03 0%, transparent 40%)
            `,
            }}
          />

          {/* --- Arena Background (Redesigned) --- */}

          {/* 1. Geometric Pattern (Crosshatch) - Subtle Professional Texture at 3% opacity */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  -45deg,
                  #1e3a8a 0,
                  #1e3a8a 1px,
                  transparent 1px,
                  transparent 12px
                ),
                repeating-linear-gradient(
                  45deg,
                  #1e3a8a 0,
                  #1e3a8a 1px,
                  transparent 1px,
                  transparent 12px
                )
              `,
              zIndex: 0
            }}
          />

          {/* 2. Primary Spotlight (Intense Red/Orange) - Top Right/Center */}
          <div
            className="absolute -top-[10%] -right-[20%] md:-top-[20%] md:-right-[10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full mix-blend-multiply filter blur-[60px] md:blur-[120px] opacity-10 md:opacity-15 animate-spotlight"
            style={{
              background: '#EA580C', // Orange-600
              zIndex: 0,
            }}
          />

          {/* 3. Secondary Glow (Cold Steel) - Bottom Left */}
          <div
            className="absolute -bottom-[10%] -left-[20%] md:-bottom-[20%] md:-left-[10%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] rounded-full mix-blend-multiply filter blur-[50px] md:blur-[100px] opacity-5 md:opacity-10"
            style={{
              background: '#1E3A8A', // Blue-900
              zIndex: 0,
            }}
          />

          {/* 4. Vignette - Focus Center */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, transparent 30%, rgba(255,255,255,0.8) 100%)`,
              zIndex: 1, // Sit above glows but below content
              mixBlendMode: 'overlay',
              opacity: 0.5
            }}
          />

          {/* Particle Field - Dark Particles for separation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  bottom: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.id % 3 === 0 ? COLORS.fireOrange : p.id % 2 === 0 ? COLORS.steelGray : COLORS.textMuted,
                  opacity: p.opacity * 0.4,
                  animation: `rise-particle ${p.speed}s linear infinite`,
                  animationDelay: `${-p.id * 0.4}s`,
                }}
              />
            ))}
          </div>


          {/* Main Content Container */}
          <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center min-h-[50vh] md:min-h-[55vh]">
            {/* Powered by GarthAI Pill - 30% Smaller */}
            <div
              className="group relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full mb-3 md:mb-4 cursor-default transition-all duration-500 ease-out hover:-translate-y-[1px]"
              style={{
                background: 'linear-gradient(135deg, rgba(0,34,255,0.06) 0%, rgba(139,92,246,0.06) 100%)',
                border: '1px solid rgba(0,34,255,0.12)',
                boxShadow: '0 2px 8px rgba(0,34,255,0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.7)',
              }}
            >
              {/* AI Sparkle Icon - Smaller */}
              <div className="relative flex items-center justify-center">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="relative z-10"
                  style={{
                    animation: 'pulse-ember 2.4s ease-in-out infinite',
                  }}
                >
                  <path
                    d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                    fill={COLORS.primary}
                    opacity="0.9"
                  />
                </svg>
              </div>

              <span
                className="text-[8px] md:text-[10px] font-semibold tracking-[0.1em] uppercase"
                style={{
                  background: `linear-gradient(90deg, ${COLORS.primary} 0%, #8B5CF6 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Powered by GarthAI
              </span>
            </div>

            {/* Main Headline - More balanced hierarchy with reduced size gap */}
            <h1
              className="mb-6 md:mb-8 transition-all duration-1000 ease-out text-center"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                transitionDelay: '150ms',
              }}
            >
              <span
                className="block text-2xl md:text-4xl lg:text-5xl font-display leading-none"
                style={{
                  color: '#BA4A00', // Earth Orange
                  transform: 'skewX(-5deg)',
                }}
              >
                THE INTERNETS
              </span>
              <span
                className="block text-4xl md:text-6xl lg:text-7xl font-display tracking-tighter leading-[0.9]"
                style={{
                  color: COLORS.primary, // Garth Blue
                  filter: 'drop-shadow(0 0 25px rgba(0,34,255,0.35))',
                  marginTop: '0.1em',
                  marginBottom: '0.1em',
                  transform: 'skewX(-5deg)',
                }}
              >
                BIDDING WAR
              </span>
              <span
                className="block text-2xl md:text-4xl lg:text-5xl font-display leading-none"
                style={{
                  color: '#BA4A00', // Earth Orange
                  transform: 'skewX(-5deg)',
                }}
              >
                ARENA
              </span>
            </h1>

            {/* Story Line - Sleek tagline with increased spacing from headline */}
            <p
              className="text-[10px] md:text-xs font-semibold tracking-[0.25em] uppercase mb-8 md:mb-10 transition-all duration-700 ease-out"
              style={{
                color: COLORS.textSecondary,
                opacity: isVisible ? 0.7 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
                transitionDelay: '300ms',
              }}
            >
              NO RESERVES. NO MERCY.
            </p>

            {/* CTA Buttons - Horizontal Layout */}
            <div
              className="flex flex-row items-center justify-center gap-3 md:gap-4 transition-all duration-700 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: '450ms',
              }}
            >
              {/* Primary CTA - Sleek Blue with More Pronounced Shadow */}
              <button
                onClick={onSellClick}
                className="group relative h-11 md:h-12 px-6 md:px-8 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider overflow-hidden transition-all duration-300 active:scale-[0.98] hover:-translate-y-[2px] cursor-pointer"
                style={{
                  background: COLORS.primary,
                  color: '#ffffff',
                  boxShadow: `
                    0 0 0 1px ${COLORS.primary}80,
                    0 4px 12px -2px ${COLORS.primary}60,
                    0 12px 32px -8px ${COLORS.primary}70,
                    0 20px 48px -12px ${COLORS.primary}40
                  `,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0015cc';
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${COLORS.primary}, 0 6px 16px -2px ${COLORS.primary}70, 0 16px 40px -8px ${COLORS.primary}80, 0 24px 56px -12px ${COLORS.primary}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${COLORS.primary}80, 0 4px 12px -2px ${COLORS.primary}60, 0 12px 32px -8px ${COLORS.primary}70, 0 20px 48px -12px ${COLORS.primary}40`;
                }}
              >
                {/* Animated shine */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)`,
                    transform: 'translateX(-100%)',
                    animation: 'shine-sweep 3s ease-in-out infinite',
                  }}
                />

                <span className="relative z-10 flex items-center justify-center gap-2">
                  ENTER THE ARENA
                  <ArrowRight size={16} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>

              {/* HOW IT WORKS - Outline/Secondary Button Style */}
              <button
                onClick={onHowItWorksClick}
                className="group relative flex items-center justify-center gap-2 h-11 md:h-12 px-5 md:px-6 text-xs md:text-sm font-bold tracking-wider transition-all duration-300 rounded-full hover:-translate-y-[1px] cursor-pointer"
                style={{
                  color: COLORS.primary,
                  background: 'transparent',
                  border: `2px solid ${COLORS.primary}40`,
                  boxShadow: '0 2px 8px rgba(0,34,255,0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.primary;
                  e.currentTarget.style.background = 'rgba(0,34,255,0.04)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,34,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${COLORS.primary}40`;
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,34,255,0.08)';
                }}
              >
                <span className="uppercase">How It Works</span>
                <ArrowRight
                  size={14}
                  strokeWidth={2.5}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* CSS Animations */}
      <style>{`

        .hero-laser-border {
          position: relative;
        }

        .hero-laser-border::before,
        .hero-laser-border::after {
          content: "";
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        padding: 2px;
        background: linear-gradient(
        135deg,
        rgba(59, 130, 246, 0.4) 0%,
        rgba(0, 212, 255, 0.6) 25%,
        rgba(59, 130, 246, 0.3) 50%,
        rgba(139, 92, 246, 0.4) 75%,
        rgba(59, 130, 246, 0.4) 100%
        );
        -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
        mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        }

        /* Glow Layer */
        .hero-laser-border::after {
          filter: blur(10px);
        opacity: 0.5;
        padding: 4px; /* Slightly wider for bloom */
        inset: -4px;
        z-index: -1;
        }

        /* Core Laser Layer */
        .hero-laser-border::before {
          z - index: 21; /* Above inner content z-10/20 */
        }

        @keyframes pulse-ember {
          0 %, 100 % {
            transform: scale(1);
            opacity: 1;
            filter: drop - shadow(0 0 0 rgba(255, 55, 0, 0));
          }
          50% {
          transform: scale(1.06);
        opacity: 0.9;
        filter: drop-shadow(0 0 4px rgba(255,55,0,0.3));
          }
        }

        @keyframes rise-particle {
          0 % {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
          opacity: 0.6;
          }
        90% {
          opacity: 0.2;
          }
        100% {
          transform: translateY(-100vh) translateX(20px) scale(0.5);
        opacity: 0;
          }
        }

        /* Arena Spotlight Pulse */
        @keyframes spotlight-pulse {
          0 %, 100 % { opacity: 0.15; transform: scale(1); }
          50% {opacity: 0.25; transform: scale(1.05); }
        }
        .animate-spotlight {
          animation: spotlight-pulse 8s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0 %, 100 % {
            opacity: 1;
            transform: scale(1);
          }
          50% {
          opacity: 0.7;
        transform: scale(0.85);
          }
        }

        @keyframes shine-sweep {
          0 %, 100 % { transform: translateX(-100 %); }
          50% {transform: translateX(100%); }
        }
      `}</style>
    </section >
  )
}

export default Hero;
