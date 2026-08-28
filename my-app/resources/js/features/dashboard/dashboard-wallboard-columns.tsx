import type { ColumnDef } from '@tanstack/react-table';
import { FlexStatus } from '@/components/flex/flex-status';
import type { FlexStatusTone } from '@/components/flex/flex-status';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/components/reui/data-grid/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import type { AgentRosterEntry } from '@/features/dashboard/dashboard-types';
import { useStateTimer } from '@/features/dashboard/use-state-timer';
import { agentStateMap } from '@/lib/status-styles';

type TFn = (key: string, opts?: Record<string, unknown>) => string;

const AGENT_STATE_TONES: Record<AgentRosterEntry['state'], FlexStatusTone> = {
    ready: 'success',
    talking: 'info',
    ringing: 'warning',
    'wrap-up': 'neutral',
    break: 'neutral',
    'not-ready': 'warning',
    offline: 'danger',
};

function StateTimeCell({ agent }: { agent: AgentRosterEntry }) {
    const stateTime = useStateTimer(agent.stateSince);

    return (
        <span className="tabular-nums text-flex-text-primary">{stateTime}</span>
    );
}

function CurrentCallCell({ agent }: { agent: AgentRosterEntry }) {
    if (!agent.callDuration) {
        return <span className="text-flex-text-muted">—</span>;
    }

    return <span className="tabular-nums text-flex-text-primary">{agent.callDuration}</span>;
}

function TranslatedStateCell({ agent, t }: { agent: AgentRosterEntry; t: TFn }) {
    const cfg = agentStateMap[agent.state];
    const label = cfg.labelKey ? t(cfg.labelKey) : cfg.label;

    return (
        <FlexStatus tone={AGENT_STATE_TONES[agent.state]} className="capitalize">
            {label}
        </FlexStatus>
    );
}

function StateCell({ agent }: { agent: AgentRosterEntry }) {
    const cfg = agentStateMap[agent.state];

    return (
        <FlexStatus tone={AGENT_STATE_TONES[agent.state]} className="capitalize">
            {cfg.label}
        </FlexStatus>
    );
}

export function wallboardColumnsTranslated(t: TFn): ColumnDef<DataGridFeatures, AgentRosterEntry>[] {
    return [
        {
            accessorKey: 'name',
            id: 'name',
            header: ({ column }) => <DataGridColumnHeader title={t('supervision:wallboard.columns.agent')} column={column} />,
            cell: ({ row }) => (
                <span className="font-medium text-flex-text-primary">{row.original.name}</span>
            ),
            size: 200,
            enableSorting: false,
            meta: { kind: 'identity', align: 'start', skeleton: <Skeleton className="h-4 w-28" /> },
        },
        {
            accessorKey: 'extension',
            id: 'extension',
            header: ({ column }) => <DataGridColumnHeader title={t('supervision:wallboard.columns.ext')} column={column} />,
            cell: ({ row }) => (
                <span className="tabular-nums text-flex-text-muted">{row.original.extension}</span>
            ),
            size: 88,
            enableSorting: false,
            meta: { kind: 'text', align: 'start', skeleton: <Skeleton className="h-4 w-12" /> },
        },
        {
            accessorKey: 'queue',
            id: 'queue',
            header: ({ column }) => <DataGridColumnHeader title={t('supervision:wallboard.columns.queue')} column={column} />,
            cell: ({ row }) => (
                <span className="text-flex-text-primary">{row.original.queue}</span>
            ),
            size: 200,
            enableSorting: false,
            meta: { kind: 'text', align: 'start', skeleton: <Skeleton className="h-4 w-20" /> },
        },
        {
            accessorKey: 'state',
            id: 'state',
            header: ({ column }) => <DataGridColumnHeader title={t('supervision:wallboard.columns.state')} column={column} />,
            cell: ({ row }) => <TranslatedStateCell agent={row.original} t={t} />,
            size: 150,
            enableSorting: false,
            meta: { kind: 'status', align: 'start', skeleton: <Skeleton className="h-4 w-16 rounded-full" /> },
        },
        {
            accessorKey: 'stateSince',
            id: 'stateTime',
            header: ({ column }) => <DataGridColumnHeader title={t('supervision:wallboard.columns.stateTime')} column={column} />,
            cell: ({ row }) => <StateTimeCell agent={row.original} />,
            size: 116,
            enableSorting: false,
            meta: { kind: 'duration', align: 'end', skeleton: <Skeleton className="h-4 w-16" /> },
        },
        {
            accessorKey: 'callDuration',
            id: 'currentCall',
            header: ({ column }) => <DataGridColumnHeader title={t('supervision:wallboard.columns.currentCall')} column={column} />,
            cell: ({ row }) => <CurrentCallCell agent={row.original} />,
            size: 320,
            enableSorting: false,
            meta: { kind: 'duration', align: 'start', skeleton: <Skeleton className="h-4 w-24" /> },
        },
        {
            accessorKey: 'callsToday',
            id: 'callsToday',
            header: ({ column }) => <DataGridColumnHeader title={t('supervision:wallboard.columns.callsToday')} column={column} />,
            cell: ({ row }) => (
                <span className="font-medium tabular-nums text-flex-text-primary">{row.original.callsToday}</span>
            ),
            size: 120,
            enableSorting: false,
            meta: { kind: 'numeric', align: 'end', skeleton: <Skeleton className="h-4 w-12" /> },
        },
        {
            accessorKey: 'aht',
            id: 'aht',
            header: ({ column }) => <DataGridColumnHeader title={t('supervision:wallboard.columns.aht')} column={column} />,
            cell: ({ row }) => (
                <span className="tabular-nums text-flex-text-primary">{row.original.aht}</span>
            ),
            size: 100,
            enableSorting: false,
            meta: { kind: 'duration', align: 'end', skeleton: <Skeleton className="h-4 w-12" /> },
        },
    ];
}

// Legacy non-reactive builder retained for tests; prefer wallboardColumnsTranslated(t).
export function wallboardColumns(): ColumnDef<DataGridFeatures, AgentRosterEntry>[] {
    return [
        {
            accessorKey: 'name',
            id: 'name',
            header: ({ column }) => <DataGridColumnHeader title="Agent" column={column} />,
            cell: ({ row }) => (
                <span className="font-medium text-flex-text-primary">{row.original.name}</span>
            ),
            size: 200,
            enableSorting: false,
            meta: { kind: 'identity', align: 'start', skeleton: <Skeleton className="h-4 w-28" /> },
        },
        {
            accessorKey: 'extension',
            id: 'extension',
            header: ({ column }) => <DataGridColumnHeader title="Ext." column={column} />,
            cell: ({ row }) => (
                <span className="tabular-nums text-flex-text-muted">{row.original.extension}</span>
            ),
            size: 88,
            enableSorting: false,
            meta: { kind: 'text', align: 'start', skeleton: <Skeleton className="h-4 w-12" /> },
        },
        {
            accessorKey: 'queue',
            id: 'queue',
            header: ({ column }) => <DataGridColumnHeader title="Queue" column={column} />,
            cell: ({ row }) => (
                <span className="text-flex-text-primary">{row.original.queue}</span>
            ),
            size: 200,
            enableSorting: false,
            meta: { kind: 'text', align: 'start', skeleton: <Skeleton className="h-4 w-20" /> },
        },
        {
            accessorKey: 'state',
            id: 'state',
            header: ({ column }) => <DataGridColumnHeader title="State" column={column} />,
            cell: ({ row }) => <StateCell agent={row.original} />,
            size: 150,
            enableSorting: false,
            meta: { kind: 'status', align: 'start', skeleton: <Skeleton className="h-4 w-16 rounded-full" /> },
        },
        {
            accessorKey: 'stateSince',
            id: 'stateTime',
            header: ({ column }) => <DataGridColumnHeader title="State Time" column={column} />,
            cell: ({ row }) => <StateTimeCell agent={row.original} />,
            size: 116,
            enableSorting: false,
            meta: { kind: 'duration', align: 'end', skeleton: <Skeleton className="h-4 w-16" /> },
        },
        {
            accessorKey: 'callDuration',
            id: 'currentCall',
            header: ({ column }) => <DataGridColumnHeader title="Current Call" column={column} />,
            cell: ({ row }) => <CurrentCallCell agent={row.original} />,
            size: 320,
            enableSorting: false,
            meta: { kind: 'duration', align: 'start', skeleton: <Skeleton className="h-4 w-24" /> },
        },
        {
            accessorKey: 'callsToday',
            id: 'callsToday',
            header: ({ column }) => <DataGridColumnHeader title="Calls Today" column={column} />,
            cell: ({ row }) => (
                <span className="font-medium tabular-nums text-flex-text-primary">{row.original.callsToday}</span>
            ),
            size: 120,
            enableSorting: false,
            meta: { kind: 'numeric', align: 'end', skeleton: <Skeleton className="h-4 w-12" /> },
        },
        {
            accessorKey: 'aht',
            id: 'aht',
            header: ({ column }) => <DataGridColumnHeader title="AHT" column={column} />,
            cell: ({ row }) => (
                <span className="tabular-nums text-flex-text-primary">{row.original.aht}</span>
            ),
            size: 100,
            enableSorting: false,
            meta: { kind: 'duration', align: 'end', skeleton: <Skeleton className="h-4 w-12" /> },
        },
    ];
}
