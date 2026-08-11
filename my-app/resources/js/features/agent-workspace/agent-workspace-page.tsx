import React from 'react';
import { CallManager } from '@/components/flex/call-manager';
import { EmbeddedWorkspace } from '@/components/flex/embedded-workspace';
import { AgentShell } from '@/layouts/agent-shell';

/**
 * Canonical FLEX Agent transaction workspace.
 *
 * Composes the Agent shell, the frozen external CRM integration boundary,
 * and the Call Manager panel. FLEX owns the shell, boundary chrome, agent
 * state, connection state, and Call Manager — never the CRM contents.
 */
export function AgentWorkspacePage() {
    return (
        <AgentShell
            title="Agent Workspace"
            subtitle="External CRM & Central Call Manager"
            callManagerPanel={<CallManager />}
        >
            {/* Central Workspace: Frozen Iframe Integration Boundary */}
            <div className="h-full w-full flex flex-col">
                <EmbeddedWorkspace
                    title="Customer Workspace"
                    mockConfigPath="/mocks/integrations/crm-primary.json"
                />
            </div>
        </AgentShell>
    );
}
