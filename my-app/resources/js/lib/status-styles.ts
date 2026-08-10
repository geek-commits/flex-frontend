import type { AgentState, ConnectionState, CampaignStatus, AIFeatureStatus } from '@/types/flex';

export interface StatusConfig {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
}

const status = {
    live: {
        bgClass: 'bg-status-live-bg',
        textClass: 'text-status-live',
        borderClass: 'border-status-live/30',
        dotClass: 'bg-status-live',
    },
    stale: {
        bgClass: 'bg-status-stale-bg',
        textClass: 'text-status-stale',
        borderClass: 'border-status-stale/30',
        dotClass: 'bg-status-stale',
    },
    disconnected: {
        bgClass: 'bg-status-disconnected-bg',
        textClass: 'text-status-disconnected',
        borderClass: 'border-status-disconnected/30',
        dotClass: 'bg-status-disconnected',
    },
    talking: {
        bgClass: 'bg-status-talking-bg',
        textClass: 'text-status-talking',
        borderClass: 'border-status-talking/30',
        dotClass: 'bg-status-talking',
    },
    neutral: {
        bgClass: 'bg-status-notready-bg',
        textClass: 'text-status-notready',
        borderClass: 'border-status-notready/30',
        dotClass: 'bg-status-notready',
    },
};

export type StatusTone = keyof typeof status;

/** Semantic tone classes for pages that render status badges without StatusBadge. */
export const statusToneClasses = status;

export const agentStateMap: Record<AgentState, StatusConfig> = {
    ready: { label: 'Ready', ...status.live },
    talking: { label: 'Talking', ...status.talking },
    ringing: { label: 'Ringing', ...status.stale, dotClass: 'bg-status-stale' },
    'wrap-up': { label: 'Wrap-Up', ...status.neutral },
    break: { label: 'Break', ...status.stale },
    'not-ready': { label: 'Not Ready', ...status.neutral },
    offline: { label: 'Offline', ...status.disconnected },
};

export const connectionStateMap: Record<ConnectionState, StatusConfig> = {
    live: { label: 'Live', ...status.live },
    connecting: { label: 'Connecting...', ...status.talking },
    stale: { label: 'Stale Data', ...status.stale },
    reconnecting: { label: 'Reconnecting...', ...status.stale },
    disconnected: { label: 'Disconnected', ...status.disconnected },
    error: { label: 'Connection Error', ...status.disconnected },
};

export const campaignStatusMap: Record<CampaignStatus, StatusConfig> = {
    active: { label: 'Active', ...status.live },
    paused: { label: 'Paused', ...status.stale },
    scheduled: { label: 'Scheduled', ...status.talking },
    completed: { label: 'Completed', ...status.neutral },
    draft: { label: 'Draft', ...status.neutral },
};

export const aiFeatureStatusMap: Record<AIFeatureStatus, StatusConfig> = {
    enabled: { label: 'Enabled', ...status.live },
    disabled: { label: 'Disabled', ...status.neutral },
    degraded: { label: 'Degraded Performance', ...status.stale },
    'configuration-required': { label: 'Configuration Required', ...status.talking },
};
