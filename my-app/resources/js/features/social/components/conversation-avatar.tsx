import React from 'react';
import { SocialChannelIcon } from '@/components/flex/social/social-channel-icon';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    AvatarBadge,
} from '@/components/ui/avatar';
import {
    getContactInitials,
    getContactName,
} from '@/features/social/social-identity';
import type { SocialConversation } from '@/features/social/social-types';

export interface ConversationAvatarProps {
    conversation: SocialConversation;
    size?: 'sm' | 'default' | 'lg';
    className?: string;
}

/**
 * Conversation identity avatar: real image when runtime provides one, else
 * honest initials (display name -> handle -> neutral fallback), with a small
 * provider badge at bottom-right showing which channel the contact is on.
 * Provider brand identity is a §13 exception — the badge never leaks into
 * FLEX navigation.
 */
export function ConversationAvatar({
    conversation,
    size = 'default',
    className,
}: ConversationAvatarProps) {
    const name = getContactName(conversation);

    return (
        <Avatar size={size} className={className}>
            {conversation.avatarUrl ? (
                <AvatarImage src={conversation.avatarUrl} alt={name} />
            ) : undefined}

            <AvatarFallback>{getContactInitials(conversation)}</AvatarFallback>

            <AvatarBadge className="group-data-[size=default]/avatar:size-4 group-data-[size=lg]/avatar:size-4 group-data-[size=default]/avatar:[&>svg]:size-3.5 group-data-[size=lg]/avatar:[&>svg]:size-3.5">
                <SocialChannelIcon
                    channel={conversation.channel}
                    className="size-full"
                />
            </AvatarBadge>
        </Avatar>
    );
}
