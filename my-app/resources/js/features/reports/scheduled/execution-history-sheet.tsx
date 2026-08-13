import { RiArrowDownSLine, RiArrowRightSLine } from '@remixicon/react';
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { scheduledReportsRepository } from '@/domain/scheduled-reports-repository';
import type { ExecutionRecord } from '@/features/reports/scheduled/execution-types';
import { ExecutionStateBadge } from '@/features/reports/scheduled/schedule-status';
import type { ScheduledReportRecord } from '@/features/reports/scheduled/scheduled-types';

export interface ExecutionHistorySheetProps {
    schedule?: ScheduledReportRecord;
    onOpenChange: (open: boolean) => void;
}

/**
 * Execution history — an operational troubleshooting surface. Dense timeline of
 * executions with expandable stage info and delivery results.
 */
export function ExecutionHistorySheet({ schedule, onOpenChange }: ExecutionHistorySheetProps) {
    const executions = useMemo(
        () => (schedule ? scheduledReportsRepository.queryExecutions(schedule.id) : []),
        [schedule]
    );
    const [expanded, setExpanded] = useState<string>();

    const open = !!schedule;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader className="border-b border-border pr-10">
                    <SheetTitle className="text-base font-semibold text-flex-text-primary">Execution History</SheetTitle>
                    {schedule && (
                        <p className="text-xs text-flex-text-muted">{schedule.name}</p>
                    )}
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                    {executions.length === 0 && (
                        <p className="py-10 text-center text-xs text-flex-text-muted">
                            No execution history yet for this schedule.
                        </p>
                    )}

                    {executions.map((execution) => (
                        <ExecutionRow
                            key={execution.id}
                            execution={execution}
                            expanded={expanded === execution.id}
                            onToggle={() => setExpanded(expanded === execution.id ? undefined : execution.id)}
                        />
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}

function ExecutionRow({
    execution,
    expanded,
    onToggle,
}: {
    execution: ExecutionRecord;
    expanded: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="rounded-lg border border-border bg-background">
            <div className="flex items-center justify-between gap-3 p-3">
                <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-flex-text-primary tabular-nums">{execution.timestamp}</span>
                        <ExecutionStateBadge state={execution.state} />
                    </div>
                    <span className="text-[11px] text-flex-text-muted tabular-nums">
                        {execution.duration} · {execution.records.toLocaleString()} records · {execution.fileSize}
                    </span>
                    <span className="text-[11px] text-flex-text-muted">
                        {execution.emailsSent} delivered{execution.emailsFailed > 0 ? `, ${execution.emailsFailed} failed` : ''}
                    </span>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-xs shrink-0" onClick={onToggle}>
                    {expanded ? <RiArrowDownSLine className="size-3.5" /> : <RiArrowRightSLine className="size-3.5" />}
                    {expanded ? 'Hide stages' : 'Stages'}
                </Button>
            </div>

            {expanded && (
                <div className="border-t border-border p-3 flex flex-col gap-2">
                    {execution.stages.map((stage, index) => (
                        <div key={index} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                                <span
                                    className={`size-1.5 rounded-full shrink-0 ${
                                        stage.status === 'completed' ? 'bg-status-live' : 'bg-status-stale'
                                    }`}
                                />
                                <span className="text-xs text-flex-text-primary truncate">{stage.name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {stage.error && <span className="text-[11px] text-destructive">{stage.error}</span>}
                                <span className="text-[11px] text-flex-text-muted tabular-nums">{stage.duration}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
