import { REPORT_MOCK_RESULTS } from '@/data/reports.mock';
import type { ReportId } from '@/features/reports/report-registry';
import type { QueueLogRow, ReportQuery, ReportResultData, ReportRun } from '@/features/reports/report-types';

/**
 * Report repository boundary.
 *
 * POC MOCK — `runReport` returns a deterministic result for the requested
 * report id, optionally filtered by period/agent/queue/etc. The real backend
 * must implement the same contract (report generation, filtering, export) with
 * authorization and tenant scoping enforced server-side. No HTTP API is faked.
 */

export interface ReportRepository {
    runReport(reportId: ReportId, query: ReportQuery): ReportRun;
}

function applyFilter(data: ReportResultData, query: ReportQuery): ReportResultData {
    const agentNeedle = query.agent?.trim().toLowerCase();
    const queueNeedle = query.queue?.trim().toLowerCase();
    const ivrNeedle = query.ivr?.trim().toLowerCase();
    const providerNeedle = query.provider?.trim().toLowerCase();

    if ('rows' in data && agentNeedle) {
        const filteredRows = data.rows.filter((row) => {
            const rowAgent = (row as { agent?: string }).agent?.toLowerCase() ?? '';

            return !rowAgent || rowAgent.includes(agentNeedle);
        });

        return { ...data, rows: filteredRows as never };
    }

    if (data.reportId === 'outgoing-calls' && (agentNeedle || providerNeedle)) {
        const details = data.data.detailedCalls.filter((row) => {
            const matchesAgent = !agentNeedle || row.agent.toLowerCase().includes(agentNeedle);
            const matchesProvider = !providerNeedle || row.provider.toLowerCase().includes(providerNeedle);

            return matchesAgent && matchesProvider;
        });

        return { ...data, data: { ...data.data, detailedCalls: details } };
    }

    if (data.reportId === 'queue-logs' && (queueNeedle || agentNeedle)) {
        const rows: QueueLogRow[] = data.rows.filter((row) => {
            const matchesQueue = !queueNeedle || row.queue.toLowerCase().includes(queueNeedle);
            const matchesAgent = !agentNeedle || row.agent.toLowerCase().includes(agentNeedle);

            return matchesQueue && matchesAgent;
        });

        return { reportId: 'queue-logs', rows };
    }

    if (data.reportId === 'ivr-report' && ivrNeedle) {
        const rows = data.rows.filter((row) => row.ivrName.toLowerCase().includes(ivrNeedle));

        return { ...data, rows };
    }

    return data;
}

export const reportRepository: ReportRepository = {
    runReport(reportId: ReportId, query: ReportQuery): ReportRun {
        const base = REPORT_MOCK_RESULTS[reportId];

        if (!base) {
            throw new Error(`Unknown report: ${reportId}`);
        }

        const data = applyFilter(base, query);
        const hasRows = 'rows' in data ? (data.rows?.length ?? 0) > 0 : data.data.detailedCalls.length > 0;

        return {
            reportId,
            state: hasRows ? 'ready' : 'empty',
            data,
            generatedAt: new Date().toISOString(),
        };
    },
};
