import {
    RiCustomerServiceLine,
    RiCheckLine,
    RiTimeLine,
    RiShieldCheckLine,
} from '@remixicon/react';
import { useTranslation } from 'react-i18next';
import { FlexMetricItem } from '@/components/flex/metrics/flex-metric-item';
import { FlexMetricStrip } from '@/components/flex/metrics/flex-metric-strip';
import { SLA_TARGET } from '@/features/dashboard/constants';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

export function OperationsSummary() {
    const { t, i18n } = useTranslation('supervision');
    const { data, isLoading } = useDashboardData();

    if (!data) {
        return (
            <FlexMetricStrip>
                <FlexMetricItem
                    label={t('dashboard.metrics.talking.label')}
                    value={isLoading ? undefined : 0}
                    loading={isLoading}
                />
                <FlexMetricItem
                    label={t('dashboard.metrics.ready.label')}
                    value={isLoading ? undefined : 0}
                    loading={isLoading}
                />
                <FlexMetricItem
                    label={t('dashboard.metrics.waiting.label')}
                    value={isLoading ? undefined : 0}
                    loading={isLoading}
                />
                <FlexMetricItem
                    label={t('dashboard.metrics.sla.label')}
                    value={isLoading ? undefined : 0}
                    loading={isLoading}
                />
            </FlexMetricStrip>
        );
    }

    const talking = data.agents.filter((a) => a.state === 'talking').length;
    const ready = data.agents.filter((a) => a.state === 'ready').length;
    const waiting = data.queueHealth.reduce((sum, q) => sum + q.waiting, 0);
    const totalContacts = data.queueHealth.reduce(
        (sum, q) => sum + q.waiting,
        0,
    );
    const totalWithinSla = data.queueHealth.reduce(
        (sum, q) => sum + q.sla * q.waiting,
        0,
    );
    const sla =
        totalContacts > 0
            ? Math.round(totalWithinSla / totalContacts)
            : SLA_TARGET;

    const slaBelowTarget = data.queueHealth.some(
        (q) => q.waiting > 0 && q.sla < SLA_TARGET,
    );
    const offendingQueue = data.queueHealth.find(
        (q) => q.waiting > 0 && q.sla < SLA_TARGET,
    );

    return (
        <FlexMetricStrip>
            <FlexMetricItem
                label={t('dashboard.metrics.talking.label')}
                value={talking}
                description={t('dashboard.metrics.talking.description')}
                icon={RiCustomerServiceLine}
            />
            <FlexMetricItem
                label={t('dashboard.metrics.ready.label')}
                value={ready}
                description={t('dashboard.metrics.ready.description')}
                icon={RiCheckLine}
            />
            <FlexMetricItem
                label={t('dashboard.metrics.waiting.label')}
                value={waiting}
                description={t('dashboard.metrics.waiting.description')}
                icon={RiTimeLine}
            />
            <FlexMetricItem
                label={t('dashboard.metrics.sla.label')}
                value={new Intl.NumberFormat(i18n.language).format(sla) + '%'}
                description={
                    slaBelowTarget && offendingQueue
                        ? t('dashboard.alert.queueWaiting', { queue: offendingQueue.queue, count: offendingQueue.waiting })
                        : t('dashboard.metrics.sla.description', { value: SLA_TARGET })
                }
                icon={RiShieldCheckLine}
                trend={
                    slaBelowTarget
                        ? {
                              value: t('dashboard.metrics.sla.below', { value: SLA_TARGET - sla, defaultValue: `${SLA_TARGET - sla}% below` }),
                              positive: false,
                          }
                        : undefined
                }
            />
        </FlexMetricStrip>
    );
}
