import { RiAddLine, RiFilterOffLine, RiRefreshLine, RiSearchLine } from '@remixicon/react';
import type { Table } from '@tanstack/react-table';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnVisibility } from '@/components/reui/data-grid/data-grid-column-visibility';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROLE_LABEL_KEYS } from '@/features/access-management/shared/role-options';
import type { UserRoleFilter, UserStatusFilter } from '@/features/access-management/shared/types';
import type { UserAccount } from '@/features/access-management/shared/types';
import { USER_STATUS_KEYS, USER_STATUS_OPTIONS } from '@/features/access-management/users/user-status';

export interface UsersToolbarProps {
    table: Table<DataGridFeatures, UserAccount>;
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: UserStatusFilter;
    onStatusFilterChange: (value: UserStatusFilter) => void;
    roleFilter: UserRoleFilter;
    onRoleFilterChange: (value: UserRoleFilter) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
    onAdd: () => void;
}

export function UsersToolbar({
    table,
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    roleFilter,
    onRoleFilterChange,
    hasActiveFilters,
    onClearFilters,
    onRefresh,
    isRefreshing,
    onAdd,
}: UsersToolbarProps) {
    const { t } = useTranslation('administration');

    const statusFilters: { value: UserStatusFilter; label: string }[] = [
        { value: 'all', label: t('users.toolbar.all') },
        ...USER_STATUS_OPTIONS.map((status) => ({ value: status as UserStatusFilter, label: t(USER_STATUS_KEYS[status]) })),
    ];

    const roleFilters: { value: UserRoleFilter; label: string }[] = [
        { value: 'all', label: t('users.toolbar.allRoles') },
        ...Object.entries(ROLE_LABEL_KEYS).map(([value, labelKey]) => ({
            value: value as UserRoleFilter,
            label: t(labelKey),
        })),
    ];

    return (
        <div className="flex flex-col gap-3 px-3 py-2.5 lg:flex-row lg:items-center lg:justify-between">
            {/* Left group — scope & filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <div
                    className="flex items-center gap-1 rounded-md border border-border bg-card p-1"
                    role="group"
                    aria-label={t('users.toolbar.filterStatusLabel')}
                >
                    {statusFilters.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onStatusFilterChange(option.value)}
                            className={`px-2.5 py-1 rounded-[6px] text-xs font-medium capitalize transition-colors ${
                                statusFilter === option.value
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-flex-text-muted hover:text-foreground hover:bg-muted/70'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <select
                    value={roleFilter}
                    onChange={(e) => onRoleFilterChange(e.target.value as UserRoleFilter)}
                    aria-label={t('users.toolbar.filterRoleLabel')}
                    className="h-7 rounded-[6px] border border-border bg-card px-2.5 text-[13px] font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                    {roleFilters.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {hasActiveFilters && (
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onClearFilters}>
                        <RiFilterOffLine className="size-3.5" />
                        {t('users.toolbar.clear')}
                    </Button>
                )}
            </div>

            {/* Right group — search, columns, actions */}
            <div className="flex items-center gap-2 flex-wrap">
                <div className="relative w-full lg:w-64">
                    <RiSearchLine className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-flex-text-muted" />
                    <Input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={t('users.toolbar.searchPlaceholder')}
                        size="sm"
                        className="pl-8"
                        aria-label={t('users.toolbar.searchAriaLabel')}
                    />
                </div>

                <DataGridColumnVisibility
                    table={table}
                    trigger={<Button variant="outline" size="sm" className="gap-1.5 text-xs">{t('users.toolbar.columns')}</Button>}
                />

                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onRefresh} disabled={isRefreshing}>
                    <RiRefreshLine className="size-3.5" />
                    {t('users.toolbar.refresh')}
                </Button>

                <Button size="sm" className="gap-1.5 text-xs" onClick={onAdd}>
                    <RiAddLine className="size-4" />
                    {t('users.toolbar.addUser')}
                </Button>
            </div>
        </div>
    );
}
