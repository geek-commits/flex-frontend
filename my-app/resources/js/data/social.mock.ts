import type { SocialInboxData } from '@/features/social/social-types';

/**
 * Deterministic social inbox mock dataset for the POC.
 *
 * POC MOCK — stable IDs and timestamps (no `Math.random()`); replaces with the
 * real provider/backend boundary behind `SocialRepository`. Only text messages
 * are modeled; provider capabilities not implemented in the runtime (typing,
 * reactions, attachments, delivery states, templates) are not fabricated here.
 */

const T = (offsetMinutes: number) =>
    new Date(Date.now() - offsetMinutes * 60_000).toISOString();

export const SOCIAL_INBOX_MOCK: SocialInboxData = {
    conversations: [
        {
            id: 'conv-1',
            channel: 'whatsapp',
            participant: '+254 700 123 456',
            displayName: 'Jane Kamau',
            handle: '+254 700 123 456',
            avatarUrl: null,
            latestPreview: 'Hi, I need help with my order #4812.',
            lastActivityAt: T(4),
            unread: true,
            followUp: false,
            escalated: false,
        },
        {
            id: 'conv-2',
            channel: 'instagram',
            participant: '@sarah.kitchen',
            displayName: 'Sarah Kitchen',
            handle: '@sarah.kitchen',
            avatarUrl: null,
            latestPreview: 'Thanks! When will my delivery arrive?',
            lastActivityAt: T(28),
            unread: true,
            followUp: true,
            escalated: false,
        },
        {
            id: 'conv-3',
            channel: 'facebook',
            participant: 'James Otieno',
            displayName: 'James Otieno',
            avatarUrl: null,
            latestPreview: 'I still have not received a callback.',
            lastActivityAt: T(65),
            unread: false,
            followUp: true,
            escalated: true,
        },
        {
            id: 'conv-4',
            channel: 'whatsapp',
            participant: '+254 712 000 999',
            displayName: 'Brian Mwangi',
            handle: '+254 712 000 999',
            avatarUrl: null,
            latestPreview: 'Can you share the pricing sheet?',
            lastActivityAt: T(190),
            unread: false,
            followUp: false,
            escalated: false,
        },
        {
            id: 'conv-5',
            channel: 'instagram',
            participant: '@david.travels',
            displayName: 'David Ouma',
            handle: '@david.travels',
            avatarUrl: null,
            latestPreview: 'Perfect, that answers my question.',
            lastActivityAt: T(320),
            unread: false,
            followUp: false,
            escalated: false,
        },
    ],
    messagesByConversation: {
        'conv-1': [
            { id: 'm1', conversationId: 'conv-1', direction: 'inbound', body: 'Hi, I need help with my order #4812.', createdAt: T(18) },
            { id: 'm2', conversationId: 'conv-1', direction: 'outbound', body: 'Hi there! I can help with that. Could you confirm your email on file?', createdAt: T(16) },
            { id: 'm3', conversationId: 'conv-1', direction: 'inbound', body: 'It is customer@example.com.', createdAt: T(6) },
            { id: 'm4', conversationId: 'conv-1', direction: 'inbound', body: 'Actually I noticed the tracking link is not working.', createdAt: T(4) },
        ],
        'conv-2': [
            { id: 'm5', conversationId: 'conv-2', direction: 'inbound', body: 'Hello! Do you deliver to Westlands?', createdAt: T(50) },
            { id: 'm6', conversationId: 'conv-2', direction: 'outbound', body: 'Yes, we deliver to Westlands daily. Any preferred time?', createdAt: T(47) },
            { id: 'm7', conversationId: 'conv-2', direction: 'inbound', body: 'Thanks! When will my delivery arrive?', createdAt: T(28) },
        ],
        'conv-3': [
            { id: 'm8', conversationId: 'conv-3', direction: 'inbound', body: 'I still have not received a callback.', createdAt: T(90) },
            { id: 'm9', conversationId: 'conv-3', direction: 'outbound', body: 'Apologies for the delay. Let me escalate this to a supervisor now.', createdAt: T(70) },
        ],
        'conv-4': [
            { id: 'm10', conversationId: 'conv-4', direction: 'inbound', body: 'Can you share the pricing sheet?', createdAt: T(200) },
            { id: 'm11', conversationId: 'conv-4', direction: 'outbound', body: 'Certainly, I will send it over now.', createdAt: T(190) },
        ],
        'conv-5': [
            { id: 'm12', conversationId: 'conv-5', direction: 'inbound', body: 'Does the tour include airport pickup?', createdAt: T(340) },
            { id: 'm13', conversationId: 'conv-5', direction: 'outbound', body: 'Yes, airport pickup is included in the package.', createdAt: T(330) },
            { id: 'm14', conversationId: 'conv-5', direction: 'inbound', body: 'Perfect, that answers my question.', createdAt: T(320) },
        ],
    },
};