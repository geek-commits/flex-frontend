import {
    RiCheckLine,
    RiCupLine,
    RiCustomerServiceLine,
    RiFileListLine,
    RiPauseCircleLine,
    RiPhoneLine,
    RiTimeLine,
} from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexMetricItem } from '@/components/flex/metrics/flex-metric-item';
import { FlexMetricStrip } from '@/components/flex/metrics/flex-metric-strip';
import { MONITORING_STATE_ORDER } from '@/features/agent-monitoring/use-agent-monitoring';
import { useAgentMonitoring } from '@/features/agent-monitoring/use-agent-monitoring';
import type { AgentState } from '@/features/dashboard/dashboard-types';

type MonitoringSummaryLabelKey =
    | 'monitoring.summary.talking.label'
    | 'monitoring.summary.ready.label'
    | 'monitoring.summary.ringing.label'
    | 'monitoring.summary.wrapUp.label'
    | 'monitoring.summary.break.label'
    | 'monitoring.summary.notReady.label'
    | 'monitoring.summary.offline.label';

type MonitoringSummaryDescKey =
    | 'monitoring.summary.talking.description'
    | 'monitoring.summary.ready.description'
    | 'monitoring.summary.ringing.description'
    | 'monitoring.summary.wrapUp.description'
    | 'monitoring.summary.break.description'
    | 'monitoring.summary.notReady.description'
    | 'monitoring.summary.offline.description';

interface SummaryState {
    state: AgentState;
    label: MonitoringSummaryLabelKey;
    description: MonitoringSummaryDescKey;
    icon: React.ComponentType<{ className?: string }>;
}

const SUMMARY_STATES: SummaryState[] = [
    {
        state: 'talking',
        label: 'monitoring.summary.talking.label',
        description: 'monitoring.summary.talking.description',
        icon: RiCustomerServiceLine,
    },
    {
        state: 'ready',
        label: 'monitoring.summary.ready.label',
        description: 'monitoring.summary.ready.description',
        icon: RiCheckLine,
    },
    {
        state: 'ringing',
        label: 'monitoring.summary.ringing.label',
        description: 'monitoring.summary.ringing.description',
        icon: RiPhoneLine,
    },
    {
        state: 'wrap-up',
        label: 'monitoring.summary.wrapUp.label',
        description: 'monitoring.summary.wrapUp.description',
        icon: RiFileListLine,
    },
    {
        state: 'break',
        label: 'monitoring.summary.break.label',
        description: 'monitoring.summary.break.description',
        icon: RiCupLine,
    },
    {
        state: 'not-ready',
        label: 'monitoring.summary.notReady.label',
        description: 'monitoring.summary.notReady.description',
        icon: RiPauseCircleLine,
    },
    {
        state: 'offline',
        label: 'monitoring.summary.offline.label',
        description: 'monitoring.summary.offline.description',
        icon: RiTimeLine,
    },
];

const SUMMARY_STATE_SET = new Set(SUMMARY_STATES.map((s) => s.state));

export function AgentStateSummary() {
    const { t } = useTranslation('supervision');
    const { summary, isLoading } = useAgentMonitoring();
    const orderedStates = MONITORING_STATE_ORDER.filter((state) =>
        SUMMARY_STATE_SET.has(state),
    );

    return (
        <FlexMetricStrip>
            {orderedStates.map((state) => {
                const config = SUMMARY_STATES.find((s) => s.state === state);

                if (!config) {
                    return null;
                }

                return (
                    <FlexMetricItem
                        key={state}
                        label={t(config.label)}
                        value={summary[state]}
                        description={t(config.description)}
                        icon={config.icon}
                        loading={isLoading}
                    />
                );
            })}
        </FlexMetricStrip>
    );
}