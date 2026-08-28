import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexProfileMenu } from '@/components/flex/flex-profile-menu';
import { GlobalSearchTrigger } from '@/components/flex/global-search';
import { LanguageSwitcher } from '@/components/language-switcher';
import { AgentStateControl } from '@/features/agent-workspace/agent-state-control';
import { ConnectionStatus } from '@/features/agent-workspace/connection-status';
import type { AgentState, ConnectionState } from '@/types/flex';

export interface AgentDashboardHeaderProps {
    agentState: AgentState;
    onAgentStateChange: (state: AgentState) => void;
    pendingState?: AgentState | null;
    connectionState: ConnectionState;
}

/**
 * Agent Dashboard operational header — title-only chrome with the compact
 * ghost availability selector and exceptional connection warning.
 *
 * It deliberately includes NO call controls: the Agent Dashboard is an
 * awareness surface, and call actions live in the Agent Workspace / Call
 * Manager. Active-call duration is owned by the Dynamic Island / Call UI.
 */
export function AgentDashboardHeader({
    agentState,
    onAgentStateChange,
    pendingState,
    connectionState,
}: AgentDashboardHeaderProps) {
    const { t } = useTranslation('navigation');

    return (
        <header className="h-11 bg-flex-workspace-surface border-b border-flex-workspace-divider px-4 flex items-center justify-between gap-3 sticky top-0 z-20 shrink-0 select-none">
            <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold tracking-tight text-flex-text-primary">{t('items.agentDashboard')}</h1>
            </div>

            <div className="flex items-center gap-3">
                <AgentStateControl
                    state={agentState}
                    onSelect={onAgentStateChange}
                    pendingState={pendingState}
                />

                <ConnectionStatus state={connectionState} />
                <LanguageSwitcher variant="compact" className="hidden sm:flex" />
                <div className="ml-auto flex items-center gap-1 border-l border-border pl-1 md:ml-0 md:pl-2">
                    <GlobalSearchTrigger />
                    <div data-call-island-zone="profile-tenant" className="flex items-center">
                        <FlexProfileMenu />
                    </div>
                </div>
            </div>
        </header>
    );
}
