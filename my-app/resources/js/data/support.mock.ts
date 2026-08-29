import type { SupportCategory, SupportData } from '@/features/support/support-types';

/**
 * Deterministic Quick Support mock dataset for the POC.
 *
 * POC MOCK — stable IDs and timestamps (no `Math.random()`); replaces with the
 * real backend boundary behind `SupportRepository`. Only runtime-verifiable
 * concepts are modeled. No support categories, statuses, or SLA claims are
 * invented beyond the explicit rows below.
 */

export const SUPPORT_MOCK: SupportData = {
    categories: ['audioHardware', 'telephonyRouting', 'crmIntegration', 'accountLogin'] as SupportCategory[],
    tickets: [
        {
            id: 'TICK-1024',
            subject: 'Headset audio crackling on WebRTC softphone',
            category: 'audioHardware',
            status: 'in-progress',
            createdAt: '2026-08-07T11:30:00.000Z',
        },
        {
            id: 'TICK-1019',
            subject: 'DID route failover test inquiry',
            category: 'telephonyRouting',
            status: 'resolved',
            createdAt: '2026-08-05T09:14:00.000Z',
        },
    ],
};