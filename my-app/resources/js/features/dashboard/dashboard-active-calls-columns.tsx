import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { FlexStatus } from '@/components/flex/flex-status';
import type { FlexStatusTone } from '@/components/flex/flex-status';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/components/reui/data-grid/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import type { ActiveCall } from '@/features/dashboard/dashboard-types';
import { useCallTimer } from '@/features/dashboard/use-call-timer';


type TFn = TFunction<'supervision', undefined>;

const CALL_STATE_TONES: Record<ActiveCall['state'], FlexStatusTone> = {
    ringing: 'info',
    connected: 'success',
    hold: 'warning',
    transferring: 'info',
};

function CustomerCell({ call }: { call: ActiveCall }) {
    return (
        <span className="flex flex-col">
            <span className="font-medium text-flex-text-primary">{call.customer.name}</span>
            <span className="tabular-nums text-xs text-flex-text-muted">{call.customer.phone}</span>
        </span>
    );
}

function DurationCell({ call }: { call: ActiveCall }) {
    const duration = useCallTimer(call.startedAt);

    return <span className="tabular-nums text-flex-text-primary">{duration}</span>;
}

function TranslatedStateCell({ call, t }: { call: ActiveCall; t: TFn }) {
    const key = `supervision:activeCalls.state.${call.state}`;

    return (
        <FlexStatus tone={CALL_STATE_TONES[call.state]} className="capitalize">
            {t(key)}
        </FlexStatus>
    );
}

function StateCell({ call }: { call: ActiveCall }) {
    return (
        <FlexStatus tone={CALL_STATE_TONES[call.state]} className="capitalize">
            {call.state}
        </FlexStatus>
    );
}

function DirectionCell({ call, t }: { call: ActiveCall; t: TFn }) {
    const key = `supervision:activeCalls.direction.${call.direction}`;

    return <span className="capitalize text-flex-text-muted">{t(key)}</span>;
}

export function activeCallColumnsTranslated(t: TFn): ColumnDef<DataGridFeatures, ActiveCall>[] {
    return [
        {
            accessorKey: 'customer',
            id: 'customer',
            header: ({ column }) => <DataGridColumnHeader title={t('supervision:activeCalls.columns.customer')} column={column} />,
            cell: ({ row }) => <CustomerCell call={row.original} />,
            size: 220,
            enableSorting: false,
            meta: { kind: 'identity', align: 'start', skeleton: <Skeleton className="h-9 w-28" /> },
        },
        {
            accessorKey: 'agent',
            id: 'agent',
            header: ({ column }) => <DataGridColumnHeader title={t('supervision:activeCalls.columns.agent')} column={column} />,
            cell: ({ row }) => (
                <span className="text-flex-text-primary">{row.original.agent.name}</span>
            ),
            size: 170,
            enableSorting: false,
            meta: { kind: 'text', align: 'start', skeleton: <Skeleton className="h-4 w-24" /> },
        },
        {
            accessorKey: 'queue',
            id: 'queue',
            header: ({ column }) => <DataGridColumnHeader title={t('supervision:activeCalls.columns.queue')} column={column} />,
            cell: ({ row }) => (
                <span className="text-flex-text-primary">{row.original.queue}</span>
            ),
            size: 200,
            enableSorting: false,
            meta: { kind: 'text', align: 'start', skeleton: <Skeleton className="h-4 w-20" /> },
        },
        {
            accessorKey: 'direction',
            id: 'direction',
            header: ({ column }) => <DataGridColumnHeader title={t('supervision:activeCalls.columns.direction')} column={column} />,
            cell: ({ row }) => <DirectionCell call={row.original} t={t} />,
            size: 96,
            enableSorting: false,
            meta: { kind: 'text', align: 'start', skeleton: <Skeleton className="h-4 w-16" /> },
        },
        {
            accessorKey: 'duration',
            id: 'duration',
            header: ({ column }) => <DataGridColumnHeader title={t('supervision:activeCalls.columns.duration')} column={column} />,
            cell: ({ row }) => <DurationCell call={row.original} />,
            size: 112,
            enableSorting: false,
            meta: { kind: 'duration', align: 'end', skeleton: <Skeleton className="h-4 w-16" /> },
        },
        {
            accessorKey: 'state',
            id: 'state',
            header: ({ column }) => <DataGridColumnHeader title={t('supervision:activeCalls.columns.state')} column={column} />,
            cell: ({ row }) => <TranslatedStateCell call={row.original} t={t} />,
            size: 150,
            enableSorting: false,
            meta: { kind: 'status', align: 'start', skeleton: <Skeleton className="h-4 w-16 rounded-full" /> },
        },
    ];
}

export function activeCallColumns(): ColumnDef<DataGridFeatures, ActiveCall>[] {
    return [
        {
            accessorKey: 'customer',
            id: 'customer',
            header: ({ column }) => <DataGridColumnHeader title="Customer" column={column} />,
            cell: ({ row }) => <CustomerCell call={row.original} />,
            size: 220,
            enableSorting: false,
            meta: { kind: 'identity', align: 'start', skeleton: <Skeleton className="h-9 w-28" /> },
        },
        {
            accessorKey: 'agent',
            id: 'agent',
            header: ({ column }) => <DataGridColumnHeader title="Agent" column={column} />,
            cell: ({ row }) => (
                <span className="text-flex-text-primary">{row.original.agent.name}</span>
            ),
            size: 170,
            enableSorting: false,
            meta: { kind: 'text', align: 'start', skeleton: <Skeleton className="h-4 w-24" /> },
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
            accessorKey: 'direction',
            id: 'direction',
            header: ({ column }) => <DataGridColumnHeader title="Dir." column={column} />,
            cell: ({ row }) => (
                <span className="capitalize text-flex-text-muted">{row.original.direction}</span>
            ),
            size: 96,
            enableSorting: false,
            meta: { kind: 'text', align: 'start', skeleton: <Skeleton className="h-4 w-16" /> },
        },
        {
            accessorKey: 'duration',
            id: 'duration',
            header: ({ column }) => <DataGridColumnHeader title="Duration" column={column} />,
            cell: ({ row }) => <DurationCell call={row.original} />,
            size: 112,
            enableSorting: false,
            meta: { kind: 'duration', align: 'end', skeleton: <Skeleton className="h-4 w-16" /> },
        },
        {
            accessorKey: 'state',
            id: 'state',
            header: ({ column }) => <DataGridColumnHeader title="State" column={column} />,
            cell: ({ row }) => <StateCell call={row.original} />,
            size: 150,
            enableSorting: false,
            meta: { kind: 'status', align: 'start', skeleton: <Skeleton className="h-4 w-16 rounded-full" /> },
        },
    ];
}
