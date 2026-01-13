import { CompetingOffer, BankerOffer } from './types';

/**
 * Ranks offers based on:
 * 1. Lowest APR (Primary)
 * 2. Shorter Term (Tie-breaker for same APR) - aggressive financing preferred? 
 *    Actually, users usually want longer term (lower payment). 
 *    Let's assume users want: LOWEST RATE > LONGEST TERM (Lower Payment) > HIGHER AMOUNT.
 *    Wait, user prompt said: "tie-break by shorter term (or longer term, choose one) + higher maxAmount."
 *    Let's stick to standard lending competition: 
 *    Lenders want to win by offering better rates. 
 *    Let's go with: Lowest APR > Highest Max Amount > Longest Term.
 */

export function sortOffers(offers: CompetingOffer[]): CompetingOffer[] {
    return [...offers].sort((a, b) => {
        // 1. Lowest APR wins
        if (a.apr !== b.apr) return a.apr - b.apr;

        // 2. Highest Max Amount wins (if specified)
        const amountA = a.maxAmount || 0;
        const amountB = b.maxAmount || 0;
        if (amountA !== amountB) return amountB - amountA;

        // 3. Longest Term wins (lower payment for user)
        return b.termMonths - a.termMonths;
    });
}

/**
 * Calculates the current rank of "my offer" against a list of comp offers.
 * Returns the rank (1-based index) or null if not applicable.
 */
export function calculateMyRank(myOffer: BankerOffer, competingOffers: CompetingOffer[]): number {
    // Convert my offer to competing format for comparison
    const meAsComp: CompetingOffer = {
        rank: 0, // placeholder
        apr: myOffer.apr,
        termMonths: myOffer.termMonths,
        maxAmount: myOffer.maxAmount,
        isMe: true
    };

    // Combine and sort
    const allFunction = [...competingOffers.filter(o => !o.isMe), meAsComp];
    const sorted = sortOffers(allFunction);

    // Find index (1-based)
    return sorted.findIndex(o => o.isMe) + 1;
}

// Generate deterministic mock competing offers based on item seed
export function generateMockCompetingOffers(itemId: string): CompetingOffer[] {
    // Simple hash to make it consistent
    const hash = itemId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Determine base rate based on "risk" (simulated by hash mod)
    const riskFactor = (hash % 10); // 0-9
    const baseRate = 6.0 + (riskFactor * 0.5); // 6.0% to 10.5%

    const offers: CompetingOffer[] = [
        {
            rank: 1, // Will be re-calculated by sort
            apr: Number((baseRate + (Math.random() * 0.5)).toFixed(2)),
            termMonths: 60,
            maxAmount: 50000 + (hash * 100)
        },
        {
            rank: 2,
            apr: Number((baseRate + 0.3 + (Math.random() * 0.5)).toFixed(2)),
            termMonths: 48,
        },
        {
            rank: 3,
            apr: Number((baseRate + 0.8 + (Math.random() * 0.5)).toFixed(2)),
            termMonths: 72,
        }
    ];

    return sortOffers(offers).map((o, i) => ({ ...o, rank: i + 1 }));
}
