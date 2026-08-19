import { Bar } from '@/components/charts/bar';
import { BarChart } from '@/components/charts/bar-chart';
import { BarXAxis } from '@/components/charts/bar-x-axis';
import { Grid } from '@/components/charts/grid';
import { ChartTooltip } from '@/components/charts/tooltip/chart-tooltip';
import type { TooltipRow } from '@/components/charts/tooltip/tooltip-content';

export interface FlexBarSeries {
    /** Key in each datum for the series value. */
    dataKey: string;
    /** Human-readable series label (e.g. "Answered"). */
    label: string;
    /** FLEX semantic token or resolved color for the bar fill. */
    color: string;
}

export interface FlexBarChartProps {
    /** Chart data points (each has `xDataKey` plus each series `dataKey`). */
    data: Record<string, unknown>[];
    /** Key in data used for the categorical x-axis. */
    xDataKey: string;
    /** Grouped series definitions. */
    series: FlexBarSeries[];
    /** Aspect ratio as "width / height". Defaults to a wide 3 / 1. */
    aspectRatio?: string;
    /** Max x-axis labels shown on desktop. Defaults to 8. */
    maxLabels?: number;
    /** Enable the entry grow animation. Defaults to false (realtime-safe). */
    animate?: boolean;
    /** Bar end radius in px. Defaults to 4. */
    lineCap?: number;
}

/**
 * FLEX wrapper around the Bklit bar chart. Owns the FLEX visual contract —
 * Inter, semantic tokens, quiet horizontal grid, restrained bar radius,
 * reduced-motion-safe (no animation by default) — while the caller supplies
 * data and business series. Live dashboards keep `animate={false}` so realtime
 * refreshes never replay an entry animation.
 */
export function FlexBarChart({
    data,
    xDataKey,
    series,
    aspectRatio = '3 / 1',
    maxLabels = 8,
    animate = false,
    lineCap = 4,
}: FlexBarChartProps) {
    const rows = (point: Record<string, unknown>): TooltipRow[] =>
        series.map((s) => ({
            color: s.color,
            label: s.label,
            value: (point[s.dataKey] as number) ?? 0,
        }));

    return (
        <BarChart data={data} xDataKey={xDataKey} aspectRatio={aspectRatio}>
            <Grid horizontal />
            {series.map((s) => (
                <Bar
                    key={s.dataKey}
                    dataKey={s.dataKey}
                    fill={s.color}
                    lineCap={lineCap}
                    animate={animate}
                />
            ))}
            <BarXAxis maxLabels={maxLabels} />
            <ChartTooltip
                showCrosshair={false}
                showDots={false}
                showDatePill={false}
                rows={rows}
            />
        </BarChart>
    );
}