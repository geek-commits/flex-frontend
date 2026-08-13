import { RiEyeLine, RiHistoryLine, RiPencilLine, RiRefreshLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { getReportById } from '@/features/reports/report-registry';
import {
    ExecutionStateBadge,
    ScheduleStatusBadge,
} from '@/features/reports/scheduled/schedule-status';
import type { ScheduledReportRecord } from '@/features/reports/scheduled/scheduled-types';

export interface ScheduledReportsTableProps {
    records: ScheduledReportRecord[];
    onViewLogs: (schedule: ScheduledReportRecord) => void;
    onEdit: (schedule: ScheduledReportRecord) => void;
    onRetry: (schedule: ScheduledReportRecord) => void;
}

/**
 * Dense schedules table. Report Name / Schedule / Target / Format / Last Run /
 * Next Run / Execution State / Status / Actions. Status and execution state are
 * rendered as distinct components.
 */
export function ScheduledReportsTable({ records, onViewLogs, onEdit, onRetry }: ScheduledReportsTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {['Report Name', 'Schedule', 'Target', 'Format', 'Last Run', 'Next Run', 'State', 'Status', ''].map((header, index) => (
                                <th key={index} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((schedule) => {
                            const report = getReportById(schedule.reportId);

                            return (
                                <tr key={schedule.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-2.5">
                                        <span className="block text-xs font-semibold text-flex-text-primary whitespace-nowrap">{schedule.name}</span>
                                        <span className="block text-[10px] text-flex-text-muted">{report?.label ?? schedule.reportId}</span>
                                    </td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap">{schedule.scheduleSummary}</td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap">{schedule.targetSummary}</td>
                                    <td className="px-4 py-2.5 text-xs font-semibold text-flex-text-primary whitespace-nowrap">{schedule.format}</td>
                                    <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-muted whitespace-nowrap">{schedule.lastRun}</td>
                                    <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-muted whitespace-nowrap">{schedule.nextRun}</td>
                                    <td className="px-4 py-2.5"><ExecutionStateBadge state={schedule.executionState} /></td>
                                    <td className="px-4 py-2.5"><ScheduleStatusBadge status={schedule.status} /></td>
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-0.5 justify-end">
                                            <Button variant="ghost" size="icon-xs" title="View logs" onClick={() => onViewLogs(schedule)}>
                                                <RiHistoryLine className="size-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon-xs" title="Edit schedule" onClick={() => onEdit(schedule)}>
                                                <RiPencilLine className="size-3.5" />
                                            </Button>
                                            {schedule.executionState === 'Failed' && (
                                                <Button variant="ghost" size="icon-xs" title="Retry" onClick={() => onRetry(schedule)}>
                                                    <RiRefreshLine className="size-3.5" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon-xs" title="View" onClick={() => onViewLogs(schedule)}>
                                                <RiEyeLine className="size-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
