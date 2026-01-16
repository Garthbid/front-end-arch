
import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, FileText, ArrowRight } from 'lucide-react';
import { COLORS } from '../constants';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Mark as seen
      localStorage.setItem('garthbid_onboarded', 'true');
      setIsPlaying(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black animate-in fade-in duration-500">
      {/* Background Video Container */}
      <div className="relative w-full h-full max-w-[500px] aspect-[9/16] bg-slate-900 overflow-hidden shadow-2xl sm:rounded-[40px] flex items-center justify-center">

        {/* The Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onClick={togglePlay}
          className="w-full h-full object-cover cursor-pointer"
        >
          {/* Using a high-quality vertical placeholder video */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-with-a-vertical-screen-34326-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Play/Pause Overlay Indicator (shows briefly on tap) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center animate-in zoom-in duration-200">
              <Play size={40} className="text-white fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent pt-12 sm:pt-10">
          <div className="flex items-center gap-3">
            {/* Logo Replaced */}
            <img
              src="/garth-logo.png"
              alt="GarthBid"
              className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(34,56,255,0.5)]"
            />
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Bottom Overlay - The Immersive Interface */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 sm:pb-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-display text-white italic leading-none">WAR IS COMING</h2>
              <p className="text-slate-300 text-sm font-medium leading-relaxed">
                For thousands of years auctions remained unchanged.... until today.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={onClose}
                className="w-full py-5 bg-[#2238ff] rounded-[24px] font-black text-white uppercase tracking-widest text-sm shadow-[0_20px_40px_rgba(34,56,255,0.4)] hover:shadow-[0_25px_50px_rgba(34,56,255,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Continue to Platform <ArrowRight size={20} strokeWidth={3} />
              </button>

              <a
                href="https://garthbid.com/garthpaper"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 text-center text-xs font-black text-white/60 hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <FileText size={14} strokeWidth={3} /> Read the Garthpaper
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
