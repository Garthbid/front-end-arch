import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { COLORS } from '../constants';

function formatCountdown(ms: number) {
  if (ms <= 0) return "LIVE NOW"
  const totalSeconds = Math.floor(ms / 1000)
  const d = Math.floor(totalSeconds / 86400)
  const h = Math.floor((totalSeconds % 86400) / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`
}

function getNextBattleStart(now = new Date()) {
  const d = new Date(now)
  const day = d.getDay()
  const daysUntilMon = (8 - day) % 7 || 7
  d.setDate(d.getDate() + daysUntilMon)
  d.setHours(9, 0, 0, 0)
  return d
}

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
  const [countdown, setCountdown] = useState("")
  const [particles] = useState(() => generateParticles(30))
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const start = getNextBattleStart(now)
      const ms = start.getTime() - now.getTime()
      setCountdown(formatCountdown(ms))
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section className="relative w-full px-4 md:px-6 pt-3 md:pt-4 mb-4">
      {/* Main Arena Panel - Light Theme */}
      <div
        className="relative overflow-hidden rounded-[24px] md:rounded-[32px] px-5 py-8 md:px-10 md:py-10 lg:py-12"
        style={{
          background: '#ffffff',
          boxShadow: `
            0 20px 60px -12px rgba(0,0,0,0.05),
            0 0 0 1px ${COLORS.border},
            inset 0 1px 0 rgba(255,255,255,0.8)
          `,
        }}
      >
        {/* Subtle Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 0%, ${COLORS.fireOrange}05 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 100%, ${COLORS.fireOrange}03 0%, transparent 50%)
            `,
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

        {/* Content - Tighter spacing */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Countdown Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 md:mb-6 transition-all duration-700 ease-out"
            style={{
              background: `${COLORS.fireOrange}10`,
              border: `1px solid ${COLORS.fireOrange}20`,
              backdropFilter: 'blur(10px)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: COLORS.fireOrange,
                boxShadow: `0 0 8px ${COLORS.fireOrange}`,
                animation: 'pulse-dot 2s ease-in-out infinite',
              }}
            />
            <span
              className="text-[10px] md:text-xs font-bold tracking-widest uppercase"
              style={{ color: COLORS.steelGray }}
            >
              Next Battle
            </span>
            <span
              className="text-[10px] md:text-xs font-black tracking-wider"
              style={{ color: COLORS.fireOrange }}
            >
              {countdown}
            </span>
          </div>

          {/* Main Headline - Clean balanced hierarchy */}
          <h1
            className="mb-5 md:mb-6 transition-all duration-1000 ease-out text-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              transitionDelay: '150ms',
            }}
          >
            <span
              className="block text-[1.5rem] md:text-[2.5rem] lg:text-[3rem] tracking-tight font-display leading-[0.9]"
              style={{
                color: COLORS.textPrimary,
              }}
            >
              THE INTERNETS
            </span>
            <span
              className="block text-[2.5rem] md:text-[5rem] lg:text-[6rem] tracking-tight font-display leading-[0.9]"
              style={{
                color: COLORS.fireOrange,
                textShadow: `0 10px 30px ${COLORS.fireOrange}15`,
                marginTop: '0.05em',
                marginBottom: '0.25em',
              }}
            >
              BIDDING WAR
            </span>
            <span
              className="block text-[1.5rem] md:text-[2.5rem] lg:text-[3rem] tracking-tight font-display leading-[0.9]"
              style={{
                color: COLORS.textPrimary,
              }}
            >
              ARENA
            </span>
          </h1>

          {/* Tagline - Smaller */}
          <p
            className="text-sm md:text-base lg:text-lg font-semibold tracking-[0.15em] uppercase mb-6 md:mb-8 transition-all duration-700 ease-out"
            style={{
              color: COLORS.steelGray,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
              transitionDelay: '300ms',
            }}
          >
            ZERO FEES. UNRESERVED.<br />EVERY MONDAY.
          </p>

          {/* CTA Buttons - Compact */}
          <div
            className="flex flex-col w-full max-w-sm gap-3 transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '450ms',
            }}
          >
            {/* Primary CTA - Royal Blue */}
            <button
              onClick={onSellClick}
              className="group relative h-12 md:h-14 w-full rounded-full font-bold text-sm md:text-base uppercase tracking-wider overflow-hidden transition-transform duration-200 active:scale-[0.98] cursor-pointer"
              style={{
                background: COLORS.fireOrange,
                color: '#ffffff',
                boxShadow: `
                  0 0 0 1px ${COLORS.fireOrange}80,
                  0 12px 40px -8px ${COLORS.fireOrange}40,
                  inset 0 1px 0 rgba(255,255,255,0.15)
                `,
              }}
            >
              {/* Animated shine */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
                  transform: 'translateX(-100%)',
                  animation: 'shine-sweep 3s ease-in-out infinite',
                }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                SEND YOUR ASSET TO WAR
                <ArrowRight size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>

            {/* Secondary CTA */}
            <button
              onClick={onHowItWorksClick}
              className="h-10 md:h-11 w-full rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer"
              style={{
                background: 'transparent',
                color: COLORS.steelGray,
                border: `1px solid ${COLORS.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.textPrimary;
                e.currentTarget.style.color = COLORS.textPrimary;
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
                e.currentTarget.style.color = COLORS.steelGray;
              }}
            >
              How it works
            </button>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes rise-particle {
          0% {
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
        @keyframes pulse-dot {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.7; 
            transform: scale(0.85);
          }
        }
        @keyframes shine-sweep {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  )
}

export default Hero;
