import type { ReportFormat, ReportId } from '@/features/reports/report-registry';

/**
 * Scheduled Reports domain types.
 *
 * The scheduler is a distinct subsystem: schedule **status** (whether the
 * schedule participates in the queue) is separate from **execution state** (the
 * last/current run outcome). The UI must never merge them into one badge.
 */

export type ScheduleType = 'Daily' | 'Weekly' | 'Monthly' | 'Custom';

export type ScheduleStatus = 'Active' | 'Inactive' | 'Disabled';

export type ExecutionState = 'Scheduled' | 'Running' | 'Completed' | 'Failed' | 'Retrying';

export type RecipientTargetType = 'Emails' | 'Users' | 'Roles' | 'Departments';

export interface ScheduleRecipient {
    type: RecipientTargetType;
    value: string;
}

export interface ScheduledReportRecord {
    id: string;
    name: string;
    reportId: ReportId;
    format: ReportFormat;
    scheduleType: ScheduleType;
    scheduleSummary: string;
    targetType: RecipientTargetType;
    targetSummary: string;
    recipients: ScheduleRecipient[];
    status: ScheduleStatus;
    lastRun: string;
    nextRun: string;
    executionState: ExecutionState;
}

export interface ScheduledReportDraft {
    name: string;
    reportId: ReportId;
    format: ReportFormat;
    scheduleType: ScheduleType;
    scheduleSummary: string;
    targetType: RecipientTargetType;
    recipients: ScheduleRecipient[];
    status: ScheduleStatus;
}
