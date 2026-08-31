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
import { accessRepository } from '@/domain/access-repository';
import type { UserAccount, UserRoleFilter, UserStatusFilter } from '@/features/access-management/shared/types';
import { UserDetailSheet } from '@/features/access-management/users/user-detail-sheet';
import { UserFormSheet } from '@/features/access-management/users/user-form-sheet';
import type { UserLifecycleAction } from '@/features/access-management/users/user-lifecycle-dialog';
import { UserLifecycleDialog } from '@/features/access-management/users/user-lifecycle-dialog';
import { UserResetPasswordDialog } from '@/features/access-management/users/user-reset-password-dialog';
import { userColumns } from '@/features/access-management/users/users-columns';
import { UsersTable } from '@/features/access-management/users/users-table';
import { UsersToolbar } from '@/features/access-management/users/users-toolbar';
import { AdminShell } from '@/layouts/admin-shell';



export function UsersPage() {
    const { t } = useTranslation('administration');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<UserStatusFilter>('all');
    const [roleFilter, setRoleFilter] = useState<UserRoleFilter>('all');
    const [records, setRecords] = useState<UserAccount[]>(() => accessRepository.queryUsers({}));
    const [isLoading, setIsLoading] = useState(false);
    type UserErrorKey = 'users.error.generic';
    const [error, setError] = useState<UserErrorKey>();
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);

    const [detailId, setDetailId] = useState<string>();
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string>();
    const [resetTargetId, setResetTargetId] = useState<string>();
    const [lifecycleTarget, setLifecycleTarget] = useState<{ id: string; action: UserLifecycleAction }>();

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        setTimeout(() => {
            try {
                setRecords(accessRepository.queryUsers({}));
            } catch {
                setError('users.error.generic');
            }

            setIsLoading(false);
        }, 350);
    }, [t]);

    const filteredData = useMemo(() => {
        const needle = search.trim().toLowerCase();

        return records.filter((user) => {
            const matchesSearch =
                !needle ||
                user.name.toLowerCase().includes(needle) ||
                user.email.toLowerCase().includes(needle) ||
                user.username.toLowerCase().includes(needle);
            const matchesStatus =
                statusFilter === 'all'
                    ? user.status !== 'deleted'
                    : user.status === statusFilter;
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;

            return matchesSearch && matchesStatus && matchesRole;
        });
    }, [records, search, statusFilter, roleFilter]);

    const openDetail = useCallback((user: UserAccount) => {
        setDetailId(user.id);
    }, []);

    const openEdit = useCallback((user: UserAccount) => {
        setEditingId(user.id);
        setFormOpen(true);
    }, []);

    const openResetPassword = useCallback((user: UserAccount) => {
        setResetTargetId(user.id);
    }, []);

    const openLifecycle = useCallback((user: UserAccount, action: UserLifecycleAction) => {
        setLifecycleTarget({ id: user.id, action });
    }, []);

    const columns = useMemo(
        () =>
            userColumns(t, {
                onView: openDetail,
                onEdit: openEdit,
            }),
        [t, openDetail, openEdit]
    );

    const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map((column) => column.id as string));

    const table = useTable({
        features: dataGridFeatures,
        columns,
        data: filteredData,
        pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
        getRowId: (row: UserAccount) => row.id,
        state: { pagination, sorting, columnOrder },
        onColumnOrderChange: setColumnOrder,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        meta: { search },
    });

    const hasActiveFilters = statusFilter !== 'all' || roleFilter !== 'all';

    const clearAll = () => {
        setSearch('');
        setStatusFilter('all');
        setRoleFilter('all');
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleSaved = () => {
        setRecords(accessRepository.queryUsers({}));
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        setEditingId(undefined);
    };

    return (
        <AdminShell
            title={t('users.title')}
            subtitle={t('users.subtitle')}
            
        >
            <Head title={t('users.headTitle')} />

            <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
                {error ? (
                    <FlexErrorState
                        title={t('users.error.title')}
                        description={error ? t(error) : undefined}
                        action={
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh}>
                                <RiRefreshLine className="size-3.5" />
                                {t('users.error.retry')}
                            </Button>
                        }
                    />
                ) : (
                    <FlexWorkbenchShell variant="primary"
                        toolbar={
                            <UsersToolbar
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
                                roleFilter={roleFilter}
                                onRoleFilterChange={(value) => {
                                    setRoleFilter(value);
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
                        <UsersTable
                            table={table}
                            recordCount={filteredData?.length || 0}
                            isLoading={isLoading}
                            total={records.length}
                            onRowClick={openDetail}
                            emptyMessage={
                                <FlexEmptyState
                                    title={records.length === 0 ? t('users.empty.noUsers') : t('users.empty.noMatch')}
                                    description={
                                        records.length === 0
                                            ? t('users.empty.noUsersDescription')
                                            : t('users.empty.noMatchDescription')
                                    }
                                    action={
                                        records.length === 0 ? (
                                            <Button variant="outline" size="sm" className="text-xs" onClick={() => setFormOpen(true)}>
                                                {t('users.empty.addUser')}
                                            </Button>
                                        ) : (
                                            <Button variant="outline" size="sm" className="text-xs" onClick={clearAll}>
                                                {t('users.empty.clearFilters')}
                                            </Button>
                                        )
                                    }
                                />
                            }
                        />
                    </FlexWorkbenchShell>
                )}

                <p className="text-[10px] text-flex-text-muted">
                    {t('users.footerHint')}
                </p>
            </div>

            <UserDetailSheet
                user={records.find((record) => record.id === detailId)}
                onOpenChange={(open) => !open && setDetailId(undefined)}
                onEdit={openEdit}
                onResetPassword={openResetPassword}
                onLifecycle={openLifecycle}
            />

            <UserResetPasswordDialog
                user={resetTargetId ? records.find((record) => record.id === resetTargetId) : undefined}
                onOpenChange={(open) => !open && setResetTargetId(undefined)}
            />

            <UserLifecycleDialog
                user={lifecycleTarget ? records.find((record) => record.id === lifecycleTarget.id) : undefined}
                action={lifecycleTarget?.action}
                onOpenChange={(open) => !open && setLifecycleTarget(undefined)}
                onCompleted={handleSaved}
            />

            <UserFormSheet
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
