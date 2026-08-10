import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

const volumeConfig = {
    answered: { label: 'Answered', color: 'var(--flex-chart-1)' },
    missed: { label: 'Missed', color: 'var(--flex-chart-2)' },
} satisfies ChartConfig;

export function CallVolumeChart() {
    const { data, isLoading, error } = useDashboardData();

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-4 text-center">
                <p className="text-sm font-medium text-flex-text-primary">
                    Call volume unavailable
                </p>
                <p className="text-xs text-flex-text-muted">
                    Failed to load trend data
                </p>
                <button
                    type="button"
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (isLoading || !data) {
        return (
            <ChartContainer config={volumeConfig} className="h-[220px] w-full">
                <Skeleton className="h-full w-full" />
            </ChartContainer>
        );
    }

    if (!data.callVolume14d || data.callVolume14d.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-8 text-center">
                <p className="text-sm font-medium text-flex-text-primary">
                    No call volume data
                </p>
                <p className="text-xs text-flex-text-muted">
                    No trend data available for the selected period
                </p>
            </div>
        );
    }

    return (
        <ChartContainer config={volumeConfig} className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data.callVolume14d}
                    margin={{ left: -12, right: 8, top: 4 }}
                >
                    <defs>
                        <linearGradient
                            id="answered-gradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="var(--flex-chart-1)"
                                stopOpacity={0.25}
                            />
                            <stop
                                offset="100%"
                                stopColor="var(--flex-chart-1)"
                                stopOpacity={0}
                            />
                        </linearGradient>
                        <linearGradient
                            id="missed-gradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="var(--flex-chart-2)"
                                stopOpacity={0.15}
                            />
                            <stop
                                offset="100%"
                                stopColor="var(--flex-chart-2)"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                        stroke="var(--flex-chart-grid)"
                    />
                    <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={11}
                        stroke="var(--flex-chart-muted)"
                        tick={{ fill: 'var(--flex-chart-muted)' }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={11}
                        stroke="var(--flex-chart-muted)"
                        tick={{ fill: 'var(--flex-chart-muted)' }}
                        domain={[0, 'dataMax + 20']}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                        dataKey="answered"
                        type="monotone"
                        fill="url(#answered-gradient)"
                        stroke="var(--flex-chart-1)"
                        strokeWidth={2}
                    />
                    <Area
                        dataKey="missed"
                        type="monotone"
                        fill="url(#missed-gradient)"
                        stroke="var(--flex-chart-2)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
