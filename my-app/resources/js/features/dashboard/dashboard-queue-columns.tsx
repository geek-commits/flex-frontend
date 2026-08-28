import type { ColumnDef } from '@tanstack/react-table';
import { FlexStatus } from '@/components/flex/flex-status';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/components/reui/data-grid/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { SLA_TARGET } from '@/features/dashboard/constants';
import type { QueueHealth } from '@/features/dashboard/dashboard-types';

function formatWait(seconds: number): string {
    if (seconds <= 0) {
        return '—';
    }

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function QueueStatusCell({ queue, t }: { queue: QueueHealth; t: (k: string, fallback?: string) => string }) {
    if (queue.waiting === 0) {
        return <span className="text-flex-text-muted">{t('queue.noCalls', 'No calls')}</span>;
    }

    if (queue.sla < SLA_TARGET) {
        return <FlexStatus tone="warning">{t('queue.degraded', 'Degraded')}</FlexStatus>;
    }

    if (queue.availableAgents === 0) {
        return <FlexStatus tone="warning">{t('queue.noAgents', 'No agents')}</FlexStatus>;
    }

    return <FlexStatus tone="success">{t('queue.healthy', 'Healthy')}</FlexStatus>;
}

export function queueColumns(t?: (k: string, fallback?: string) => string): ColumnDef<DataGridFeatures, QueueHealth>[] {
    const tr = t ?? ((k: string, fb?: string) => fb ?? k);

    return [
        {
            accessorKey: 'queue',
            id: 'queue',
            header: ({ column }) => <DataGridColumnHeader title={tr('queue.columns.queue', 'Queue')} column={column} />,
            cell: ({ row }) => (
                <span className="font-medium text-flex-text-primary">{row.original.queue}</span>
            ),
            size: 240,
            enableSorting: false,
            meta: { kind: 'identity', align: 'start', skeleton: <Skeleton className="h-4 w-28" /> },
        },
        {
            accessorKey: 'waiting',
            id: 'waiting',
            header: ({ column }) => <DataGridColumnHeader title={tr('queue.columns.waiting', 'Waiting')} column={column} />,
            cell: ({ row }) => (
                <span className="tabular-nums text-flex-text-primary">{row.original.waiting}</span>
            ),
            size: 96,
            enableSorting: false,
            meta: { kind: 'numeric', align: 'end', skeleton: <Skeleton className="h-4 w-8" /> },
        },
        {
            accessorKey: 'longestWait',
            id: 'longestWait',
            header: ({ column }) => <DataGridColumnHeader title={tr('queue.columns.longestWait', 'Longest Wait')} column={column} />,
            cell: ({ row }) => (
                <span className="tabular-nums text-flex-text-muted">{formatWait(row.original.longestWait)}</span>
            ),
            size: 128,
            enableSorting: false,
            meta: { kind: 'duration', align: 'end', skeleton: <Skeleton className="h-4 w-12" /> },
        },
        {
            accessorKey: 'availableAgents',
            id: 'available',
            header: ({ column }) => <DataGridColumnHeader title={tr('queue.columns.available', 'Available')} column={column} />,
            cell: ({ row }) => (
                <span className="tabular-nums text-flex-text-primary">
                    {row.original.availableAgents} / {row.original.totalAgents}
                </span>
            ),
            size: 120,
            enableSorting: false,
            meta: { kind: 'numeric', align: 'end', skeleton: <Skeleton className="h-4 w-10" /> },
        },
        {
            accessorKey: 'sla',
            id: 'sla',
            header: ({ column }) => <DataGridColumnHeader title={tr('queue.columns.sla', 'SLA')} column={column} />,
            cell: ({ row }) => (
                <span className="tabular-nums text-flex-text-primary">{row.original.sla}%</span>
            ),
            size: 112,
            enableSorting: false,
            meta: { kind: 'numeric', align: 'end', skeleton: <Skeleton className="h-4 w-10" /> },
        },
        {
            accessorKey: 'status',
            id: 'status',
            header: ({ column }) => <DataGridColumnHeader title={tr('queue.columns.status', 'Status')} column={column} />,
            cell: ({ row }) => <QueueStatusCell queue={row.original} t={tr} />,
            size: 160,
            enableSorting: false,
            meta: { kind: 'status', align: 'start', skeleton: <Skeleton className="h-4 w-16 rounded-full" /> },
        },
    ];
}
