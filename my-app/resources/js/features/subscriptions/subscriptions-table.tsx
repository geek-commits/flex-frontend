import {
    RiCalendarCheckLine,
    RiEyeLine,
    RiMailSendLine,
    RiRefreshLine,
} from '@remixicon/react';
import type { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import {
    DataGrid,
    DataGridContainer,
    dataGridFeatures,
} from '@/components/reui/data-grid/data-grid';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/components/reui/data-grid/data-grid-column-header';
import { DataGridPagination } from '@/components/reui/data-grid/data-grid-pagination';
import { DataGridScrollArea } from '@/components/reui/data-grid/data-grid-scroll-area';
import { DataGridTable } from '@/components/reui/data-grid/data-grid-table';
import { Button } from '@/components/ui/button';
import type { SubscriptionRecord } from '@/domain/subscription-types';
import { SubscriptionStatusBadge } from '@/features/subscriptions/subscription-status-badge';

export interface SubscriptionsTableProps {
    records: SubscriptionRecord[];
    isLoading: boolean;
    onRowClick: (record: SubscriptionRecord) => void;
    onTriggerReminder: (record: SubscriptionRecord) => void;
    onRenew: (record: SubscriptionRecord) => void;
}

export function SubscriptionsTable({
    records,
    isLoading = false,
    onRowClick,
    onTriggerReminder,
    onRenew,
}: SubscriptionsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'remainingDays', desc: false },
    ]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const columns = useMemo<ColumnDef<DataGridFeatures, SubscriptionRecord>[]>(
        () => [
            {
                accessorKey: 'accountName',
                header: ({ column }) => <DataGridColumnHeader column={column} title="Account & Contact" />,
                cell: ({ row }) => (
                    <div className="flex flex-col min-w-0 py-0.5">
                        <span className="font-semibold text-xs text-flex-text-primary truncate">
                            {row.original.accountName}
                        </span>
                        <span className="text-[11px] text-flex-text-muted font-mono truncate">
                            {row.original.contactEmail}
                        </span>
                    </div>
                ),
                size: 220,
                enableSorting: true,
                meta: { kind: 'identity', align: 'start' },
            },
            {
                accessorKey: 'plan',
                header: ({ column }) => <DataGridColumnHeader column={column} title="Plan & Seats" />,
                cell: ({ row }) => (
                    <div className="flex items-center gap-1.5 text-xs text-flex-text-primary whitespace-nowrap">
                        <span className="font-medium">{row.original.plan}</span>
                        <span className="text-flex-text-muted">({row.original.seats} seats)</span>
                    </div>
                ),
                size: 140,
                enableSorting: true,
                meta: { kind: 'text', align: 'start' },
            },
            {
                accessorKey: 'amount',
                header: ({ column }) => <DataGridColumnHeader column={column} title="Billing" />,
                cell: ({ row }) => (
                    <div className="flex flex-col text-xs">
                        <span className="font-semibold flex-numeric text-flex-text-primary">
                            ${row.original.amount.toLocaleString()} {row.original.currency}
                        </span>
                        <span className="text-[10px] text-flex-text-muted capitalize">
                            {row.original.billingCycle} · {row.original.autoRenew ? 'Auto-renew' : 'Manual'}
                        </span>
                    </div>
                ),
                size: 130,
                enableSorting: true,
                meta: { kind: 'currency', align: 'end' },
            },
            {
                accessorKey: 'expiresAt',
                header: ({ column }) => <DataGridColumnHeader column={column} title="Expires" />,
                cell: ({ row }) => {
                    const date = new Date(row.original.expiresAt);

                    return (
                        <span className="text-xs tabular-nums text-flex-text-muted whitespace-nowrap">
                            {Number.isNaN(date.getTime())
                                ? '—'
                                : date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    );
                },
                size: 120,
                enableSorting: true,
                meta: { kind: 'date', align: 'start' },
            },
            {
                accessorKey: 'remainingDays',
                header: ({ column }) => <DataGridColumnHeader column={column} title="Remaining Time" />,
                cell: ({ row }) => {
                    const days = row.original.remainingDays;

                    return (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <span
                                className={`text-xs font-semibold tabular-nums ${
                                    days === 0
                                        ? 'text-destructive font-bold'
                                        : days <= 5
                                          ? 'text-warning font-bold'
                                          : 'text-flex-text-primary'
                                }`}
                            >
                                {days === 0 ? '0 days' : `${days} days`}
                            </span>
                        </div>
                    );
                },
                size: 130,
                enableSorting: true,
                meta: { kind: 'numeric', align: 'end' },
            },
            {
                accessorKey: 'status',
                header: ({ column }) => <DataGridColumnHeader column={column} title="Status" />,
                cell: ({ row }) => (
                    <SubscriptionStatusBadge
                        status={row.original.status}
                        remainingDays={row.original.remainingDays}
                    />
                ),
                size: 120,
                enableSorting: true,
                meta: { kind: 'status', align: 'start' },
            },
            {
                id: 'notifications',
                header: 'Reminders',
                cell: ({ row }) => {
                    const rec = row.original;

                    return (
                        <div className="flex items-center gap-1.5 text-[11px] text-flex-text-muted whitespace-nowrap">
                            {rec.reminderSent ? (
                                <span className="inline-flex items-center gap-1 text-success">
                                    <RiCalendarCheckLine className="size-3.5" />
                                    Reminder sent
                                </span>
                            ) : rec.remainingDays <= 5 && rec.remainingDays > 0 ? (
                                <span className="text-warning font-medium">Due (≤5d)</span>
                            ) : (
                                <span>Not sent</span>
                            )}
                        </div>
                    );
                },
                size: 130,
                enableSorting: false,
                meta: { kind: 'text', align: 'start' },
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => (
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Inspect subscription"
                            aria-label={`Inspect ${row.original.accountName}`}
                            onClick={() => onRowClick(row.original)}
                        >
                            <RiEyeLine className="size-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Send reminder notice"
                            aria-label={`Send reminder to ${row.original.accountName}`}
                            onClick={() => onTriggerReminder(row.original)}
                        >
                            <RiMailSendLine className="size-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Renew subscription"
                            aria-label={`Renew ${row.original.accountName}`}
                            onClick={() => onRenew(row.original)}
                        >
                            <RiRefreshLine className="size-3.5" />
                        </Button>
                    </div>
                ),
                size: 110,
                enableHiding: false,
                enableSorting: false,
                meta: { kind: 'action', align: 'center' },
            },
        ],
        [onRowClick, onTriggerReminder, onRenew]
    );

    const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map((column) => column.id as string));

    const table = useTable({
        features: dataGridFeatures,
        columns,
        data: records,
        pageCount: Math.ceil((records?.length || 0) / pagination.pageSize),
        getRowId: (row: SubscriptionRecord) => row.id,
        state: { pagination, sorting, columnOrder },
        onColumnOrderChange: setColumnOrder,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
    });

    return (
        <DataGrid
            table={table}
            recordCount={records?.length || 0}
            isLoading={isLoading}
            loadingMode="skeleton"
            emptyMessage={
                <FlexEmptyState
                    title="No Subscriptions Found"
                    description="No subscription records match your current search and filter criteria."
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
