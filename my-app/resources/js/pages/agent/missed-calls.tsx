import { Head } from '@inertiajs/react';
import { RiPlayFill, RiPhoneLine } from '@remixicon/react';
import type { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { FlexStatus  } from '@/components/flex/flex-status';
import type {FlexStatusTone} from '@/components/flex/flex-status';
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
import { Input } from '@/components/ui/input';
import { AgentShell } from '@/layouts/agent-shell';

export interface MissedCallRecord {
    id: string;
    phoneNumber: string;
    missedAt: string;
    category: string;
    queueName: string;
    status: 'unhandled' | 'callback-scheduled' | 'resolved';
    attempts: number;
    hasVoicemail: boolean;
}

const RECORDS: MissedCallRecord[] = [
    { id: 'mc-1', phoneNumber: '+255 784 123 999', missedAt: '2026-08-07 13:15:00', category: 'VIP Customer', queueName: 'Customer Support', status: 'unhandled', attempts: 1, hasVoicemail: true },
    { id: 'mc-2', phoneNumber: '+255 712 998 877', missedAt: '2026-08-07 12:40:12', category: 'Standard Inbound', queueName: 'Sales & Inquiries', status: 'callback-scheduled', attempts: 2, hasVoicemail: false },
    { id: 'mc-3', phoneNumber: '+255 655 443 322', missedAt: '2026-08-07 11:20:45', category: 'Technical Inquiry', queueName: 'Technical Escalations', status: 'resolved', attempts: 3, hasVoicemail: true },
    { id: 'mc-4', phoneNumber: '+255 789 321 654', missedAt: '2026-08-06 17:05:33', category: 'VIP Customer', queueName: 'Customer Support', status: 'unhandled', attempts: 1, hasVoicemail: false },
    { id: 'mc-5', phoneNumber: '+255 700 112 233', missedAt: '2026-08-06 15:48:09', category: 'Standard Inbound', queueName: 'Customer Support', status: 'resolved', attempts: 4, hasVoicemail: true },
    { id: 'mc-6', phoneNumber: '+255 733 556 677', missedAt: '2026-08-06 14:02:51', category: 'Technical Inquiry', queueName: 'Technical Escalations', status: 'callback-scheduled', attempts: 2, hasVoicemail: true },
];

const STATUS_TONE: Record<MissedCallRecord['status'], { label: string; tone: FlexStatusTone }> = {
    unhandled: { label: 'Unhandled', tone: 'danger' },
    'callback-scheduled': { label: 'Callback Scheduled', tone: 'warning' },
    resolved: { label: 'Resolved', tone: 'success' },
};

export default function MissedCallsPage() {
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([{ id: 'missedAt', desc: true }]);

    const filteredData = useMemo(() => {
        const needle = search.trim().toLowerCase();

        return RECORDS.filter(
            (record) =>
                !needle ||
                record.phoneNumber.toLowerCase().includes(needle) ||
                record.queueName.toLowerCase().includes(needle) ||
                record.category.toLowerCase().includes(needle)
        );
    }, [search]);

    const columns = useMemo<ColumnDef<DataGridFeatures, MissedCallRecord>[]>(
        () => [
            {
                accessorKey: 'phoneNumber',
                id: 'phone',
                header: ({ column }) => <DataGridColumnHeader title="Phone Number" column={column} />,
                cell: ({ getValue }) => <span className="font-semibold font-mono text-foreground">{getValue() as string}</span>,
                size: 170,
                enableSorting: true,
            },
            {
                accessorKey: 'missedAt',
                id: 'missedAt',
                header: ({ column }) => <DataGridColumnHeader title="Missed At" column={column} />,
                cell: ({ getValue }) => <span className="font-mono text-muted-foreground">{getValue() as string}</span>,
                size: 168,
                enableSorting: true,
            },
            {
                accessorKey: 'category',
                id: 'category',
                header: 'Category',
                cell: ({ getValue }) => <span>{getValue() as string}</span>,
                size: 150,
            },
            {
                accessorKey: 'queueName',
                id: 'queue',
                header: ({ column }) => <DataGridColumnHeader title="Queue" column={column} />,
                cell: ({ getValue }) => <span>{getValue() as string}</span>,
                size: 180,
                enableSorting: true,
            },
            {
                accessorKey: 'attempts',
                id: 'attempts',
                header: 'Attempts',
                cell: ({ getValue }) => <span className="font-mono text-center">{getValue() as number}</span>,
                size: 80,
            },
            {
                accessorKey: 'hasVoicemail',
                id: 'voicemail',
                header: 'Voicemail',
                cell: ({ row }) =>
                    row.original.hasVoicemail ? (
                        <Button variant="outline" size="icon-xs" title="Play Voicemail">
                            <RiPlayFill className="size-3.5 text-primary" />
                        </Button>
                    ) : (
                        <span className="text-muted-foreground italic text-[10px]">None</span>
                    ),
                size: 100,
            },
            {
                accessorKey: 'status',
                id: 'status',
                header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
                cell: ({ row }) => {
                    const meta = STATUS_TONE[row.original.status];

                    return <FlexStatus tone={meta.tone}>{meta.label}</FlexStatus>;
                },
                size: 160,
                enableSorting: true,
            },
            {
                id: 'action',
                header: 'Action',
                cell: () => (
                    <Button size="xs" variant="outline" className="gap-1 text-primary">
                        <RiPhoneLine className="size-3" />
                        Call Back
                    </Button>
                ),
                size: 100,
                enableHiding: false,
            },
        ],
        []
    );

    const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map((column) => column.id as string));

    const table = useTable({
        features: dataGridFeatures,
        columns,
        data: filteredData,
        pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
        getRowId: (row: MissedCallRecord) => row.id,
        state: { pagination, sorting, columnOrder },
        onColumnOrderChange: setColumnOrder,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
    });

    return (
        <AgentShell title="Missed Calls & Voicemail" subtitle="Follow Up & Customer Callbacks">
            <Head title="Missed Calls — Flex Contact Center" />
            <div className="flex flex-col gap-4 w-full">
                <div className="relative w-full lg:max-w-sm">
                    <RiPhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                        }}
                        placeholder="Search phone number or queue..."
                        className="pl-9 h-9 text-xs"
                        aria-label="Search missed calls"
                    />
                </div>

                <DataGrid
                    table={table}
                    recordCount={filteredData?.length || 0}
                    emptyMessage="No missed calls match your search."
                    tableLayout={{ dense: true }}
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
            </div>
        </AgentShell>
    );
}
