import { RiAddLine, RiFilterOffLine, RiRefreshLine, RiSearchLine } from '@remixicon/react';
import type { Table } from '@tanstack/react-table';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnVisibility } from '@/components/reui/data-grid/data-grid-column-visibility';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TenantRecord, TenantStatusFilter } from '@/features/tenants/shared/types';
import { TENANT_STATUS_OPTIONS } from '@/features/tenants/tenant-status';

export const TENANT_STATUS_FILTERS: { value: TenantStatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    ...TENANT_STATUS_OPTIONS.map((status) => ({
        value: status as TenantStatusFilter,
        label: status === 'active' ? 'Active' : 'Disabled',
    })),
];

export interface TenantsToolbarProps {
    table: Table<DataGridFeatures, TenantRecord>;
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: TenantStatusFilter;
    onStatusFilterChange: (value: TenantStatusFilter) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
    onAdd: () => void;
}

export function TenantsToolbar({
    table,
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    hasActiveFilters,
    onClearFilters,
    onRefresh,
    isRefreshing,
    onAdd,
}: TenantsToolbarProps) {
    const { t } = useTranslation('platform');

    const statusFilters: { value: TenantStatusFilter; label: string }[] = [
        { value: 'all', label: t('tenants.filters.all') },
        ...TENANT_STATUS_OPTIONS.map((status) => ({
            value: status as TenantStatusFilter,
            label: t(`tenants.filters.${status}`),
        })),
    ];

    return (
        <div className="flex flex-col gap-3 px-3 py-2.5 lg:flex-row lg:items-center lg:justify-between">
            {/* Left group — scope & filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <div
                    className="flex items-center gap-1 rounded-md border border-border bg-card p-1"
                    role="group"
                    aria-label={t('tenants.toolbar.filterLabel')}
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

                {hasActiveFilters && (
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onClearFilters}>
                        <RiFilterOffLine className="size-3.5" />
                        {t('tenants.toolbar.clear')}
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
                        placeholder={t('tenants.toolbar.searchPlaceholder')}
                        size="sm"
                        className="pl-8"
                        aria-label={t('tenants.toolbar.searchAriaLabel')}
                    />
                </div>

                <DataGridColumnVisibility
                    table={table}
                    trigger={<Button variant="outline" size="sm" className="gap-1.5 text-xs">{t('tenants.toolbar.columns')}</Button>}
                />

                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onRefresh} disabled={isRefreshing}>
                    <RiRefreshLine className="size-3.5" />
                    {t('tenants.toolbar.refresh')}
                </Button>

                <Button size="sm" className="gap-1.5 text-xs" onClick={onAdd}>
                    <RiAddLine className="size-4" />
                    {t('tenants.toolbar.addTenant')}
                </Button>
            </div>
        </div>
    );
}
