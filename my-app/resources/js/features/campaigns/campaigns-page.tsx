import { Head } from '@inertiajs/react';
import { RiAddLine, RiRefreshLine } from '@remixicon/react';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { dataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { campaignRepository } from '@/domain/campaign-repository';
import type { CampaignRecord } from '@/domain/types';
import { CampaignDetailSheet } from '@/features/campaigns/campaign-detail-sheet';
import { CampaignFormSheet } from '@/features/campaigns/campaign-form-sheet';
import { campaignColumns } from '@/features/campaigns/campaigns-columns';
import { CampaignSummary } from '@/features/campaigns/campaigns-summary';
import { CampaignsTable } from '@/features/campaigns/campaigns-table';
import { CampaignsToolbar } from '@/features/campaigns/campaigns-toolbar';
import type { CampaignStatusFilter } from '@/features/campaigns/campaigns-toolbar';
import { AdminShell } from '@/layouts/admin-shell';
import type { CampaignStatus } from '@/types/flex';

const campaignsContextGroups: ContextSidebarGroup[] = [
    {
        groupTitle: 'Telephony',
        items: [
            { title: 'Call Records (CDR)', href: '/admin/cdr', capability: 'cdr.view' },
            { title: 'Call Campaigns', href: '/admin/campaigns', capability: 'campaigns.view' },
            { title: 'Reports & Analytics', href: '/admin/reports', capability: 'reports.view' },
        ],
    },
];

export function CampaignsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<CampaignStatusFilter>('all');
    const [records, setRecords] = useState<CampaignRecord[]>(() => campaignRepository.query({}));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([{ id: 'schedule', desc: true }]);

    const [sheetOpen, setSheetOpen] = useState(false);
    const [editing, setEditing] = useState<CampaignRecord>();
    const [detailId, setDetailId] = useState<string>();

    const [deleteTarget, setDeleteTarget] = useState<CampaignRecord>();
    const [deleting, setDeleting] = useState(false);
    const [statusBusyId, setStatusBusyId] = useState<string>();

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        setTimeout(() => {
            try {
                setRecords(campaignRepository.query({}));
            } catch {
                setError('Campaign data could not be retrieved.');
            }

            setIsLoading(false);
        }, 350);
    }, []);

    const filteredData = useMemo(() => {
        const needle = search.trim().toLowerCase();

        return records.filter((record) => {
            const matchesSearch =
                !needle ||
                record.title.toLowerCase().includes(needle) ||
                record.destination.toLowerCase().includes(needle);
            const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [records, search, statusFilter]);

    const openAdd = () => {
        setEditing(undefined);
        setSheetOpen(true);
    };

    const openEdit = useCallback((record: CampaignRecord) => {
        setEditing(record);
        setSheetOpen(true);
    }, []);

    const openDelete = useCallback((record: CampaignRecord) => {
        setDeleteTarget(record);
    }, []);

    const toggleStatus = useCallback(
        (record: CampaignRecord) => {
            if (statusBusyId) {
                return;
            }

            const nextStatus: CampaignStatus = record.status === 'active' ? 'paused' : 'active';
            setStatusBusyId(record.id);
            setTimeout(() => {
                campaignRepository.update(record.id, {
                    title: record.title,
                    destination: record.destination,
                    scheduleTime: record.scheduleTime,
                    status: nextStatus,
                    totalContacts: record.totalContacts,
                    dialedCount: record.dialedCount,
                    answeredCount: record.answeredCount,
                });
                setStatusBusyId(undefined);
                refresh();
                toast.success(nextStatus === 'active' ? 'Campaign started' : 'Campaign paused');
            }, 250);
        },
        [refresh, statusBusyId]
    );

    const openDetail = useCallback((record: CampaignRecord) => {
        setDetailId(record.id);
    }, []);

    const columns = useMemo(
        () =>
            campaignColumns({
                onView: openDetail,
                onEdit: openEdit,
                onToggleStatus: toggleStatus,
                onDelete: openDelete,
                statusBusyId,
            }),
        [openDetail, openEdit, toggleStatus, openDelete, statusBusyId]
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

    const hasActiveFilters = statusFilter !== 'all';

    const clearAll = () => {
        setSearch('');
        setStatusFilter('all');
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);
        setTimeout(() => {
            try {
                campaignRepository.delete(deleteTarget.id);
                toast.success('Campaign deleted');
            } catch {
                toast.error('Campaign could not be deleted');
            }

            setDeleting(false);
            setDeleteTarget(undefined);
            refresh();
        }, 250);
    };

    return (
        <AdminShell
            title="Call Campaigns"
            subtitle="Manage outbound dialer & automated campaign schedules"
            contextTitle="Telephony"
            contextSubtitle="Campaigns & operations"
            contextGroups={campaignsContextGroups}
            actions={
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh} disabled={isLoading}>
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

            <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
                <CampaignSummary records={records} loading={isLoading} />

                <CampaignsToolbar
                    search={search}
                    onSearchChange={(value) => {
                        setSearch(value);
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    statusFilter={statusFilter}
                    onStatusFilterChange={(value) => {
                        setStatusFilter(value);
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={clearAll}
                />

                {error ? (
                    <FlexErrorState
                        title="Couldn't load campaigns"
                        description={error}
                        action={
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh}>
                                <RiRefreshLine className="size-3.5" />
                                Try again
                            </Button>
                        }
                    />
                ) : (
                    <CampaignsTable
                        table={table}
                        recordCount={filteredData?.length || 0}
                        isLoading={isLoading}
                        total={records.length}
                        onRowClick={openDetail}
                        emptyMessage={
                            <FlexEmptyState
                                title={records.length === 0 ? 'No campaigns yet' : 'No campaigns match these filters'}
                                description={
                                    records.length === 0
                                        ? 'Create your first outbound campaign to get started.'
                                        : 'Try changing your search or filters.'
                                }
                                action={
                                    records.length === 0 ? (
                                        <Button variant="outline" size="sm" className="text-xs" onClick={openAdd}>
                                            New Campaign
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="sm" className="text-xs" onClick={clearAll}>
                                            Clear filters
                                        </Button>
                                    )
                                }
                            />
                        }
                    />
                )}

                <p className="text-[10px] text-flex-text-muted">
                    POC mock adapter — `CampaignRepository` boundary; replace with the real campaigns backend in rollout.
                </p>
            </div>

            <CampaignDetailSheet
                recordId={detailId}
                onOpenChange={(open) => !open && setDetailId(undefined)}
                onEdit={(record) => {
                    setDetailId(undefined);
                    openEdit(record);
                }}
                onToggleStatus={toggleStatus}
                onDelete={(record) => {
                    setDetailId(undefined);
                    openDelete(record);
                }}
                statusBusy={statusBusyId === detailId}
            />

            <CampaignFormSheet open={sheetOpen} onOpenChange={setSheetOpen} editing={editing} onSaved={refresh} />

            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(undefined)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete campaign</AlertDialogTitle>
                        <AlertDialogDescription>
                            Delete &quot;{deleteTarget?.title}&quot;? This action cannot be undone.
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
