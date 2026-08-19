import type { FlexBarSeries } from '@/components/flex/charts/flex-bar-chart';
import type { DailyCallVolume } from '@/features/dashboard/dashboard-types';

/**
 * Narrow view-model for the Contact Center traffic chart. Maps the dashboard
 * response into the grouped-bar shape without touching the backend contract.
 */
export interface ContactCenterTrafficDatum {
    date: string;
    answered: number;
    missed: number;
    [key: string]: unknown;
}

/** Series labels shown in legend/tooltip — never raw API keys. */
export const TRAFFIC_SERIES: FlexBarSeries[] = [
    { dataKey: 'answered', label: 'Answered', color: 'var(--flex-chart-bar)' },
    { dataKey: 'missed', label: 'Missed', color: 'var(--status-disconnected)' },
];

export function toTrafficData(volume: DailyCallVolume[] | undefined): ContactCenterTrafficDatum[] {
    return (volume ?? []).map((v) => ({
        date: v.day,
        answered: v.answered,
        missed: v.missed,
    }));
}