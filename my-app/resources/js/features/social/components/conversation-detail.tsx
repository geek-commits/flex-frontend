import { RiArrowLeftLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { SOCIAL_CHANNEL_META } from '../social-constants';
import type { SocialConversation, SocialMessage } from '../social-types';
import { ChannelBadge } from './channel-badge';
import { FollowUpControls } from './follow-up-controls';
import { MessageTimeline } from './message-timeline';
import { SocialComposer } from './social-composer';

export interface ConversationDetailProps {
    conversation: SocialConversation;
    messages: SocialMessage[];
    onBack: () => void;
    onSend: (body: string) => void;
    onToggleFollowUp: () => void;
    onEscalate: () => void;
}

/**
 * Active conversation: identity header, message timeline and reply composer.
 * Channel context is visible text (never color-only). Mobile offers a Back
 * affordance; desktop relies on the list selection flow.
 */
export function ConversationDetail({
    conversation,
    messages,
    onBack,
    onSend,
    onToggleFollowUp,
    onEscalate,
}: ConversationDetailProps) {
    return (
        <div className="flex flex-col h-full min-w-0">
            <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={onBack}
                    className="lg:hidden"
                    aria-label="Back to conversations"
                >
                    <RiArrowLeftLine className="size-4" />
                </Button>

                <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-foreground truncate">
                        {conversation.participant}
                    </div>
                    <div className="flex items-center gap-2">
                        <ChannelBadge channel={conversation.channel} />
                        <span className="text-xs text-muted-foreground">
                            {SOCIAL_CHANNEL_META[conversation.channel].label}
                        </span>
                    </div>
                </div>

                <FollowUpControls
                    followUp={conversation.followUp}
                    escalated={conversation.escalated}
                    onToggleFollowUp={onToggleFollowUp}
                    onEscalate={onEscalate}
                />
            </div>

            <MessageTimeline messages={messages} />

            <SocialComposer onSend={onSend} />
        </div>
    );
}