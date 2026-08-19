import type { SocialConversation } from './social-types';

/**
 * Conversation identity resolution (§17 source priority).
 *
 * Avatar/profile images come first from real runtime data (none today), then
 * real FLEX contact avatars, then initials from display name, then initials
 * from the social handle, then a neutral phone fallback. Never fabricate
 * customer portraits.
 */
export function getContactName(conversation: SocialConversation): string {
    return conversation.displayName ?? conversation.participant;
}

export function getContactHandle(conversation: SocialConversation): string | undefined {
    return conversation.handle;
}

export function getContactInitials(conversation: SocialConversation): string {
    const name = getContactName(conversation).trim();

    if (name) {
        const parts = name.split(/\s+/).filter(Boolean);

        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }

        return parts[0].slice(0, 2).toUpperCase();
    }

    const handle = getContactHandle(conversation)?.trim();

    if (handle && handle[0] !== '+') {
        const clean = handle.replace(/^@/, '').replace(/\d/g, '');

        if (clean) {
            return clean.slice(0, 2).toUpperCase();
        }
    }

    return '?';
}

/** True when the contact is only known by a phone number (no name). */
export function isPhoneOnly(conversation: SocialConversation): boolean {
    return !conversation.displayName && (conversation.participant.startsWith('+') || /^\d+$/.test(conversation.participant));
}