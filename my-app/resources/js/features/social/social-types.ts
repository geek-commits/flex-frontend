/**
 * Social / Omnichannel domain types.
 *
 * A unified conversation workspace for runtime-supported channels. Only fields
 * the runtime/repository can back are typed here; provider behaviors not
 * implemented in the backend (read receipts, typing, reactions, attachments,
 * delivery states, conversation status, assignment, templates) are deliberately
 * absent — they are never invented.
 */

export type SocialChannel = 'instagram' | 'facebook' | 'whatsapp';

export interface SocialChannelMeta {
    id: SocialChannel;
    label: string;
}

export interface SocialConversation {
    id: string;
    channel: SocialChannel;
    /** Provider-facing participant identity (never merged across channels). */
    participant: string;
    /** Short latest-message preview shown in the list row. */
    latestPreview: string;
    lastActivityAt: string;
    unread: boolean;
    followUp: boolean;
    escalated: boolean;
}

export type SocialMessageDirection = 'inbound' | 'outbound';

export interface SocialMessage {
    id: string;
    conversationId: string;
    direction: SocialMessageDirection;
    body: string;
    /** Canonical server timestamp (authoritative ordering field). */
    createdAt: string;
}

export interface SocialInboxData {
    conversations: SocialConversation[];
    messagesByConversation: Record<string, SocialMessage[]>;
}

export interface SocialReplyResult {
    conversationId: string;
    message: SocialMessage;
}