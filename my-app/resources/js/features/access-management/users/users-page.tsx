import { Head } from '@inertiajs/react';
import { RiAddLine, RiRefreshLine } from '@remixicon/react';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { dataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { Button } from '@/components/ui/button';
import { accessRepository } from '@/domain/access-repository';
import type { UserAccount, UserRoleFilter, UserStatusFilter } from '@/features/access-management/shared/types';
import { UserDetailSheet } from '@/features/access-management/users/user-detail-sheet';
import { UserFormSheet } from '@/features/access-management/users/user-form-sheet';
import { UserResetPasswordDialog } from '@/features/access-management/users/user-reset-password-dialog';
import { userColumns } from '@/features/access-management/users/users-columns';
import { UsersTable } from '@/features/access-management/users/users-table';
import { UsersToolbar } from '@/features/access-management/users/users-toolbar';
import { AdminShell } from '@/layouts/admin-shell';

const usersContextGroups: ContextSidebarGroup[] = [
    {
        groupTitle: 'People & Access',
        items: [
            { title: 'Users', href: '/admin/users', capability: 'roles.manage' },
            { title: 'Roles & Permissions', href: '/admin/roles', capability: 'roles.manage' },
        ],
    },
    {
        groupTitle: 'Administration',
        items: [
            { title: 'Management Console', href: '/admin/console', capability: 'console.view' },
        ],
    },
];

export function UsersPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<UserStatusFilter>('all');
    const [roleFilter, setRoleFilter] = useState<UserRoleFilter>('all');
    const [records, setRecords] = useState<UserAccount[]>(() => accessRepository.queryUsers({}));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);

    const [detailId, setDetailId] = useState<string>();
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string>();
    const [resetTargetId, setResetTargetId] = useState<string>();

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        setTimeout(() => {
            try {
                setRecords(accessRepository.queryUsers({}));
            } catch {
                setError('User data could not be retrieved.');
            }

            setIsLoading(false);
        }, 350);
    }, []);

    const filteredData = useMemo(() => {
        const needle = search.trim().toLowerCase();

        return records.filter((user) => {
            const matchesSearch =
                !needle ||
                user.name.toLowerCase().includes(needle) ||
                user.email.toLowerCase().includes(needle) ||
                user.username.toLowerCase().includes(needle);
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
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

    const columns = useMemo(
        () =>
            userColumns({
                onView: openDetail,
                onEdit: openEdit,
            }),
        [openDetail, openEdit]
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
            title="Users"
            subtitle="Manage user accounts and access."
            contextTitle="People & Access"
            contextSubtitle="Users, roles & permissions"
            contextGroups={usersContextGroups}
            actions={
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh} disabled={isLoading}>
                        <RiRefreshLine className="size-3.5" />
                        <span>Refresh</span>
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs" onClick={() => setFormOpen(true)}>
                        <RiAddLine className="size-4" />
                        <span>Add User</span>
                    </Button>
                </div>
            }
        >
            <Head title="Users — Flex Contact Center" />

            <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
                <UsersToolbar
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
                />

                {error ? (
                    <FlexErrorState
                        title="Couldn't load users"
                        description={error}
                        action={
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh}>
                                <RiRefreshLine className="size-3.5" />
                                Try again
                            </Button>
                        }
                    />
                ) : (
                    <UsersTable
                        table={table}
                        recordCount={filteredData?.length || 0}
                        isLoading={isLoading}
                        total={records.length}
                        onRowClick={openDetail}
                        emptyMessage={
                            <FlexEmptyState
                                title={records.length === 0 ? 'No users yet' : 'No users match these filters'}
                                description={
                                    records.length === 0
                                        ? 'Add your first user account to get started.'
                                        : 'Try changing your search or filters.'
                                }
                                action={
                                    records.length === 0 ? (
                                        <Button variant="outline" size="sm" className="text-xs" onClick={() => setFormOpen(true)}>
                                            Add User
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
                    POC mock adapter — `AccessRepository` boundary; replace with the real users backend in rollout.
                </p>
            </div>

            <UserDetailSheet
                user={records.find((record) => record.id === detailId)}
                onOpenChange={(open) => !open && setDetailId(undefined)}
                onEdit={openEdit}
                onResetPassword={openResetPassword}
            />

            <UserResetPasswordDialog
                user={resetTargetId ? records.find((record) => record.id === resetTargetId) : undefined}
                onOpenChange={(open) => !open && setResetTargetId(undefined)}
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
