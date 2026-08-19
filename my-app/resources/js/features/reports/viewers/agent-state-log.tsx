import React from 'react';
import type { AgentState, ReportRun } from '@/features/reports/report-types';
import { AgentStateBadge } from '@/features/reports/viewers/agent-state-badge';

/**
 * Agent State Log — a historical state-change timeline, not Agent Monitoring.
 * Reuses canonical agent-state semantics. No client-derived state history.
 */
export function AgentStateLogViewer({ run }: { run: ReportRun }) {
    const data = run.data as { reportId: 'agent-state-log'; rows: StateLogRow[] };
    const rows = data.rows;

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="overflow-x-auto">
                <table className="flex-table-grid w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {[
                                { label: 'Agent', align: 'start' },
                                { label: 'State', align: 'start' },
                                { label: 'Duration', align: 'end' },
                                { label: 'State Change Time', align: 'start' },
                            ].map((header) => (
                                <th key={header.label} className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap ${header.align === 'end' ? 'text-end' : 'text-start'}`}>
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-2.5 text-xs font-semibold text-flex-text-primary whitespace-nowrap text-start">{row.agent}</td>
                                <td className="px-4 py-2.5 text-start"><AgentStateBadge state={row.state} /></td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary whitespace-nowrap text-end">{row.duration}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-muted whitespace-nowrap text-start">{row.stateChangeTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

interface StateLogRow {
    agent: string;
    state: AgentState;
    duration: string;
    stateChangeTime: string;
}
