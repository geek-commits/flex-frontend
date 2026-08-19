import { RiDownload2Line, RiEyeLine, RiPlayFill } from '@remixicon/react';
import type { ColumnDef } from '@tanstack/react-table';
import { FlexStatus  } from '@/components/flex/flex-status';
import type {FlexStatusTone} from '@/components/flex/flex-status';
import { SearchHighlight } from '@/components/flex/search-highlight';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/components/reui/data-grid/data-grid-column-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { CDRRecord } from '@/domain/types';

export const CDR_STATUS_TONE: Record<CDRRecord['status'], FlexStatusTone> = {
    answered: 'success',
    missed: 'danger',
    voicemail: 'warning',
    transferred: 'info',
};

export const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;

    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const recordingUnavailable = (
    <span className="text-flex-text-muted italic text-[10px]">No recording</span>
);

export function cdrColumns(onViewRecord?: (record: CDRRecord) => void): ColumnDef<DataGridFeatures, CDRRecord>[] {
    return [
        {
            accessorKey: 'date',
            id: 'date',
            header: ({ column }) => <DataGridColumnHeader title="Date & Time" column={column} />,
            cell: ({ getValue }) => (
                <span className="font-mono flex-numeric text-flex-text-muted">{getValue() as string}</span>
            ),
            size: 168,
            enableSorting: true,
            meta: { kind: 'date', align: 'start', skeleton: <Skeleton className="h-4 w-28" /> },
        },
        {
            accessorKey: 'customerPhone',
            id: 'customerPhone',
            header: ({ column }) => <DataGridColumnHeader title="Customer" column={column} />,
            cell: ({ row, table }) => {
                const queryText = (table.options.meta as { search?: string } | undefined)?.search ?? '';

                return (
                    <span className="font-semibold font-mono flex-numeric text-flex-text-primary">
                        <SearchHighlight text={row.original.customerPhone} query={queryText} />
                    </span>
                );
            },
            size: 170,
            enableSorting: true,
            meta: { kind: 'identity', align: 'start', skeleton: <Skeleton className="h-4 w-20" /> },
        },
        {
            accessorKey: 'agentName',
            id: 'agentName',
            header: ({ column }) => <DataGridColumnHeader title="Agent" column={column} />,
            cell: ({ row, table }) => {
                const queryText = (table.options.meta as { search?: string } | undefined)?.search ?? '';

                return <SearchHighlight text={row.original.agentName} query={queryText} />;
            },
            size: 150,
            enableSorting: true,
            meta: { kind: 'text', align: 'start', skeleton: <Skeleton className="h-4 w-24" /> },
        },
        {
            accessorKey: 'queueName',
            id: 'queueName',
            header: ({ column }) => <DataGridColumnHeader title="Queue" column={column} />,
            cell: ({ row, table }) => {
                const queryText = (table.options.meta as { search?: string } | undefined)?.search ?? '';

                return <SearchHighlight text={row.original.queueName} query={queryText} />;
            },
            size: 190,
            enableSorting: true,
            meta: { kind: 'text', align: 'start', skeleton: <Skeleton className="h-4 w-32" /> },
        },
        {
            accessorKey: 'durationSeconds',
            id: 'duration',
            header: ({ column }) => <DataGridColumnHeader title="Duration" column={column} />,
            cell: ({ row }) => (
                <span className="font-mono flex-numeric">{formatDuration(row.original.durationSeconds)}</span>
            ),
            size: 96,
            enableSorting: true,
            meta: { kind: 'duration', align: 'end', skeleton: <Skeleton className="h-4 w-10" /> },
        },
        {
            accessorKey: 'status',
            id: 'status',
            header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
            cell: ({ row }) => (
                <FlexStatus tone={CDR_STATUS_TONE[row.original.status]} className="capitalize">
                    {row.original.status}
                </FlexStatus>
            ),
            size: 120,
            enableSorting: true,
            meta: { kind: 'status', align: 'start', skeleton: <Skeleton className="h-4 w-16 rounded-full" /> },
        },
        {
            accessorKey: 'hasRecording',
            id: 'recording',
            header: 'Recording',
            cell: ({ row }) =>
                row.original.hasRecording ? (
                    <Button variant="outline" size="icon-xs" title="Listen to audio recording">
                        <RiPlayFill className="size-3.5 text-primary" />
                    </Button>
                ) : (
                    recordingUnavailable
                ),
            size: 100,
            enableSorting: false,
            meta: { kind: 'icon', align: 'center' },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    {onViewRecord && (
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            title="View call record"
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewRecord(row.original);
                            }}
                        >
                            <RiEyeLine className="size-3.5" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        title="Download Record"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <RiDownload2Line className="size-3.5" />
                    </Button>
                </div>
            ),
            size: 96,
            enableSorting: false,
            enableHiding: false,
            meta: { kind: 'action', align: 'center' },
        },
    ];
}
