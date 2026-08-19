import React from 'react';
import type { ReportRun } from '@/features/reports/report-types';

/**
 * Agent Outgoing — outbound activity by agent. Distinct from the detailed
 * Outgoing Calls report; this is scoped to per-agent outbound volume.
 */
export function AgentOutgoingViewer({ run }: { run: ReportRun }) {
    const data = run.data as { reportId: 'agent-outgoing'; rows: AgentOutgoingRow[] };
    const rows = data.rows;

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="overflow-x-auto">
                <table className="flex-table-grid w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {[
                                { label: 'Agent', align: 'start' },
                                { label: 'Total Calls', align: 'end' },
                                { label: 'Calls Answered', align: 'end' },
                                { label: 'Calls Unanswered', align: 'end' },
                                { label: 'Total Duration', align: 'end' },
                            ].map((header) => (
                                <th key={header.label} className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap ${header.align === 'end' ? 'text-end' : 'text-start'}`}>
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
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.answeredCalls}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.unansweredCalls}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary whitespace-nowrap text-end">{row.totalDuration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

interface AgentOutgoingRow {
    agent: string;
    totalCalls: number;
    answeredCalls: number;
    unansweredCalls: number;
    totalDuration: string;
}
