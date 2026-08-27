import { useTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import {
    DataGrid,
    DataGridContainer,
    dataGridFeatures,
} from '@/components/reui/data-grid/data-grid';
import { DataGridScrollArea } from '@/components/reui/data-grid/data-grid-scroll-area';
import { DataGridTable } from '@/components/reui/data-grid/data-grid-table';
import { Button } from '@/components/ui/button';
import { queueColumns } from '@/features/dashboard/dashboard-queue-columns';
import type { QueueHealth } from '@/features/dashboard/dashboard-types';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

export function QueueHealth() {
    const { t } = useTranslation('supervision');
    const { data, isLoading, error } = useDashboardData();

    const rows = useMemo(() => data?.queueHealth ?? [], [data]);

    const columns = queueColumns((key, fallback) =>
        t(key, { defaultValue: fallback ?? key }),
    );
    const table = useTable({
        features: dataGridFeatures,
        columns,
        data: rows,
        getRowId: (row: QueueHealth) => row.queue,
        state: {},
        enableSorting: false,
    });

    if (error) {
        return (
            <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
                <FlexErrorState
                    title={t('dashboard.queueHealth.errorTitle', { defaultValue: 'Queue health unavailable' })}
                    description={t('dashboard.queueHealth.errorDescription', { defaultValue: 'Failed to load queue data' })}
                    action={
                        <Button onClick={() => window.location.reload()} size="sm">
                            {t('dashboard.live.retry')}
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
            <div className="border-b border-flex-workspace-divider px-4 py-3">
                <h2 className="text-sm font-semibold text-flex-text-primary">
                    {t('dashboard.metrics.queueHealth.title')}
                </h2>
            </div>

            <DataGrid
                key={t('queue.columns.queue')}
                table={table}
                recordCount={rows.length}
                isLoading={isLoading}
                loadingMode="spinner"
                emptyMessage={t('dashboard.queueHealth.empty', { defaultValue: 'No queue data available' })}
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
