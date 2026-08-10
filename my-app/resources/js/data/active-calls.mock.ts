import type { ActiveCall } from '@/features/dashboard/dashboard-types';

export const ACTIVE_CALLS_MOCK: ActiveCall[] = [
    {
        id: 'call-1',
        customer: { name: 'Maria Santos', phone: '+255 712 345 678' },
        agent: { id: 'a1', name: 'John Doe' },
        queue: 'Customer Support',
        direction: 'inbound',
        state: 'connected',
        durationSeconds: 134,
        startedAt: new Date(Date.now() - 134_000).toISOString(),
    },
    {
        id: 'call-2',
        customer: { name: 'James Wilson', phone: '+255 789 123 456' },
        agent: { id: 'a4', name: 'Amina Hassan' },
        queue: 'Customer Support',
        direction: 'inbound',
        state: 'connected',
        durationSeconds: 331,
        startedAt: new Date(Date.now() - 331_000).toISOString(),
    },
    {
        id: 'call-3',
        customer: { name: 'Sarah Chen', phone: '+255 755 999 111' },
        agent: { id: 'a8', name: 'Fatuma Ally' },
        queue: 'Customer Support',
        direction: 'inbound',
        state: 'ringing',
        durationSeconds: 12,
        startedAt: new Date(Date.now() - 12_000).toISOString(),
    },
];
