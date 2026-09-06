import React from 'react';
import { AgentStateControl } from '@/features/agent-workspace/agent-state-control';
import { ConnectionStatus } from '@/features/agent-workspace/connection-status';
import type { AgentState, ConnectionState } from '@/types/flex';

export interface AgentDashboardHeaderProps {
    agentState: AgentState;
    onAgentStateChange: (state: AgentState) => void;
    pendingState?: AgentState | null;
    connectionState: ConnectionState;
}

/** Agent status controls inserted into the universal global header. */
export function AgentDashboardHeader({
    agentState,
    onAgentStateChange,
    pendingState,
    connectionState,
}: AgentDashboardHeaderProps) {
    return (
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <AgentStateControl
                state={agentState}
                onSelect={onAgentStateChange}
                pendingState={pendingState}
            />
            <ConnectionStatus state={connectionState} />
        </div>
    );
}
