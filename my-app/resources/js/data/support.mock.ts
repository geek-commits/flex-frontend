import type { SupportData } from '@/features/support/support-types';

/**
 * Deterministic Quick Support mock dataset for the POC.
 *
 * POC MOCK — stable IDs and timestamps (no `Math.random()`); replaces with the
 * real backend boundary behind `SupportRepository`. Only runtime-verifiable
 * concepts are modeled. No support categories, statuses, or SLA claims are
 * invented beyond the explicit rows below.
 */

export const SUPPORT_MOCK: SupportData = {
    categories: ['Audio / Hardware', 'Telephony / Routing', 'CRM / Integration', 'Account & Login'],
    tickets: [
        {
            id: 'TICK-1024',
            subject: 'Headset audio crackling on WebRTC softphone',
            category: 'Audio / Hardware',
            status: 'in-progress',
            createdAt: '2026-08-07 11:30',
        },
        {
            id: 'TICK-1019',
            subject: 'DID route failover test inquiry',
            category: 'Telephony / Routing',
            status: 'resolved',
            createdAt: '2026-08-05 09:14',
        },
    ],
};