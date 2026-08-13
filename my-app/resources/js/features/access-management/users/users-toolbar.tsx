import { RiFilterOffLine, RiSearchLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROLE_OPTIONS } from '@/features/access-management/shared/role-options';
import type { UserRoleFilter, UserStatusFilter } from '@/features/access-management/shared/types';
import { USER_STATUS_OPTIONS } from '@/features/access-management/users/user-status';

export const USER_STATUS_FILTERS: { value: UserStatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    ...USER_STATUS_OPTIONS.map((status) => ({ value: status as UserStatusFilter, label: status })),
];

export const USER_ROLE_FILTERS: { value: UserRoleFilter; label: string }[] = [
    { value: 'all', label: 'All roles' },
    ...ROLE_OPTIONS,
];

export interface UsersToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: UserStatusFilter;
    onStatusFilterChange: (value: UserStatusFilter) => void;
    roleFilter: UserRoleFilter;
    onRoleFilterChange: (value: UserRoleFilter) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

export function UsersToolbar({
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    roleFilter,
    onRoleFilterChange,
    hasActiveFilters,
    onClearFilters,
}: UsersToolbarProps) {
    return (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative w-full lg:max-w-sm">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-flex-text-muted" />
                <Input
                    value={search}
                    onChange={(e) => {
                        onSearchChange(e.target.value);
                    }}
                    placeholder="Search users by name, email, or username..."
                    className="pl-9 h-9 text-xs"
                    aria-label="Search users"
                />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <div
                    className="flex items-center gap-1 rounded-lg border border-border bg-card p-1"
                    role="group"
                    aria-label="Filter by status"
                >
                    {USER_STATUS_FILTERS.map((option) => (
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

                <select
                    value={roleFilter}
                    onChange={(e) => onRoleFilterChange(e.target.value as UserRoleFilter)}
                    aria-label="Filter by role"
                    className="h-9 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                    {USER_ROLE_FILTERS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

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
