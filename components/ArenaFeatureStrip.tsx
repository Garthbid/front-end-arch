import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FEATURE_ASSETS = [
    {
        id: 'feature-1',
        type: 'image',
        src: '/arena-feature.jpg',
        headline: 'THE ARENA IS LIVE',
        subline: 'Thousands of bidders. One winner. No reserves.',
    },
    // Duplicating for rotation demo purposes since we only have one image
    {
        id: 'feature-2',
        type: 'image',
        src: '/arena-feature.jpg',
        headline: 'LEGENDARY FINDS',
        subline: 'Discover rare items from top sellers.',
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
        <div className="w-full px-4 md:px-8 lg:px-12 mt-32 md:mt-8 mb-4 md:mb-6">
            <div
                className="relative w-full overflow-hidden rounded-2xl shadow-sm bg-white"
                style={{
                    // Clamp height as requested: 
                    // Mobile: clamp(260px, 34vh, 360px)
                    // Desktop: clamp(320px, 38vh, 520px)
                    height: 'clamp(260px, 34vh, 360px)',
                }}
            >
                {/* Desktop Height Override via Media Query Style or simple separate clamp */}
                <style>{`
          @media (min-width: 768px) {
            .arena-strip-container {
               height: clamp(320px, 38vh, 520px) !important;
            }
          }
        `}</style>

                <div className="arena-strip-container w-full h-full relative cursor-pointer group">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentAsset.id}
                            className="absolute inset-0 w-full h-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, scale: 1.05 }} // Subtle Ken Burns zoom target
                            exit={{ opacity: 0 }}
                            transition={{
                                opacity: { duration: 0.5 }, // Cross-fade 500ms
                                scale: { duration: 7, ease: "linear" } // Constant 7s zoom
                            }}
                        >
                            <img
                                src={currentAsset.src}
                                alt={currentAsset.headline}
                                className="w-full h-full object-cover center-crop"
                            />

                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Text Overlay */}
                    <div className="absolute bottom-0 left-0 p-4 md:p-6 z-10 max-w-[90%] md:max-w-[70%]">
                        <motion.h2
                            key={`headline-${currentIndex}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-white/95 font-black italic uppercase tracking-tighter text-2xl md:text-2xl lg:text-3xl leading-[0.9] drop-shadow-lg"
                            style={{ fontFamily: "'Integral CF', sans-serif" }} // Assuming font availability
                        >
                            {currentAsset.headline}
                        </motion.h2>

                        {currentAsset.subline && (
                            <motion.p
                                key={`subline-${currentIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.9 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="text-white/90 text-sm md:text-base font-medium mt-2 md:mt-3 drop-shadow-md"
                            >
                                {currentAsset.subline}
                            </motion.p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArenaFeatureStrip;
