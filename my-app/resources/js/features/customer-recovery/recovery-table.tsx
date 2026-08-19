import type { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import {
    DataGrid,
    DataGridContainer,
    dataGridFeatures
    
} from '@/components/reui/data-grid/data-grid';
import type {DataGridFeatures} from '@/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/components/reui/data-grid/data-grid-column-header';
import { DataGridPagination } from '@/components/reui/data-grid/data-grid-pagination';
import { DataGridScrollArea } from '@/components/reui/data-grid/data-grid-scroll-area';
import { DataGridTable } from '@/components/reui/data-grid/data-grid-table';
import { Button } from '@/components/ui/button';
import { CallbackAction } from '@/features/customer-recovery/callback-action';
import { RecoveryOwnership } from '@/features/customer-recovery/recovery-ownership';
import { RecoveryStatus } from '@/features/customer-recovery/recovery-status';
import type { RecoveryRecord } from '@/features/customer-recovery/recovery-types';
import { VoicemailPlayer } from '@/features/customer-recovery/voicemail-player';

export interface RecoveryTableProps {
    records: RecoveryRecord[];
    currentAgent: { id: string; name: string };
    isLoading: boolean;
    error?: string;
    onRefresh: () => void;
    onRowClick: (record: RecoveryRecord) => void;
    onRecordChanged: (record: RecoveryRecord) => void;
}

function formatMissedAt(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    const today = new Date();

    const sameDay = date.toDateString() === today.toDateString();
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);

    if (sameDay) {
        return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    return date.toLocaleDateString([], { day: 'numeric', month: 'short' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function RecoveryTable({
    records,
    currentAgent,
    isLoading,
    error,
    onRefresh,
    onRowClick,
    onRecordChanged,
}: RecoveryTableProps) {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([{ id: 'missedAt', desc: true }]);

    const columns = useMemo<ColumnDef<DataGridFeatures, RecoveryRecord>[]>(
        () => [
            {
                accessorKey: 'phoneNumber',
                id: 'customer',
                header: ({ column }) => <DataGridColumnHeader title="Customer / Phone" column={column} />,
                cell: ({ row }) => (
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-flex-text-primary truncate">
                            {row.original.customerName ?? 'Unknown customer'}
                        </span>
                        <span className="font-mono text-[11px] text-flex-text-muted">{row.original.phoneNumber}</span>
                    </div>
                ),
                size: 190,
                enableSorting: true,
                meta: { kind: 'identity', align: 'start' },
            },
            {
                accessorKey: 'missedAt',
                id: 'missedAt',
                header: ({ column }) => <DataGridColumnHeader title="Missed At" column={column} />,
                cell: ({ getValue }) => (
                    <span className="text-xs tabular-nums text-flex-text-muted whitespace-nowrap">{formatMissedAt(getValue() as string)}</span>
                ),
                size: 150,
                enableSorting: true,
                meta: { kind: 'date', align: 'start' },
            },
            {
                accessorKey: 'queueName',
                id: 'queue',
                header: ({ column }) => <DataGridColumnHeader title="Queue" column={column} />,
                cell: ({ getValue }) => <span className="text-xs text-flex-text-primary">{getValue() as string}</span>,
                size: 170,
                enableSorting: true,
                meta: { kind: 'text', align: 'start' },
            },
            {
                accessorKey: 'category',
                id: 'category',
                header: 'Category',
                cell: ({ getValue }) => <span className="text-xs text-flex-text-primary">{getValue() as string}</span>,
                size: 140,
                meta: { kind: 'text', align: 'start' },
            },
            {
                accessorKey: 'attempts',
                id: 'attempts',
                header: 'Attempts',
                cell: ({ getValue }) => <span className="text-xs tabular-nums text-flex-text-primary">{getValue() as number}</span>,
                size: 70,
                meta: { kind: 'numeric', align: 'end' },
            },
            {
                id: 'voicemail',
                header: 'Voicemail',
                cell: ({ row }) => <VoicemailPlayer voicemail={row.original.voicemail} compact />,
                size: 120,
                meta: { kind: 'icon', align: 'start' },
            },
            {
                id: 'ownership',
                header: 'Ownership',
                cell: ({ row }) => <RecoveryOwnership record={row.original} currentAgentId={currentAgent.id} />,
                size: 150,
                meta: { kind: 'text', align: 'start' },
            },
            {
                accessorKey: 'status',
                id: 'status',
                header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
                cell: ({ row }) => <RecoveryStatus status={row.original.status} />,
                size: 140,
                enableSorting: true,
                meta: { kind: 'status', align: 'start' },
            },
            {
                id: 'action',
                header: 'Action',
                cell: ({ row }) => (
                    <CallbackAction
                        record={row.original}
                        currentAgent={currentAgent}
                        onChanged={onRecordChanged}
                    />
                ),
                size: 120,
                enableHiding: false,
                enableSorting: false,
                meta: { kind: 'action', align: 'center' },
            },
        ],
        [currentAgent, onRecordChanged]
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
    });

    if (error) {
        return (
            <FlexErrorState
                title="Couldn't load missed calls"
                description={error}
                action={
                    <Button variant="outline" size="sm" className="text-xs" onClick={onRefresh}>
                        Try Again
                    </Button>
                }
            />
        );
    }

    return (
        <DataGrid
            table={table}
            recordCount={records?.length || 0}
            isLoading={isLoading}
            loadingMode="skeleton"
            emptyMessage={
                <FlexEmptyState
                    title="No missed calls to recover"
                    description="New missed calls will appear here when follow-up is needed."
                />
            }
            tableLayout={{ dense: true }}
            onRowClick={onRowClick}
        >
            <div className="w-full space-y-2.5">
                <DataGridContainer>
                    <DataGridScrollArea>
                        <DataGridTable />
                    </DataGridScrollArea>
                </DataGridContainer>
                <DataGridPagination />
            </div>
        </DataGrid>
    );
}
