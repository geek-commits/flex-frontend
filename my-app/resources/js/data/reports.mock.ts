import type {
    ReportResultData,
} from '@/features/reports/report-types';

/**
 * POC MOCK — deterministic report result fixtures, keyed by canonical report id.
 * Dev-only; never imported by production report-generation logic. Each report's
 * data mirrors the manual's documented fields for that report.
 */

export const REPORT_MOCK_RESULTS: Record<string, ReportResultData> = {
    'contact-center-performance': {
        reportId: 'contact-center-performance',
        rows: [
            { metric: 'Total Calls', value: '12,480' },
            { metric: 'Incoming Calls', value: '9,315' },
            { metric: 'Queue Calls', value: '7,842' },
            { metric: 'Answered Calls', value: '6,904' },
            { metric: 'Answer Rate', value: '88.0%' },
            { metric: 'Caller Abandon Rate', value: '7.1%' },
            { metric: 'Average Speed to Answer', value: '0:14' },
            { metric: 'Average Wrap-up Duration', value: '0:38' },
            { metric: 'Average Call Duration', value: '3:24' },
            { metric: 'Longest Wait Time', value: '11:42' },
            { metric: 'Service Level', value: '82.4%' },
            { metric: 'Total Outgoing Calls', value: '3,165' },
        ],
    },
    'yearly-performance': {
        reportId: 'yearly-performance',
        year: '2026',
        rows: [
            { month: 'Jan', totalCalls: 10840, incomingCalls: 8120, callsToAgent: 6800, answeredCalls: 5880, answerRate: 86.5, abandonedRate: 6.2 },
            { month: 'Feb', totalCalls: 9870, incomingCalls: 7240, callsToAgent: 6050, answeredCalls: 5210, answerRate: 86.1, abandonedRate: 6.8 },
            { month: 'Mar', totalCalls: 11230, incomingCalls: 8340, callsToAgent: 7010, answeredCalls: 6100, answerRate: 87.0, abandonedRate: 6.0 },
            { month: 'Apr', totalCalls: 12140, incomingCalls: 9020, callsToAgent: 7540, answeredCalls: 6620, answerRate: 87.8, abandonedRate: 5.6 },
            { month: 'May', totalCalls: 13020, incomingCalls: 9780, callsToAgent: 8210, answeredCalls: 7300, answerRate: 88.9, abandonedRate: 5.1 },
            { month: 'Jun', totalCalls: 12890, incomingCalls: 9630, callsToAgent: 8090, answeredCalls: 7240, answerRate: 89.5, abandonedRate: 4.9 },
            { month: 'Jul', totalCalls: 12480, incomingCalls: 9315, callsToAgent: 7842, answeredCalls: 6904, answerRate: 88.0, abandonedRate: 7.1 },
        ],
    },
    'agent-performance': {
        reportId: 'agent-performance',
        rows: [
            { agent: 'Grace Mwanga', totalCalls: 342, missedCalls: 18, answeredCalls: 324, answerRate: 94.7, missedRate: 5.3, outgoingCalls: 86, outgoingAnswered: 71, avgCallDuration: '3:12', avgWrapupDuration: '0:35' },
            { agent: 'James Otieno', totalCalls: 318, missedCalls: 24, answeredCalls: 294, answerRate: 92.5, missedRate: 7.5, outgoingCalls: 74, outgoingAnswered: 60, avgCallDuration: '3:41', avgWrapupDuration: '0:42' },
            { agent: 'Fatuma Ally', totalCalls: 296, missedCalls: 31, answeredCalls: 265, answerRate: 89.5, missedRate: 10.5, outgoingCalls: 65, outgoingAnswered: 52, avgCallDuration: '3:08', avgWrapupDuration: '0:29' },
            { agent: 'Sarah Smith', totalCalls: 271, missedCalls: 12, answeredCalls: 259, answerRate: 95.6, missedRate: 4.4, outgoingCalls: 58, outgoingAnswered: 49, avgCallDuration: '2:54', avgWrapupDuration: '0:31' },
        ],
    },
    'agent-state-log': {
        reportId: 'agent-state-log',
        rows: [
            { agent: 'Grace Mwanga', state: 'On Call', duration: '0:08:12', stateChangeTime: '2026-08-13 08:44:02' },
            { agent: 'Grace Mwanga', state: 'Wrap up', duration: '0:00:41', stateChangeTime: '2026-08-13 08:52:14' },
            { agent: 'James Otieno', state: 'Ready', duration: '0:02:05', stateChangeTime: '2026-08-13 08:37:56' },
            { agent: 'James Otieno', state: 'On Call', duration: '0:05:31', stateChangeTime: '2026-08-13 08:40:01' },
            { agent: 'Fatuma Ally', state: 'Break', duration: '0:12:00', stateChangeTime: '2026-08-13 09:01:20' },
            { agent: 'Sarah Smith', state: 'Offline', duration: '0:30:00', stateChangeTime: '2026-08-13 08:10:00' },
        ],
    },
    'agent-outgoing': {
        reportId: 'agent-outgoing',
        rows: [
            { agent: 'Grace Mwanga', totalCalls: 86, answeredCalls: 71, unansweredCalls: 15, totalDuration: '3:58:12' },
            { agent: 'James Otieno', totalCalls: 74, answeredCalls: 60, unansweredCalls: 14, totalDuration: '3:22:40' },
            { agent: 'Fatuma Ally', totalCalls: 65, answeredCalls: 52, unansweredCalls: 13, totalDuration: '2:51:06' },
            { agent: 'Sarah Smith', totalCalls: 58, answeredCalls: 49, unansweredCalls: 9, totalDuration: '2:30:18' },
        ],
    },
    'ivr-report': {
        reportId: 'ivr-report',
        rows: [
            { ivrName: 'Main Menu', total: 5230, open: 4875, offHours: 355, offHourRate: 6.8 },
            { ivrName: 'Billing', total: 1840, open: 1721, offHours: 119, offHourRate: 6.5 },
            { ivrName: 'Support', total: 2210, open: 2054, offHours: 156, offHourRate: 7.1 },
            { ivrName: 'Sales', total: 1180, open: 1104, offHours: 76, offHourRate: 6.4 },
        ],
    },
    'customer-end-to-ivr': {
        reportId: 'customer-end-to-ivr',
        rows: [
            { dateTime: '2026-08-13 08:12:04', customer: '***-****-2210', ivrDuration: '0:42' },
            { dateTime: '2026-08-13 08:15:39', customer: '***-****-8845', ivrDuration: '1:08' },
            { dateTime: '2026-08-13 08:21:12', customer: '***-****-3307', ivrDuration: '0:19' },
            { dateTime: '2026-08-13 08:27:55', customer: '***-****-9921', ivrDuration: '2:04' },
        ],
    },
    'outgoing-calls': {
        reportId: 'outgoing-calls',
        data: {
            summary: [
                { disposition: 'Answered', count: 232, percentage: 73.4 },
                { disposition: 'No Answer', count: 49, percentage: 15.5 },
                { disposition: 'Busy', count: 22, percentage: 7.0 },
                { disposition: 'Failed', count: 13, percentage: 4.1 },
            ],
            providerMinutes: [
                { provider: 'Twilio', duration: '9:41:20', calls: 210 },
                { provider: 'Vonage', duration: '4:52:14', calls: 106 },
            ],
            detailedCalls: [
                { dateTime: '2026-08-13 09:02:11', destination: '+254 712 445 908', agent: 'Grace Mwanga', status: 'Answered', duration: '4:12', provider: 'Twilio' },
                { dateTime: '2026-08-13 09:05:47', destination: '+254 733 210 445', agent: 'James Otieno', status: 'No Answer', duration: '0:45', provider: 'Twilio' },
                { dateTime: '2026-08-13 09:08:23', destination: '+254 701 887 120', agent: 'Sarah Smith', status: 'Answered', duration: '6:08', provider: 'Vonage' },
            ],
        },
    },
    recordings: {
        reportId: 'recordings',
        rows: [
            { recordingName: '2026-08-13 08:44 – Grace Mwanga', playCount: 12 },
            { recordingName: '2026-08-13 08:40 – James Otieno', playCount: 9 },
            { recordingName: '2026-08-12 16:48 – Fatuma Ally', playCount: 7 },
            { recordingName: '2026-08-12 15:12 – Sarah Smith', playCount: 15 },
        ],
    },
    'queue-logs': {
        reportId: 'queue-logs',
        rows: [
            { date: '2026-08-13 08:44:02', agent: 'Grace Mwanga', customer: '***-****-2210', queue: 'Support', event: 'ENTERQUEUE', duration: '0:00' },
            { date: '2026-08-13 08:44:12', agent: 'Grace Mwanga', customer: '***-****-2210', queue: 'Support', event: 'CONNECT', duration: '0:00' },
            { date: '2026-08-13 08:52:14', agent: 'Grace Mwanga', customer: '***-****-2210', queue: 'Support', event: 'COMPLETECALLER', duration: '0:08:12' },
            { date: '2026-08-13 08:40:01', agent: 'James Otieno', customer: '***-****-8845', queue: 'Billing', event: 'CONNECT', duration: '0:00' },
            { date: '2026-08-13 08:55:20', agent: '—', customer: '***-****-3307', queue: 'Support', event: 'ABANDON', duration: '0:02:15' },
            { date: '2026-08-13 09:02:11', agent: 'Grace Mwanga', customer: '***-****-9921', queue: 'Sales', event: 'TRANSFER', duration: '0:01:40' },
        ],
    },
};
