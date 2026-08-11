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
import { FlexMetricItem } from '@/components/flex/metrics/flex-metric-item';
import { FlexMetricStrip } from '@/components/flex/metrics/flex-metric-strip';
import { MONITORING_STATE_ORDER } from '@/features/agent-monitoring/use-agent-monitoring';
import { useAgentMonitoring } from '@/features/agent-monitoring/use-agent-monitoring';
import type { AgentState } from '@/features/dashboard/dashboard-types';

interface SummaryState {
    state: AgentState;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

const SUMMARY_STATES: SummaryState[] = [
    {
        state: 'talking',
        label: 'Talking',
        description: 'Agents on active call',
        icon: RiCustomerServiceLine,
    },
    {
        state: 'ready',
        label: 'Ready',
        description: 'Available for incoming calls',
        icon: RiCheckLine,
    },
    {
        state: 'ringing',
        label: 'Ringing',
        description: 'Agents on inbound ring',
        icon: RiPhoneLine,
    },
    {
        state: 'wrap-up',
        label: 'Wrap-Up',
        description: 'Post-call work',
        icon: RiFileListLine,
    },
    {
        state: 'break',
        label: 'Break',
        description: 'Away on break',
        icon: RiCupLine,
    },
    {
        state: 'not-ready',
        label: 'Not Ready',
        description: 'Unavailable for calls',
        icon: RiPauseCircleLine,
    },
    {
        state: 'offline',
        label: 'Offline',
        description: 'Not currently logged in',
        icon: RiTimeLine,
    },
];

const SUMMARY_STATE_SET = new Set(SUMMARY_STATES.map((s) => s.state));

export function AgentStateSummary() {
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
                        label={config.label}
                        value={summary[state]}
                        description={config.description}
                        icon={config.icon}
                        loading={isLoading}
                    />
                );
            })}
        </FlexMetricStrip>
    );
}
