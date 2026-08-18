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
                            {['Agent', 'Total Calls', 'Calls Answered', 'Calls Unanswered', 'Total Duration'].map((header) => (
                                <th key={header} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.agent} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-2.5 text-xs font-semibold text-flex-text-primary whitespace-nowrap">{row.agent}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary">{row.totalCalls}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary">{row.answeredCalls}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary">{row.unansweredCalls}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary whitespace-nowrap">{row.totalDuration}</td>
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
