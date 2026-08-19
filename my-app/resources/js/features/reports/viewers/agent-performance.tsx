import React from 'react';
import type { ReportRun } from '@/features/reports/report-types';

/**
 * Agent Performance — table-first. No medals or rank podiums; a dense,
 * sortable-by-column agent metrics table per plan §33.
 */
export function AgentPerformanceViewer({ run }: { run: ReportRun }) {
    const data = run.data as { reportId: 'agent-performance'; rows: AgentPerfRow[] };
    const rows = data.rows;

    const headers: { key: keyof AgentPerfRow; label: string; align: 'start' | 'end' }[] = [
        { key: 'agent', label: 'Agent', align: 'start' },
        { key: 'totalCalls', label: 'Total Calls', align: 'end' },
        { key: 'missedCalls', label: 'Missed Calls', align: 'end' },
        { key: 'answeredCalls', label: 'Answered Calls', align: 'end' },
        { key: 'answerRate', label: 'Answer Rate', align: 'end' },
        { key: 'missedRate', label: 'Missed Rate', align: 'end' },
        { key: 'outgoingCalls', label: 'Outgoing Calls', align: 'end' },
        { key: 'outgoingAnswered', label: 'Outgoing Answered', align: 'end' },
        { key: 'avgCallDuration', label: 'Avg Call Duration', align: 'end' },
        { key: 'avgWrapupDuration', label: 'Avg Wrap-up', align: 'end' },
    ];

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="overflow-x-auto">
                <table className="flex-table-grid w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {headers.map((header) => (
                                <th
                                    key={header.key}
                                    className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap ${
                                        header.align === 'end' ? 'text-end' : 'text-start'
                                    }`}
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.agent} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-2.5 text-xs font-semibold text-flex-text-primary whitespace-nowrap text-start">{row.agent}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.totalCalls}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.missedCalls}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.answeredCalls}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.answerRate.toFixed(1)}%</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.missedRate.toFixed(1)}%</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.outgoingCalls}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.outgoingAnswered}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary whitespace-nowrap text-end">{row.avgCallDuration}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary whitespace-nowrap text-end">{row.avgWrapupDuration}</td>
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
