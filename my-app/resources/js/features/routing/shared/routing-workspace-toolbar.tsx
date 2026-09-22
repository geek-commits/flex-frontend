import { RiFilterOffLine, RiSearchLine } from '@remixicon/react';
import React from 'react';
import { FlexDataWorkspaceToolbar } from '@/components/flex/flex-data-workspace-toolbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface RoutingWorkspaceToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;
    searchAriaLabel: string;
    hasActiveFilters?: boolean;
    onClearFilters?: () => void;
    clearLabel?: string;
    filters?: React.ReactNode;
}

/** Shared compact toolbar for routing directories. */
export function RoutingWorkspaceToolbar({
    search,
    onSearchChange,
    searchPlaceholder,
    searchAriaLabel,
    hasActiveFilters = false,
    onClearFilters,
    clearLabel,
    filters,
}: RoutingWorkspaceToolbarProps) {
    return (
        <FlexDataWorkspaceToolbar
            scope={
                <>
                    {filters}
                    {hasActiveFilters && onClearFilters && clearLabel && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 px-2.5 text-[13px] font-medium"
                            onClick={onClearFilters}
                        >
                            <RiFilterOffLine className="size-3.5" />
                            {clearLabel}
                        </Button>
                    )}
                </>
            }
            actions={
                <div className="relative w-full sm:w-72">
                    <RiSearchLine className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-flex-text-muted" />
                    <Input
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder={searchPlaceholder}
                        aria-label={searchAriaLabel}
                        size="sm"
                        className="pl-8"
                    />
                </div>
            }
        />
    );
}
