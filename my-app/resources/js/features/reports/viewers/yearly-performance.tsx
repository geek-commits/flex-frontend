import React from 'react';
import { ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart, CartesianGrid } from 'recharts';
import type { ReportRun } from '@/features/reports/report-types';

/**
 * Yearly Contact Center Performance — year context, a monthly data table, and a
 * quiet volume trend line using the same underlying data. No comparison years
 * beyond what the report provides; no animated count-ups.
 */
export function YearlyPerformanceViewer({ run }: { run: ReportRun }) {
    const data = run.data as { reportId: 'yearly-performance'; rows: YearlyRow[]; year: string };
    const rows = data.rows;

    return (
        <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
            <div className="rounded-lg border border-border bg-background p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-flex-text-muted">Monthly Trend</h3>
                    <span className="text-xs font-semibold text-flex-text-primary">Year {data.year}</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--flex-border, #e2e8f0)" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--flex-text-muted)' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: 'var(--flex-text-muted)' }} tickLine={false} axisLine={false} width={42} />
                        <Tooltip
                            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--flex-border)' }}
                        />
                        <Line type="monotone" dataKey="totalCalls" stroke="var(--flex-chart-line)" strokeWidth={2} dot={false} name="Total Calls" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-background">
                <div className="overflow-x-auto">
                    <table className="flex-table-grid w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/40 text-left">
                                {[
                                    { label: 'Month', align: 'start' },
                                    { label: 'Total Calls', align: 'end' },
                                    { label: 'Incoming Calls', align: 'end' },
                                    { label: 'Calls to Agent', align: 'end' },
                                    { label: 'Answered Calls', align: 'end' },
                                    { label: 'Answer Rate', align: 'end' },
                                    { label: 'Abandoned Rate', align: 'end' },
                                ].map((header) => (
                                    <th key={header.label} className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap ${header.align === 'end' ? 'text-end' : 'text-start'}`}>
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={row.month} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-2.5 text-xs font-semibold text-flex-text-primary text-start">{row.month}</td>
                                    <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.totalCalls.toLocaleString()}</td>
                                    <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.incomingCalls.toLocaleString()}</td>
                                    <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.callsToAgent.toLocaleString()}</td>
                                    <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.answeredCalls.toLocaleString()}</td>
                                    <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.answerRate.toFixed(1)}%</td>
                                    <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.abandonedRate.toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

interface YearlyRow {
    month: string;
    totalCalls: number;
    incomingCalls: number;
    callsToAgent: number;
    answeredCalls: number;
    answerRate: number;
    abandonedRate: number;
}
