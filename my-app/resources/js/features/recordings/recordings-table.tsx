import {
    RiDeleteBinLine,
    RiEditLine,
    RiExchangeLine,
    RiEyeLine,
} from '@remixicon/react';
import type { ColumnDef, Table } from '@tanstack/react-table';
import React from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexStatus } from '@/components/flex/flex-status';
import {
    DataGrid,
    DataGridContainer,
} from '@/components/reui/data-grid/data-grid';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/components/reui/data-grid/data-grid-column-header';
import { DataGridPagination } from '@/components/reui/data-grid/data-grid-pagination';
import { DataGridScrollArea } from '@/components/reui/data-grid/data-grid-scroll-area';
import { DataGridTable } from '@/components/reui/data-grid/data-grid-table';
import { Button } from '@/components/ui/button';
import type { RecordingCategory, RecordingRecord } from '@/domain/recording-types';
import { RecordingAudioPlayer } from '@/features/recordings/recording-audio-player';

export interface RecordingsTableProps {
    table: Table<DataGridFeatures, RecordingRecord>;
    records: RecordingRecord[];
    isLoading: boolean;
    onRowClick: (record: RecordingRecord) => void;
    onEdit: (record: RecordingRecord) => void;
    onReplace: (record: RecordingRecord) => void;
    onDelete: (record: RecordingRecord) => void;
}

const CATEGORY_META: Record<RecordingCategory, { label: string; tone: 'info' | 'warning' | 'neutral' | 'success' | 'danger' }> = {
    'ivr-prompt': { label: 'IVR Prompt', tone: 'info' },
    'queue-announcement': { label: 'Queue Audio', tone: 'warning' },
    'voicemail-greeting': { label: 'Voicemail', tone: 'neutral' },
    'hold-music': { label: 'Hold Music', tone: 'success' },
    'system-announcement': { label: 'System Notice', tone: 'danger' },
};

function formatBytes(bytes: number): string {
    if (bytes === 0) {
        return '0 B';
    }

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function buildRecordingsColumns(deps: {
    onRowClick: (record: RecordingRecord) => void;
    onEdit: (record: RecordingRecord) => void;
    onReplace: (record: RecordingRecord) => void;
    onDelete: (record: RecordingRecord) => void;
}): ColumnDef<DataGridFeatures, RecordingRecord>[] {
    const { onRowClick, onEdit, onReplace, onDelete } = deps;

    return [
        {
            accessorKey: 'name',
            id: 'name',
            header: ({ column }) => <DataGridColumnHeader title="Title & File" column={column} />,
            cell: ({ row }) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-flex-text-primary truncate">
                        {row.original.name}
                    </span>
                    <span className="font-mono text-[11px] text-flex-text-muted">{row.original.filename}</span>
                </div>
            ),
            size: 220,
            enableSorting: true,
            meta: { kind: 'identity', align: 'start' },
        },
        {
            accessorKey: 'category',
            id: 'category',
            header: ({ column }) => <DataGridColumnHeader title="Category" column={column} />,
            cell: ({ row }) => {
                const meta = CATEGORY_META[row.original.category] ?? { label: row.original.category, tone: 'neutral' as const };

                return (
                    <FlexStatus tone={meta.tone} className="text-[11px]">
                        {meta.label}
                    </FlexStatus>
                );
            },
            size: 130,
            enableSorting: true,
            meta: { kind: 'status', align: 'start' },
        },
        {
            accessorKey: 'duration',
            id: 'duration',
            header: 'Duration',
            cell: ({ row }) => (
                <RecordingAudioPlayer
                    url={row.original.url}
                    duration={row.original.duration}
                    name={row.original.name}
                    compact
                />
            ),
            size: 130,
            meta: { kind: 'duration', align: 'start' },
        },
        {
            accessorKey: 'format',
            id: 'format',
            header: 'Format & Size',
            cell: ({ row }) => (
                <span className="text-xs text-flex-text-muted tabular-nums">
                    {row.original.format} · {formatBytes(row.original.fileSizeBytes)}
                </span>
            ),
            size: 130,
            meta: { kind: 'text', align: 'start' },
        },
        {
            accessorKey: 'usages',
            id: 'usages',
            header: 'Used In',
            cell: ({ row }) => {
                const usages = row.original.usages;

                if (usages.length === 0) {
                    return <span className="text-xs text-flex-text-muted">Unassigned</span>;
                }

                return (
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-medium text-flex-text-primary">
                            {usages.length} {usages.length === 1 ? 'target' : 'targets'}
                        </span>
                        <span className="text-[11px] text-flex-text-muted truncate max-w-[120px]">
                            ({usages.map((u) => u.type).join(', ')})
                        </span>
                    </div>
                );
            },
            size: 160,
            meta: { kind: 'text', align: 'start' },
        },
        {
            accessorKey: 'updatedAt',
            id: 'updatedAt',
            header: ({ column }) => <DataGridColumnHeader title="Modified" column={column} />,
            cell: ({ getValue }) => {
                const date = new Date(getValue() as string);

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
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        title="Inspect recording"
                        aria-label={`Inspect ${row.original.name}`}
                        onClick={() => onRowClick(row.original)}
                    >
                        <RiEyeLine className="size-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        title="Edit details"
                        aria-label={`Edit ${row.original.name}`}
                        onClick={() => onEdit(row.original)}
                    >
                        <RiEditLine className="size-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        title="Replace audio file"
                        aria-label={`Replace audio for ${row.original.name}`}
                        onClick={() => onReplace(row.original)}
                    >
                        <RiExchangeLine className="size-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        title="Delete recording"
                        aria-label={`Delete ${row.original.name}`}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(row.original)}
                    >
                        <RiDeleteBinLine className="size-3.5" />
                    </Button>
                </div>
            ),
            size: 140,
            enableHiding: false,
            enableSorting: false,
            meta: { kind: 'action', align: 'center' },
        },
    ];
}

export function RecordingsTable({
    table,
    records,
    isLoading,
    onRowClick,
}: RecordingsTableProps) {
    return (
        <DataGrid
            table={table}
            recordCount={records?.length || 0}
            isLoading={isLoading}
            loadingMode="skeleton"
            emptyMessage={
                <FlexEmptyState
                    title="No audio recordings found"
                    description="Upload audio prompts or adjust your filters to view recordings."
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