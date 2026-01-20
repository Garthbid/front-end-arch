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
                className="relative w-full overflow-hidden rounded-2xl shadow-sm bg-slate-900 group aspect-[16/9] md:aspect-auto h-auto md:h-[clamp(340px,32vh,460px)]"
            >
                <div className="w-full h-full relative cursor-pointer">
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

                    {/* Text Overlay - Poster Titling Style */}
                    <div className="absolute bottom-6 left-6 md:bottom-[36px] md:left-[44px] z-10 max-w-[90%] md:max-w-[520px]">
                        <motion.h2
                            key={`headline-${currentIndex}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-white/90 font-black italic uppercase tracking-tighter text-3xl md:text-4xl leading-[1.05] drop-shadow-md"
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
                                className="text-white/75 text-sm md:text-base font-medium mt-1.5 md:mt-1.5 drop-shadow-sm"
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
