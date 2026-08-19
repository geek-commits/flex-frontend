import { RiAddLine, RiFilterOffLine, RiRefreshLine, RiSearchLine } from '@remixicon/react';
import type { Table } from '@tanstack/react-table';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnVisibility } from '@/components/reui/data-grid/data-grid-column-visibility';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CampaignRecord } from '@/domain/types';
import { CAMPAIGN_STATUS_OPTIONS } from '@/features/campaigns/campaign-status';
import type { CampaignStatus } from '@/types/flex';

export type CampaignStatusFilter = 'all' | CampaignStatus;

export const CAMPAIGN_QUICK_FILTERS: { value: CampaignStatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    ...CAMPAIGN_STATUS_OPTIONS.map((status) => ({ value: status as CampaignStatusFilter, label: status })),
];

export interface CampaignsToolbarProps {
    table: Table<DataGridFeatures, CampaignRecord>;
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: CampaignStatusFilter;
    onStatusFilterChange: (value: CampaignStatusFilter) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
    onAdd: () => void;
}

export function CampaignsToolbar({
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
}: CampaignsToolbarProps) {
    return (
        <div className="flex flex-col gap-3 px-3 py-2.5 lg:flex-row lg:items-center lg:justify-between">
            {/* Left group — scope & filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <div
                    className="flex items-center gap-1 rounded-md border border-border bg-card p-1"
                    role="group"
                    aria-label="Filter by status"
                >
                    {CAMPAIGN_QUICK_FILTERS.map((option) => (
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
                        Clear
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
                        placeholder="Search campaigns by title or destination..."
                        size="sm"
                        className="pl-8"
                        aria-label="Search campaigns"
                    />
                </div>

                <DataGridColumnVisibility
                    table={table}
                    trigger={<Button variant="outline" size="sm" className="gap-1.5 text-xs">Columns</Button>}
                />

                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onRefresh} disabled={isRefreshing}>
                    <RiRefreshLine className="size-3.5" />
                    Refresh
                </Button>

                <Button size="sm" className="gap-1.5 text-xs" onClick={onAdd}>
                    <RiAddLine className="size-4" />
                    New Campaign
                </Button>
            </div>
        </div>
    );
}