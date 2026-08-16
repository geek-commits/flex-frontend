import { RiFilterOffLine, RiSearchLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TenantStatusFilter } from '@/features/tenants/shared/types';
import { TENANT_STATUS_OPTIONS } from '@/features/tenants/tenant-status';

export const TENANT_STATUS_FILTERS: { value: TenantStatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    ...TENANT_STATUS_OPTIONS.map((status) => ({
        value: status as TenantStatusFilter,
        label: status === 'active' ? 'Active' : 'Disabled',
    })),
];

export interface TenantsToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: TenantStatusFilter;
    onStatusFilterChange: (value: TenantStatusFilter) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

export function TenantsToolbar({
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    hasActiveFilters,
    onClearFilters,
}: TenantsToolbarProps) {
    return (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative w-full lg:max-w-sm">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-flex-text-muted" />
                <Input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search tenants by name, domain, or contact..."
                    className="pl-9 h-9 text-xs"
                    aria-label="Search tenants"
                />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <div
                    className="flex items-center gap-1 rounded-lg border border-border bg-card p-1"
                    role="group"
                    aria-label="Filter by status"
                >
                    {TENANT_STATUS_FILTERS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onStatusFilterChange(option.value)}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
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
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
}
