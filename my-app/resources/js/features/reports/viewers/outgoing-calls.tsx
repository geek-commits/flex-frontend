import React from 'react';
import type { ReportRun } from '@/features/reports/report-types';

/**
 * Outgoing Calls — preserves the report's actual multi-section structure:
 * Outcome Summary, Provider Minutes, and Detailed Calls. Not forced into one
 * generic table.
 */
export function OutgoingCallsViewer({ run }: { run: ReportRun }) {
    const data = run.data as { reportId: 'outgoing-calls'; data: OutgoingData };
    const { summary, providerMinutes, detailedCalls } = data.data;

    return (
        <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
            <Section title="Outcome Summary">
                <table className="flex-table-grid w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {[
                                { label: 'Disposition', align: 'start' },
                                { label: 'Count', align: 'end' },
                                { label: 'Percentage', align: 'end' },
                            ].map((header) => (
                                <th key={header.label} className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap ${header.align === 'end' ? 'text-end' : 'text-start'}`}>
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {summary.map((row) => (
                            <tr key={row.disposition} className="border-b border-border last:border-b-0">
                                <td className="px-4 py-2.5 text-xs text-flex-text-primary text-start">{row.disposition}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.count}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.percentage.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Section>

            <Section title="Provider Minutes">
                <table className="flex-table-grid w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {[
                                { label: 'Provider', align: 'start' },
                                { label: 'Duration', align: 'end' },
                                { label: 'Calls', align: 'end' },
                            ].map((header) => (
                                <th key={header.label} className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap ${header.align === 'end' ? 'text-end' : 'text-start'}`}>
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {providerMinutes.map((row) => (
                            <tr key={row.provider} className="border-b border-border last:border-b-0">
                                <td className="px-4 py-2.5 text-xs text-flex-text-primary text-start">{row.provider}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.duration}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.calls}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Section>

            <Section title="Detailed Calls">
                <div className="overflow-x-auto">
                    <table className="flex-table-grid w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/40 text-left">
                                {[
                                    { label: 'Date & Time', align: 'start' },
                                    { label: 'Destination', align: 'start' },
                                    { label: 'Agent', align: 'start' },
                                    { label: 'Status', align: 'start' },
                                    { label: 'Duration', align: 'end' },
                                    { label: 'Provider', align: 'start' },
                                ].map((header) => (
                                    <th key={header.label} className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap ${header.align === 'end' ? 'text-end' : 'text-start'}`}>
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {detailedCalls.map((row, index) => (
                                <tr key={index} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-muted whitespace-nowrap text-start">{row.dateTime}</td>
                                    <td className="px-4 py-2.5 font-mono text-xs text-flex-text-primary whitespace-nowrap text-start">{row.destination}</td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap text-start">{row.agent}</td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap text-start">{row.status}</td>
                                    <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary whitespace-nowrap text-end">{row.duration}</td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap text-start">{row.provider}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="border-b border-border bg-muted/40 px-4 py-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-flex-text-muted">{title}</h3>
            </div>
            <div className="overflow-x-auto">{children}</div>
        </div>
    );
}

interface OutgoingData {
    summary: { disposition: string; count: number; percentage: number }[];
    providerMinutes: { provider: string; duration: string; calls: number }[];
    detailedCalls: { dateTime: string; destination: string; agent: string; status: string; duration: string; provider: string }[];
}
