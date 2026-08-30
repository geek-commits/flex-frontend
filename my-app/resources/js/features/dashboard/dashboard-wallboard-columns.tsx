import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { FlexStatus } from '@/components/flex/flex-status';
import type { FlexStatusTone } from '@/components/flex/flex-status';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/components/reui/data-grid/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import type { AgentRosterEntry } from '@/features/dashboard/dashboard-types';
import { useStateTimer } from '@/features/dashboard/use-state-timer';
type TFn = TFunction<'supervision', undefined>;

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

const MONITORING_SUMMARY_KEYS = {
    ready: 'monitoring.summary.ready.label',
    talking: 'monitoring.summary.talking.label',
    ringing: 'monitoring.summary.ringing.label',
    'wrap-up': 'monitoring.summary.wrapUp.label',
    break: 'monitoring.summary.break.label',
    'not-ready': 'monitoring.summary.notReady.label',
    offline: 'monitoring.summary.offline.label',
} as const;

function TranslatedStateCell({ agent, t }: { agent: AgentRosterEntry; t: TFn }) {
    return (
        <FlexStatus tone={AGENT_STATE_TONES[agent.state]} className="capitalize">
            {t(MONITORING_SUMMARY_KEYS[agent.state])}
        </FlexStatus>
    );
}

export function wallboardColumnsTranslated(t: TFn): ColumnDef<DataGridFeatures, AgentRosterEntry>[] {
    return [
        {
            accessorKey: 'name',
            id: 'name',
            header: ({ column }) => <DataGridColumnHeader title={t('wallboard.columns.agent')} column={column} />,
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
            header: ({ column }) => <DataGridColumnHeader title={t('wallboard.columns.ext')} column={column} />,
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
            header: ({ column }) => <DataGridColumnHeader title={t('wallboard.columns.queue')} column={column} />,
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
            header: ({ column }) => <DataGridColumnHeader title={t('wallboard.columns.state')} column={column} />,
            cell: ({ row }) => <TranslatedStateCell agent={row.original} t={t} />,
            size: 150,
            enableSorting: false,
            meta: { kind: 'status', align: 'start', skeleton: <Skeleton className="h-4 w-16 rounded-full" /> },
        },
        {
            accessorKey: 'stateSince',
            id: 'stateTime',
            header: ({ column }) => <DataGridColumnHeader title={t('wallboard.columns.stateTime')} column={column} />,
            cell: ({ row }) => <StateTimeCell agent={row.original} />,
            size: 116,
            enableSorting: false,
            meta: { kind: 'duration', align: 'end', skeleton: <Skeleton className="h-4 w-16" /> },
        },
        {
            accessorKey: 'callDuration',
            id: 'currentCall',
            header: ({ column }) => <DataGridColumnHeader title={t('wallboard.columns.currentCall')} column={column} />,
            cell: ({ row }) => <CurrentCallCell agent={row.original} />,
            size: 320,
            enableSorting: false,
            meta: { kind: 'duration', align: 'start', skeleton: <Skeleton className="h-4 w-24" /> },
        },
        {
            accessorKey: 'callsToday',
            id: 'callsToday',
            header: ({ column }) => <DataGridColumnHeader title={t('wallboard.columns.callsToday')} column={column} />,
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
            header: ({ column }) => <DataGridColumnHeader title={t('wallboard.columns.aht')} column={column} />,
            cell: ({ row }) => (
                <span className="tabular-nums text-flex-text-primary">{row.original.aht}</span>
            ),
            size: 100,
            enableSorting: false,
            meta: { kind: 'duration', align: 'end', skeleton: <Skeleton className="h-4 w-12" /> },
        },
    ];
}