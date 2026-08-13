import { RiCalendarLine } from '@remixicon/react';
import React from 'react';
import { DateRangeSelect } from '@/components/flex/date-range-select';
import type { ReportQuery } from '@/features/reports/report-types';

export interface ReportFilterBarProps {
    query: ReportQuery;
    onQueryChange: (query: ReportQuery) => void;
}

/**
 * Shared report filter grammar — date period (canonical control). Report-specific
 * filters (agent/queue/ivr/provider) compose on top per viewer in later phases.
 */
export function ReportFilterBar({ query, onQueryChange }: ReportFilterBarProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-flex-text-muted shrink-0">
                <RiCalendarLine className="size-3.5" />
                <span>Period</span>
            </div>
            <DateRangeSelect
                from={query.dateFrom}
                to={query.dateTo}
                onRangeChange={(from, to) => onQueryChange({ ...query, dateFrom: from, dateTo: to })}
            />
        </div>
    );
}
