import { RiCalendarLine, RiFilterOffLine } from '@remixicon/react';
import React, { useMemo } from 'react';
import { DateRangeSelect } from '@/components/flex/date-range-select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getReportFilterOptions } from '@/features/reports/report-filter-options';
import type { ReportDefinition } from '@/features/reports/report-registry';
import type { ReportQuery } from '@/features/reports/report-types';

export interface ReportFilterBarProps {
    report: ReportDefinition;
    query: ReportQuery;
    onQueryChange: (query: ReportQuery) => void;
}

/**
 * Shared report filter grammar. Always renders the canonical date period, then
 * composes report-specific filters (agent / queue / ivr / provider / year) only
 * when the report's data actually supports that dimension. Filters apply on the
 * viewer's Run action — no request on every keystroke.
 */
export function ReportFilterBar({ report, query, onQueryChange }: ReportFilterBarProps) {
    const options = useMemo(() => getReportFilterOptions(report.id), [report.id]);

    const hasFilters =
        Boolean(query.agent) ||
        Boolean(query.queue) ||
        Boolean(query.ivr) ||
        Boolean(query.provider) ||
        Boolean(query.year);

    const clearFilters = () => {
        onQueryChange({
            dateFrom: query.dateFrom,
            dateTo: query.dateTo,
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4 lg:flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-flex-text-muted shrink-0">
                    <RiCalendarLine className="size-3.5" />
                    <span>Period</span>
                </div>
                <DateRangeSelect
                    from={query.dateFrom}
                    to={query.dateTo}
                    onRangeChange={(from, to) => onQueryChange({ ...query, dateFrom: from, dateTo: to })}
                />

                {options.years.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Label htmlFor="filter-year" className="text-xs font-semibold text-flex-text-muted">
                            Year
                        </Label>
                        <Select
                            value={query.year || undefined}
                            onValueChange={(value) => onQueryChange({ ...query, year: value || undefined })}
                        >
                            <SelectTrigger id="filter-year" className="w-32 h-9 text-xs">
                                <SelectValue placeholder="All years" />
                            </SelectTrigger>
                            <SelectContent>
                                {options.years.map((year) => (
                                    <SelectItem key={year} value={year} className="text-xs">
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {(options.agents.length > 0 || options.queues.length > 0 || options.ivrs.length > 0 || options.providers.length > 0) && (
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4 lg:flex-wrap">
                    {options.agents.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Label htmlFor="filter-agent" className="text-xs font-semibold text-flex-text-muted">
                                Agent
                            </Label>
                            <Select
                                value={query.agent || undefined}
                                onValueChange={(value) => onQueryChange({ ...query, agent: value || undefined })}
                            >
                                <SelectTrigger id="filter-agent" className="w-48 h-9 text-xs">
                                    <SelectValue placeholder="All agents" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.agents.map((agent) => (
                                        <SelectItem key={agent} value={agent} className="text-xs">
                                            {agent}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {options.queues.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Label htmlFor="filter-queue" className="text-xs font-semibold text-flex-text-muted">
                                Queue
                            </Label>
                            <Select
                                value={query.queue || undefined}
                                onValueChange={(value) => onQueryChange({ ...query, queue: value || undefined })}
                            >
                                <SelectTrigger id="filter-queue" className="w-40 h-9 text-xs">
                                    <SelectValue placeholder="All queues" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.queues.map((queue) => (
                                        <SelectItem key={queue} value={queue} className="text-xs">
                                            {queue}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {options.ivrs.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Label htmlFor="filter-ivr" className="text-xs font-semibold text-flex-text-muted">
                                IVR
                            </Label>
                            <Select
                                value={query.ivr || undefined}
                                onValueChange={(value) => onQueryChange({ ...query, ivr: value || undefined })}
                            >
                                <SelectTrigger id="filter-ivr" className="w-40 h-9 text-xs">
                                    <SelectValue placeholder="All IVRs" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.ivrs.map((ivr) => (
                                        <SelectItem key={ivr} value={ivr} className="text-xs">
                                            {ivr}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {options.providers.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Label htmlFor="filter-provider" className="text-xs font-semibold text-flex-text-muted">
                                Provider
                            </Label>
                            <Select
                                value={query.provider || undefined}
                                onValueChange={(value) => onQueryChange({ ...query, provider: value || undefined })}
                            >
                                <SelectTrigger id="filter-provider" className="w-40 h-9 text-xs">
                                    <SelectValue placeholder="All providers" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.providers.map((provider) => (
                                        <SelectItem key={provider} value={provider} className="text-xs">
                                            {provider}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {hasFilters && (
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={clearFilters}>
                            <RiFilterOffLine className="size-3.5" />
                            Clear filters
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
