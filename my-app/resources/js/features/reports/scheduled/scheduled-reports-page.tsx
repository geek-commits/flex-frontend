import { RiAddLine, RiSearchLine } from '@remixicon/react';
import React, { useMemo, useState } from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScheduledReportsTable } from '@/features/reports/scheduled/scheduled-reports-table';
import type { ExecutionState, ScheduleStatus, ScheduledReportRecord } from '@/features/reports/scheduled/scheduled-types';

const STATUS_FILTERS: (ScheduleStatus | 'all')[] = ['all', 'Active', 'Inactive', 'Disabled'];
const STATE_FILTERS: (ExecutionState | 'all')[] = ['all', 'Scheduled', 'Running', 'Completed', 'Failed', 'Retrying'];

export interface ScheduledReportsPageProps {
    onBackToLibrary: () => void;
    onCreate: () => void;
    onEdit: (schedule: ScheduledReportRecord) => void;
    onViewLogs: (schedule: ScheduledReportRecord) => void;
    onRetry: (schedule: ScheduledReportRecord) => void;
    records: ScheduledReportRecord[];
}

export function ScheduledReportsPage({
    onBackToLibrary,
    onCreate,
    onEdit,
    onViewLogs,
    onRetry,
    records,
}: ScheduledReportsPageProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<ScheduleStatus | 'all'>('all');
    const [stateFilter, setStateFilter] = useState<ExecutionState | 'all'>('all');

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase();

        return records.filter((schedule) => {
            const matchesSearch =
                !needle ||
                schedule.name.toLowerCase().includes(needle) ||
                schedule.reportId.toLowerCase().includes(needle) ||
                schedule.targetSummary.toLowerCase().includes(needle);
            const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
            const matchesState = stateFilter === 'all' || schedule.executionState === stateFilter;

            return matchesSearch && matchesStatus && matchesState;
        });
    }, [records, search, statusFilter, stateFilter]);

    const hasFilters = statusFilter !== 'all' || stateFilter !== 'all';

    return (
        <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs -ml-2" onClick={onBackToLibrary}>
                        <span>‹</span> Back to Reports
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" className="gap-1.5 text-xs" onClick={onCreate}>
                        <RiAddLine className="size-4" />
                        Add New Report
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
                <div className="relative w-full lg:w-72">
                    <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-flex-text-muted" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search schedules..."
                        aria-label="Search schedules"
                        className="pl-9 h-9 text-xs"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Label htmlFor="sched-status" className="text-xs font-semibold text-flex-text-muted">
                        Status
                    </Label>
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter((value as ScheduleStatus | 'all') ?? 'all')}>
                        <SelectTrigger id="sched-status" className="w-32 h-9 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_FILTERS.map((status) => (
                                <SelectItem key={status} value={status} className="text-xs capitalize">
                                    {status === 'all' ? 'All' : status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Label htmlFor="sched-state" className="text-xs font-semibold text-flex-text-muted">
                        State
                    </Label>
                    <Select value={stateFilter} onValueChange={(value) => setStateFilter((value as ExecutionState | 'all') ?? 'all')}>
                        <SelectTrigger id="sched-state" className="w-36 h-9 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATE_FILTERS.map((state) => (
                                <SelectItem key={state} value={state} className="text-xs capitalize">
                                    {state === 'all' ? 'All states' : state}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filtered.length === 0 ? (
                <FlexEmptyState
                    title={records.length === 0 ? 'No scheduled reports yet' : 'No schedules match these filters'}
                    description={
                        records.length === 0
                            ? 'Automate report generation and delivery for recurring reporting needs.'
                            : 'Try changing your search or filters.'
                    }
                    action={
                        records.length === 0 ? (
                            <Button variant="outline" size="sm" className="text-xs" onClick={onCreate}>
                                Add New Report
                            </Button>
                        ) : hasFilters ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                    setStatusFilter('all');
                                    setStateFilter('all');
                                }}
                            >
                                Clear filters
                            </Button>
                        ) : undefined
                    }
                />
            ) : (
                <ScheduledReportsTable records={filtered} onViewLogs={onViewLogs} onEdit={onEdit} onRetry={onRetry} />
            )}
        </div>
    );
}
