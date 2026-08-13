import { REPORT_MOCK_RESULTS } from '@/data/reports.mock';
import type { ReportId } from '@/features/reports/report-registry';

/**
 * Derives report-specific filter options from the mock result data.
 * Filters are only offered for reports whose data actually has that dimension.
 * A real backend would provide these options via its own API.
 */

export interface ReportFilterOptions {
    agents: string[];
    queues: string[];
    ivrs: string[];
    providers: string[];
    years: string[];
}

function unique(values: (string | undefined)[]): string[] {
    return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort();
}

export function getReportFilterOptions(reportId: ReportId): ReportFilterOptions {
    const data = REPORT_MOCK_RESULTS[reportId];
    const options: ReportFilterOptions = { agents: [], queues: [], ivrs: [], providers: [], years: [] };

    if (!data) {
        return options;
    }

    if ('rows' in data) {
        options.agents = unique(
            data.rows.map((row) => (row as { agent?: string }).agent).filter((agent) => agent && agent !== '—')
        );
        options.queues = unique(data.rows.map((row) => (row as { queue?: string }).queue));
        options.ivrs = unique(data.rows.map((row) => (row as { ivrName?: string }).ivrName));
        options.years = unique(data.rows.map((row) => (row as { year?: string }).year));
    }

    if (data.reportId === 'outgoing-calls') {
        options.providers = unique(data.data.providerMinutes.map((row) => row.provider));
        options.agents = unique(data.data.detailedCalls.map((row) => row.agent));
    }

    return options;
}
