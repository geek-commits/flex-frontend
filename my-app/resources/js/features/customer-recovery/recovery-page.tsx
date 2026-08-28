import { Head } from '@inertiajs/react';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexWorkbenchShell } from '@/components/flex/flex-workbench-shell';
import { dataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { Button } from '@/components/ui/button';
import { recoveryColumns } from '@/features/customer-recovery/recovery-columns';
import { RecoveryDetailSheet } from '@/features/customer-recovery/recovery-detail-sheet';
import { RecoveryTable } from '@/features/customer-recovery/recovery-table';
import { RecoveryToolbar } from '@/features/customer-recovery/recovery-toolbar';
import type { RecoveryRecord } from '@/features/customer-recovery/recovery-types';
import { useRecoveryData } from '@/features/customer-recovery/use-recovery-data';
import { AgentShell } from '@/layouts/agent-shell';

/**
 * Customer Recovery workspace — missed-call triage + voicemail + callback.
 * The page is the recovery surface; telephony state stays in the canonical
 * workspace store. Table, filters and pagination share one white workbench.
 */
export function RecoveryPage() {
    const { t } = useTranslation('agent');
    const { records, allRecords, query, setQuery, isLoading, error, refresh, getById, mutate, currentAgent, summary, lastUpdated } = useRecoveryData();
    const [detailId, setDetailId] = useState<string>();
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([{ id: 'missedAt', desc: true }]);

    const detailRecord = detailId ? getById(detailId) ?? records.find((record) => record.id === detailId) : undefined;

    const queues = Array.from(new Set(allRecords.map((record) => record.queueName))).sort();

    const handleRecordChanged = useCallback((record: RecoveryRecord) => {
        mutate(record);
    }, [mutate]);

    const columns = useMemo(
        () => recoveryColumns(currentAgent, handleRecordChanged, t),
        [currentAgent, handleRecordChanged, t]
    );

    const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map((column) => column.id as string));

    const table = useTable({
        features: dataGridFeatures,
        columns,
        data: records,
        pageCount: Math.ceil((records?.length || 0) / pagination.pageSize),
        getRowId: (row: RecoveryRecord) => row.id,
        state: { pagination, sorting, columnOrder },
        onColumnOrderChange: setColumnOrder,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        meta: { search: query.search ?? '' },
    });

    return (
        <AgentShell title={t('recovery.title')}>
            <Head title={t('recovery.headTitle')} />

            <div className="flex w-full flex-col gap-[var(--flex-space-section)]">
                <div className="flex flex-wrap items-center gap-4 text-xs text-flex-text-muted">
                    <span>
                        <span className="font-semibold text-flex-text-primary">{summary.unclaimedCount}</span> {t('recovery.summary.unresolved')}
                    </span>
                    <span>
                        <span className="font-semibold text-flex-text-primary">{summary.claimedByMeCount}</span> {t('recovery.summary.claimedByMe')}
                    </span>
                    <span>
                        <span className="font-semibold text-flex-text-primary">{summary.voicemailCount}</span> {t('recovery.summary.withVoicemail')}
                    </span>
                    <span className="ml-auto">
                        {t('recovery.summary.updated', { time: lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })}
                    </span>
                </div>

                <FlexWorkbenchShell variant="primary"
                    toolbar={
                        <RecoveryToolbar
                            table={table}
                            query={query}
                            queues={queues}
                            onQueryChange={(next) => {
                                setQuery(next);
                                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                            }}
                            onRefresh={refresh}
                            isRefreshing={isLoading}
                        />
                    }
                >
                    <RecoveryTable
                        table={table}
                        records={records}
                        isLoading={isLoading}
                        error={error}
                        onRefresh={refresh}
                        onRowClick={(record) => setDetailId(record.id)}
                        emptyMessage={
                            <FlexEmptyState
                                title={t('recovery.empty.noMissedCalls')}
                                description={t('recovery.empty.noMissedCallsDescription')}
                                action={
                                    <Button variant="outline" size="sm" className="text-xs" onClick={() => setQuery({})}>
                                        {t('recovery.clearFilters')}
                                    </Button>
                                }
                            />
                        }
                    />
                </FlexWorkbenchShell>
            </div>

            <RecoveryDetailSheet
                record={detailRecord}
                currentAgent={currentAgent}
                onOpenChange={(open) => !open && setDetailId(undefined)}
                onRecordChanged={handleRecordChanged}
            />
        </AgentShell>
    );
}