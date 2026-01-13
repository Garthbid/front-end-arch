
export type BankerStatus = 'unseen' | 'passed' | 'needs_info' | 'offered';

export interface BankerItem {
    id: string;
    title: string;
    category: string;
    estValueMin: number;
    estValueMax: number;
    closeAt: Date; // Keep as Date object for easier comparison
    thumbUrl: string;
    facts: {
        year?: number;
        vin?: string;
        hours?: number; // e.g., for equipment
        mileage?: number; // e.g., for vehicles
        location: string;
        dataConfidence: number; // 0-100
        // New Banker Indicators match V2 reqs
        qualityRating: 'High' | 'Medium' | 'Low';
        priceAnalysis: 'Strong' | 'OK' | 'Weak';
        sellerRating: 'Excellent' | 'Good' | 'Risky' | 'Unrated';
        longevityRating: 'A' | 'B' | 'C' | 'D';
    };
    flags: {
        missingVin: boolean;
        highValue: boolean;
        lowConfidence: boolean;
    };
}

export interface BankerTemplate {
    id: string;
    name: string;
    defaultApr: number;
    termMonths: number[];
    defaultTerm: number;
    maxAmountPolicy?: (itemValue: number) => number;
    allowedCategories?: string[]; // If omitted, allowed for all
}

export interface CompetingOffer {
    rank: number;
    apr: number;
    termMonths: number;
    maxAmount?: number;
    isMe?: boolean;
}

export interface BankerOffer {
    itemId: string;
    lenderId: string; // 'me'
    apr: number;
    termMonths: number;
    maxAmount?: number;
    templateId?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Single source of truth for item state
export interface ItemState {
    status: BankerStatus;
    myOfferId?: string; // ID of the offer object if status is 'offered' (or 'custom_offer' generally implies an offer exists)
    lastUpdatedAt: number; // Timestamp
    riskReasons?: string[]; // Why was it flagged?
    confirmedHighRisk?: boolean; // Did user explicitly confirm?
}

export interface BankerActionLog {
    id: string;
    itemId: string;
    action: 'pass' | 'offer' | 'needs_info' | 'custom_offer';
    timestamp: number;
    previousState?: ItemState;
    newState: ItemState;
    metadata?: any; // For "Beat #1" delta, etc.
}

export interface BankerState {
    queue: BankerItem[];
    itemStateById: Record<string, ItemState>;
    offersById: Record<string, BankerOffer>; // Keyed by offer ID (or composite itemId)
    actionLog: BankerActionLog[];
    currentIndex: number;
}
