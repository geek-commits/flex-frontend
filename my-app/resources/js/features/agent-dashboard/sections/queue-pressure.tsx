import React from 'react';
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
    return (
        <Card className="bg-card border-border shadow-2xs">
            <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                        Queue Pressure
                    </h3>
                    <span className="text-[11px] text-muted-foreground">
                        Waiting calls and availability
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    {queues.map((queue) => (
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
                                        ? 'No calls waiting'
                                        : queue.sla < SLA_TARGET
                                          ? 'Below SLA'
                                          : queue.availableAgents === 0
                                            ? 'No agents available'
                                            : 'Healthy'}
                                </FlexStatus>
                            </div>

                            <FlexMetricStrip className="gap-x-6 px-3 py-2">
                                <FlexMetricItem
                                    label="Waiting"
                                    value={queue.waiting}
                                />
                                <FlexMetricItem
                                    label="Longest wait"
                                    value={formatWait(queue.longestWait)}
                                />
                                <FlexMetricItem
                                    label="Available agents"
                                    value={`${queue.availableAgents} / ${queue.totalAgents}`}
                                />
                                <FlexMetricItem
                                    label="SLA"
                                    value={`${queue.sla}%`}
                                />
                            </FlexMetricStrip>
                        </div>
                    )) || (
                        <div className="text-xs text-muted-foreground">
                            No queue data available.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}