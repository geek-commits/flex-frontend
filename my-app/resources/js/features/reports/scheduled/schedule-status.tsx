import React from 'react';
import { FlexStatus } from '@/components/flex/flex-status';
import type { ExecutionState, ScheduleStatus } from '@/features/reports/scheduled/scheduled-types';

const SCHEDULE_STATUS_TONE: Record<ScheduleStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    Active: 'success',
    Inactive: 'neutral',
    Disabled: 'danger',
};

const EXECUTION_STATE_TONE: Record<ExecutionState, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    Scheduled: 'neutral',
    Running: 'info',
    Completed: 'success',
    Failed: 'danger',
    Retrying: 'warning',
};

/** Schedule status — whether the schedule is in the execution queue. */
export function ScheduleStatusBadge({ status }: { status: ScheduleStatus }) {
    return (
        <FlexStatus tone={SCHEDULE_STATUS_TONE[status]} className="capitalize">
            {status}
        </FlexStatus>
    );
}

/** Execution state — the last/current run outcome. Distinct from status. */
export function ExecutionStateBadge({ state }: { state: ExecutionState }) {
    return (
        <FlexStatus tone={EXECUTION_STATE_TONE[state]} className="capitalize">
            {state}
        </FlexStatus>
    );
}
