import React from 'react';
import type { AgentState, ConnectionState } from '@/types/flex';
import { AgentStateControl } from './agent-state-control';
import { ConnectionStatus } from './connection-status';

export interface AgentOperationalHeaderProps {
    agentState: AgentState;
    onAgentStateChange: (state: AgentState) => void;
    pendingState?: AgentState | null;
    stateError?: string | null;
    connectionState: ConnectionState;
    title?: string;
}

/** Agent-priority controls inserted into the shared FLEX global header. */
export function AgentOperationalHeader({
    agentState,
    onAgentStateChange,
    pendingState,
    stateError,
    connectionState,
}: AgentOperationalHeaderProps) {
    return (
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <AgentStateControl
                state={agentState}
                onSelect={onAgentStateChange}
                pendingState={pendingState}
                error={stateError}
                className="min-w-28"
            />
            <ConnectionStatus state={connectionState} />
        </div>
    );
}
