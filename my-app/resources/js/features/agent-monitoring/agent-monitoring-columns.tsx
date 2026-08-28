import type { ColumnDef } from '@tanstack/react-table';
import { FlexStatus } from '@/components/flex/flex-status';
import type { FlexStatusTone } from '@/components/flex/flex-status';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/components/reui/data-grid/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import type { MonitoringAgentRow } from '@/features/agent-monitoring/use-agent-monitoring';
import { useStateTimer } from '@/features/dashboard/use-state-timer';
import { agentStateMap } from '@/lib/status-styles';

const AGENT_STATE_TONES: Record<MonitoringAgentRow['state'], FlexStatusTone> = {
    ready: 'success',
    talking: 'info',
    ringing: 'warning',
    'wrap-up': 'neutral',
    break: 'neutral',
    'not-ready': 'warning',
    offline: 'danger',
};

function StateTimeCell({ row }: { row: MonitoringAgentRow }) {
    const stateTime = useStateTimer(row.stateSince);

    return (
        <span className="tabular-nums text-flex-text-primary">{stateTime}</span>
    );
}

function CurrentCallCell({ row }: { row: MonitoringAgentRow }) {
    if (!row.call) {
        return (
            <span className="text-flex-text-muted">—</span>
        );
    }

    const { direction, customer, state } = row.call;

    return (
        <span className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 capitalize text-flex-text-muted">{direction}</span>
            <span className="min-w-0 truncate text-flex-text-primary">{customer.name}</span>
            <span className="shrink-0 text-flex-text-muted">{state}</span>
        </span>
    );
}

export function monitoringColumns(t?: (key: string) => string): ColumnDef<DataGridFeatures, MonitoringAgentRow>[] {
    const tt = t ?? ((k: string) => k);

    return [
        {
            accessorKey: 'name',
            id: 'name',
            header: ({ column }) => <DataGridColumnHeader title={tt('monitoring.columns.agent')} column={column} />,
            cell: ({ row }) => (
                <span className="font-medium text-flex-text-primary">{row.original.name}</span>
            ),
            size: 200,
            enableSorting: true,
            meta: { kind: 'identity', align: 'start', skeleton: <Skeleton className="h-4 w-28" /> },
        },
        {
            accessorKey: 'extension',
            id: 'extension',
            header: ({ column }) => <DataGridColumnHeader title={tt('monitoring.columns.ext')} column={column} />,
            cell: ({ row }) => (
                <span className="tabular-nums text-flex-text-muted">{row.original.extension}</span>
            ),
            size: 88,
            enableSorting: true,
            meta: { kind: 'text', align: 'start', skeleton: <Skeleton className="h-4 w-12" /> },
        },
        {
            accessorKey: 'queue',
            id: 'queue',
            header: ({ column }) => <DataGridColumnHeader title={tt('monitoring.columns.queue')} column={column} />,
            cell: ({ row }) => (
                <span className="text-flex-text-primary">{row.original.queue}</span>
            ),
            size: 200,
            enableSorting: true,
            meta: { kind: 'text', align: 'start', skeleton: <Skeleton className="h-4 w-20" /> },
        },
        {
            accessorKey: 'state',
            id: 'state',
            header: ({ column }) => <DataGridColumnHeader title={tt('monitoring.columns.state')} column={column} />,
            cell: ({ row }) => (
                <FlexStatus tone={AGENT_STATE_TONES[row.original.state]} className="capitalize">
                    {agentStateMap[row.original.state].label}
                </FlexStatus>
            ),
            size: 150,
            enableSorting: true,
            meta: { kind: 'status', align: 'start', skeleton: <Skeleton className="h-4 w-16 rounded-full" /> },
        },
        {
            accessorKey: 'stateSince',
            id: 'stateTime',
            header: ({ column }) => <DataGridColumnHeader title={tt('monitoring.columns.stateTime')} column={column} />,
            cell: ({ row }) => <StateTimeCell row={row.original} />,
            size: 116,
            enableSorting: true,
            meta: { kind: 'duration', align: 'end', skeleton: <Skeleton className="h-4 w-16" /> },
        },
        {
            accessorKey: 'call',
            id: 'currentCall',
            header: ({ column }) => <DataGridColumnHeader title={tt('monitoring.columns.currentCall')} column={column} />,
            cell: ({ row }) => <CurrentCallCell row={row.original} />,
            size: 320,
            enableSorting: false,
            meta: { kind: 'text', align: 'start', skeleton: <Skeleton className="h-4 w-24" /> },
        },
        {
            accessorKey: 'callsToday',
            id: 'callsToday',
            header: ({ column }) => <DataGridColumnHeader title={tt('monitoring.columns.callsToday')} column={column} />,
            cell: ({ row }) => (
                <span className="font-medium tabular-nums text-flex-text-primary">{row.original.callsToday}</span>
            ),
            size: 120,
            enableSorting: true,
            meta: { kind: 'numeric', align: 'end', skeleton: <Skeleton className="h-4 w-12" /> },
        },
        {
            accessorKey: 'aht',
            id: 'aht',
            header: ({ column }) => <DataGridColumnHeader title={tt('monitoring.columns.aht')} column={column} />,
            cell: ({ row }) => (
                <span className="tabular-nums text-flex-text-primary">{row.original.aht}</span>
            ),
            size: 100,
            enableSorting: true,
            meta: { kind: 'duration', align: 'end', skeleton: <Skeleton className="h-4 w-12" /> },
        },
    ];
}
