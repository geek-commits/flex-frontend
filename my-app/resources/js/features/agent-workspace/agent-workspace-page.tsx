import React, { useState } from 'react';
import { AgentShell } from '@/layouts/agent-shell';
import { AgentAssistPanel } from './agent-assist/agent-assist-panel';
import { AgentOperationalHeader } from './agent-operational-header';
import { CallManager } from './call-manager/call-manager';
import { CrmIntegrationHost } from './integration/crm-integration-host';
import { useWorkspaceState } from './state/use-workspace-state';

/**
 * Canonical FLEX Agent transaction workspace.
 *
 * Composes the Agent shell, the frozen external CRM integration boundary,
 * the Call Manager panel, and the call-scoped Agent Assist companion panel.
 * FLEX owns the shell, operational header, agent state, connection state,
 * and Call Manager — never the CRM contents. Agent state, telephony
 * connection, and call state all come from the canonical workspace owner
 * (AGENT_WORKSPACE_PLAN §50).
 *
 * Agent Assist is call-scoped: it renders only while an active call exists
 * and the agent has opened it (AGENT_ASSIST_RUNTIME_AUDIT.md). On call end it
 * resets closed, so there is never an Assist UI with no call.
 */
export function AgentWorkspacePage() {
    const {
        agentState,
        agentStatePending,
        connection,
        sessionStartedAt,
        setAgentState,
        callState,
    } = useWorkspaceState();
    const [assistOpen, setAssistOpen] = useState(false);

    const hasActiveCall = callState !== 'idle';

    // Keep Assist call-scoped: reset closed whenever the call ends. Adjusted
    // during render (the documented pattern) so no effect schedules a cascade.
    if (!hasActiveCall && assistOpen) {
        setAssistOpen(false);
    }

    return (
        <AgentShell
            callManagerPanel={
                <CallManager onOpenAssist={() => setAssistOpen(true)} />
            }
            assistPanel={
                hasActiveCall && assistOpen ? (
                    <AgentAssistPanel onClose={() => setAssistOpen(false)} />
                ) : null
            }
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
            <div className="flex h-full w-full flex-col">
                <CrmIntegrationHost
                    title="Customer Workspace"
                    mockConfigPath="/mocks/integrations/crm-primary.json"
                />
            </div>
        </AgentShell>
    );
}
