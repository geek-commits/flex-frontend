import { ExternalWorkspaceHost } from '@/features/integrations/external-workspace-host';
import { AgentShell } from '@/layouts/agent-shell';
import { AgentCallWorkspace } from './agent-call-workspace';
import { AgentOperationalHeader } from './agent-operational-header';
import { useWorkspaceState } from './state/use-workspace-state';

/**
 * Canonical FLEX Agent transaction workspace.
 *
 * Composes the Agent shell, the frozen external CRM integration boundary,
 * the Call Manager panel and the call-scoped Agent Assist companion. On
 * desktop, supported active calls use a vertical Call Manager/Assist
 * workspace; on mobile Assist remains another mode of the unified sheet.
 */
export function AgentWorkspacePage() {
    const { agentState, agentStatePending, connection, setAgentState } = useWorkspaceState();

    return (
        <AgentShell
            callManagerPanel={<AgentCallWorkspace />}
            topbar={
                <AgentOperationalHeader
                    agentState={agentState}
                    onAgentStateChange={setAgentState}
                    pendingState={agentStatePending}
                    connectionState={connection}
                />
            }
        >
            <ExternalWorkspaceHost title="Customer Workspace" configPath="/integrations/crm-primary.json" chrome="none" />
        </AgentShell>
    );
}
