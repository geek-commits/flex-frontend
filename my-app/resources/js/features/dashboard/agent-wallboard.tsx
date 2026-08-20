import { useTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import {
    DataGrid,
    DataGridContainer,
    dataGridFeatures,
} from '@/components/reui/data-grid/data-grid';
import { DataGridScrollArea } from '@/components/reui/data-grid/data-grid-scroll-area';
import { DataGridTable } from '@/components/reui/data-grid/data-grid-table';
import { Button } from '@/components/ui/button';
import type { AgentRosterEntry } from '@/features/dashboard/dashboard-types';
import { wallboardColumns } from '@/features/dashboard/dashboard-wallboard-columns';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

export function AgentWallboard() {
    const { data, isLoading, error } = useDashboardData();

    const rows = useMemo(() => data?.agents ?? [], [data]);
    const columns = useMemo(() => wallboardColumns(), []);
    const table = useTable({
        features: dataGridFeatures,
        columns,
        data: rows,
        getRowId: (row: AgentRosterEntry) => row.id,
        state: {},
        enableSorting: false,
    });

    const callsToday = useMemo(
        () => rows.reduce((sum, agent) => sum + agent.callsToday, 0),
        [rows],
    );

    if (error) {
        return (
            <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
                <FlexErrorState
                    title="Agent wallboard unavailable"
                    description="Failed to load agent data"
                    action={
                        <Button onClick={() => window.location.reload()} size="sm">
                            Retry
                        </Button>
                    }
                />
            </div>
        );
    }

    if (!isLoading && !error && rows.length === 0) {
        return (
            <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
                <FlexEmptyState
                    title="No agents logged in"
                    description="No agent roster data available"
                />
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
            <div className="flex items-center justify-between border-b border-flex-workspace-divider px-4 py-3">
                <h2 className="text-sm font-semibold text-flex-text-primary">
                    Live Agent Wallboard
                </h2>
                <span className="flex items-center gap-1.5">
                    <span
                        className="size-1.5 rounded-full bg-status-live"
                        aria-hidden="true"
                    />
                    <span className="text-xs font-semibold text-status-live">
                        {callsToday} calls today
                    </span>
                </span>
            </div>

            <DataGrid
                table={table}
                recordCount={rows.length}
                isLoading={isLoading}
                loadingMode="spinner"
                emptyMessage="No agents logged in"
                tableLayout={{
                    columnsMovable: false,
                }}
            >
                <DataGridContainer>
                    <DataGridScrollArea>
                        <DataGridTable />
                    </DataGridScrollArea>
                </DataGridContainer>
            </DataGrid>
        </div>
    );
}