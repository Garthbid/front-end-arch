import { BankerTemplate } from './types';

export const BANKER_TEMPLATES: BankerTemplate[] = [
    {
        id: 'prime_auto',
        name: 'Prime Auto',
        defaultApr: 6.9,
        termMonths: [36, 48, 60, 72, 84],
        defaultTerm: 60,
    },
    {
        id: 'standard_auto',
        name: 'Standard Auto',
        defaultApr: 8.9,
        termMonths: [36, 48, 60, 72],
        defaultTerm: 60,
    },
    {
        id: 'equipment',
        name: 'Equipment',
        defaultApr: 7.5,
        termMonths: [24, 36, 48, 60],
        defaultTerm: 48,
    },
    {
        id: 'recreational',
        name: 'Recreational',
        defaultApr: 9.9,
        termMonths: [60, 120, 180], // Longer terms usually
        defaultTerm: 120,
    },
    {
        id: 'high_risk',
        name: 'High Risk',
        defaultApr: 14.9,
        termMonths: [24, 36, 48],
        defaultTerm: 36,
    },
];
