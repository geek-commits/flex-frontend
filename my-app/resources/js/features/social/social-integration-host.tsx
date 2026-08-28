import { AgentOperationalHeader } from '@/features/agent-workspace/agent-operational-header';
import { useWorkspaceState } from '@/features/agent-workspace/state/use-workspace-state';
import { ExternalWorkspaceHost } from '@/features/integrations/external-workspace-host';
import { AgentShell } from '@/layouts/agent-shell';

export function SocialIntegrationHost() {
    const { agentState, agentStatePending, connection, setAgentState } = useWorkspaceState();

    return (
        <AgentShell
            topbar={
                <AgentOperationalHeader
                    title="Social Inbox"
                    agentState={agentState}
                    onAgentStateChange={setAgentState}
                    pendingState={agentStatePending}
                    connectionState={connection}
                />
            }
        >
            <ExternalWorkspaceHost title="Social Inbox" configPath="/integrations/social-primary.json" />
        </AgentShell>
    );
}
