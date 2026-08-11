import React, { useEffect, useRef, useState } from 'react';
import { CallManager } from '@/components/flex/call-manager';
import { AgentShell } from '@/layouts/agent-shell';
import type { AgentState, ConnectionState } from '@/types/flex';
import { AgentOperationalHeader } from './agent-operational-header';
import { CrmIntegrationHost } from './integration/crm-integration-host';

/** POC transition round-trip simulation; the real adapter (Phase 4) becomes authoritative. */
const STATE_TRANSITION_DELAY_MS = 450;

/**
 * Canonical FLEX Agent transaction workspace.
 *
 * Composes the Agent shell, the frozen external CRM integration boundary,
 * and the Call Manager panel. FLEX owns the shell, operational header, agent
 * state, connection state, and Call Manager — never the CRM contents.
 */
export function AgentWorkspacePage() {
    const [agentState, setAgentState] = useState<AgentState>('ready');
    const [connectionState] = useState<ConnectionState>('live');
    const [pendingState, setPendingState] = useState<AgentState | null>(null);
    const [sessionStartedAt] = useState(() => new Date().toISOString());
    const transitionTimer = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (transitionTimer.current !== null) {
                window.clearTimeout(transitionTimer.current);
            }
        };
    }, []);

    const handleAgentStateChange = (next: AgentState) => {
        if (pendingState !== null || next === agentState) {
            return;
        }

        setPendingState(next);
        transitionTimer.current = window.setTimeout(() => {
            setAgentState(next);
            setPendingState(null);
        }, STATE_TRANSITION_DELAY_MS);
    };

    return (
        <AgentShell
            callManagerPanel={<CallManager />}
            topbar={
                <AgentOperationalHeader
                    agentState={agentState}
                    onAgentStateChange={handleAgentStateChange}
                    pendingState={pendingState}
                    connectionState={connectionState}
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
