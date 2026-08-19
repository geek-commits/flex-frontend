import React from 'react';
import type { ReportRun } from '@/features/reports/report-types';

/**
 * IVR Report — comparative IVR usage across nodes. This is reporting only;
 * IVR configuration is not redesigned here (no context link unless a real
 * route supports it).
 */
export function IVRReportViewer({ run }: { run: ReportRun }) {
    const data = run.data as { reportId: 'ivr-report'; rows: IVRRow[] };
    const rows = data.rows;

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="overflow-x-auto">
                <table className="flex-table-grid w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {[
                                { label: 'IVR Name', align: 'start' },
                                { label: 'Total', align: 'end' },
                                { label: 'Open', align: 'end' },
                                { label: 'Off Hours', align: 'end' },
                                { label: 'Off Hour Rate', align: 'end' },
                            ].map((header) => (
                                <th key={header.label} className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap ${header.align === 'end' ? 'text-end' : 'text-start'}`}>
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.ivrName} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-2.5 text-xs font-semibold text-flex-text-primary whitespace-nowrap text-start">{row.ivrName}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.total.toLocaleString()}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.open.toLocaleString()}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.offHours.toLocaleString()}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.offHourRate.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

interface IVRRow {
    ivrName: string;
    total: number;
    open: number;
    offHours: number;
    offHourRate: number;
}
