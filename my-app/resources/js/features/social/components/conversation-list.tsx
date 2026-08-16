import React from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { SOCIAL_CHANNELS, SOCIAL_CHANNEL_META  } from '../social-constants';
import type {SocialChannelFilter} from '../social-constants';
import type { SocialConversation } from '../social-types';
import { ConversationRow } from './conversation-row';

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
    const filtered = filter === 'all' ? conversations : conversations.filter((c) => c.channel === filter);

    return (
        <div className="flex flex-col h-full min-w-0">
            <div className="px-3 py-2 border-b border-border flex items-center gap-1 flex-wrap">
                <button
                    type="button"
                    onClick={() => onFilterChange('all')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                        filter === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                    }`}
                >
                    All
                </button>
                {SOCIAL_CHANNELS.map((channel) => (
                    <button
                        key={channel}
                        type="button"
                        onClick={() => onFilterChange(channel)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                            filter === channel
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted'
                        }`}
                    >
                        {SOCIAL_CHANNEL_META[channel].label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5">
                {filtered.length === 0 ? (
                    <FlexEmptyState
                        title={filter === 'all' ? 'No conversations yet' : `No ${SOCIAL_CHANNEL_META[filter].label} conversations`}
                        description={
                            filter === 'all'
                                ? 'Incoming social messages will appear here.'
                                : 'No conversations match this channel filter.'
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
        </div>
    );
}