import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { FlexStatus } from '@/components/flex/flex-status';
import { cn } from '@/lib/utils';
import { getContactName } from '../social-identity';
import type { SocialConversation } from '../social-types';
import { ConversationAvatar } from './conversation-avatar';

export interface ConversationRowProps {
    conversation: SocialConversation;
    active: boolean;
    onSelect: () => void;
}

/**
 * Conversation list row — identity first (avatar + provider badge), then name,
 * latest message preview, follow-up/escalation metadata and quiet timestamp.
 * Selected state is a subtle primary-tinted surface, not a heavy card (§34).
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
            className={cn(
                'flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors duration-[var(--flex-duration-fast)]',
                active
                    ? 'bg-primary/[0.06]'
                    : 'hover:bg-flex-workspace-surface-muted',
            )}
        >
            <ConversationAvatar conversation={conversation} size="default" className="mt-0.5 size-8" />

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13px] font-semibold text-flex-text-primary">
                        {getContactName(conversation)}
                    </span>
                    <span className="shrink-0 text-[11px] text-flex-text-muted whitespace-nowrap">
                        {lastActivity}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-flex-text-muted">
                        {conversation.latestPreview}
                    </span>
                    {conversation.unread && (
                        <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                    )}
                </div>

                <div className="mt-1 flex items-center gap-1.5">
                    {conversation.followUp && <FlexStatus tone="info">Follow-up</FlexStatus>}
                    {conversation.escalated && <FlexStatus tone="warning">Escalated</FlexStatus>}
                </div>
            </div>
        </button>
    );
}