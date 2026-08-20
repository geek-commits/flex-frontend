import React, { useState } from 'react';
import { AppProviders } from '@/components/flex/app-providers';
import { AppTopbar } from '@/components/flex/app-topbar';
import { PrimaryRail } from '@/components/flex/primary-rail';
import type { AgentState } from '@/types/flex';

export interface AgentShellProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    callManagerPanel?: React.ReactNode;
    /** Optional Agent Assist companion panel, rendered left of the Call Manager. */
    assistPanel?: React.ReactNode;
    /** Custom top band; overrides the default AppTopbar chrome. */
    topbar?: React.ReactNode;
}

export function AgentShell({
    title = 'Agent Workspace',
    subtitle = 'Active Operational Session',
    children,
    callManagerPanel,
    assistPanel,
    topbar,
}: AgentShellProps) {
    const [agentState, setAgentState] = useState<AgentState>('ready');

    return (
        <AppProviders>
            <div className="flex min-h-screen overflow-hidden bg-background font-sans text-foreground antialiased">
                {/* Primary Rail */}
                <PrimaryRail activeWorkspace="agent" />

                {/* Main Content & Toolbar */}
                <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
                    {topbar ?? (
                        <AppTopbar
                            title={title}
                            subtitle={subtitle}
                            mode="agent"
                            agentState={agentState}
                            onAgentStateChange={setAgentState}
                        />
                    )}

                    {/* Workspace Grid Layout: Central Workspace + Optional Call Manager */}
                    <div className="flex min-h-0 flex-1 overflow-hidden">
                        <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-5">
                            {children}
                        </main>

                        {/* Optional Agent Assist companion panel */}
                        {assistPanel}

                        {/* Optional Right Call Manager Panel */}
                        {callManagerPanel && (
                            <aside
                                data-call-island-zone="call-manager"
                                className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-card md:w-96"
                            >
                                {callManagerPanel}
                            </aside>
                        )}
                    </div>
                </div>
            </div>
        </AppProviders>
    );
}
