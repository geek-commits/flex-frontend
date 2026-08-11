import React from 'react';
import { FlexLiveDataStatus } from '@/components/flex/flex-live-data-status';
import { ActiveCalls } from '@/features/dashboard/active-calls';
import { AgentWallboard } from '@/features/dashboard/agent-wallboard';
import { CallVolumeChart } from '@/features/dashboard/call-volume-chart';
import { OperationalException } from '@/features/dashboard/operational-exception';
import { OperationsSummary } from '@/features/dashboard/operations-summary';
import { QueueHealth } from '@/features/dashboard/queue-health';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

export function ContactCenterDashboardContent() {
    const { connectionState, lastUpdated, isRefreshing, refresh } =
        useDashboardData();

    return (
        <div className="flex w-full flex-col gap-[var(--flex-space-section)]">
            <FlexLiveDataStatus
                connectionState={connectionState}
                lastUpdated={lastUpdated}
                isRefreshing={isRefreshing}
                onRefresh={refresh}
                title="Contact Center"
                description="Real-time operations and queue performance"
            />

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
