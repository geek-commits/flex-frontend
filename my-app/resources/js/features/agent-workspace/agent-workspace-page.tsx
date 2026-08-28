import { ExternalWorkspaceHost } from '@/features/integrations/external-workspace-host';
import { AgentShell } from '@/layouts/agent-shell';
import { AgentAssistDock } from './agent-assist/agent-assist-dock';
import { AgentOperationalHeader } from './agent-operational-header';
import { CallManager } from './call-manager/call-manager';
import { useWorkspaceState } from './state/use-workspace-state';

/**
 * Canonical FLEX Agent transaction workspace.
 *
 * Composes the Agent shell, the frozen external CRM integration boundary,
 * the Call Manager panel, and the call-scoped Agent Assist companion.
 * Assist is owned by the active call (connected/hold/transferring) via
 * AgentAssistSessionProvider and rendered as a compact dock on desktop;
 * on mobile Assist is another mode of the unified Call Manager sheet
 * (see CallManager).
 */
export function AgentWorkspacePage() {
    const { agentState, agentStatePending, connection, setAgentState } = useWorkspaceState();

    return (
        <AgentShell
            callManagerPanel={<CallManager />}
            assistPanel={<AgentAssistDock />}
            topbar={
                <AgentOperationalHeader
                    agentState={agentState}
                    onAgentStateChange={setAgentState}
                    pendingState={agentStatePending}
                    connectionState={connection}
                />
            }
        >
            <ExternalWorkspaceHost title="Customer Workspace" configPath="/integrations/crm-primary.json" />
        </AgentShell>
    );
}
