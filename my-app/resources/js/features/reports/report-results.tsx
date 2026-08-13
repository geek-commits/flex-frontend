import React from 'react';
import type { ReportRun } from '@/features/reports/report-types';

function fmt(value: unknown): string {
    if (typeof value === 'number') {
        return Number.isInteger(value) ? String(value) : value.toFixed(2);
    }

    return String(value ?? '—');
}

/**
 * Generic high-density report results table for single-section reports.
 * Report-specific viewers (P5+) may replace this with custom composition, but
 * this provides the canonical dense numeric table for common `rows` reports.
 */
export function ReportResults({ run }: { run: ReportRun }) {
    const data = run.data;

    if ('rows' in data) {
        const rows = data.rows;
        const keys = rows.length > 0 ? (Object.keys(rows[0]) as string[]) : [];
        const columns = keys.length > 0 ? keys : ['data'];

        return (
            <div className="overflow-hidden rounded-lg border border-border bg-background">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/40 text-left">
                                {columns.map((key) => (
                                    <th key={key} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                    {columns.map((key) => (
                                        <td key={key} className="px-4 py-2.5 tabular-nums whitespace-nowrap text-xs text-flex-text-primary">
                                            {fmt((row as unknown as Record<string, unknown>)[key])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return null;
}
