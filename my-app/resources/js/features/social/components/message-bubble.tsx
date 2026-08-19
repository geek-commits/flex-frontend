import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { cn } from '@/lib/utils';
import type { SocialMessage } from '../social-types';

export interface MessageBubbleProps {
    message: SocialMessage;
    /** Show the author's avatar beside the bubble (first of a same-sender run). */
    showAvatar?: boolean;
    avatar?: React.ReactNode;
}

/**
 * Message bubble — restrained, content primary. Incoming sits left on a muted
 * surface; outgoing sits right in FLEX primary blue. Direction is communicated
 * by alignment alone (§47) — no repetitive INCOMING/OUTGOING labels (§46).
 * Body is plain text (safe rendering; no HTML injection).
 */
export function MessageBubble({ message, showAvatar = false, avatar }: MessageBubbleProps) {
    const isInbound = message.direction === 'inbound';
    const time = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

    return (
        <div
            className={cn(
                'flex w-full items-end gap-2',
                isInbound ? 'justify-start' : 'justify-end',
            )}
        >
            <div className={cn('w-6 shrink-0', isInbound ? 'order-1' : 'order-2')}>
                {showAvatar && isInbound ? avatar : null}
            </div>

            <div
                className={cn(
                    'flex max-w-[68%] flex-col gap-0.5',
                    isInbound ? 'order-2 items-start' : 'order-1 items-end',
                )}
            >
                <div
                    className={cn(
                        'px-3 py-2 text-sm whitespace-pre-wrap break-words rounded-2xl',
                        isInbound
                            ? 'rounded-bl-md border border-flex-workspace-divider bg-flex-workspace-surface-muted text-flex-text-primary'
                            : 'rounded-br-md bg-primary text-primary-foreground',
                    )}
                >
                    {message.body}
                </div>
                <span className="text-[10px] text-flex-text-muted">{time}</span>
            </div>

            <div className={cn('w-6 shrink-0', isInbound ? 'order-3' : 'order-4')}>
                {showAvatar && !isInbound ? avatar : null}
            </div>
        </div>
    );
}