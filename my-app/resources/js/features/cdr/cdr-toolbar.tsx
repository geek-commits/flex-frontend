import { RiFilter3Line, RiFilterOffLine, RiRefreshLine, RiSearchLine } from '@remixicon/react';
import type { Table } from '@tanstack/react-table';
import { DateRangeSelect } from '@/components/flex/date-range-select';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnVisibility } from '@/components/reui/data-grid/data-grid-column-visibility';
import { Filters   } from '@/components/reui/filters';
import type {Filter, FilterFieldConfig} from '@/components/reui/filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CDRRecord } from '@/domain/types';

export type QuickFilter = 'all' | 'today' | 'answered' | 'missed' | 'voicemail' | 'transferred';

export const QUICK_FILTERS: { value: QuickFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'answered', label: 'Answered' },
    { value: 'missed', label: 'Missed' },
    { value: 'voicemail', label: 'Voicemail' },
    { value: 'transferred', label: 'Transferred' },
];

export const CDR_FILTER_FIELDS: FilterFieldConfig[] = [
    {
        key: 'queue',
        label: 'Queue',
        type: 'select',
        searchable: true,
        className: 'w-[180px]',
        options: ['Customer Support', 'Sales & Inquiries', 'Technical Escalations'].map((queue) => ({
            value: queue,
            label: queue,
        })),
    },
    {
        key: 'agent',
        label: 'Agent',
        type: 'text',
        className: 'w-44',
        placeholder: 'Search agent...',
    },
    {
        key: 'recording',
        label: 'Recording',
        type: 'select',
        searchable: false,
        className: 'w-[140px]',
        options: [
            { value: 'has', label: 'Has recording' },
            { value: 'none', label: 'No recording' },
        ],
    },
];

export interface CdrToolbarProps {
    table: Table<DataGridFeatures, CDRRecord>;
    search: string;
    onSearchChange: (value: string) => void;
    quickFilter: QuickFilter;
    onQuickFilterChange: (value: QuickFilter) => void;
    dateFrom?: string;
    dateTo?: string;
    onRangeChange: (from?: string, to?: string) => void;
    filters: Filter[];
    onFiltersChange: (filters: Filter[]) => void;
    hasActiveAdvanced: boolean;
    onClearFilters: () => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
}

export function CdrToolbar({
    table,
    search,
    onSearchChange,
    quickFilter,
    onQuickFilterChange,
    dateFrom,
    dateTo,
    onRangeChange,
    filters,
    onFiltersChange,
    hasActiveAdvanced,
    onClearFilters,
    onRefresh,
    isRefreshing,
}: CdrToolbarProps) {
    return (
        <div className="flex flex-col gap-3 px-3 py-2.5 lg:flex-row lg:items-center lg:justify-between">
            {/* Left group — scope & filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <div
                    className="flex items-center gap-1 rounded-md border border-border bg-card p-1"
                    role="group"
                    aria-label="Quick filters"
                >
                    {QUICK_FILTERS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onQuickFilterChange(option.value)}
                            className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors duration-[var(--flex-duration-fast)] flex-focus-visible ${
                                quickFilter === option.value
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <DateRangeSelect from={dateFrom} to={dateTo} onRangeChange={onRangeChange} />

                <Filters
                    filters={filters}
                    fields={CDR_FILTER_FIELDS}
                    onChange={onFiltersChange}
                    size="sm"
                    trigger={
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                            <RiFilter3Line className="size-3.5" />
                            Filters
                            {hasActiveAdvanced && <span className="size-1.5 rounded-full bg-primary" />}
                        </Button>
                    }
                />
                {hasActiveAdvanced && (
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
                        placeholder="Search calls by phone, agent, queue..."
                        size="sm"
                        className="pl-8"
                        aria-label="Search calls"
                    />
                </div>

                <DataGridColumnVisibility
                    table={table}
                    trigger={<Button variant="outline" size="sm" className="gap-1.5 text-xs">Columns</Button>}
                />

                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                >
                    <RiRefreshLine className="size-3.5" />
                    Refresh
                </Button>
            </div>
        </div>
    );
}