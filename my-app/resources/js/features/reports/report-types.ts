import type { ReportId } from '@/features/reports/report-registry';

/**
 * Report domain types.
 *
 * POC MOCK — typed result shapes for each canonical report. The backend has no
 * reporting engine; these fixtures live behind the `ReportRepository` boundary
 * and are dev-only. The backend remains authoritative for report generation.
 */

export interface ReportPeriod {
    dateFrom?: string;
    dateTo?: string;
}

export interface ReportQuery extends ReportPeriod {
    agent?: string;
    queue?: string;
    ivr?: string;
    provider?: string;
    year?: string;
}

/* ---- Contact Center Performance ---- */

export interface ContactCenterPerformanceRow {
    metric: string;
    value: string;
}

/* ---- Yearly Contact Center Performance ---- */

export interface YearlyPerformanceRow {
    month: string;
    totalCalls: number;
    incomingCalls: number;
    callsToAgent: number;
    answeredCalls: number;
    answerRate: number;
    abandonedRate: number;
}

/* ---- Agent Performance ---- */

export interface AgentPerformanceRow {
    agent: string;
    totalCalls: number;
    missedCalls: number;
    answeredCalls: number;
    answerRate: number;
    missedRate: number;
    outgoingCalls: number;
    outgoingAnswered: number;
    avgCallDuration: string;
    avgWrapupDuration: string;
}

/* ---- Agent State Log ---- */

export type AgentState = 'On Call' | 'Ready' | 'Wrap up' | 'Break' | 'Offline';

export interface AgentStateLogRow {
    agent: string;
    state: AgentState;
    duration: string;
    stateChangeTime: string;
}

/* ---- Agent Outgoing ---- */

export interface AgentOutgoingRow {
    agent: string;
    totalCalls: number;
    answeredCalls: number;
    unansweredCalls: number;
    totalDuration: string;
}

/* ---- IVR Report ---- */

export interface IVRReportRow {
    ivrName: string;
    total: number;
    open: number;
    offHours: number;
    offHourRate: number;
}

/* ---- Customer End to IVR ---- */

export interface CustomerEndToIVRRow {
    dateTime: string;
    customer: string;
    ivrDuration: string;
}

/* ---- Outgoing Calls ---- */

export interface OutgoingDispositionRow {
    disposition: string;
    count: number;
    percentage: number;
}

export interface OutgoingProviderRow {
    provider: string;
    duration: string;
    calls: number;
}

export interface OutgoingCallDetailRow {
    dateTime: string;
    destination: string;
    agent: string;
    status: string;
    duration: string;
    provider: string;
}

export interface OutgoingCallsReport {
    summary: OutgoingDispositionRow[];
    providerMinutes: OutgoingProviderRow[];
    detailedCalls: OutgoingCallDetailRow[];
}

/* ---- Recordings ---- */

export interface RecordingRow {
    recordingName: string;
    playCount: number;
}

/* ---- Queue Logs ---- */

export type QueueEvent = 'ENTERQUEUE' | 'CONNECT' | 'ABANDON' | 'COMPLETECALLER' | 'TRANSFER';

export interface QueueLogRow {
    date: string;
    agent: string;
    customer: string;
    queue: string;
    event: QueueEvent;
    duration: string;
}

/** Report-specific result data, discriminated by report id. */
export type ReportResultData =
    | { reportId: 'contact-center-performance'; rows: ContactCenterPerformanceRow[] }
    | { reportId: 'yearly-performance'; rows: YearlyPerformanceRow[]; year: string }
    | { reportId: 'agent-performance'; rows: AgentPerformanceRow[] }
    | { reportId: 'agent-state-log'; rows: AgentStateLogRow[] }
    | { reportId: 'agent-outgoing'; rows: AgentOutgoingRow[] }
    | { reportId: 'ivr-report'; rows: IVRReportRow[] }
    | { reportId: 'customer-end-to-ivr'; rows: CustomerEndToIVRRow[] }
    | { reportId: 'outgoing-calls'; data: OutgoingCallsReport }
    | { reportId: 'recordings'; rows: RecordingRow[] }
    | { reportId: 'queue-logs'; rows: QueueLogRow[] };

export type ReportRunState = 'ready' | 'empty';

export interface ReportRun {
    reportId: ReportId;
    state: ReportRunState;
    data: ReportResultData;
    generatedAt: string;
}
