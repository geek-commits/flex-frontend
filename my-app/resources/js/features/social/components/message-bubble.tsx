import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import type { SocialMessage } from '../social-types';

export interface MessageBubbleProps {
    message: SocialMessage;
}

/**
 * Message bubble — restrained, content primary. Incoming/outgoing are
 * distinguished by alignment AND a visible label, not color alone (plan §31).
 * Body is rendered as plain text (safe rendering; no HTML injection, §143).
 */
export function MessageBubble({ message }: MessageBubbleProps) {
    const isInbound = message.direction === 'inbound';
    const time = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

    return (
        <div className={`flex flex-col gap-0.5 max-w-[85%] ${isInbound ? 'self-start items-start' : 'self-end items-end'}`}>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                {isInbound ? 'Incoming' : 'Outgoing'}
            </span>
            <div
                className={`px-3 py-2 rounded-lg text-sm whitespace-pre-wrap break-words border ${
                    isInbound
                        ? 'bg-card border-border text-foreground'
                        : 'bg-primary text-primary-foreground border-primary'
                }`}
            >
                {message.body}
            </div>
            <span className="text-[10px] text-muted-foreground">{time}</span>
        </div>
    );
}