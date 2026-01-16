import React from 'react';

/**
 * ColdOpenIllustration
 * 
 * Optimized for Ultra-Crisp rendering on High-DPI displays.
 * Adapts Next.js image optimization principles to standard Vite React.
 * 
 * - Loads the high-resolution source directly to ensure Retina sharpness.
 * - Enforces layout constraints to preventing upscaling softness.
 * - Strict aspect ratios for cinematic presentation.
 */
export default function ColdOpenIllustration() {
    return (
        <section className="mx-auto w-full max-w-[1280px] px-4 md:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-black/10 shadow-sm aspect-[16/10] lg:aspect-[21/9] bg-slate-100">
                {/* 
            Using standard <img> for Vite compatibility.
            We link directly to the high-res asset to ensure 4K/Retina sharpness.
            Browser will downscale as needed.
        */}
                <img
                    src="/illustrations/auction-chaos-6000.png"
                    alt="Auction chaos illustration"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{
                        objectFit: "cover",
                        objectPosition: "center",
                        // Prevent common blurring filters
                        filter: 'none',
                        transform: 'none'
                    }}
                    loading="eager" // Simulate 'priority'
                />
            </div>
        </section>
    );
}
