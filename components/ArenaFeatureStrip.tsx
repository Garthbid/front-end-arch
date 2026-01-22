import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FEATURE_ASSETS = [
    {
        id: 'feature-1',
        type: 'image',
        src: '/arena-feature.jpg',
        headline: 'UNRESERVED',
        subline: 'Thousands of bidders. One winner. No reserves.',
    },
    {
        id: 'feature-2',
        type: 'image',
        src: '/arena-feature-2.png',
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
                className="relative w-full overflow-hidden rounded-2xl shadow-sm bg-slate-900 group aspect-[16/9] md:aspect-auto h-auto md:h-[280px]"
            >
                <div className="w-full h-full relative cursor-pointer">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentAsset.id}
                            className="absolute inset-0 w-full h-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, scale: 1.02 }}
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


                    {/* Text Overlay - Poster Titling Style - Scaled Down */}
                    <div className="absolute bottom-5 left-5 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-12 z-10 max-w-[90%] md:max-w-[420px]">
                        <motion.h2
                            key={`headline-${currentIndex}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-white/90 font-black italic uppercase tracking-tighter text-2xl md:text-3xl leading-[1.05] drop-shadow-md"
                            style={{ fontFamily: "'Integral CF', sans-serif" }}
                        >
                            {currentAsset.headline}
                        </motion.h2>

                        {currentAsset.subline && (
                            <motion.p
                                key={`subline-${currentIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.8 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="text-white/70 text-xs md:text-sm font-medium mt-1 md:mt-1 drop-shadow-sm"
                            >
                                {currentAsset.subline}
                            </motion.p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ArenaFeatureStrip;
