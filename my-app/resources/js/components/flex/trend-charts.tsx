import React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { CALL_VOLUME_14D, QUEUE_SLA } from '@/data/dashboard-trends.mock';

const volumeConfig = {
    answered: { label: 'Answered', color: 'var(--status-live)' },
    missed: { label: 'Missed', color: 'var(--status-disconnected)' },
} satisfies ChartConfig;

const slaConfig = {
    withinSla: { label: 'Within SLA %', color: 'var(--status-live)' },
} satisfies ChartConfig;

export function CallVolumeChart() {
    return (
        <ChartContainer config={volumeConfig} className="h-[220px] w-full">
            <AreaChart data={CALL_VOLUME_14D} margin={{ left: -12, right: 8, top: 4 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                    dataKey="answered"
                    type="monotone"
                    fill="var(--color-answered)"
                    fillOpacity={0.3}
                    stroke="var(--color-answered)"
                    stackId="a"
                />
                <Area
                    dataKey="missed"
                    type="monotone"
                    fill="var(--color-missed)"
                    fillOpacity={0.2}
                    stroke="var(--color-missed)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    );
}

export function QueueSlaChart() {
    return (
        <ChartContainer config={slaConfig} className="h-[220px] w-full">
            <BarChart data={QUEUE_SLA} margin={{ left: -12, right: 8, top: 4 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="queue" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="withinSla" radius={[4, 4, 0, 0]} fill="var(--color-withinSla)" />
            </BarChart>
        </ChartContainer>
    );
}
