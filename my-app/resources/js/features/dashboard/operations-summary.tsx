import {
    RiCustomerServiceLine,
    RiCheckLine,
    RiTimeLine,
    RiShieldCheckLine,
} from '@remixicon/react';
import { FlexMetricItem } from '@/components/flex/metrics/flex-metric-item';
import { FlexMetricStrip } from '@/components/flex/metrics/flex-metric-strip';
import { SLA_TARGET } from '@/features/dashboard/constants';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

export function OperationsSummary() {
    const { data, isLoading } = useDashboardData();

    if (!data) {
        return (
            <FlexMetricStrip>
                <FlexMetricItem
                    label="Talking"
                    value={isLoading ? undefined : 0}
                    loading={isLoading}
                />
                <FlexMetricItem
                    label="Ready"
                    value={isLoading ? undefined : 0}
                    loading={isLoading}
                />
                <FlexMetricItem
                    label="Waiting"
                    value={isLoading ? undefined : 0}
                    loading={isLoading}
                />
                <FlexMetricItem
                    label="SLA"
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
                label="Talking"
                value={talking}
                description="Agents on active call"
                icon={RiCustomerServiceLine}
            />
            <FlexMetricItem
                label="Ready"
                value={ready}
                description="Available for incoming calls"
                icon={RiCheckLine}
            />
            <FlexMetricItem
                label="Waiting"
                value={waiting}
                description="Calls in queue"
                icon={RiTimeLine}
            />
            <FlexMetricItem
                label="SLA"
                value={`${sla}%`}
                description={
                    slaBelowTarget && offendingQueue
                        ? `${offendingQueue.queue} below target`
                        : `Target ${SLA_TARGET}%`
                }
                icon={RiShieldCheckLine}
                trend={
                    slaBelowTarget
                        ? {
                              value: `${SLA_TARGET - sla}% below`,
                              positive: false,
                          }
                        : undefined
                }
            />
        </FlexMetricStrip>
    );
}
