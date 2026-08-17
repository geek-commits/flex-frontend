import { RiFilter3Line, RiFilterOffLine } from '@remixicon/react';
import { DateRangeSelect } from '@/components/flex/date-range-select';
import { Filters   } from '@/components/reui/filters';
import type {Filter, FilterFieldConfig} from '@/components/reui/filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
}

export function CdrToolbar({
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
}: CdrToolbarProps) {
    return (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative w-full lg:max-w-sm">
                <Input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search calls by phone, agent, queue..."
                    size="sm"
                    aria-label="Search calls"
                />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                {/* Quick filters */}
                <div
                    className="flex items-center gap-1 rounded-lg border border-border bg-card p-1"
                    role="group"
                    aria-label="Quick filters"
                >
                    {QUICK_FILTERS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onQuickFilterChange(option.value)}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors duration-flex-fast flex-focus-visible ${
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
        </div>
    );
}
