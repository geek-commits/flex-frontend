import { Head, router } from '@inertiajs/react';
import {
    RiPlayFill,
    RiDownload2Line,
    RiRefreshLine,
    RiFilter3Line,
    RiFilterOffLine,
    RiEyeLine,
} from '@remixicon/react';
import type { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { DateRangeSelect } from '@/components/flex/date-range-select';
import { SearchHighlight } from '@/components/flex/search-highlight';
import { Alert, AlertTitle } from '@/components/reui/alert';
import {
    DataGrid,
    DataGridContainer,
    dataGridFeatures
    
} from '@/components/reui/data-grid/data-grid';
import type {DataGridFeatures} from '@/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/components/reui/data-grid/data-grid-column-header';
import { DataGridColumnVisibility } from '@/components/reui/data-grid/data-grid-column-visibility';
import { DataGridPagination } from '@/components/reui/data-grid/data-grid-pagination';
import { DataGridScrollArea } from '@/components/reui/data-grid/data-grid-scroll-area';
import { DataGridTable } from '@/components/reui/data-grid/data-grid-table';
import { Filters   } from '@/components/reui/filters';
import type {Filter, FilterFieldConfig} from '@/components/reui/filters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cdrRepository  } from '@/domain/cdr-repository';
import type {CdrQuery} from '@/domain/cdr-repository';
import type { CDRRecord } from '@/domain/types';
import { AdminShell } from '@/layouts/admin-shell';
import { statusToneClasses } from '@/lib/status-styles';

const QUEUE_OPTIONS = ['Customer Support', 'Sales & Inquiries', 'Technical Escalations'];

const STATUS_META: Record<CDRRecord['status'], string> = {
    answered: `${statusToneClasses.live.bgClass} ${statusToneClasses.live.textClass} ${statusToneClasses.live.borderClass}`,
    missed: `${statusToneClasses.disconnected.bgClass} ${statusToneClasses.disconnected.textClass} ${statusToneClasses.disconnected.borderClass}`,
    voicemail: `${statusToneClasses.stale.bgClass} ${statusToneClasses.stale.textClass} ${statusToneClasses.stale.borderClass}`,
    transferred: `${statusToneClasses.talking.bgClass} ${statusToneClasses.talking.textClass} ${statusToneClasses.talking.borderClass}`,
};

const cdrContextGroups: ContextSidebarGroup[] = [
    {
        groupTitle: 'Telephony',
        items: [
            { title: 'Call Records (CDR)', href: '/admin/cdr', icon: RiPlayFill, capability: 'cdr.view' },
            { title: 'Call Campaigns', href: '/admin/campaigns', icon: RiDownload2Line, capability: 'campaigns.view' },
            { title: 'Reports & Analytics', href: '/admin/reports', icon: RiRefreshLine, capability: 'reports.view' },
        ],
    },
];

type QuickFilter = 'all' | 'today' | 'answered' | 'missed' | 'voicemail' | 'transferred';

const QUICK_FILTERS: { value: QuickFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'answered', label: 'Answered' },
    { value: 'missed', label: 'Missed' },
    { value: 'voicemail', label: 'Voicemail' },
    { value: 'transferred', label: 'Transferred' },
];

const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;

    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const toDateInput = (date: Date) => format(date, 'yyyy-MM-dd');

export default function CDRPage() {
    const [search, setSearch] = useState('');
    const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
    const [dateFrom, setDateFrom] = useState<string>();
    const [dateTo, setDateTo] = useState<string>();
    const [filters, setFilters] = useState<Filter[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);

    const fieldConfigs: FilterFieldConfig[] = useMemo(
        () => [
            {
                key: 'queue',
                label: 'Queue',
                type: 'select',
                searchable: true,
                className: 'w-[180px]',
                options: QUEUE_OPTIONS.map((queue) => ({ value: queue, label: queue })),
            },
            {
                key: 'agent',
                label: 'Agent',
                type: 'text',
                className: 'w-44',
                placeholder: 'Search agent...',
            },
            {
                key: 'recording',
                label: 'Recording',
                type: 'select',
                searchable: false,
                className: 'w-[140px]',
                options: [
                    { value: 'has', label: 'Has recording' },
                    { value: 'none', label: 'No recording' },
                ],
            },
        ],
        []
    );

    const query = useMemo<CdrQuery>(() => {
        const q: CdrQuery = { search };

        if (quickFilter === 'today') {
            const today = toDateInput(new Date());
            q.dateFrom = today;
            q.dateTo = today;
        } else if (quickFilter !== 'all') {
            q.status = quickFilter;
        }

        if (dateFrom) {
q.dateFrom = dateFrom;
}

        if (dateTo) {
q.dateTo = dateTo;
}

        return q;
    }, [search, quickFilter, dateFrom, dateTo]);

    const baseResults = useMemo(() => cdrRepository.query(query), [query]);

    const filteredData = useMemo(() => {
        const active = filters.filter((filter) => filter.values?.length > 0 && filter.values.some((v) => v !== ''));

        return baseResults.filter((record) => {
            for (const filter of active) {
                const { field, operator, values } = filter;
                const value = record[field as keyof CDRRecord] as string | boolean | undefined;

                if (operator === 'is' || operator === 'equals') {
                    if (!values.includes(value)) {
return false;
}
                } else if (operator === 'is_not' || operator === 'not_equals') {
                    if (values.includes(value)) {
return false;
}
                } else if (operator === 'contains') {
                    if (!values.some((v) => String(value).toLowerCase().includes(String(v).toLowerCase()))) {
return false;
}
                } else if (operator === 'not_contains') {
                    if (values.some((v) => String(value).toLowerCase().includes(String(v).toLowerCase()))) {
return false;
}
                }
            }

            return true;
        });
    }, [baseResults, filters]);

    const columns = useMemo<ColumnDef<DataGridFeatures, CDRRecord>[]>(
        () => [
            {
                accessorKey: 'date',
                id: 'date',
                header: ({ column }) => <DataGridColumnHeader title="Date & Time" column={column} />,
                cell: ({ getValue }) => <span className="font-mono text-muted-foreground">{getValue() as string}</span>,
                size: 168,
                enableSorting: true,
            },
            {
                accessorKey: 'customerPhone',
                id: 'customerPhone',
                header: ({ column }) => <DataGridColumnHeader title="Customer" column={column} />,
                cell: ({ row, table }) => {
                    const queryText = (table.options.meta as { search?: string } | undefined)?.search ?? '';

                    return (
                        <span className="font-semibold text-foreground">
                            <SearchHighlight text={row.original.customerPhone} query={queryText} />
                        </span>
                    );
                },
                size: 170,
                enableSorting: true,
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
            },
            {
                accessorKey: 'durationSeconds',
                id: 'duration',
                header: ({ column }) => <DataGridColumnHeader title="Duration" column={column} />,
                cell: ({ row }) => <span className="font-mono">{formatDuration(row.original.durationSeconds)}</span>,
                size: 96,
                enableSorting: true,
            },
            {
                accessorKey: 'status',
                id: 'status',
                header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
                cell: ({ row }) => {
                    const meta = STATUS_META[row.original.status];

                    return (
                        <Badge variant="outline" className={`capitalize ${meta}`}>
                            {row.original.status}
                        </Badge>
                    );
                },
                size: 120,
                enableSorting: true,
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
                        <span className="text-muted-foreground italic text-[10px]">None</span>
                    ),
                size: 100,
                enableSorting: false,
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            title="View call record"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.visit(`/admin/cdr/${row.original.id}`);
                            }}
                        >
                            <RiEyeLine className="size-3.5" />
                        </Button>
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
            },
        ],
        []
    );

    const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map((column) => column.id as string));

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        // Local mock adapter: resolve on a microtask to render the loading state.
        setTimeout(() => {
            try {
                cdrRepository.query(query);
                setIsLoading(false);
            } catch {
                setError('Failed to load call records. Please try again.');
                setIsLoading(false);
            }
        }, 350);
    }, [query]);

    const table = useTable({
        features: dataGridFeatures,
        columns,
        data: filteredData,
        pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
        getRowId: (row: CDRRecord) => row.id,
        state: {
            pagination,
            sorting,
            columnOrder,
        },
        onColumnOrderChange: setColumnOrder,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        meta: { search },
    });

    const hasActiveAdvanced = filters.some((filter) => filter.values?.length > 0);
    const todayDate = toDateInput(new Date());

    return (
        <AdminShell
            title="Call Detail Records (CDR)"
            subtitle="Search, filter & inspect telephony logs"
            contextTitle="Telephony"
            contextSubtitle="Search & navigate call records"
            contextGroups={cdrContextGroups}
            actions={
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh} disabled={isLoading}>
                    <RiRefreshLine className="size-3.5" />
                    <span>Refresh Logs</span>
                </Button>
            }
        >
            <Head title="CDR — Flex Contact Center" />

            <div className="flex flex-col gap-4 w-full">
                {/* Page-level search */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    <div className="relative w-full lg:max-w-sm">
                        <RiPlayFill className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground rotate-90" />
                        <Input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                            }}
                            placeholder="Search calls by phone, agent, queue..."
                            className="pl-9 h-9 text-xs"
                            aria-label="Search calls"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Quick filters */}
                        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1" role="group" aria-label="Quick filters">
                            {QUICK_FILTERS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        setQuickFilter(option.value);
                                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                                    }}
                                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                                        quickFilter === option.value
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {/* Date range trigger */}
                        <DateRangeSelect
                            from={dateFrom}
                            to={dateTo}
                            onRangeChange={(from, to) => {
                                setDateFrom(from);
                                setDateTo(to);
                            }}
                        />

                        {/* Advanced filters */}
                        <Filters
                            filters={filters}
                            fields={fieldConfigs}
                            onChange={(next) => {
                                setFilters(next);
                                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                            }}
                            size="sm"
                            trigger={
                                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                    <RiFilter3Line className="size-3.5" />
                                    Filters
                                    {hasActiveAdvanced && <span className="size-1.5 rounded-full bg-primary" />}
                                </Button>
                            }
                        />
                        {hasActiveAdvanced && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setFilters([])}>
                                <RiFilterOffLine className="size-3.5" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>{error}</AlertTitle>
                    </Alert>
                )}

                {/* Data Grid */}
                <DataGrid
                    table={table}
                    recordCount={filteredData?.length || 0}
                    isLoading={isLoading}
                    loadingMode="skeleton"
                    emptyMessage="No call records match your search or filters."
                    tableLayout={{
                        dense: true,
                        columnsMovable: true,
                    }}
                    onRowClick={(row) => router.visit(`/admin/cdr/${row.id}`)}
                >
                    <div className="w-full space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-muted-foreground">
                                {filteredData.length} of {baseResults.length} records
                                {quickFilter !== 'all' && (
                                    <span className="ml-2 text-muted-foreground/70">• quick: {QUICK_FILTERS.find((f) => f.value === quickFilter)?.label}</span>
                                )}
                            </span>
                            <DataGridColumnVisibility
                                table={table}
                                trigger={<Button variant="outline" size="sm" className="gap-1.5 text-xs">Columns</Button>}
                            />
                        </div>
                        <DataGridContainer>
                            <DataGridScrollArea>
                                <DataGridTable />
                            </DataGridScrollArea>
                        </DataGridContainer>
                        <DataGridPagination />
                    </div>
                </DataGrid>

                <p className="text-[10px] text-muted-foreground">
                    POC mock adapter ({todayDate} dataset) — `CdrRepository` boundary; replace with the CDR backend in rollout.
                </p>
            </div>
        </AdminShell>
    );
}
