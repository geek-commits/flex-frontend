import React, { useState } from 'react';
import { PrimaryRail } from '@/components/flex/primary-rail';
import { AppTopbar } from '@/components/flex/app-topbar';
import type { AgentState } from '@/types/flex';

export interface AgentShellProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    callManagerPanel?: React.ReactNode;
}

export function AgentShell({
    title = 'Agent Workspace',
    subtitle = 'Active Operational Session',
    children,
    callManagerPanel,
}: AgentShellProps) {
    const [agentState, setAgentState] = useState<AgentState>('ready');

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
            {/* Primary Rail */}
            <PrimaryRail activeWorkspace="agent" />

            {/* Main Content & Toolbar */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <AppTopbar
                    title={title}
                    subtitle={subtitle}
                    mode="agent"
                    agentState={agentState}
                    onAgentStateChange={setAgentState}
                />

                {/* Workspace Grid Layout: Central Workspace + Optional Call Manager */}
                <div className="flex-1 flex min-h-0 overflow-hidden">
                    <main className="flex-1 overflow-y-auto p-4 md:p-5 min-w-0">
                        {children}
                    </main>

                    {/* Optional Right Call Manager Panel */}
                    {callManagerPanel && (
                        <aside className="w-80 md:w-96 border-l border-border bg-card flex flex-col h-full shrink-0">
                            {callManagerPanel}
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
}
