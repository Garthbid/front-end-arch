import { BankerItem } from './types';

function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const CATEGORIES = ['Vehicles', 'Recreational', 'Equipment', 'Trailers', 'Tools'];
const LOCATIONS = ['Edmonton, AB', 'Calgary, AB', 'Saskatoon, SK', 'Red Deer, AB', 'Grande Prairie, AB'];

// Helper to generate 100+ items
export const MOCK_BANKER_ITEMS: BankerItem[] = Array.from({ length: 15 }, (_, i) => {
    const id = `item-${i + 1}`;
    const isHighValue = i % 7 === 0; // Every 7th item is high value
    const isMissingVin = i % 12 === 0; // Every 12th item missing VIN
    const isLowConfidence = i % 15 === 0;

    // Random Category
    const category = CATEGORIES[i % CATEGORIES.length];

    return {
        id,
        title: `${2015 + (i % 10)} ${category === 'Vehicles' ? 'Ford F-150' : category === 'Equipment' ? 'Bobcat S570' : 'Generic Item ' + i} ${isHighValue ? 'Platinum Edition' : ''}`,
        category,
        estValueMin: isHighValue ? 55000 : 15000,
        estValueMax: isHighValue ? 65000 : 22000,
        closeAt: addDays(new Date(), (i % 5) + 1), // Closes in 1-5 days
        thumbUrl: `https://images.unsplash.com/photo-${i % 2 === 0 ? '1533473359331-0135ef1b58bf' : '1552519507-da8b1227eff4'}?auto=format&fit=crop&q=80`,
        facts: {
            year: 2015 + (i % 10),
            vin: isMissingVin ? undefined : `1FTSW21${i}55882K`,
            hours: category === 'Equipment' ? 2500 + (i * 100) : undefined,
            mileage: category === 'Vehicles' ? 85000 + (i * 1000) : undefined,
            location: LOCATIONS[i % LOCATIONS.length],
            dataConfidence: isLowConfidence ? 45 : 95,
            qualityRating: isLowConfidence ? 'Low' : (i % 3 === 0 ? 'High' : 'Medium'),
            // Mock logic for new indicators
            priceAnalysis: i % 4 === 0 ? 'Weak' : (i % 2 === 0 ? 'Strong' : 'OK'),
            sellerRating: i % 10 === 0 ? 'Risky' : (i % 5 === 0 ? 'Unrated' : (i % 3 === 0 ? 'Excellent' : 'Good')),
            longevityRating: ['A', 'B', 'B', 'C', 'D'][i % 5] as any,
        },
        // Risk flags
        flags: {
            missingVin: isMissingVin,
            highValue: isHighValue,
            lowConfidence: isLowConfidence,
        }
    };
});
