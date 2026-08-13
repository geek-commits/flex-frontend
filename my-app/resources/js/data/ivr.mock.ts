import type { IVRRecord } from '@/domain/routing-types';

/**
 * POC MOCK — deterministic IVR fixtures. Dev-only. Destinations reference real
 * queue/recording identities where possible; the backend remains authoritative.
 */
export const IVR_MOCK_RECORDS: IVRRecord[] = [
    {
        id: 'ivr1',
        name: 'Main Menu',
        prompt: 'welcome-main',
        entries: [
            { key: '1', label: 'Sales', destination: { type: 'Queue', value: 'Sales & Inquiries' } },
            { key: '2', label: 'Support', destination: { type: 'Queue', value: 'Customer Support' } },
            { key: '3', label: 'Billing', destination: { type: 'IVR', value: 'Billing Menu' } },
            { key: '0', label: 'Operator', destination: { type: 'Extension', value: '8001' } },
        ],
        defaultDestination: { type: 'Queue', value: 'Customer Support' },
        status: 'active',
    },
    {
        id: 'ivr2',
        name: 'Billing Menu',
        prompt: 'welcome-billing',
        entries: [
            { key: '1', label: 'Payments', destination: { type: 'Recording', value: 'payment-info' } },
            { key: '2', label: 'Statement', destination: { type: 'Queue', value: 'Technical Escalations' } },
        ],
        defaultDestination: { type: 'Queue', value: 'Customer Support' },
        status: 'active',
    },
    {
        id: 'ivr3',
        name: 'After Hours',
        prompt: 'after-hours-greeting',
        entries: [
            { key: '1', label: 'Leave Message', destination: { type: 'Recording', value: 'voicemail-prompt' } },
        ],
        defaultDestination: { type: 'Hangup', value: 'Hangup' },
        status: 'inactive',
    },
];
