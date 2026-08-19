import { RiArrowLeftLine } from '@remixicon/react';
import React from 'react';
import { SocialChannelIcon } from '@/components/flex/social/social-channel-icon';
import { Button } from '@/components/ui/button';
import { SOCIAL_CHANNEL_META } from '../social-constants';
import { getContactHandle, getContactName } from '../social-identity';
import type { SocialConversation, SocialMessage } from '../social-types';
import { ConversationAvatar } from './conversation-avatar';
import { FollowUpControls } from './follow-up-controls';
import { MessageTimeline } from './message-timeline';
import { SocialComposer } from './social-composer';

export interface ConversationDetailProps {
    conversation: SocialConversation;
    messages: SocialMessage[];
    agentName?: string;
    onBack: () => void;
    onSend: (body: string) => void;
    onToggleFollowUp: () => void;
    onEscalate: () => void;
}

/**
 * Active conversation: identity header, message timeline and reply composer.
 * Provider identity is shown via the avatar badge plus one textual provider
 * label (§77) — never a duplicate pill. Mobile offers a Back affordance;
 * desktop relies on the list selection flow.
 */
export function ConversationDetail({
    conversation,
    messages,
    agentName,
    onBack,
    onSend,
    onToggleFollowUp,
    onEscalate,
}: ConversationDetailProps) {
    const name = getContactName(conversation);
    const handle = getContactHandle(conversation);

    return (
        <div className="flex flex-col h-full min-w-0">
            <div className="flex items-center gap-3 border-b border-flex-workspace-divider px-4 py-2.5">
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

                <ConversationAvatar conversation={conversation} size="lg" className="size-9" />

                <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-flex-text-primary">
                        {name}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-flex-text-muted">
                        <SocialChannelIcon channel={conversation.channel} className="size-3.5" />
                        <span className="truncate">
                            {handle ? `${handle} / ${SOCIAL_CHANNEL_META[conversation.channel].label}` : SOCIAL_CHANNEL_META[conversation.channel].label}
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

            <MessageTimeline conversation={conversation} messages={messages} agentName={agentName} />

            <SocialComposer onSend={onSend} />
        </div>
    );
}