import { RiSparklingLine } from '@remixicon/react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AgentShell } from '@/layouts/agent-shell';
import { cn } from '@/lib/utils';
import { AgentAssistPanel } from './agent-assist/agent-assist-panel';
import { AgentOperationalHeader } from './agent-operational-header';
import { CallManager } from './call-manager/call-manager';
import { CrmIntegrationHost } from './integration/crm-integration-host';
import { useWorkspaceState } from './state/use-workspace-state';

/**
 * Canonical FLEX Agent transaction workspace.
 *
 * Composes the Agent shell, the frozen external CRM integration boundary,
 * the Call Manager panel, and the optional Agent Assist companion panel.
 * FLEX owns the shell, operational header, agent state, connection state,
 * and Call Manager — never the CRM contents. Agent state, telephony
 * connection, and call state all come from the canonical workspace owner
 * (AGENT_WORKSPACE_PLAN §50).
 */
export function AgentWorkspacePage() {
    const {
        agentState,
        agentStatePending,
        connection,
        sessionStartedAt,
        setAgentState,
    } = useWorkspaceState();
    const [assistOpen, setAssistOpen] = useState(false);

    return (
        <AgentShell
            callManagerPanel={<CallManager />}
            assistPanel={
                <AgentAssistPanel
                    open={assistOpen}
                    onClose={() => setAssistOpen(false)}
                />
            }
            topbar={
                <AgentOperationalHeader
                    agentState={agentState}
                    onAgentStateChange={setAgentState}
                    pendingState={agentStatePending}
                    connectionState={connection}
                    sessionStartedAt={sessionStartedAt}
                    assistSlot={
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setAssistOpen((open) => !open)}
                            aria-pressed={assistOpen}
                            aria-label="Toggle Agent Assist"
                            className={cn(
                                'gap-1.5',
                                assistOpen && 'bg-muted text-foreground',
                            )}
                        >
                            <RiSparklingLine className="size-4" />
                            <span className="hidden sm:inline">
                                Agent Assist
                            </span>
                        </Button>
                    }
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
