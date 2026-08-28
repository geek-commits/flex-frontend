import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexStatus } from '@/components/flex/flex-status';
import { FlexMetricItem } from '@/components/flex/metrics/flex-metric-item';
import { FlexMetricStrip } from '@/components/flex/metrics/flex-metric-strip';
import { Card, CardContent } from '@/components/ui/card';
import { SLA_TARGET } from '@/features/dashboard/constants';
import type { AgentQueuePressure } from '../agent-dashboard-types';

function formatWait(seconds: number): string {
    if (seconds <= 0) {
        return '—';
    }

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export interface QueuePressureSectionProps {
    queues: AgentQueuePressure[];
}

/**
 * Queue pressure — the queues the agent relates to, using real `QueueHealth`
 * fields and the runtime SLA target (`SLA_TARGET`). Distilled to the waiting
 * work signal; it never duplicates the supervisor Dashboard's queue table or
 * invents thresholds.
 */
export function QueuePressureSection({ queues }: QueuePressureSectionProps) {
    const { t } = useTranslation('agent');

    return (
        <Card className="bg-card border-border shadow-2xs">
            <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                        {t('dashboard.queuePressure.title')}
                    </h3>
                    <span className="text-[11px] text-muted-foreground">
                        {t('dashboard.queuePressure.subtitle')}
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    {queues.length === 0 ? (
                        <div className="text-xs text-muted-foreground">
                            {t('dashboard.queuePressure.empty')}
                        </div>
                    ) : (
                        queues.map((queue) => (
                            <div key={queue.queue} className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-semibold text-foreground">
                                        {queue.queue}
                                    </span>
                                    <FlexStatus
                                        tone={
                                            queue.waiting === 0
                                                ? 'neutral'
                                                : queue.sla < SLA_TARGET
                                                  ? 'warning'
                                                  : queue.availableAgents === 0
                                                    ? 'warning'
                                                    : 'success'
                                        }
                                    >
                                        {queue.waiting === 0
                                            ? t('dashboard.queuePressure.status.noCalls')
                                            : queue.sla < SLA_TARGET
                                              ? t('dashboard.queuePressure.status.belowSla')
                                              : queue.availableAgents === 0
                                                ? t('dashboard.queuePressure.status.noAgents')
                                                : t('dashboard.queuePressure.status.healthy')}
                                    </FlexStatus>
                                </div>

                                <FlexMetricStrip className="gap-x-6 px-3 py-2">
                                    <FlexMetricItem
                                        label={t('dashboard.queuePressure.metrics.waiting')}
                                        value={queue.waiting}
                                    />
                                    <FlexMetricItem
                                        label={t('dashboard.queuePressure.metrics.longestWait')}
                                        value={formatWait(queue.longestWait)}
                                    />
                                    <FlexMetricItem
                                        label={t('dashboard.queuePressure.metrics.availableAgents')}
                                        value={`${queue.availableAgents} / ${queue.totalAgents}`}
                                    />
                                    <FlexMetricItem
                                        label={t('dashboard.queuePressure.metrics.sla')}
                                        value={`${queue.sla}%`}
                                    />
                                </FlexMetricStrip>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}