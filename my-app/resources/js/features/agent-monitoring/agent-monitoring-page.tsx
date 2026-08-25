import { Head } from '@inertiajs/react';
import type { SortingState } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';

import React, { useMemo, useState } from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { FlexLiveDataStatus } from '@/components/flex/flex-live-data-status';
import { FlexWorkbenchShell } from '@/components/flex/flex-workbench-shell';
import { dataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { Button } from '@/components/ui/button';
import { monitoringColumns } from '@/features/agent-monitoring/agent-monitoring-columns';
import { AgentMonitoringRoster } from '@/features/agent-monitoring/agent-monitoring-roster';
import { AgentMonitoringToolbar } from '@/features/agent-monitoring/agent-monitoring-toolbar';
import { AgentStateSummary } from '@/features/agent-monitoring/agent-state-summary';
import { useAgentMonitoring } from '@/features/agent-monitoring/use-agent-monitoring';
import type { MonitoringAgentRow } from '@/features/agent-monitoring/use-agent-monitoring';
import { DashboardProvider } from '@/features/dashboard/dashboard-context';
import { AdminShell } from '@/layouts/admin-shell';



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
        isLoading,
        error,
    } = useAgentMonitoring();

    const showFilteredEmpty = hasActiveFilters && filteredAgents.length === 0;
    const showTrueEmpty = !isLoading && !error && agents.length === 0 && !hasActiveFilters;

    const columns = useMemo(() => monitoringColumns(), []);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map((column) => column.id as string));

    const table = useTable({
        features: dataGridFeatures,
        columns,
        data: filteredAgents,
        getRowId: (row: MonitoringAgentRow) => row.id,
        state: { sorting, columnOrder },
        onSortingChange: setSorting,
        onColumnOrderChange: setColumnOrder,
    });

    return (
        <div className="flex w-full flex-col gap-[var(--flex-space-section)]">
            <FlexLiveDataStatus
                connectionState={connectionState}
                lastUpdated={lastUpdated}
                isRefreshing={isRefreshing}
                onRefresh={refresh}
            />

            <AgentStateSummary />

            {error ? (
                <FlexErrorState
                    title="Agent monitoring unavailable"
                    description="Failed to load live agent activity."
                    action={
                        <Button variant="outline" size="sm" className="text-xs" onClick={refresh}>
                            Retry
                        </Button>
                    }
                />
            ) : showFilteredEmpty ? (
                <FlexEmptyState
                    title="No agents match your filters"
                    description="Try a different search or clear your filters."
                    action={
                        <Button variant="outline" size="sm" className="text-xs" onClick={clearFilters}>
                            Clear filters
                        </Button>
                    }
                />
            ) : showTrueEmpty ? (
                <FlexEmptyState
                    title="No agents online"
                    description="Agent activity will appear here once agents come online."
                />
            ) : (
                <FlexWorkbenchShell variant="primary"
                    toolbar={
                        <AgentMonitoringToolbar
                            table={table}
                            search={search}
                            onSearchChange={setSearch}
                            filters={filters}
                            onFiltersChange={setFilters}
                            queues={queues}
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={clearFilters}
                        />
                    }
                >
                    <AgentMonitoringRoster table={table} rows={filteredAgents} isLoading={isLoading} />
                </FlexWorkbenchShell>
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
                
            >
                <Head title="Agent Monitoring — Flex Contact Center" />

                <AgentMonitoringContent />
            </AdminShell>
        </DashboardProvider>
    );
}
