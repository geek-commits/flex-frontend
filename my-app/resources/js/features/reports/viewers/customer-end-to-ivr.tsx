import React from 'react';
import type { ReportRun } from '@/features/reports/report-types';

/**
 * Customer End to IVR — operational diagnostic table. Customer identifiers are
 * masked; no additional customer data is exposed beyond existing permissions.
 */
export function CustomerEndToIVRViewer({ run }: { run: ReportRun }) {
    const data = run.data as { reportId: 'customer-end-to-ivr'; rows: JourneyRow[] };
    const rows = data.rows;

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="overflow-x-auto">
                <table className="flex-table-grid w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {[
                                { label: 'Date & Time', align: 'start' },
                                { label: 'Customer', align: 'start' },
                                { label: 'IVR Duration', align: 'end' },
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
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-muted whitespace-nowrap text-start">{row.dateTime}</td>
                                <td className="px-4 py-2.5 font-mono text-xs text-flex-text-primary whitespace-nowrap text-start">{row.customer}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary whitespace-nowrap text-end">{row.ivrDuration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

interface JourneyRow {
    dateTime: string;
    customer: string;
    ivrDuration: string;
}
