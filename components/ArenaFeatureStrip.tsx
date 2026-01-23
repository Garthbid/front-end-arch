import React from 'react';

const ArenaFeatureStrip: React.FC = () => {
    return (
        <section className="w-full px-4 md:px-8 lg:px-12 mt-32 md:mt-8 mb-4 md:mb-10">
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

