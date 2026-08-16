import React from 'react';
import { useWorkspaceState } from '@/features/agent-workspace/state/use-workspace-state';
import { AgentShell } from '@/layouts/agent-shell';
import { AgentDashboardHeader } from './agent-dashboard-header';
import { agentDashboardRepository } from './agent-dashboard-repository';
import { AgentStatusSection } from './sections/agent-status';
import { DeferredSectionCard } from './sections/deferred-section';
import { QueuePressureSection } from './sections/queue-pressure';

/**
 * Canonical FLEX Agent Dashboard surface.
 *
 * An awareness-only personal operations console. It surfaces the agent's own
 * state, connection, session and queue pressure — it deliberately contains no
 * call controls (those live in the Agent Workspace / Call Manager) and no
 * supervisor dashboard widgets. Realtime agent state, telephony connection
 * and session come from the single canonical workspace owner.
 */
export function AgentDashboardPage() {
    const { agentState, agentStatePending, connection, sessionStartedAt, setAgentState } =
        useWorkspaceState();
    const data = agentDashboardRepository.getDashboardData();

    return (
        <AgentShell
            topbar={
                <AgentDashboardHeader
                    agentState={agentState}
                    onAgentStateChange={setAgentState}
                    pendingState={agentStatePending}
                    connectionState={connection}
                    sessionStartedAt={sessionStartedAt}
                />
            }
        >
            <div className="h-full w-full flex flex-col gap-4">
                <AgentStatusSection
                    profile={data.profile}
                    agentState={agentState}
                    connection={connection}
                />

                <QueuePressureSection queues={data.queuePressure} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DeferredSectionCard
                        title="Performance"
                        section={data.deferred.performance}
                    />
                    <DeferredSectionCard
                        title="Skills & Proficiency"
                        section={data.deferred.skills}
                    />
                    <DeferredSectionCard
                        title="Provider Minutes"
                        section={data.deferred.providerMinutes}
                    />
                    <DeferredSectionCard
                        title="System Notices"
                        section={data.deferred.notices}
                    />
                </div>
            </div>
        </AgentShell>
    );
}