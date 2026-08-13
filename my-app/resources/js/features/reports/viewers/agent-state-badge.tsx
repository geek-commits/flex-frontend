import React from 'react';
import { FlexStatus } from '@/components/flex/flex-status';
import type { AgentState } from '@/features/reports/report-types';

const AGENT_STATE_TONE: Record<AgentState, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    'On Call': 'success',
    Ready: 'info',
    'Wrap up': 'warning',
    Break: 'neutral',
    Offline: 'danger',
};

/** Semantic state badge for agent state-log rows (not color-only). */
export function AgentStateBadge({ state }: { state: AgentState }) {
    return (
        <FlexStatus tone={AGENT_STATE_TONE[state]} className="capitalize">
            {state}
        </FlexStatus>
    );
}
