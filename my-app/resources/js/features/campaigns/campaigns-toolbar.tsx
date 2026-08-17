import { RiFilterOffLine, RiSearchLine } from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CAMPAIGN_STATUS_OPTIONS } from '@/features/campaigns/campaign-status';
import type { CampaignStatus } from '@/types/flex';

export type CampaignStatusFilter = 'all' | CampaignStatus;

export const CAMPAIGN_QUICK_FILTERS: { value: CampaignStatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    ...CAMPAIGN_STATUS_OPTIONS.map((status) => ({ value: status as CampaignStatusFilter, label: status })),
];

export interface CampaignsToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: CampaignStatusFilter;
    onStatusFilterChange: (value: CampaignStatusFilter) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

export function CampaignsToolbar({
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    hasActiveFilters,
    onClearFilters,
}: CampaignsToolbarProps) {
    return (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative w-full lg:max-w-sm">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-flex-text-muted" />
                <Input
                    value={search}
                    onChange={(e) => {
                        onSearchChange(e.target.value);
                    }}
                    placeholder="Search campaigns by title or destination..."
                    size="sm"
                    className="pl-9"
                    aria-label="Search campaigns"
                />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <div
                    className="flex items-center gap-1 rounded-lg border border-border bg-card p-1"
                    role="group"
                    aria-label="Filter by status"
                >
                    {CAMPAIGN_QUICK_FILTERS.map((option) => (
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
