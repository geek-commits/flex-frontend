import { RiHeartPulseLine, RiLineChartLine, RiTimerLine } from '@remixicon/react';
import React from 'react';
import type { ReportRun } from '@/features/reports/report-types';

const PRIMARY_KEYS = ['Total Calls', 'Answer Rate', 'Service Level', 'Average Speed to Answer'];

/**
 * Contact Center Performance — section-first hierarchy. A restrained primary
 * operational strip (volume, service level, speed to answer) then a dense
 * secondary metrics table. No 12 equal KPI cards.
 */
export function ContactCenterPerformanceViewer({ run }: { run: ReportRun }) {
    const data = run.data as { reportId: 'contact-center-performance'; rows: { metric: string; value: string }[] };
    const rows = data.rows;

    const primary = PRIMARY_KEYS.map((key) => rows.find((row) => row.metric === key)).filter(
        (row): row is { metric: string; value: string } => Boolean(row)
    );
    const secondary = rows.filter((row) => !PRIMARY_KEYS.includes(row.metric));

    const stripMeta = [
        { label: 'Volume', Icon: RiHeartPulseLine },
        { label: 'Service', Icon: RiLineChartLine },
        { label: 'Speed to Answer', Icon: RiTimerLine },
    ];

    return (
        <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {primary.map((row, index) => (
                    <div key={row.metric} className="rounded-lg border border-border bg-background p-4">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted">
                            {(() => {
                                const Icon = stripMeta[index]?.Icon;

                                return Icon ? <Icon className="size-3.5" /> : null;
                            })()}
                            <span>{row.metric}</span>
                        </div>
                        <p className="mt-2 flex-metric tabular-nums text-flex-text-primary">{row.value}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border border-border bg-background">
                <div className="border-b border-border bg-muted/40 px-4 py-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-flex-text-muted">Operational Metrics</h3>
                </div>
                <table className="w-full text-sm">
                    <tbody>
                        {secondary.map((row) => (
                            <tr key={row.metric} className="border-b border-border last:border-b-0">
                                <td className="px-4 py-2.5 text-xs text-flex-text-muted">{row.metric}</td>
                                <td className="px-4 py-2.5 text-right text-xs font-semibold tabular-nums text-flex-text-primary">
                                    {row.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
