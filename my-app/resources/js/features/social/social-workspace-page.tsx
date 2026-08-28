import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { FlexWorkbenchShell } from '@/components/flex/flex-workbench-shell';
import { AgentOperationalHeader } from '@/features/agent-workspace/agent-operational-header';
import { useWorkspaceState } from '@/features/agent-workspace/state/use-workspace-state';
import { AgentShell } from '@/layouts/agent-shell';
import { ConversationDetail } from './components/conversation-detail';
import { ConversationList } from './components/conversation-list';
import { SocialContextPane } from './components/social-context-pane';
import { SOCIAL_CHANNEL_META  } from './social-constants';
import type {SocialChannelFilter} from './social-constants';
import { getContactName } from './social-identity';
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
    const { t } = useTranslation('supervision');
    const { auth } = usePage().props;
    const agentName = (auth as { user?: { name?: string } } | undefined)?.user?.name ?? 'Agent';
    const { agentState, agentStatePending, connection, setAgentState } =
        useWorkspaceState();
    const { conversations, getMessages, sendReply, setFollowUp, escalate } = useSocialWorkspace();

    const [filter, setFilter] = useState<SocialChannelFilter>('all');
    const [activeId, setActiveId] = useState<string | null>(null);
    const [contextOpen, setContextOpen] = useState(false);

    // The active conversation is derived against the current filter so a
    // filtered-out selection is treated as inactive rather than cleared via
    // an effect (keeps derived state free of synchronous setState-in-effect).
    const activeConversation =
        conversations.find(
            (c) => c.id === activeId && (filter === 'all' || c.channel === filter),
        ) ?? null;
    const activeMessages = activeConversation ? getMessages(activeConversation.id) : [];

    // Mobile list <-> detail transition. Directional: detail enters from the
    // right, list returns from the left (8px slide + fade). AnimatePresence
    // initial={false} suppresses the animation on first paint/hydration.
    // Suppressed entirely under prefers-reduced-motion. Desktop split panes
    // (above) are untouched.
    const reduced = useReducedMotion();
    const surfaceTransition = { duration: reduced ? 0 : 0.2, ease: 'easeOut' as const };

    const handleSend = (body: string) => {
        if (activeId) {
            sendReply(activeId, body);
        }
    };

    return (
        <AgentShell
            topbar={
                <AgentOperationalHeader
                    title={t('social.title')}
                    agentState={agentState}
                    onAgentStateChange={setAgentState}
                    pendingState={agentStatePending}
                    connectionState={connection}
                />
            }
        >
            <FlexWorkbenchShell variant="primary" className="h-full min-h-0">
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
                                    agentName={agentName}
                                    onBack={() => setActiveId(null)}
                                    onSend={handleSend}
                                    onToggleFollowUp={() => activeConversation && setFollowUp(activeConversation.id, !activeConversation.followUp)}
                                    onEscalate={() => activeConversation && escalate(activeConversation.id)}
                                    onOpenContext={() => setContextOpen(true)}
                                />
                            ) : (
                                <div className="flex-1 flex items-center justify-center p-4">
                                    <p className="text-sm text-muted-foreground">
                                        {t('social.selectConversation')}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="hidden xl:flex w-[320px] shrink-0 flex-col border-l border-flex-workspace-divider">
                            {activeConversation ? (
                                <SocialContextPane
                                    conversation={activeConversation}
                                    messages={activeMessages}
                                />
                            ) : null}
                        </div>
                    </div>

                    {/* Mobile / Tablet: list → detail flow */}
                    <div className="lg:hidden flex-1 min-h-0">
                        <AnimatePresence initial={false} mode="wait">
                            {activeConversation ? (
                                <motion.div key="detail" className="h-full min-h-0" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={surfaceTransition}>
                                    <ConversationDetail
                                        conversation={activeConversation}
                                        messages={activeMessages}
                                        agentName={agentName}
                                        onBack={() => setActiveId(null)}
                                        onSend={handleSend}
                                        onToggleFollowUp={() => activeConversation && setFollowUp(activeConversation.id, !activeConversation.followUp)}
                                        onEscalate={() => activeConversation && escalate(activeConversation.id)}
                                        onOpenContext={() => setContextOpen(true)}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div key="list" className="h-full min-h-0" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={surfaceTransition}>
                                    <ConversationList
                                        conversations={conversations}
                                        filter={filter}
                                        onFilterChange={setFilter}
                                        activeId={activeId}
                                        onSelect={setActiveId}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {activeConversation && (
                    <FlexDetailSheet
                        open={contextOpen}
                        onOpenChange={setContextOpen}
                        title={t('social.contextTitle')}
                        meta={`${getContactName(activeConversation)} · ${SOCIAL_CHANNEL_META[activeConversation.channel].label}`}
                        widthClass="sm:max-w-sm"
                    >
                        <SocialContextPane
                            conversation={activeConversation}
                            messages={activeMessages}
                        />
                    </FlexDetailSheet>
                )}
            </FlexWorkbenchShell>
        </AgentShell>
    );
}