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
    <section className="relative w-full px-4 md:px-6 pt-3 md:pt-4 mb-4">
      {/* Wrapper for Laser Border Effect */}
      <div className="relative rounded-[24px] md:rounded-[32px] hero-laser-border">
        {/* Main Arena Panel - Light Theme */}
        <div
          className="relative overflow-hidden rounded-[24px] md:rounded-[32px] px-5 py-8 md:px-10 md:py-10 lg:py-12"
          style={{
            background: '#ffffff',
            boxShadow: `
              0 20px 60px -12px rgba(0,0,0,0.1),
              0 0 0 1px rgba(255,255,255,0.5),
              inset 0 1px 0 rgba(255,255,255,0.5)
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

          {/* 1. Geometric Pattern (Diagonal Hash) - Aggressive Texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(
              -45deg,
              #000 0,
              #000 1px,
              transparent 1px,
              transparent 10px
            )`,
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
          <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center min-h-[45vh] md:min-h-[50vh]">
            {/* Powered by GarthAI Pill */}
            <div
              className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full mb-4 md:mb-5 cursor-default transition-all duration-500 ease-out hover:-translate-y-[1px]"
              style={{
                background: 'linear-gradient(135deg, rgba(0,34,255,0.08) 0%, rgba(139,92,246,0.08) 100%)',
                border: '1px solid rgba(0,34,255,0.15)',
                boxShadow: '0 2px 12px rgba(0,34,255,0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
              }}
            >
              {/* AI Sparkle Icon */}
              <div className="relative flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
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
                className="text-[10px] md:text-xs font-semibold tracking-[0.12em] uppercase"
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

            {/* Main Headline - Clean balanced hierarchy */}
            <h1
              className="mb-3 md:mb-4 transition-all duration-1000 ease-out text-center"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                transitionDelay: '150ms',
              }}
            >
              <span
                className="block text-2xl md:text-3xl lg:text-4xl font-display leading-none"
                style={{
                  color: '#BA4A00', // Earth Orange
                  transform: 'skewX(-5deg)',
                }}
              >
                THE INTERNETS
              </span>
              <span
                className="block text-5xl md:text-7xl lg:text-8xl font-display tracking-tighter leading-[0.85]"
                style={{
                  color: COLORS.primary, // Garth Blue
                  filter: 'drop-shadow(0 0 25px rgba(0,34,255,0.35))',
                  marginTop: '0.05em',
                  marginBottom: '0.05em',
                  transform: 'skewX(-5deg)',
                }}
              >
                BIDDING WAR
              </span>
              <span
                className="block text-2xl md:text-3xl lg:text-4xl font-display leading-none"
                style={{
                  color: '#BA4A00', // Earth Orange
                  transform: 'skewX(-5deg)',
                }}
              >
                ARENA
              </span>
            </h1>

            {/* Story Line - Sleek tagline */}
            <p
              className="text-[10px] md:text-xs font-semibold tracking-[0.25em] uppercase mb-5 md:mb-6 transition-all duration-700 ease-out"
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
              {/* Primary CTA - Sleek Blue */}
              <button
                onClick={onSellClick}
                className="group relative h-11 md:h-12 px-6 md:px-8 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider overflow-hidden transition-all duration-300 active:scale-[0.98] hover:-translate-y-[1px] cursor-pointer"
                style={{
                  background: COLORS.primary,
                  color: '#ffffff',
                  boxShadow: `
                    0 0 0 1px ${COLORS.primary}60,
                    0 8px 24px -6px ${COLORS.primary}50
                  `,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0015cc';
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${COLORS.primary}, 0 12px 32px -6px ${COLORS.primary}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${COLORS.primary}60, 0 8px 24px -6px ${COLORS.primary}50`;
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

              {/* Rules Link - Sleek Secondary */}
              <button
                onClick={onHowItWorksClick}
                className="group relative flex items-center justify-center gap-1.5 h-11 md:h-12 px-4 text-xs md:text-sm font-bold tracking-wide transition-all duration-300 rounded-full"
                style={{
                  color: COLORS.textSecondary,
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = COLORS.accent;
                  e.currentTarget.style.background = 'rgba(255,85,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = COLORS.textSecondary;
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className="text-sm">🏛️</span>
                <span className="uppercase tracking-wider">Rules</span>
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
