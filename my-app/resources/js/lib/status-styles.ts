import type { AgentState, ConnectionState, CampaignStatus, AIFeatureStatus } from '@/types/flex';

export interface StatusConfig {
    label: string;
    labelKey?: string;
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
    ready: { label: 'Ready', labelKey: 'agent:status.ready', ...status.live },
    talking: { label: 'Talking', labelKey: 'agent:status.talking', ...status.talking },
    ringing: { label: 'Ringing', labelKey: 'agent:status.ringing', ...status.stale, dotClass: 'bg-status-stale' },
    'wrap-up': { label: 'Wrap Up', labelKey: 'agent:status.wrapUp', ...status.neutral },
    break: { label: 'Break', labelKey: 'agent:status.break', ...status.stale },
    'not-ready': { label: 'Not Ready', labelKey: 'agent:status.notReady', ...status.neutral },
    offline: { label: 'Offline', labelKey: 'agent:status.offline', ...status.disconnected },
};

export const connectionStateMap: Record<ConnectionState, StatusConfig> = {
    live: { label: 'Live', labelKey: 'supervision:dashboard.live.live', ...status.live },
    connecting: { label: 'Connecting...', labelKey: 'supervision:dashboard.live.reconnecting', ...status.talking },
    stale: { label: 'Stale Data', labelKey: 'supervision:dashboard.live.stale', ...status.stale },
    reconnecting: { label: 'Reconnecting...', labelKey: 'supervision:dashboard.live.reconnecting', ...status.stale },
    disconnected: { label: 'Disconnected', labelKey: 'supervision:dashboard.live.error', ...status.disconnected },
    error: { label: 'Connection Error', labelKey: 'supervision:dashboard.live.error', ...status.disconnected },
};

export const campaignStatusMap: Record<CampaignStatus, StatusConfig> = {
    active: { label: 'Active', labelKey: 'supervision:campaigns.status.active', ...status.live },
    paused: { label: 'Paused', labelKey: 'supervision:campaigns.status.paused', ...status.stale },
    scheduled: { label: 'Scheduled', labelKey: 'supervision:campaigns.status.scheduled', ...status.talking },
    completed: { label: 'Completed', labelKey: 'supervision:campaigns.status.completed', ...status.neutral },
    draft: { label: 'Draft', labelKey: 'supervision:campaigns.status.draft', ...status.neutral },
};

export const aiFeatureStatusMap: Record<AIFeatureStatus, StatusConfig> = {
    enabled: { label: 'Enabled', labelKey: 'administration:ai.enabled', ...status.live },
    disabled: { label: 'Disabled', labelKey: 'administration:ai.disabled', ...status.neutral },
    degraded: { label: 'Degraded Performance', labelKey: 'administration:ai.degraded', ...status.stale },
    'configuration-required': { label: 'Configuration Required', labelKey: 'administration:ai.configurationRequired', ...status.talking },
};
