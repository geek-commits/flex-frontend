import React from 'react';
import { ActiveCalls } from '@/features/dashboard/active-calls';
import { AgentWallboard } from '@/features/dashboard/agent-wallboard';
import { CallVolumeChart } from '@/features/dashboard/call-volume-chart';
import { LiveDataStatus } from '@/features/dashboard/live-data-status';
import { OperationalException } from '@/features/dashboard/operational-exception';
import { OperationsSummary } from '@/features/dashboard/operations-summary';
import { QueueHealth } from '@/features/dashboard/queue-health';

export function ContactCenterDashboardContent() {
    return (
        <div className="flex w-full flex-col gap-[var(--flex-space-section)]">
            <LiveDataStatus />

            <OperationalException />

            <OperationsSummary />

            <CallVolumeChart />

            <div className="grid grid-cols-1 gap-[var(--flex-space-section)] lg:grid-cols-2">
                <QueueHealth />
                <ActiveCalls />
            </div>

            <AgentWallboard />
        </div>
    );
}
