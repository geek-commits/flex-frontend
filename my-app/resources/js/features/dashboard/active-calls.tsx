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
import { activeCallColumns } from '@/features/dashboard/dashboard-active-calls-columns';
import type { ActiveCall } from '@/features/dashboard/dashboard-types';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

export function ActiveCalls() {
    const { data, isLoading, error } = useDashboardData();

    const rows = useMemo(() => data?.activeCalls ?? [], [data]);
    const columns = useMemo(() => activeCallColumns(), []);
    const table = useTable({
        features: dataGridFeatures,
        columns,
        data: rows,
        getRowId: (row: ActiveCall) => row.id,
        state: {},
        enableSorting: false,
    });

    if (error) {
        return (
            <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
                <FlexErrorState
                    title="Active calls unavailable"
                    description="Failed to load active calls"
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
                    title="No active calls"
                    description="All lines are currently clear"
                />
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
            <div className="border-b border-flex-workspace-divider px-4 py-3">
                <h2 className="text-sm font-semibold text-flex-text-primary">
                    Active Calls & Traffic
                </h2>
            </div>

            <DataGrid
                table={table}
                recordCount={rows.length}
                isLoading={isLoading}
                loadingMode="spinner"
                emptyMessage="No active calls"
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