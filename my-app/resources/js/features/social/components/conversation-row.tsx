import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { FlexStatus } from '@/components/flex/flex-status';
import type { SocialConversation } from '../social-types';
import { ChannelBadge } from './channel-badge';

export interface ConversationRowProps {
    conversation: SocialConversation;
    active: boolean;
    onSelect: () => void;
}

/**
 * Compact conversation list row — participant, channel, latest preview and
 * last activity. Restrained; no oversized avatars or multi-badge overload.
 */
export function ConversationRow({ conversation, active, onSelect }: ConversationRowProps) {
    const lastActivity =
        typeof conversation.lastActivityAt === 'string'
            ? formatDistanceToNow(new Date(conversation.lastActivityAt), { addSuffix: true })
            : '';

    return (
        <button
            type="button"
            onClick={onSelect}
            aria-current={active ? 'true' : undefined}
            role="listitem"
            className={`w-full text-left px-3 py-2.5 flex flex-col gap-1 rounded-md transition-colors ${
                active ? 'bg-muted' : 'hover:bg-muted/50'
            }`}
        >
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground truncate">
                    {conversation.participant}
                </span>
                <ChannelBadge channel={conversation.channel} />
            </div>

            <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground truncate">
                    {conversation.latestPreview}
                </span>
                {conversation.unread && (
                    <span className="size-2 rounded-full bg-primary shrink-0" aria-label="Unread" />
                )}
            </div>

            <div className="flex items-center gap-2">
                {conversation.followUp && <FlexStatus tone="info">Follow-up</FlexStatus>}
                {conversation.escalated && <FlexStatus tone="warning">Escalated</FlexStatus>}
                <span className="text-[11px] text-muted-foreground ml-auto whitespace-nowrap">{lastActivity}</span>
            </div>
        </button>
    );
}