import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexBarChart } from '@/components/flex/charts/flex-bar-chart';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    TRAFFIC_SERIES,
    toTrafficData,
} from '@/features/dashboard/contact-center-traffic-data';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

function TrafficLegend() {
    const { t } = useTranslation('supervision');

    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {TRAFFIC_SERIES.map((s) => (
                <span
                    key={s.dataKey}
                    className="flex items-center gap-1.5 text-xs text-flex-text-muted"
                >
                    <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: s.color }}
                        aria-hidden="true"
                    />
                    {s.labelKey ? t(s.labelKey) : s.label}
                </span>
            ))}
        </div>
    );
}

export function ContactCenterTrafficChart() {
    const { t } = useTranslation('supervision');
    const { data, isLoading, error, isRefreshing, refresh } =
        useDashboardData();

    const chartData = useMemo(() => toTrafficData(data?.callVolume14d), [data]);
    const hasData = chartData.length > 0;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface p-4 text-center">
                <p className="text-sm font-medium text-flex-text-primary">
                    {t('dashboard.traffic.unavailable')}
                </p>
                <p className="text-xs text-flex-text-muted">
                    {t('dashboard.traffic.failed')}
                </p>
                <Button
                    size="sm"
                    onClick={refresh}
                    disabled={isRefreshing}
                    aria-busy={isRefreshing}
                >
                    {t('dashboard.live.retry')}
                </Button>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
            <div className="flex flex-col gap-2 border-b border-flex-workspace-divider px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-flex-text-primary">
                        {t('dashboard.traffic.title')}
                    </h2>
                    <p className="text-xs text-flex-text-muted">
                        {t('dashboard.traffic.description')}
                    </p>
                </div>
                <TrafficLegend />
            </div>

            <div className="px-4 py-4">
                {isLoading || !data ? (
                    <div className="flex min-h-64 w-full items-center justify-center sm:aspect-[3/1] sm:min-h-0">
                        <Skeleton className="h-full w-full" />
                    </div>
                ) : hasData ? (
                    <FlexBarChart
                        ariaLabel={t('dashboard.traffic.description')}
                        className="min-h-64 sm:min-h-0"
                        data={chartData}
                        xDataKey="date"
                        series={TRAFFIC_SERIES}
                        aspectRatio="3 / 1"
                        maxLabels={8}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                        <p className="text-sm font-medium text-flex-text-primary">
                            {t('dashboard.traffic.noData')}
                        </p>
                        <p className="text-xs text-flex-text-muted">
                            {t('dashboard.traffic.noTrend')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
