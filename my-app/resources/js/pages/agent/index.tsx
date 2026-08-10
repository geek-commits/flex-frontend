import React from 'react';
import { Head } from '@inertiajs/react';
import { AgentShell } from '@/layouts/agent-shell';
import { EmbeddedWorkspace } from '@/components/flex/embedded-workspace';
import { CallManager } from '@/components/flex/call-manager';

export default function AgentWorkspacePage() {
    return (
        <AgentShell
            title="Agent Operational Workspace"
            subtitle="Embedded CRM & Central Call Manager"
            callManagerPanel={<CallManager />}
        >
            <Head title="Agent Workspace — Flex Contact Center" />

            {/* Central Workspace: Frozen Iframe Integration Boundary */}
            <div className="h-full w-full flex flex-col">
                <EmbeddedWorkspace
                    title="External CRM Integration Host"
                    mockConfigPath="/mocks/integrations/crm-primary.json"
                />
            </div>
        </AgentShell>
    );
}
