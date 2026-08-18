import React from 'react';
import type { ReportRun } from '@/features/reports/report-types';

/**
 * Agent Performance — table-first. No medals or rank podiums; a dense,
 * sortable-by-column agent metrics table per plan §33.
 */
export function AgentPerformanceViewer({ run }: { run: ReportRun }) {
    const data = run.data as { reportId: 'agent-performance'; rows: AgentPerfRow[] };
    const rows = data.rows;

    const headers: { key: keyof AgentPerfRow; label: string }[] = [
        { key: 'agent', label: 'Agent' },
        { key: 'totalCalls', label: 'Total Calls' },
        { key: 'missedCalls', label: 'Missed Calls' },
        { key: 'answeredCalls', label: 'Answered Calls' },
        { key: 'answerRate', label: 'Answer Rate' },
        { key: 'missedRate', label: 'Missed Rate' },
        { key: 'outgoingCalls', label: 'Outgoing Calls' },
        { key: 'outgoingAnswered', label: 'Outgoing Answered' },
        { key: 'avgCallDuration', label: 'Avg Call Duration' },
        { key: 'avgWrapupDuration', label: 'Avg Wrap-up' },
    ];

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="overflow-x-auto">
                <table className="flex-table-grid w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {headers.map((header) => (
                                <th key={header.key} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap">
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.agent} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-2.5 text-xs font-semibold text-flex-text-primary whitespace-nowrap">{row.agent}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary">{row.totalCalls}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary">{row.missedCalls}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary">{row.answeredCalls}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary">{row.answerRate.toFixed(1)}%</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary">{row.missedRate.toFixed(1)}%</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary">{row.outgoingCalls}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary">{row.outgoingAnswered}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary whitespace-nowrap">{row.avgCallDuration}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary whitespace-nowrap">{row.avgWrapupDuration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

interface AgentPerfRow {
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
