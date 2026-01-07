import React from 'react';
import { X, ArrowRight, Upload, Users, Route, DollarSign } from 'lucide-react';
import { COLORS } from '../constants';

interface SellLandingModalProps {
   isOpen: boolean;
   onClose: () => void;
   onContinue: () => void;
}

const SellLandingModal: React.FC<SellLandingModalProps> = ({ isOpen, onClose, onContinue }) => {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
         {/* Backdrop */}
         <div
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity"
            onClick={onClose}
         />

         <div
            className="relative w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
            style={{ background: COLORS.voidBlack }}
         >
            <div className="p-6 pt-8 md:p-8 md:pt-10">

               {/* Header */}
               <div className="text-center mb-6 md:mb-8">
                  <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 md:mb-2">Welcome to</div>
                  <h2 className="text-3xl md:text-5xl font-display uppercase leading-[0.9] mb-3 md:mb-4">
                     <span style={{ color: COLORS.textPrimary }}>SELL WITH </span>
                     <span style={{ color: COLORS.fireOrange }}>GARTH</span>
                  </h2>
                  <p className="text-base md:text-lg font-medium leading-tight max-w-xs mx-auto" style={{ color: COLORS.textSecondary }}>
                     Sell unreserved 100% free. Keep every dollar.
                  </p>
               </div>

               {/* Steps */}
               <div
                  className="space-y-6 mb-8 rounded-2xl p-5 md:p-6 border"
                  style={{
                     background: COLORS.surface1,
                     borderColor: COLORS.border
                  }}
               >
                  <h3 className="text-xs font-black uppercase tracking-wide border-b pb-2 md:pb-3 mb-1 md:mb-2" style={{ color: COLORS.textPrimary, borderColor: COLORS.border }}>
                     How it works
                  </h3>

                  <div className="space-y-5">
                     <Step
                        number={1}
                        icon={Upload}
                        title="List your item"
                        description="Create a listing in minutes. No upfront cost."
                     />

                     <Step
                        number={2}
                        icon={Users}
                        title="Buyers compete"
                        description="Real bidders. Real momentum."
                     />

                     {/* Step 3 - Simple Path Options */}
                     <div className="flex gap-3 md:gap-4">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full font-black flex items-center justify-center text-xs md:text-sm shadow-sm flex-shrink-0"
                           style={{ background: COLORS.surface2, color: COLORS.fireOrange, border: `1px solid ${COLORS.border}` }}>
                           3
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-2">
                              <Route size={16} style={{ color: COLORS.steelGray }} />
                              <span className="font-bold text-sm md:text-base" style={{ color: COLORS.textPrimary }}>Choose Your Path</span>
                           </div>

                           <div className="flex gap-3">
                              <span className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg" style={{ background: `${COLORS.fireOrange}15`, color: COLORS.fireOrange }}>UNRESERVED</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: COLORS.textMuted, lineHeight: '28px' }}>or</span>
                              <span className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg" style={{ background: COLORS.surface2, color: COLORS.textSecondary }}>RESERVED</span>
                           </div>
                        </div>
                     </div>

                     <Step
                        number={4}
                        icon={DollarSign}
                        title="Get paid directly"
                        description="Peer-to-peer. No middleman."
                     />
                  </div>
               </div>

               {/* Action Button */}
               <button
                  onClick={onContinue}
                  className="w-full py-3.5 md:py-4 rounded-xl font-black text-white text-lg md:text-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                  style={{
                     backgroundColor: COLORS.fireOrange,
                     boxShadow: `0 8px 20px ${COLORS.fireOrange}40`
                  }}
               >
                  LIST MY ITEM <ArrowRight size={22} md:size={24} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
               </button>
            </div>

            <button
               onClick={onClose}
               className="absolute top-4 right-4 p-2 transition-colors hover:bg-slate-100 rounded-full"
               style={{ color: COLORS.textMuted }}
            >
               <X size={24} />
            </button>
         </div>
      </div>
   );
};

const Step = ({ number, icon: Icon, title, description }: { number: number, icon: any, title: string, description: string }) => (
   <div className="flex gap-3 md:gap-4">
      <div
         className="w-7 h-7 md:w-8 md:h-8 rounded-full font-black flex items-center justify-center text-xs md:text-sm shadow-sm flex-shrink-0"
         style={{
            background: COLORS.surface2,
            color: COLORS.fireOrange,
            border: `1px solid ${COLORS.border}`
         }}
      >
         {number}
      </div>
      <div>
         <div className="flex items-center gap-2 mb-0.5">
            <Icon size={16} style={{ color: COLORS.steelGray }} />
            <span className="font-bold text-sm md:text-base" style={{ color: COLORS.textPrimary }}>{title}</span>
         </div>
         <p className="text-xs md:text-sm leading-snug" style={{ color: COLORS.textSecondary }}>{description}</p>
      </div>
   </div>
);

export default SellLandingModal;