import React from 'react';

const ArenaFeatureStrip: React.FC = () => {
    return (
        <section className="hidden">
            <div
                className="relative w-full overflow-hidden rounded-soft shadow-sm bg-slate-900 aspect-[16/9] md:aspect-auto h-auto md:h-[280px]"
            >
                <img
                    src="/hero-image.jpg"
                    alt="Hero"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center 35%' }}
                />
            </div>
        </section>
    );
};

export default ArenaFeatureStrip;

