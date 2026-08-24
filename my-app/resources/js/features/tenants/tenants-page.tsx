import { Head } from '@inertiajs/react';
import { RiRefreshLine } from '@remixicon/react';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { FlexWorkbenchShell } from '@/components/flex/flex-workbench-shell';
import { dataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { Button } from '@/components/ui/button';
import { tenantRepository } from '@/domain/tenant-repository';
import type { TenantRecord, TenantStatus, TenantStatusFilter } from '@/features/tenants/shared/types';
import { useTenantContext } from '@/features/tenants/tenant-context';
import { TenantDetailSheet } from '@/features/tenants/tenant-detail-sheet';
import { TenantFormSheet } from '@/features/tenants/tenant-form-sheet';
import { TenantStatusDialog } from '@/features/tenants/tenant-status-dialog';
import { tenantColumns } from '@/features/tenants/tenants-columns';
import { TenantsTable } from '@/features/tenants/tenants-table';
import { TenantsToolbar } from '@/features/tenants/tenants-toolbar';
import { AdminShell } from '@/layouts/admin-shell';

const tenantsContextGroups: ContextSidebarGroup[] = [
    {
        groupTitle: 'Platform',
        items: [
            { title: 'Tenants & Multi-Org', href: '/admin/tenants', capability: 'roles.manage' },
        ],
    },
];

export function TenantsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<TenantStatusFilter>('all');
    const [records, setRecords] = useState<TenantRecord[]>(() => tenantRepository.queryTenants({}));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);

    const [detailId, setDetailId] = useState<string>();
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string>();
    const [statusTarget, setStatusTarget] = useState<{ id: string; status: TenantStatus }>();

    const { enterTenant } = useTenantContext();

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        setTimeout(() => {
            try {
                setRecords(tenantRepository.queryTenants({}));
            } catch {
                setError('Tenant data could not be retrieved.');
            }

            setIsLoading(false);
        }, 350);
    }, []);

    const filteredData = useMemo(() => {
        const needle = search.trim().toLowerCase();

        return records.filter((tenant) => {
            const matchesSearch =
                !needle ||
                tenant.name.toLowerCase().includes(needle) ||
                tenant.domain.toLowerCase().includes(needle) ||
                tenant.email.toLowerCase().includes(needle) ||
                tenant.contact.toLowerCase().includes(needle) ||
                tenant.phone.toLowerCase().includes(needle);
            const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [records, search, statusFilter]);

    const openDetail = useCallback((tenant: TenantRecord) => {
        setDetailId(tenant.id);
    }, []);

    const openEdit = useCallback((tenant: TenantRecord) => {
        setEditingId(tenant.id);
        setFormOpen(true);
    }, []);

    const openSetStatus = useCallback((tenant: TenantRecord, status: TenantStatus) => {
        setStatusTarget({ id: tenant.id, status });
    }, []);

    const openEnter = useCallback(
        (tenant: TenantRecord) => {
            enterTenant(tenant);
        },
        [enterTenant]
    );

    const columns = useMemo(
        () =>
            tenantColumns({
                onView: openDetail,
                onEdit: openEdit,
                onEnter: openEnter,
                onSetStatus: openSetStatus,
            }),
        [openDetail, openEdit, openEnter, openSetStatus]
    );

    const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map((column) => column.id as string));

    const table = useTable({
        features: dataGridFeatures,
        columns,
        data: filteredData,
        pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
        getRowId: (row: TenantRecord) => row.id,
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

    const handleSaved = () => {
        setRecords(tenantRepository.queryTenants({}));
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        setEditingId(undefined);
    };

    const handleStatusChanged = () => {
        setRecords(tenantRepository.queryTenants({}));
        setStatusTarget(undefined);
    };

    return (
        <AdminShell
            title="Tenants"
            subtitle="Manage tenant organizations and their status."
            contextTitle="Platform"
            contextSubtitle="Tenants & multi-org administration"
            contextGroups={tenantsContextGroups}
        >
            <Head title="Tenants — Flex Contact Center" />

            <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
                {error ? (
                    <FlexErrorState
                        title="Couldn't load tenants"
                        description={error}
                        action={
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh}>
                                <RiRefreshLine className="size-3.5" />
                                Try again
                            </Button>
                        }
                    />
                ) : (
                    <FlexWorkbenchShell variant="primary"
                        toolbar={
                            <TenantsToolbar
                                table={table}
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
                                onRefresh={refresh}
                                isRefreshing={isLoading}
                                onAdd={() => setFormOpen(true)}
                            />
                        }
                    >
                        <TenantsTable
                            table={table}
                            recordCount={filteredData?.length || 0}
                            isLoading={isLoading}
                            total={records.length}
                            onRowClick={openDetail}
                            emptyMessage={
                                <FlexEmptyState
                                    title={records.length === 0 ? 'No tenants yet' : 'No tenants match these filters'}
                                    description={
                                        records.length === 0
                                            ? 'Add your first tenant organization to get started.'
                                            : 'Try changing your search or filters.'
                                    }
                                    action={
                                        records.length === 0 ? (
                                            <Button variant="outline" size="sm" className="text-xs" onClick={() => setFormOpen(true)}>
                                                Add Tenant
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
                    </FlexWorkbenchShell>
                )}

                <p className="text-[10px] text-flex-text-muted">
                    POC mock adapter — `TenantRepository` boundary; replace with the real tenants backend in rollout.
                </p>
            </div>

            <TenantDetailSheet
                tenant={records.find((record) => record.id === detailId)}
                onOpenChange={(open) => !open && setDetailId(undefined)}
                onEdit={openEdit}
                onEnter={openEnter}
            />

            <TenantStatusDialog
                tenant={statusTarget ? records.find((record) => record.id === statusTarget.id) : undefined}
                status={statusTarget?.status}
                onOpenChange={(open) => !open && setStatusTarget(undefined)}
                onCompleted={handleStatusChanged}
            />

            <TenantFormSheet
                key={editingId ?? 'new'}
                open={formOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingId(undefined);
                    }

                    setFormOpen(open);
                }}
                editing={editingId ? records.find((record) => record.id === editingId) : undefined}
                onSaved={handleSaved}
            />
        </AdminShell>
    );
}
