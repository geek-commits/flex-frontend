import { Head } from '@inertiajs/react';
import { RiRefreshLine } from '@remixicon/react';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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



export function TenantsPage() {
    const { t } = useTranslation('platform');
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
                setError(t('tenants.error.generic'));
            }

            setIsLoading(false);
        }, 350);
    }, [t]);

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
            tenantColumns(t, {
                onView: openDetail,
                onEdit: openEdit,
                onEnter: openEnter,
                onSetStatus: openSetStatus,
            }),
        [t, openDetail, openEdit, openEnter, openSetStatus]
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
            title={t('tenants.title')}
            subtitle={t('tenants.subtitle')}
            
        >
            <Head title={t('tenants.headTitle')} />

            <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
                {error ? (
                    <FlexErrorState
                        title={t('tenants.error.title')}
                        description={error}
                        action={
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh}>
                                <RiRefreshLine className="size-3.5" />
                                {t('tenants.error.retry')}
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
                                    title={records.length === 0 ? t('tenants.empty.noTenants') : t('tenants.empty.noMatch')}
                                    description={
                                        records.length === 0
                                            ? t('tenants.empty.noTenantsDescription')
                                            : t('tenants.empty.noMatchDescription')
                                    }
                                    action={
                                        records.length === 0 ? (
                                            <Button variant="outline" size="sm" className="text-xs" onClick={() => setFormOpen(true)}>
                                                {t('tenants.empty.addTenant')}
                                            </Button>
                                        ) : (
                                            <Button variant="outline" size="sm" className="text-xs" onClick={clearAll}>
                                                {t('tenants.empty.clearFilters')}
                                            </Button>
                                        )
                                    }
                                />
                            }
                        />
                    </FlexWorkbenchShell>
                )}

                <p className="text-[10px] text-flex-text-muted">
                    {t('tenants.footerHint')}
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
