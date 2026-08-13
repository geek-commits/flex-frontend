import { EXECUTION_MOCK_RECORDS } from '@/data/executions.mock';
import { SCHEDULED_REPORT_MOCK_RECORDS } from '@/data/scheduled-reports.mock';
import type { ExecutionRecord } from '@/features/reports/scheduled/execution-types';
import type { ScheduledReportDraft, ScheduledReportRecord } from '@/features/reports/scheduled/scheduled-types';

/**
 * Scheduled Reports repository boundary.
 *
 * POC MOCK — operates on the in-memory synthetic dataset. CRUD mutations update
 * a local copy for the session. The real backend must implement the same
 * contract (recipient resolution, cron/timezone validation, retries, execution
 * logging) with authorization and tenant scoping enforced server-side.
 */

export interface ScheduledReportsRepository {
    querySchedules(): ScheduledReportRecord[];
    getById(id: string): ScheduledReportRecord | undefined;
    queryExecutions(scheduleId: string): ExecutionRecord[];
    createSchedule(draft: ScheduledReportDraft): ScheduledReportRecord;
    updateSchedule(id: string, draft: ScheduledReportDraft): ScheduledReportRecord | undefined;
    deleteSchedule(id: string): void;
    retrySchedule(id: string): ScheduledReportRecord | undefined;
}

let schedules = [...SCHEDULED_REPORT_MOCK_RECORDS];

export const scheduledReportsRepository: ScheduledReportsRepository = {
    querySchedules() {
        return schedules;
    },

    getById(id: string) {
        return schedules.find((schedule) => schedule.id === id);
    },

    queryExecutions(scheduleId: string) {
        return EXECUTION_MOCK_RECORDS.filter((execution) => execution.scheduleId === scheduleId);
    },

    createSchedule(draft: ScheduledReportDraft) {
        const schedule: ScheduledReportRecord = {
            id: `sched-${Date.now()}`,
            name: draft.name,
            reportId: draft.reportId,
            format: draft.format,
            scheduleType: draft.scheduleType,
            scheduleSummary: draft.scheduleSummary,
            targetType: draft.targetType,
            targetSummary: draft.recipients.map((recipient) => recipient.value).join(', '),
            recipients: draft.recipients,
            status: draft.status,
            lastRun: 'Never',
            nextRun: draft.status === 'Active' ? 'Scheduled' : 'Never',
            executionState: 'Scheduled',
        };

        schedules = [schedule, ...schedules];

        return schedule;
    },

    updateSchedule(id: string, draft: ScheduledReportDraft) {
        const existing = schedules.find((schedule) => schedule.id === id);

        if (!existing) {
            return undefined;
        }

        existing.name = draft.name;
        existing.reportId = draft.reportId;
        existing.format = draft.format;
        existing.scheduleType = draft.scheduleType;
        existing.scheduleSummary = draft.scheduleSummary;
        existing.targetType = draft.targetType;
        existing.targetSummary = draft.recipients.map((recipient) => recipient.value).join(', ');
        existing.recipients = draft.recipients;
        existing.status = draft.status;

        return existing;
    },

    deleteSchedule(id: string) {
        schedules = schedules.filter((schedule) => schedule.id !== id);
    },

    retrySchedule(id: string) {
        const existing = schedules.find((schedule) => schedule.id === id);

        if (existing) {
            existing.executionState = 'Retrying';
            existing.nextRun = 'Scheduled';
        }

        return existing;
    },
};
