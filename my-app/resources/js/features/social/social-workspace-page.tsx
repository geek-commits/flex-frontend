import React, { useState } from 'react';
import { FlexWorkbenchShell } from '@/components/flex/flex-workbench-shell';
import { AgentOperationalHeader } from '@/features/agent-workspace/agent-operational-header';
import { useWorkspaceState } from '@/features/agent-workspace/state/use-workspace-state';
import { AgentShell } from '@/layouts/agent-shell';
import { ConversationDetail } from './components/conversation-detail';
import { ConversationList } from './components/conversation-list';
import type { SocialChannelFilter } from './social-constants';
import { useSocialWorkspace } from './use-social-workspace';

/**
 * Canonical FLEX Social / Omnichannel workspace.
 *
 * A unified conversation inbox across runtime-supported channels (Instagram,
 * Facebook, WhatsApp). Agents scan the list, open a conversation, read history,
 * reply, tag for follow-up and escalate to a supervisor. It contains no call
 * controls (those live in the Agent Workspace / Call Manager) and no social
 * analytics. Realtime agent state/connection come from the canonical workspace
 * owner; conversation data from the social repository.
 */
export function SocialWorkspacePage() {
    const { agentState, agentStatePending, connection, sessionStartedAt, setAgentState } =
        useWorkspaceState();
    const { conversations, getMessages, sendReply, setFollowUp, escalate } = useSocialWorkspace();

    const [filter, setFilter] = useState<SocialChannelFilter>('all');
    const [activeId, setActiveId] = useState<string | null>(null);

    // The active conversation is derived against the current filter so a
    // filtered-out selection is treated as inactive rather than cleared via
    // an effect (keeps derived state free of synchronous setState-in-effect).
    const activeConversation =
        conversations.find(
            (c) => c.id === activeId && (filter === 'all' || c.channel === filter),
        ) ?? null;
    const activeMessages = activeConversation ? getMessages(activeConversation.id) : [];

    const handleSend = (body: string) => {
        if (activeId) {
            sendReply(activeId, body);
        }
    };

    return (
        <AgentShell
            topbar={
                <AgentOperationalHeader
                    title="Social Inbox"
                    subtitle="Unified customer conversations across connected channels"
                    agentState={agentState}
                    onAgentStateChange={setAgentState}
                    pendingState={agentStatePending}
                    connectionState={connection}
                    sessionStartedAt={sessionStartedAt}
                />
            }
        >
            <FlexWorkbenchShell>
                <div className="flex h-full w-full flex-col">
                    {/* Desktop / Laptop: side-by-side split view */}
                    <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden">
                        <aside className="w-[360px] shrink-0 border-r border-flex-workspace-divider flex flex-col h-full">
                            <ConversationList
                                conversations={conversations}
                                filter={filter}
                                onFilterChange={setFilter}
                                activeId={activeId}
                                onSelect={setActiveId}
                            />
                        </aside>

                        <div className="hidden lg:flex flex-1 flex-col min-w-0 border-l border-flex-workspace-divider">
                            {activeConversation ? (
                                <ConversationDetail
                                    conversation={activeConversation}
                                    messages={activeMessages}
                                    onBack={() => setActiveId(null)}
                                    onSend={handleSend}
                                    onToggleFollowUp={() => activeConversation && setFollowUp(activeConversation.id, !activeConversation.followUp)}
                                    onEscalate={() => activeConversation && escalate(activeConversation.id)}
                                />
                            ) : (
                                <div className="flex-1 flex items-center justify-center p-4">
                                    <p className="text-sm text-muted-foreground">
                                        Select a conversation to view and reply.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile / Tablet: list → detail flow */}
                    <div className="lg:hidden flex-1 min-h-0">
                        {activeConversation ? (
                            <ConversationDetail
                                conversation={activeConversation}
                                messages={activeMessages}
                                onBack={() => setActiveId(null)}
                                onSend={handleSend}
                                onToggleFollowUp={() => activeConversation && setFollowUp(activeConversation.id, !activeConversation.followUp)}
                                onEscalate={() => activeConversation && escalate(activeConversation.id)}
                            />
                        ) : (
                            <ConversationList
                                conversations={conversations}
                                filter={filter}
                                onFilterChange={setFilter}
                                activeId={activeId}
                                onSelect={setActiveId}
                            />
                        )}
                    </div>
                </div>
            </FlexWorkbenchShell>
        </AgentShell>
    );
}