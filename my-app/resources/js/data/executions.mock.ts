import type { ExecutionRecord } from '@/features/reports/scheduled/execution-types';

/**
 * POC MOCK — deterministic execution-history fixtures keyed by schedule id.
 * Dev-only; backend remains authoritative for execution logging and delivery
 * results.
 */
export const EXECUTION_MOCK_RECORDS: ExecutionRecord[] = [
    {
        id: 'exec-1',
        scheduleId: 'sched-1',
        timestamp: '2026-08-13 08:00:02',
        state: 'Completed',
        duration: '0:42',
        records: 12480,
        fileSize: '1.4 MB',
        emailsSent: 2,
        emailsFailed: 0,
        stages: [
            { name: 'Generate report', duration: '0:18', status: 'completed' },
            { name: 'Render PDF', duration: '0:14', status: 'completed' },
            { name: 'Deliver', duration: '0:10', status: 'completed' },
        ],
    },
    {
        id: 'exec-2',
        scheduleId: 'sched-1',
        timestamp: '2026-08-12 08:00:01',
        state: 'Completed',
        duration: '0:39',
        records: 12110,
        fileSize: '1.3 MB',
        emailsSent: 2,
        emailsFailed: 0,
        stages: [
            { name: 'Generate report', duration: '0:16', status: 'completed' },
            { name: 'Render PDF', duration: '0:13', status: 'completed' },
            { name: 'Deliver', duration: '0:10', status: 'completed' },
        ],
    },
    {
        id: 'exec-3',
        scheduleId: 'sched-4',
        timestamp: '2026-08-08 06:00:03',
        state: 'Failed',
        duration: '0:11',
        records: 0,
        fileSize: '—',
        emailsSent: 0,
        emailsFailed: 0,
        stages: [
            { name: 'Generate report', duration: '0:08', status: 'failed', error: 'IVR data source timed out.' },
        ],
    },
    {
        id: 'exec-4',
        scheduleId: 'sched-3',
        timestamp: '2026-08-13 09:00:10',
        state: 'Running',
        duration: '0:25',
        records: 0,
        fileSize: '—',
        emailsSent: 0,
        emailsFailed: 0,
        stages: [
            { name: 'Generate report', duration: '0:25', status: 'completed' },
            { name: 'Render PDF', duration: '—', status: 'completed' },
        ],
    },
    {
        id: 'exec-5',
        scheduleId: 'sched-4',
        timestamp: '2026-08-01 06:00:02',
        state: 'Retrying',
        duration: '0:14',
        records: 0,
        fileSize: '—',
        emailsSent: 0,
        emailsFailed: 0,
        stages: [
            { name: 'Generate report', duration: '0:14', status: 'failed', error: 'Recipient email delivery failed, retrying.' },
        ],
    },
];
