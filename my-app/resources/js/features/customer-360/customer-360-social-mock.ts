/**
 * Customer 360 — Social timeline POC boundary.
 *
 * Minimal, Customer-360-owned deterministic mock. Does NOT depend on the native
 * Social Inbox implementation (features/social/*) and does NOT emulate the
 * external Social system. External Social UI/auth/session/realtime/messages are
 * owned by https://demo-chat.flex.co.tz and embedded at /agent/social via
 * ExternalWorkspaceHost. This file only provides the POC summary fields that
 * Customer 360 currently renders in its 360° timeline (type, timestamp,
 * channel/title, preview, route). Honest POC mock — not a network fetch.
 */

export type Customer360SocialActivity = {
    id: string;
    participant: string;
    displayName: string;
    channel: string;
    lastActivityAt: string;
    latestPreview: string;
};

const T = (offsetMinutes: number) => new Date(Date.now() - offsetMinutes * 60_000).toISOString();

export const CUSTOMER_360_SOCIAL_MOCK: Customer360SocialActivity[] = [
    {
        id: 'conv-1',
        channel: 'whatsapp',
        participant: '+254 700 123 456',
        displayName: 'Jane Kamau',
        latestPreview: 'Hi, I need help with my order #4812.',
        lastActivityAt: T(4),
    },
    {
        id: 'conv-2',
        channel: 'instagram',
        participant: '@sarah.kitchen',
        displayName: 'Sarah Kitchen',
        latestPreview: 'Thanks! When will my delivery arrive?',
        lastActivityAt: T(28),
    },
    {
        id: 'conv-3',
        channel: 'facebook',
        participant: 'James Otieno',
        displayName: 'James Otieno',
        latestPreview: 'I still have not received a callback.',
        lastActivityAt: T(65),
    },
    {
        id: 'conv-4',
        channel: 'whatsapp',
        participant: '+254 712 000 999',
        displayName: 'Brian Mwangi',
        latestPreview: 'Can you share the pricing sheet?',
        lastActivityAt: T(190),
    },
    {
        id: 'conv-5',
        channel: 'instagram',
        participant: '@david.travels',
        displayName: 'David Ouma',
        latestPreview: 'Perfect, that answers my question.',
        lastActivityAt: T(320),
    },
];

export function getCustomer360SocialActivities(): Customer360SocialActivity[] {
    return CUSTOMER_360_SOCIAL_MOCK;
}
