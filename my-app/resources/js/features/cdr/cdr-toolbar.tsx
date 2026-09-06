import {
    RiFilter3Line,
    RiFilterOffLine,
    RiRefreshLine,
    RiSearchLine,
} from '@remixicon/react';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { DateRangeSelect } from '@/components/flex/date-range-select';
import { FlexDataWorkspaceToolbar } from '@/components/flex/flex-data-workspace-toolbar';
import { FlexViewSwitcher } from '@/components/flex/flex-view-switcher';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnVisibility } from '@/components/reui/data-grid/data-grid-column-visibility';
import { Filters } from '@/components/reui/filters';
import type { Filter, FilterFieldConfig } from '@/components/reui/filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CDRRecord } from '@/domain/types';

export type QuickFilter =
    'all' | 'today' | 'answered' | 'missed' | 'voicemail' | 'transferred';

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
    const { t } = useTranslation('supervision');

    const quickFilterOptions: { value: QuickFilter; label: string }[] = [
        { value: 'all', label: t('cdr.quickFilters.all') },
        { value: 'today', label: t('cdr.quickFilters.today') },
        { value: 'answered', label: t('cdr.quickFilters.answered') },
        { value: 'missed', label: t('cdr.quickFilters.missed') },
        { value: 'voicemail', label: t('cdr.quickFilters.voicemail') },
        { value: 'transferred', label: t('cdr.quickFilters.transferred') },
    ];

    const filterFields: FilterFieldConfig[] = [
        {
            key: 'queue',
            label: t('cdr.toolbar.filterQueue'),
            type: 'select',
            searchable: true,
            className: 'w-[180px]',
            options: [
                'Customer Support',
                'Sales & Inquiries',
                'Technical Escalations',
            ].map((queue) => ({
                value: queue,
                label: queue,
            })),
        },
        {
            key: 'agent',
            label: t('cdr.toolbar.filterAgent'),
            type: 'text',
            className: 'w-44',
            placeholder: t('cdr.toolbar.filterAgentPlaceholder'),
        },
    ];

    return (
        <FlexDataWorkspaceToolbar
            scope={
                <>
                    <FlexViewSwitcher
                        value={quickFilter}
                        onValueChange={(value) =>
                            onQuickFilterChange(value as QuickFilter)
                        }
                        options={quickFilterOptions}
                        ariaLabel={t('cdr.toolbar.quickFiltersLabel')}
                    />

                    <DateRangeSelect
                        from={dateFrom}
                        to={dateTo}
                        onRangeChange={onRangeChange}
                    />

                    <Filters
                        filters={filters}
                        fields={filterFields}
                        onChange={onFiltersChange}
                        size="sm"
                        trigger={
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs"
                            >
                                <RiFilter3Line className="size-3.5" />
                                {t('cdr.toolbar.filters')}
                                {hasActiveAdvanced && (
                                    <span className="size-1.5 rounded-full bg-primary" />
                                )}
                            </Button>
                        }
                    />
                    {hasActiveAdvanced && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs"
                            onClick={onClearFilters}
                        >
                            <RiFilterOffLine className="size-3.5" />
                            {t('cdr.toolbar.clear')}
                        </Button>
                    )}
                </>
            }

            actions={
                <>
                    <div className="relative w-full lg:w-64">
                        <RiSearchLine className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-flex-text-muted" />
                        <Input
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={t('cdr.toolbar.searchPlaceholder')}
                            size="sm"
                            className="pl-8"
                            aria-label={t('cdr.toolbar.searchAriaLabel')}
                        />
                    </div>

                    <DataGridColumnVisibility
                        table={table}
                        trigger={
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs"
                            >
                                {t('cdr.toolbar.columns')}
                            </Button>
                        }
                    />

                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={onRefresh}
                        disabled={isRefreshing}
                    >
                        <RiRefreshLine className="size-3.5" />
                        {t('cdr.toolbar.refresh')}
                    </Button>
                </>
            }
        />
    );
}
