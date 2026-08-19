import React from 'react';
import type { ReportRun } from '@/features/reports/report-types';

/**
 * Recordings — usage-oriented play-count report. Distinct from CDR call
 * recordings and Management Console recordings configuration.
 */
export function RecordingsViewer({ run }: { run: ReportRun }) {
    const data = run.data as { reportId: 'recordings'; rows: RecordingRow[] };
    const rows = data.rows;

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="overflow-x-auto">
                <table className="flex-table-grid w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {[
                                { label: 'Recording Name', align: 'start' },
                                { label: 'Play Count', align: 'end' },
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
                                <td className="px-4 py-2.5 text-xs text-flex-text-primary text-start">{row.recordingName}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{row.playCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

interface RecordingRow {
    recordingName: string;
    playCount: number;
}
