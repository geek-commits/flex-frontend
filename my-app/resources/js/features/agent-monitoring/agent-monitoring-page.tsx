import { Head } from '@inertiajs/react';
import { RiDashboardLine } from '@remixicon/react';
import React from 'react';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexLiveDataStatus } from '@/components/flex/flex-live-data-status';
import { useAgentMonitoring } from '@/features/agent-monitoring/use-agent-monitoring';
import { DashboardProvider } from '@/features/dashboard/dashboard-context';
import { AdminShell } from '@/layouts/admin-shell';

const monitoringContextGroups: ContextSidebarGroup[] = [
    {
        groupTitle: 'Supervision',
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: RiDashboardLine,
                capability: 'dashboard.view',
            },
            {
                title: 'Agent Monitoring',
                href: '/admin/monitoring',
                capability: 'monitor.view',
            },
        ],
    },
    {
        groupTitle: 'Operations',
        items: [
            {
                title: 'Call Records (CDR)',
                href: '/admin/cdr',
                capability: 'cdr.view',
            },
            {
                title: 'Call Campaigns',
                href: '/admin/campaigns',
                capability: 'campaigns.view',
            },
            {
                title: 'Reports & Analytics',
                href: '/admin/reports',
                capability: 'reports.view',
            },
        ],
    },
];

function AgentMonitoringPipelineStatus() {
    const { connectionState, lastUpdated, isRefreshing, refresh } =
        useAgentMonitoring();

    return (
        <FlexLiveDataStatus
            connectionState={connectionState}
            lastUpdated={lastUpdated}
            isRefreshing={isRefreshing}
            onRefresh={refresh}
        />
    );
}

export function AgentMonitoringPage() {
    return (
        <DashboardProvider>
            <AdminShell
                title="Agent Monitoring"
                subtitle="Live agent activity and supervisor intervention."
                contextTitle="Supervision"
                contextSubtitle="Realtime workforce monitoring"
                contextGroups={monitoringContextGroups}
            >
                <Head title="Agent Monitoring — Flex Contact Center" />

                <div className="flex w-full flex-col gap-[var(--flex-space-section)]">
                    <AgentMonitoringPipelineStatus />

                    <FlexEmptyState
                        title="Agent monitoring is coming online"
                        description="Live agent activity will appear here."
                    />
                </div>
            </AdminShell>
        </DashboardProvider>
    );
}
