import React from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { SocialConversation, SocialMessage } from '../social-types';
import { ConversationAvatar } from './conversation-avatar';
import { MessageBubble } from './message-bubble';

export interface MessageTimelineProps {
    conversation: SocialConversation;
    messages: SocialMessage[];
    /** Logged-in agent display name (outgoing avatar fallback = initials). */
    agentName?: string;
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
}

function AgentAvatar({ name }: { name: string }) {
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <Avatar size="sm" className="mt-1 size-6">
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    );
}

/**
 * Message timeline — clean incoming-left / outgoing-right rhythm, avatars shown
 * only on the first message of a consecutive same-sender run (§55). Preserves
 * viewport position on history load; only appends inbound messages for the
 * active conversation.
 */
export function MessageTimeline({
    conversation,
    messages,
    agentName = 'Agent',
    loading,
    error,
    onRetry,
}: MessageTimelineProps) {
    if (error) {
        return (
            <FlexEmptyState
                title="Couldn't load this conversation"
                description={error}
                action={
                    onRetry ? (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                        >
                            Retry
                        </button>
                    ) : undefined
                }
                className="py-10"
            />
        );
    }

    if (loading) {
        return <div className="p-4 text-xs text-muted-foreground">Loading conversation…</div>;
    }

    if (messages.length === 0) {
        return (
            <FlexEmptyState
                title="No messages yet"
                description="This conversation has no messages."
                className="py-10"
            />
        );
    }

    return (
        <div
            className="flex flex-col gap-3 overflow-y-auto p-4 min-h-0"
            role="log"
            aria-label="Conversation messages"
        >
            {messages.map((message, index) => {
                const previous = messages[index - 1];
                const isFirstOfRun =
                    !previous || previous.direction !== message.direction;

                return (
                    <MessageBubble
                        key={message.id}
                        message={message}
                        showAvatar={isFirstOfRun}
                        avatar={
                            message.direction === 'inbound' ? (
                                <ConversationAvatar
                                    conversation={conversation}
                                    size="sm"
                                    className="mt-1 size-6"
                                />
                            ) : (
                                <AgentAvatar name={agentName} />
                            )
                        }
                    />
                );
            })}
        </div>
    );
}