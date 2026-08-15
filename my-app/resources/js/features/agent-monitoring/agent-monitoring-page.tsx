import { Head } from '@inertiajs/react';

import React from 'react';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexLiveDataStatus } from '@/components/flex/flex-live-data-status';
import { Button } from '@/components/ui/button';
import { AgentMonitoringToolbar } from '@/features/agent-monitoring/agent-monitoring-toolbar';
import { AgentStateSummary } from '@/features/agent-monitoring/agent-state-summary';
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
                icon: 'dashboard',
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

function AgentMonitoringContent() {
    const {
        agents,
        filteredAgents,
        search,
        setSearch,
        filters,
        setFilters,
        queues,
        hasActiveFilters,
        clearFilters,
        connectionState,
        lastUpdated,
        isRefreshing,
        refresh,
    } = useAgentMonitoring();

    const showFilteredEmpty = hasActiveFilters && filteredAgents.length === 0;

    return (
        <div className="flex w-full flex-col gap-[var(--flex-space-section)]">
            <FlexLiveDataStatus
                connectionState={connectionState}
                lastUpdated={lastUpdated}
                isRefreshing={isRefreshing}
                onRefresh={refresh}
            />

            <AgentStateSummary />

            <AgentMonitoringToolbar
                search={search}
                onSearchChange={setSearch}
                filters={filters}
                onFiltersChange={setFilters}
                queues={queues}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
            />

            {showFilteredEmpty ? (
                <FlexEmptyState
                    title="No agents match your filters"
                    description="Try a different search or clear your filters."
                    action={
                        <Button variant="outline" size="sm" className="text-xs" onClick={clearFilters}>
                            Clear filters
                        </Button>
                    }
                />
            ) : hasActiveFilters ? (
                <p className="text-xs text-flex-text-muted">
                    {filteredAgents.length} of {agents.length} agents match
                </p>
            ) : (
                <FlexEmptyState
                    title="Agent monitoring is coming online"
                    description="Live agent activity will appear here."
                />
            )}
        </div>
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

                <AgentMonitoringContent />
            </AdminShell>
        </DashboardProvider>
    );
}
