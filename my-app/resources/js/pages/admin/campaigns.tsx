import { Head, router } from '@inertiajs/react';
import {
    RiAddLine,
    RiPlayFill,
    RiPauseFill,
    RiEyeLine,
    RiDeleteBin6Line,
    RiRefreshLine,
    RiMegaphoneLine,
    RiPhoneLine,
    RiCheckboxCircleLine,
    RiTimeLine,
    RiEditLine,
} from '@remixicon/react';
import type { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CampaignFormSheet } from '@/components/flex/campaign-form-sheet';
import { MetricCard, MetricGroup } from '@/components/flex/metric-card';
import { SearchHighlight } from '@/components/flex/search-highlight';
import { StatusBadge } from '@/components/flex/status-badge';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { campaignRepository } from '@/domain/campaign-repository';
import type { CampaignRecord } from '@/domain/types';
import { AdminShell } from '@/layouts/admin-shell';
import type { CampaignStatus } from '@/types/flex';

export default function CampaignsPage() {
    const [search, setSearch] = useState('');
    const [records, setRecords] = useState<CampaignRecord[]>(() => campaignRepository.query({}));
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([{ id: 'sn', desc: false }]);

    const [sheetOpen, setSheetOpen] = useState(false);
    const [editing, setEditing] = useState<CampaignRecord>();

    const [deleteTarget, setDeleteTarget] = useState<CampaignRecord>();
    const [deleting, setDeleting] = useState(false);

    const refresh = useCallback(() => setRecords(campaignRepository.query({})), []);

    const filteredData = useMemo(() => {
        const needle = search.trim().toLowerCase();

        return records.filter(
            (record) =>
                !needle ||
                record.title.toLowerCase().includes(needle) ||
                record.destination.toLowerCase().includes(needle)
        );
    }, [records, search]);

    const openAdd = () => {
        setEditing(undefined);
        setSheetOpen(true);
    };

    const openEdit = useCallback((record: CampaignRecord) => {
        setEditing(record);
        setSheetOpen(true);
    }, []);

    const toggleStatus = useCallback(
        (record: CampaignRecord) => {
            const nextStatus: CampaignStatus = record.status === 'active' ? 'paused' : 'active';
            campaignRepository.update(record.id, {
                title: record.title,
                destination: record.destination,
                scheduleTime: record.scheduleTime,
                status: nextStatus,
                totalContacts: record.totalContacts,
                dialedCount: record.dialedCount,
                answeredCount: record.answeredCount,
            });
            refresh();
            toast.success(nextStatus === 'active' ? 'Campaign started' : 'Campaign paused');
        },
        [refresh]
    );

    const columns = useMemo<ColumnDef<DataGridFeatures, CampaignRecord>[]>(
        () => [
            {
                accessorKey: 'sn',
                id: 'sn',
                header: ({ column }) => <DataGridColumnHeader title="SN" column={column} />,
                cell: ({ getValue }) => <span className="font-mono text-muted-foreground">{getValue() as number}</span>,
                size: 56,
                enableSorting: true,
            },
            {
                accessorKey: 'title',
                id: 'campaign',
                header: ({ column }) => <DataGridColumnHeader title="Campaign" column={column} />,
                cell: ({ row, table }) => {
                    const queryText = (table.options.meta as { search?: string } | undefined)?.search ?? '';

                    return (
                        <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-foreground truncate">
                                <SearchHighlight text={row.original.title} query={queryText} />
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate">
                                <SearchHighlight text={row.original.destination} query={queryText} />
                            </span>
                        </div>
                    );
                },
                size: 260,
                enableSorting: true,
            },
            {
                accessorKey: 'scheduleTime',
                id: 'schedule',
                header: ({ column }) => <DataGridColumnHeader title="Schedule" column={column} />,
                cell: ({ getValue }) => <span className="font-mono text-muted-foreground">{getValue() as string}</span>,
                size: 150,
                enableSorting: true,
            },
            {
                accessorKey: 'totalContacts',
                id: 'progress',
                header: ({ column }) => <DataGridColumnHeader title="Progress" column={column} />,
                cell: ({ row }) => {
                    const pct = row.original.totalContacts > 0 ? Math.round((row.original.dialedCount / row.original.totalContacts) * 100) : 0;

                    return (
                        <div className="flex flex-col gap-1 min-w-[120px]">
                            <div className="flex items-center justify-between text-[10px]">
                                <span className="text-muted-foreground">
                                    {row.original.dialedCount}/{row.original.totalContacts}
                                </span>
                                <span className="font-bold text-foreground">{pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                            </div>
                        </div>
                    );
                },
                size: 150,
                enableSorting: false,
            },
            {
                accessorKey: 'answeredCount',
                id: 'answerRate',
                header: ({ column }) => <DataGridColumnHeader title="Answer Rate" column={column} />,
                cell: ({ row }) => {
                    const rate = row.original.dialedCount > 0 ? Math.round((row.original.answeredCount / row.original.dialedCount) * 100) : 0;
                    const color =
                        rate >= 85
                            ? 'text-status-live'
                            : rate >= 70
                              ? 'text-status-stale'
                              : 'text-destructive';

                    return <span className={`font-bold text-xs ${color}`}>{row.original.totalContacts > 0 ? `${rate}%` : '—'}</span>;
                },
                size: 110,
                enableSorting: true,
            },
            {
                accessorKey: 'status',
                id: 'status',
                header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
                cell: ({ row }) => <StatusBadge domain="campaign" status={row.original.status} />,
                size: 120,
                enableSorting: true,
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            title="View campaign"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.visit(`/admin/campaigns/${row.original.id}`);
                            }}
                        >
                            <RiEyeLine className="size-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Edit campaign"
                            onClick={(e) => {
                                e.stopPropagation();
                                openEdit(row.original);
                            }}
                        >
                            <RiEditLine className="size-3.5" />
                        </Button>
                        {(row.original.status === 'active' || row.original.status === 'paused') && (
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                title={row.original.status === 'active' ? 'Pause Campaign' : 'Start Campaign'}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStatus(row.original);
                                }}
                            >
                                {row.original.status === 'active' ? (
                                    <RiPauseFill className="size-3.5 text-status-stale" />
                                ) : (
                                    <RiPlayFill className="size-3.5 text-status-live" />
                                )}
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Delete Campaign"
                            className="text-destructive hover:text-destructive/80"
                            onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget(row.original);
                            }}
                        >
                            <RiDeleteBin6Line className="size-3.5" />
                        </Button>
                    </div>
                ),
                size: 150,
                enableSorting: false,
                enableHiding: false,
            },
        ],
        [openEdit, toggleStatus]
    );

    const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map((column) => column.id as string));

    const table = useTable({
        features: dataGridFeatures,
        columns,
        data: filteredData,
        pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
        getRowId: (row: CampaignRecord) => row.id,
        state: { pagination, sorting, columnOrder },
        onColumnOrderChange: setColumnOrder,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        meta: { search },
    });

    const totals = useMemo(() => {
        return {
            totalContacts: records.reduce((s, c) => s + c.totalContacts, 0),
            totalAnswered: records.reduce((s, c) => s + c.answeredCount, 0),
            totalDialed: records.reduce((s, c) => s + c.dialedCount, 0),
            activeCampaigns: records.filter((c) => c.status === 'active').length,
        };
    }, [records]);

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);
        setTimeout(() => {
            campaignRepository.delete(deleteTarget.id);
            setDeleting(false);
            setDeleteTarget(undefined);
            refresh();
            toast.success('Campaign deleted');
        }, 250);
    };

    return (
        <AdminShell
            title="Call Campaigns"
            subtitle="Manage outbound dialer & automated campaign schedules"
            actions={
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh}>
                        <RiRefreshLine className="size-3.5" />
                        <span>Refresh</span>
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs" onClick={openAdd}>
                        <RiAddLine className="size-4" />
                        <span>New Campaign</span>
                    </Button>
                </div>
            }
        >
            <Head title="Call Campaigns — Flex Contact Center" />

            <div className="flex flex-col gap-5 w-full">
                <MetricGroup>
                    <MetricCard
                        title="Active Campaigns"
                        value={totals.activeCampaigns}
                        description="Currently dialing"
                        icon={RiMegaphoneLine}
                    />
                    <MetricCard
                        title="Total Contacts"
                        value={totals.totalContacts.toLocaleString()}
                        description="Across all campaigns"
                        icon={RiPhoneLine}
                    />
                    <MetricCard
                        title="Calls Dialed"
                        value={totals.totalDialed.toLocaleString()}
                        description="Cumulative dialed contacts"
                        icon={RiTimeLine}
                        trend={{ value: `${totals.totalContacts > 0 ? Math.round((totals.totalDialed / totals.totalContacts) * 100) : 0}%`, positive: true }}
                    />
                    <MetricCard
                        title="Answered"
                        value={totals.totalAnswered.toLocaleString()}
                        description="Successfully connected calls"
                        icon={RiCheckboxCircleLine}
                        trend={{ value: `${totals.totalDialed > 0 ? Math.round((totals.totalAnswered / totals.totalDialed) * 100) : 0}%`, positive: true }}
                    />
                </MetricGroup>

                <DataGrid
                    table={table}
                    recordCount={filteredData?.length || 0}
                    emptyMessage="No campaigns match your search."
                    tableLayout={{ dense: true, columnsMovable: true }}
                    onRowClick={(row) => router.visit(`/admin/campaigns/${row.id}`)}
                >
                    <div className="w-full space-y-2.5">
                        <div className="relative w-full lg:max-w-sm">
                            <RiTimeLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                                }}
                                placeholder="Search campaigns by title or destination..."
                                className="pl-9 h-9 text-xs"
                                aria-label="Search campaigns"
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
            </div>

            <CampaignFormSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                editing={editing}
                onSaved={refresh}
            />

            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(undefined)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete campaign</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Deleting…' : 'Delete campaign'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminShell>
    );
}
