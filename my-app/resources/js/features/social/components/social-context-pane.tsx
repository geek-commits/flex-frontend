import React from 'react';
import { FlexStatus } from '@/components/flex/flex-status';
import { SocialChannelIcon } from '@/components/flex/social/social-channel-icon';
import { SOCIAL_CHANNEL_META } from '../social-constants';
import { getContactHandle, getContactName } from '../social-identity';
import type { SocialConversation, SocialMessage } from '../social-types';
import { ConversationAvatar } from './conversation-avatar';

export interface SocialContextPaneProps {
    conversation: SocialConversation;
    messages: SocialMessage[];
}

function formatTimestamp(iso: string | undefined): string {
    if (!iso) {
        return '—';
    }

    return new Date(iso).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="flex flex-col gap-1.5">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-flex-text-muted">
                {title}
            </h4>
            {children}
        </section>
    );
}

/**
 * Conversation context pane — real runtime-backed data only (§65, §69, §140).
 * Section-first layout: Contact, Channel, Follow-up, Escalation, Started and
 * Last activity. No AI, no generated summaries, no fabricated activity history,
 * and no customer-record link (no such route exists). Rendered conditionally
 * by the workspace: only when a conversation is active and real context exists.
 */
export function SocialContextPane({ conversation, messages }: SocialContextPaneProps) {
    const name = getContactName(conversation);
    const handle = getContactHandle(conversation);
    const startedAt = messages[0]?.createdAt;

    return (
        <aside
            aria-label="Conversation context"
            className="flex w-full flex-col gap-5 overflow-y-auto p-4"
        >
            <div className="flex items-center gap-3">
                <ConversationAvatar conversation={conversation} size="lg" className="size-10" />
                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-flex-text-primary">
                        {name}
                    </div>
                    {handle && (
                        <div className="truncate text-xs text-flex-text-muted">{handle}</div>
                    )}
                </div>
            </div>

            <Section title="Contact">
                <div className="flex items-center gap-1.5 text-sm text-flex-text-primary">
                    <SocialChannelIcon channel={conversation.channel} className="size-4" />
                    <span>{name}</span>
                </div>
                {handle && (
                    <p className="text-xs text-flex-text-muted">{handle}</p>
                )}
            </Section>

            <Section title="Channel">
                <p className="text-sm text-flex-text-primary">
                    {SOCIAL_CHANNEL_META[conversation.channel].label}
                </p>
            </Section>

            <Section title="Follow-up">
                {conversation.followUp ? (
                    <FlexStatus tone="info">Follow-up set</FlexStatus>
                ) : (
                    <p className="text-sm text-flex-text-muted">None</p>
                )}
            </Section>

            <Section title="Escalation">
                {conversation.escalated ? (
                    <FlexStatus tone="warning">Escalated</FlexStatus>
                ) : (
                    <p className="text-sm text-flex-text-muted">Not escalated</p>
                )}
            </Section>

            <Section title="Activity">
                <dl className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between gap-3">
                        <dt className="text-flex-text-muted">Started</dt>
                        <dd className="text-flex-text-primary">{formatTimestamp(startedAt)}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <dt className="text-flex-text-muted">Last activity</dt>
                        <dd className="text-flex-text-primary">{formatTimestamp(conversation.lastActivityAt)}</dd>
                    </div>
                </dl>
            </Section>
        </aside>
    );
}