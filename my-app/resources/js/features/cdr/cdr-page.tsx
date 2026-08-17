import { Head } from '@inertiajs/react';
import { RiRefreshLine } from '@remixicon/react';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { FlexWorkbenchShell } from '@/components/flex/flex-workbench-shell';
import { dataGridFeatures } from '@/components/reui/data-grid/data-grid';
import type { Filter } from '@/components/reui/filters';
import { Button } from '@/components/ui/button';
import { cdrRepository  } from '@/domain/cdr-repository';
import type {CdrQuery} from '@/domain/cdr-repository';
import type { CDRRecord } from '@/domain/types';
import { cdrColumns } from '@/features/cdr/cdr-columns';
import { CdrDetailSheet } from '@/features/cdr/cdr-detail-sheet';
import { CdrTable } from '@/features/cdr/cdr-table';
import { CdrToolbar  } from '@/features/cdr/cdr-toolbar';
import type {QuickFilter} from '@/features/cdr/cdr-toolbar';
import { AdminShell } from '@/layouts/admin-shell';

const cdrContextGroups: ContextSidebarGroup[] = [
    {
        groupTitle: 'Supervision',
        items: [
            { title: 'Dashboard', href: '/dashboard', capability: 'dashboard.view' },
        ],
    },
    {
        groupTitle: 'Operations',
        items: [
            { title: 'Call Records (CDR)', href: '/admin/cdr', capability: 'cdr.view' },
            { title: 'Call Campaigns', href: '/admin/campaigns', capability: 'campaigns.view' },
            { title: 'Reports & Analytics', href: '/admin/reports', capability: 'reports.view' },
        ],
    },
];

const toDateInput = (date: Date) => format(date, 'yyyy-MM-dd');

export function CdrPage() {
    const [search, setSearch] = useState('');
    const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
    const [dateFrom, setDateFrom] = useState<string>();
    const [dateTo, setDateTo] = useState<string>();
    const [filters, setFilters] = useState<Filter[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);
    const [detailId, setDetailId] = useState<string>();

    const query = useMemo<CdrQuery>(() => {
        const q: CdrQuery = { search };

        if (quickFilter === 'today') {
            const today = toDateInput(new Date());
            q.dateFrom = today;
            q.dateTo = today;
        } else if (quickFilter !== 'all') {
            q.status = quickFilter;
        }

        if (dateFrom) {
q.dateFrom = dateFrom;
}

        if (dateTo) {
q.dateTo = dateTo;
}

        return q;
    }, [search, quickFilter, dateFrom, dateTo]);

    const { records: baseResults, error: queryError } = useMemo(() => {
        try {
            return { records: cdrRepository.query(query), error: undefined as string | undefined };
        } catch {
            return { records: [], error: 'The call records service did not respond.' };
        }
    }, [query]);

    const loadError = error ?? queryError;

    const filteredData = useMemo(() => {
        const active = filters.filter((filter) => filter.values?.length > 0 && filter.values.some((v) => v !== ''));

        return baseResults.filter((record) => {
            for (const filter of active) {
                const { field, operator, values } = filter;
                const value = record[field as keyof CDRRecord] as string | boolean | undefined;

                if (operator === 'is' || operator === 'equals') {
                    if (!values.includes(value)) {
return false;
}
                } else if (operator === 'is_not' || operator === 'not_equals') {
                    if (values.includes(value)) {
return false;
}
                } else if (operator === 'contains') {
                    if (!values.some((v) => String(value).toLowerCase().includes(String(v).toLowerCase()))) {
return false;
}
                } else if (operator === 'not_contains') {
                    if (values.some((v) => String(value).toLowerCase().includes(String(v).toLowerCase()))) {
return false;
}
                }
            }

            return true;
        });
    }, [baseResults, filters]);

    const openDetail = useCallback((record: CDRRecord) => {
        setDetailId(record.id);
    }, []);

    const columns = useMemo(() => cdrColumns(openDetail), [openDetail]);

    const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map((column) => column.id as string));

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        // Local mock adapter: resolve on a microtask to render the loading state.
        // The data read itself happens in the safe query memo below; errors there
        // surface through `queryError` without crashing the page.
        setTimeout(() => {
            setIsLoading(false);
        }, 350);
    }, []);

    const clearAll = useCallback(() => {
        setSearch('');
        setQuickFilter('all');
        setFilters([]);
        setDateFrom(undefined);
        setDateTo(undefined);
    }, []);

    const table = useTable({
        features: dataGridFeatures,
        columns,
        data: filteredData,
        pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
        getRowId: (row: CDRRecord) => row.id,
        state: { pagination, sorting, columnOrder },
        onColumnOrderChange: setColumnOrder,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        meta: { search },
    });

    const hasActiveAdvanced = filters.some((filter) => filter.values?.length > 0);
    const todayDate = toDateInput(new Date());

    return (
        <AdminShell
            title="Call Detail Records (CDR)"
            subtitle="Search, filter & inspect telephony logs"
            contextTitle="Telephony"
            contextSubtitle="Search & navigate call records"
            contextGroups={cdrContextGroups}
            actions={
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh} disabled={isLoading}>
                    <RiRefreshLine className="size-3.5" />
                    Refresh
                </Button>
            }
        >
            <Head title="CDR — Flex Contact Center" />

            <div className="flex flex-col gap-4 w-full">
                <CdrToolbar
                    search={search}
                    onSearchChange={(value) => {
                        setSearch(value);
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    quickFilter={quickFilter}
                    onQuickFilterChange={(value) => {
                        setQuickFilter(value);
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    onRangeChange={(from, to) => {
                        setDateFrom(from);
                        setDateTo(to);
                    }}
                    filters={filters}
                    onFiltersChange={(next) => {
                        setFilters(next);
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    hasActiveAdvanced={hasActiveAdvanced}
                    onClearFilters={() => setFilters([])}
                />

                {loadError ? (
                    <FlexErrorState
                        title="Couldn't load call records"
                        description={loadError}
                        action={
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh}>
                                <RiRefreshLine className="size-3.5" />
                                Try again
                            </Button>
                        }
                    />
                ) : (
                    <FlexWorkbenchShell>
                        <CdrTable
                            table={table}
                            recordCount={filteredData?.length || 0}
                            isLoading={isLoading}
                            total={baseResults.length}
                            quickFilter={quickFilter}
                            onRowClick={openDetail}
                            emptyMessage={
                                <FlexEmptyState
                                    title="No call records found"
                                    description="Try changing your filters or date range."
                                    action={
                                        <Button variant="outline" size="sm" className="text-xs" onClick={clearAll}>
                                            Clear filters
                                        </Button>
                                    }
                                />
                            }
                        />
                    </FlexWorkbenchShell>
                )}

                <p className="text-[10px] text-flex-text-muted">
                    POC mock adapter ({todayDate} dataset) — `CdrRepository` boundary; replace with the CDR backend in
                    rollout.
                </p>
            </div>

            <CdrDetailSheet recordId={detailId} onOpenChange={(open) => !open && setDetailId(undefined)} />
        </AdminShell>
    );
}
