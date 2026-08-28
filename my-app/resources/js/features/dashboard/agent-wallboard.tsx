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
import type { AgentRosterEntry } from '@/features/dashboard/dashboard-types';
import { wallboardColumnsTranslated } from '@/features/dashboard/dashboard-wallboard-columns';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

export function AgentWallboard() {
    const { t } = useTranslation('supervision');
    const { data, isLoading, error } = useDashboardData();

    const rows = useMemo(() => data?.agents ?? [], [data]);
    const columns = useMemo(() => wallboardColumnsTranslated(t), [t]);
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
                    title={t('dashboard.metrics.agentWallboard.errorTitle')}
                    description={t('dashboard.metrics.agentWallboard.errorDescription')}
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
                    title={t('dashboard.metrics.agentWallboard.empty')}
                    description={t('dashboard.metrics.agentWallboard.emptyDescription')}
                />
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
            <div className="flex items-center justify-between border-b border-flex-workspace-divider px-4 py-3">
                <h2 className="text-sm font-semibold text-flex-text-primary">
                    {t('dashboard.metrics.agentWallboard.title')}
                </h2>
                <span className="flex items-center gap-1.5">
                    <span
                        className="size-1.5 rounded-full bg-status-live"
                        aria-hidden="true"
                    />
                    <span className="text-xs font-semibold text-status-live">
                        {t('dashboard.metrics.agentWallboard.callsToday', { count: callsToday })}
                    </span>
                </span>
            </div>

            <DataGrid
                table={table}
                recordCount={rows.length}
                isLoading={isLoading}
                loadingMode="spinner"
                emptyMessage={t('dashboard.metrics.agentWallboard.empty')}
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