import React, { useState } from 'react';
import { FlexAppShell } from '@/components/flex/flex-app-shell';
import { AgentOperationalHeader } from '@/features/agent-workspace/agent-operational-header';
import type { AgentState } from '@/types/flex';

export interface AgentShellProps {
    title?: string;
    children: React.ReactNode;
    callManagerPanel?: React.ReactNode;
    /** Optional Agent Assist companion panel, rendered left of the Call Manager. */
    assistPanel?: React.ReactNode;
    /** Custom top band; overrides the default AppTopbar chrome. */
    topbar?: React.ReactNode;
}

export function AgentShell({
    title = 'Agent Workspace',
    children,
    callManagerPanel,
    assistPanel,
    topbar,
}: AgentShellProps) {
    const [agentState, setAgentState] = useState<AgentState>('ready');

    const resolvedTopbar = topbar ?? (
        <AgentOperationalHeader
            title={title}
            agentState={agentState}
            onAgentStateChange={setAgentState}
            connectionState="live"
        />
    );

    return (
        <FlexAppShell
            mode="agent"
            topbar={resolvedTopbar}
            assistPanel={assistPanel}
            rightPanel={callManagerPanel}
        >
            {children}
        </FlexAppShell>
    );
}
