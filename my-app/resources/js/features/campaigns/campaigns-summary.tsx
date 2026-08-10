import { RiCheckboxCircleLine, RiMegaphoneLine, RiPhoneLine, RiTimeLine } from '@remixicon/react';
import React from 'react';
import { FlexMetricItem } from '@/components/flex/metrics/flex-metric-item';
import { FlexMetricStrip } from '@/components/flex/metrics/flex-metric-strip';
import type { CampaignRecord } from '@/domain/types';

export interface CampaignSummaryProps {
    records: CampaignRecord[];
    loading?: boolean;
}

/**
 * Compact operational campaign summary — preserves all four metrics
 * (Active Campaigns, Total Contacts, Calls Dialed, Answered) in a single
 * quiet surface. Trend values are derived only from real fields.
 */
export function CampaignSummary({ records, loading = false }: CampaignSummaryProps) {
    const totals = React.useMemo(() => {
        return {
            totalContacts: records.reduce((s, c) => s + c.totalContacts, 0),
            totalAnswered: records.reduce((s, c) => s + c.answeredCount, 0),
            totalDialed: records.reduce((s, c) => s + c.dialedCount, 0),
            activeCampaigns: records.filter((c) => c.status === 'active').length,
        };
    }, [records]);

    const dialedPct = totals.totalContacts > 0 ? Math.round((totals.totalDialed / totals.totalContacts) * 100) : 0;
    const answerRate = totals.totalDialed > 0 ? Math.round((totals.totalAnswered / totals.totalDialed) * 100) : 0;

    return (
        <FlexMetricStrip>
            <FlexMetricItem
                label="Active Campaigns"
                value={totals.activeCampaigns}
                description="Currently dialing"
                icon={RiMegaphoneLine}
                loading={loading}
            />
            <FlexMetricItem
                label="Total Contacts"
                value={totals.totalContacts.toLocaleString()}
                description="Across all campaigns"
                icon={RiPhoneLine}
                loading={loading}
            />
            <FlexMetricItem
                label="Calls Dialed"
                value={totals.totalDialed.toLocaleString()}
                description="Cumulative dialed contacts"
                icon={RiTimeLine}
                trend={{ value: `${dialedPct}%`, positive: true }}
                loading={loading}
            />
            <FlexMetricItem
                label="Answered"
                value={totals.totalAnswered.toLocaleString()}
                description="Successfully connected calls"
                icon={RiCheckboxCircleLine}
                trend={{ value: `${answerRate}%`, positive: true }}
                loading={loading}
            />
        </FlexMetricStrip>
    );
}
