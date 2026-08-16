import React from 'react';
import { AgentStateControl } from '@/features/agent-workspace/agent-state-control';
import { ConnectionStatus } from '@/features/agent-workspace/connection-status';
import { SessionTimer } from '@/features/agent-workspace/session-timer';
import type { AgentState, ConnectionState } from '@/types/flex';

export interface AgentDashboardHeaderProps {
    agentState: AgentState;
    onAgentStateChange: (state: AgentState) => void;
    pendingState?: AgentState | null;
    connectionState: ConnectionState;
    sessionStartedAt?: string;
    title?: string;
    subtitle?: string;
}

/**
 * Agent Dashboard operational header.
 *
 * Awareness-first: it surfaces the agent's own availability state, telephony
 * connection and session elapsed time — reusing the canonical workspace
 * controls (AgentStateControl, ConnectionStatus, SessionTimer) and the single
 * workspace state owner. It deliberately includes NO call controls: the Agent
 * Dashboard is an awareness surface, and call actions live in the Agent
 * Workspace / Call Manager.
 */
export function AgentDashboardHeader({
    agentState,
    onAgentStateChange,
    pendingState,
    connectionState,
    sessionStartedAt,
    title = 'Agent Dashboard',
    subtitle = 'Personal Operations Overview',
}: AgentDashboardHeaderProps) {
    return (
        <header className="h-14 bg-card border-b border-border px-4 flex items-center justify-between gap-3 sticky top-0 z-20 shrink-0 select-none">
            <div className="min-w-0">
                <h1 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
                    {title}
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
                        Agent Mode
                    </span>
                </h1>
                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            </div>

            <div className="flex items-center gap-3">
                <AgentStateControl
                    state={agentState}
                    onSelect={onAgentStateChange}
                    pendingState={pendingState}
                />

                <ConnectionStatus state={connectionState} />

                <SessionTimer startedAt={sessionStartedAt} />
            </div>
        </header>
    );
}