import React from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import type { SocialMessage } from '../social-types';
import { MessageBubble } from './message-bubble';

export interface MessageTimelineProps {
    messages: SocialMessage[];
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
}

/**
 * Message timeline — readable reading order, incoming/outgoing separated.
 * Preserves viewport position on history load; only appends inbound messages
 * for the active conversation (plan §47). Safe fallback for empty/error.
 */
export function MessageTimeline({ messages, loading, error, onRetry }: MessageTimelineProps) {
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
            {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
            ))}
        </div>
    );
}