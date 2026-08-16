import { SOCIAL_INBOX_MOCK } from '@/data/social.mock';
import type { SocialInboxData, SocialMessage, SocialReplyResult } from './social-types';

/**
 * Social inbox repository boundary.
 *
 * POC MOCK — operates on the in-memory synthetic dataset. Reply, follow-up and
 * escalation mutations update a local copy for the session. The real backend
 * must implement the same contract (provider adapters, message history, reply
 * semantics, tag/follow-up, supervisor escalation) later. No HTTP API is faked;
 * the backend remains authoritative for provider message behavior. Response
 * templates are NOT modeled — they are a manual tip, not a runtime feature.
 */
export interface SocialRepository {
    getInbox(): SocialInboxData;
    getConversation(conversationId: string): SocialInboxData['conversations'][number] | undefined;
    getMessages(conversationId: string): SocialMessage[];
    sendReply(conversationId: string, body: string): SocialReplyResult | undefined;
    setFollowUp(conversationId: string, value: boolean): void;
    escalate(conversationId: string): void;
}

let data: SocialInboxData = SOCIAL_INBOX_MOCK;

let messageSeq = 0;

function nextMessageId(): string {
    messageSeq += 1;

    return `m-${messageSeq}`;
}

export const socialRepository: SocialRepository = {
    getInbox() {
        return data;
    },

    getConversation(conversationId) {
        return data.conversations.find((conversation) => conversation.id === conversationId);
    },

    getMessages(conversationId) {
        return data.messagesByConversation[conversationId] ?? [];
    },

    sendReply(conversationId, body) {
        const conversation = data.conversations.find((c) => c.id === conversationId);

        if (!conversation) {
            return undefined;
        }

        const message: SocialMessage = {
            id: nextMessageId(),
            conversationId,
            direction: 'outbound',
            body,
            createdAt: new Date().toISOString(),
        };

        data = {
            conversations: data.conversations.map((c) =>
                c.id === conversationId
                    ? {
                          ...c,
                          latestPreview: body,
                          lastActivityAt: message.createdAt,
                          unread: false,
                      }
                    : c,
            ),
            messagesByConversation: {
                ...data.messagesByConversation,
                [conversationId]: [...(data.messagesByConversation[conversationId] ?? []), message],
            },
        };

        return { conversationId, message };
    },

    setFollowUp(conversationId, value) {
        data = {
            ...data,
            conversations: data.conversations.map((c) => (c.id === conversationId ? { ...c, followUp: value } : c)),
        };
    },

    escalate(conversationId) {
        data = {
            ...data,
            conversations: data.conversations.map((c) =>
                c.id === conversationId ? { ...c, escalated: true, followUp: false } : c,
            ),
        };
    },
};