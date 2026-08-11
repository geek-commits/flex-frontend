import React from 'react';
import { AgentShell } from '@/layouts/agent-shell';
import { AgentOperationalHeader } from './agent-operational-header';
import { CallManager } from './call-manager/call-manager';
import { CrmIntegrationHost } from './integration/crm-integration-host';
import { useWorkspaceState } from './state/use-workspace-state';

/**
 * Canonical FLEX Agent transaction workspace.
 *
 * Composes the Agent shell, the frozen external CRM integration boundary,
 * and the Call Manager panel. FLEX owns the shell, operational header, agent
 * state, connection state, and Call Manager — never the CRM contents. Agent
 * state, telephony connection, and call state all come from the canonical
 * workspace owner (AGENT_WORKSPACE_PLAN §50).
 */
export function AgentWorkspacePage() {
    const { agentState, agentStatePending, connection, sessionStartedAt, setAgentState } =
        useWorkspaceState();

    return (
        <AgentShell
            callManagerPanel={<CallManager />}
            topbar={
                <AgentOperationalHeader
                    agentState={agentState}
                    onAgentStateChange={setAgentState}
                    pendingState={agentStatePending}
                    connectionState={connection}
                    sessionStartedAt={sessionStartedAt}
                />
            }
        >
            {/* Central Workspace: Frozen Iframe Integration Boundary */}
            <div className="h-full w-full flex flex-col">
                <CrmIntegrationHost
                    title="Customer Workspace"
                    mockConfigPath="/mocks/integrations/crm-primary.json"
                />
            </div>
        </AgentShell>
    );
}
