import React, { useState } from 'react';
import { AppTopbar } from '@/components/flex/app-topbar';
import { FlexAppShell } from '@/components/flex/flex-app-shell';
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

    const resolvedTopbar =
        topbar ?? (
            <AppTopbar title={title} mode="agent" agentState={agentState} onAgentStateChange={setAgentState} />
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
