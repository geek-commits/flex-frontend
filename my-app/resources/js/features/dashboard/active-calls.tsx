import { useTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
import { activeCallColumnsTranslated } from '@/features/dashboard/dashboard-active-calls-columns';
import type { ActiveCall } from '@/features/dashboard/dashboard-types';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

export function ActiveCalls() {
    const { t } = useTranslation('supervision');
    const { data, isLoading, error } = useDashboardData();

    const rows = useMemo(() => data?.activeCalls ?? [], [data]);
    const columns = useMemo(() => activeCallColumnsTranslated(t), [t]);
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
                    title={t('dashboard.metrics.activeCalls.errorTitle')}
                    description={t('dashboard.metrics.activeCalls.errorDescription')}
                    action={
                        <Button onClick={() => window.location.reload()} size="sm">
                            {t('dashboard.live.retry')}
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
                    title={t('dashboard.metrics.activeCalls.empty')}
                    description={t('dashboard.metrics.activeCalls.emptyDescription')}
                />
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
            <div className="border-b border-flex-workspace-divider px-4 py-3">
                <h2 className="text-sm font-semibold text-flex-text-primary">
                    {t('dashboard.metrics.activeCalls.title')}
                </h2>
            </div>

            <DataGrid
                table={table}
                recordCount={rows.length}
                isLoading={isLoading}
                loadingMode="spinner"
                emptyMessage={t('dashboard.metrics.activeCalls.empty')}
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