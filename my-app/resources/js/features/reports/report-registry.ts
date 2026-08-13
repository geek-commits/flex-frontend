import type { Capability } from '@/auth/capabilities';

/**
 * Canonical FLEX report registry.
 *
 * POC — the backend has no report definitions, so this registry is the single
 * frontend source of truth for report metadata (label, description, category,
 * permission, formats). It mirrors the manual's canonical reporting inventory.
 * The backend remains authoritative for report generation and authorization.
 *
 * Report Library and viewer navigation read from here — never from scattered
 * hardcoded per-page catalogs.
 */

export type ReportCategory = 'PERFORMANCE' | 'AGENTS' | 'QUEUE & IVR' | 'TELEPHONY & QUALITY';

export type ReportId =
    | 'contact-center-performance'
    | 'yearly-performance'
    | 'agent-performance'
    | 'agent-state-log'
    | 'agent-outgoing'
    | 'ivr-report'
    | 'customer-end-to-ivr'
    | 'queue-logs'
    | 'outgoing-calls'
    | 'recordings';

export type ReportFormat = 'PDF' | 'Excel' | 'CSV';

export interface ReportDefinition {
    id: ReportId;
    label: string;
    description: string;
    category: ReportCategory;
    permission: Capability;
    supportedFormats: ReportFormat[];
    /** Searchable aliases. */
    keywords: string[];
}

export const REPORT_PERMISSION: Capability = 'reports.view';

export const REPORT_CATEGORIES: { key: ReportCategory; label: string; description: string }[] = [
    { key: 'PERFORMANCE', label: 'Performance', description: 'Operational and executive performance.' },
    { key: 'AGENTS', label: 'Agents', description: 'Agent activity and state reporting.' },
    { key: 'QUEUE & IVR', label: 'Queue & IVR', description: 'Queue, IVR, and customer journey reporting.' },
    { key: 'TELEPHONY & QUALITY', label: 'Telephony & Quality', description: 'Outbound, telephony, and recording usage.' },
];

export const REPORTS: ReportDefinition[] = [
    {
        id: 'contact-center-performance',
        label: 'Contact Center Performance',
        description: 'Operational summary of calls, service levels, and handling times.',
        category: 'PERFORMANCE',
        permission: 'reports.view',
        supportedFormats: ['PDF', 'Excel', 'CSV'],
        keywords: ['performance', 'calls', 'service level', 'sls', 'summary', 'operational'],
    },
    {
        id: 'yearly-performance',
        label: 'Yearly Contact Center Performance',
        description: 'Monthly volume, service level, and answer-rate trends across the year.',
        category: 'PERFORMANCE',
        permission: 'reports.view',
        supportedFormats: ['PDF', 'Excel', 'CSV'],
        keywords: ['yearly', 'year', 'monthly', 'trend', 'annual', 'volume'],
    },
    {
        id: 'agent-performance',
        label: 'Agent Performance',
        description: 'Per-agent calls, answer rate, and handling time statistics.',
        category: 'AGENTS',
        permission: 'reports.view',
        supportedFormats: ['PDF', 'Excel', 'CSV'],
        keywords: ['agent', 'performance', 'answered', 'aht', 'wrap-up'],
    },
    {
        id: 'agent-state-log',
        label: 'Agent State Log',
        description: 'Historical agent state-change timeline across states.',
        category: 'AGENTS',
        permission: 'reports.view',
        supportedFormats: ['PDF', 'Excel', 'CSV'],
        keywords: ['agent', 'state', 'log', 'ready', 'on call', 'wrap up', 'break'],
    },
    {
        id: 'agent-outgoing',
        label: 'Agent Outgoing',
        description: 'Outbound call activity grouped by agent.',
        category: 'AGENTS',
        permission: 'reports.view',
        supportedFormats: ['PDF', 'Excel', 'CSV'],
        keywords: ['agent', 'outgoing', 'outbound', 'dialer'],
    },
    {
        id: 'ivr-report',
        label: 'IVR Report',
        description: 'Comparative IVR usage and off-hours handling by node.',
        category: 'QUEUE & IVR',
        permission: 'reports.view',
        supportedFormats: ['PDF', 'Excel', 'CSV'],
        keywords: ['ivr', 'menu', 'node', 'off hours', 'keypress'],
    },
    {
        id: 'customer-end-to-ivr',
        label: 'Customer End to IVR',
        description: 'Call-level customer journey into the IVR.',
        category: 'QUEUE & IVR',
        permission: 'reports.view',
        supportedFormats: ['PDF', 'Excel', 'CSV'],
        keywords: ['customer', 'ivr', 'journey', 'duration'],
    },
    {
        id: 'queue-logs',
        label: 'Queue Logs',
        description: 'High-density queue event log for operational troubleshooting.',
        category: 'QUEUE & IVR',
        permission: 'reports.view',
        supportedFormats: ['PDF', 'Excel', 'CSV'],
        keywords: ['queue', 'log', 'events', 'enterqueue', 'connect', 'abandon'],
    },
    {
        id: 'outgoing-calls',
        label: 'Outgoing Calls',
        description: 'Outcome summary, provider minutes, and detailed outbound calls.',
        category: 'TELEPHONY & QUALITY',
        permission: 'reports.view',
        supportedFormats: ['PDF', 'Excel', 'CSV'],
        keywords: ['outgoing', 'outbound', 'provider', 'minutes', 'disposition', 'call'],
    },
    {
        id: 'recordings',
        label: 'Recordings',
        description: 'Recording usage and play counts by recording.',
        category: 'TELEPHONY & QUALITY',
        permission: 'reports.view',
        supportedFormats: ['PDF', 'Excel', 'CSV'],
        keywords: ['recording', 'play count', 'usage', 'audio'],
    },
];

export function getReportById(id: string): ReportDefinition | undefined {
    return REPORTS.find((report) => report.id === id);
}
