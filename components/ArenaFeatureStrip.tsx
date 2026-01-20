import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FEATURE_ASSETS = [
    {
        id: 'feature-1',
        type: 'image',
        src: '/arena-feature.jpg',
        headline: 'UNRESERVED MADNESS',
        subline: 'Thousands of bidders. One winner. No reserves.',
    },
    {
        id: 'feature-2',
        type: 'image',
        src: '/arena-feature.jpg',
        headline: 'EVERY MONDAY',
        subline: 'The madness happens weekly. Live on Garthbid.',
    }
];

const ArenaFeatureStrip: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % FEATURE_ASSETS.length);
        }, 7000); // 7 seconds

        return () => clearInterval(timer);
    }, []);

    const currentAsset = FEATURE_ASSETS[currentIndex];

    return (

        <section className="w-full px-4 md:px-8 lg:px-12 mt-32 md:mt-6 mb-4 md:mb-6">
            <div
                className="relative w-full overflow-hidden rounded-2xl shadow-sm bg-slate-900 group"
                style={{
                    height: 'clamp(260px, 42vh, 460px)', // Default mobile clamp
                }}
            >
                <style>{`
          @media (min-width: 1024px) {
            .arena-content-container {
               height: clamp(340px, 32vh, 460px) !important;
            }
          }
        `}</style>

                <div className="arena-content-container w-full h-full relative cursor-pointer">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentAsset.id}
                            className="absolute inset-0 w-full h-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, scale: 1.05 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                opacity: { duration: 0.5 },
                                scale: { duration: 7, ease: "linear" }
                            }}
                        >
                            <img
                                src={currentAsset.src}
                                alt={currentAsset.headline}
                                className="w-full h-full object-cover"
                                style={{ objectPosition: 'center 35%' }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Gradient Overlay for Legibility */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0) 70%)'
                        }}
                    />

                    {/* Poster Layout Grid */}
                    <div className="absolute inset-0 grid grid-cols-[minmax(24px,32px)_minmax(0,1fr)_minmax(24px,32px)] md:grid-cols-[minmax(32px,48px)_minmax(0,520px)_1fr] grid-rows-[1fr_auto_auto_1fr] pointer-events-none z-10">
                        {/* Text Block - Row 3, Col 2 */}
                        <div className="col-start-2 row-start-3 self-end md:self-center pb-6 md:pb-0">
                            <motion.h2
                                key={`headline-${currentIndex}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-white/95 font-black italic uppercase tracking-tighter text-3xl md:text-5xl leading-[0.9] drop-shadow-lg"
                                style={{ fontFamily: "'Integral CF', sans-serif" }}
                            >
                                {currentAsset.headline}
                            </motion.h2>

                            {currentAsset.subline && (
                                <motion.p
                                    key={`subline-${currentIndex}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.9 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="text-white/85 text-sm md:text-lg font-medium mt-3 md:mt-4 drop-shadow-md"
                                >
                                    {currentAsset.subline}
                                </motion.p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ArenaFeatureStrip;
