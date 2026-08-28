import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { SOCIAL_CHANNEL_META } from '../social-constants';
import type { SocialChannelFilter } from '../social-constants';
import type { SocialConversation } from '../social-types';
import { ConversationRow } from './conversation-row';
import { SocialChannelFilter as SocialChannelFilterControl } from './social-channel-filter';

export interface ConversationListProps {
    conversations: SocialConversation[];
    filter: SocialChannelFilter;
    onFilterChange: (filter: SocialChannelFilter) => void;
    activeId: string | null;
    onSelect: (conversationId: string) => void;
}

/**
 * Unified conversation list with channel filtering. Filtering is a display
 * concern over the current snapshot; an inbound conversation is never inserted
 * into a mismatched filter view (see plan §24).
 */
export function ConversationList({
    conversations,
    filter,
    onFilterChange,
    activeId,
    onSelect,
}: ConversationListProps) {
    const { t } = useTranslation('supervision');
    const filtered = filter === 'all' ? conversations : conversations.filter((c) => c.channel === filter);

    return (
        <section aria-label={t('social.ariaLabel')} className="flex flex-col h-full min-w-0">
            <div className="border-b border-flex-workspace-divider px-3 py-2">
                <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-flex-text-primary">{t('social.inbox')}</h2>
                </div>
                <SocialChannelFilterControl value={filter} onChange={onFilterChange} />
            </div>

            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5" role="list">
                {filtered.length === 0 ? (
                    <FlexEmptyState
                        title={filter === 'all' ? t('social.empty.noConversations') : t('social.empty.noChannelConversations', { channel: SOCIAL_CHANNEL_META[filter].label })}
                        description={
                            filter === 'all'
                                ? t('social.empty.allDescription')
                                : t('social.empty.filteredDescription')
                        }
                        className="py-8"
                    />
                ) : (
                    filtered.map((conversation) => (
                        <ConversationRow
                            key={conversation.id}
                            conversation={conversation}
                            active={conversation.id === activeId}
                            onSelect={() => onSelect(conversation.id)}
                        />
                    ))
                )}
            </div>
        </section>
    );
}