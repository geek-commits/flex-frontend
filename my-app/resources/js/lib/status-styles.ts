import type { AgentState, ConnectionState, CampaignStatus, AIFeatureStatus } from '@/types/flex';

export type AgentStatusKey = 'status.ready' | 'status.talking' | 'status.ringing' | 'status.wrapUp' | 'status.break' | 'status.notReady' | 'status.offline';
export type ConnectionStatusKey = 'dashboard.live.live' | 'dashboard.live.reconnecting' | 'dashboard.live.stale' | 'dashboard.live.error';
export type CampaignStatusKey = 'campaigns.status.active' | 'campaigns.status.paused' | 'campaigns.status.scheduled' | 'campaigns.status.completed' | 'campaigns.status.draft';
export type AIStatusKey = 'ai.enabled' | 'ai.disabled' | 'ai.degraded' | 'ai.configurationRequired';

export interface StatusConfig {
    label: string;
    labelKey?: AgentStatusKey | ConnectionStatusKey | CampaignStatusKey | AIStatusKey | string;
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
} as const;

export type StatusTone = keyof typeof status;

/** Semantic tone classes for pages that render status badges without StatusBadge. */
export const statusToneClasses = status;

export const agentStateMap: Record<AgentState, StatusConfig & { labelKey: AgentStatusKey }> = {
    ready: { label: 'Ready', labelKey: 'status.ready', ...status.live },
    talking: { label: 'Talking', labelKey: 'status.talking', ...status.talking },
    ringing: { label: 'Ringing', labelKey: 'status.ringing', ...status.stale, dotClass: 'bg-status-stale' },
    'wrap-up': { label: 'Wrap Up', labelKey: 'status.wrapUp', ...status.neutral },
    break: { label: 'Break', labelKey: 'status.break', ...status.stale },
    'not-ready': { label: 'Not Ready', labelKey: 'status.notReady', ...status.neutral },
    offline: { label: 'Offline', labelKey: 'status.offline', ...status.disconnected },
} as const;

export const connectionStateMap: Record<ConnectionState, StatusConfig & { labelKey: ConnectionStatusKey }> = {
    live: { label: 'Live', labelKey: 'dashboard.live.live', ...status.live },
    connecting: { label: 'Connecting...', labelKey: 'dashboard.live.reconnecting', ...status.talking },
    stale: { label: 'Stale Data', labelKey: 'dashboard.live.stale', ...status.stale },
    reconnecting: { label: 'Reconnecting...', labelKey: 'dashboard.live.reconnecting', ...status.stale },
    disconnected: { label: 'Disconnected', labelKey: 'dashboard.live.error', ...status.disconnected },
    error: { label: 'Connection Error', labelKey: 'dashboard.live.error', ...status.disconnected },
} as const;

export const campaignStatusMap: Record<CampaignStatus, StatusConfig & { labelKey: CampaignStatusKey }> = {
    active: { label: 'Active', labelKey: 'campaigns.status.active', ...status.live },
    paused: { label: 'Paused', labelKey: 'campaigns.status.paused', ...status.stale },
    scheduled: { label: 'Scheduled', labelKey: 'campaigns.status.scheduled', ...status.talking },
    completed: { label: 'Completed', labelKey: 'campaigns.status.completed', ...status.neutral },
    draft: { label: 'Draft', labelKey: 'campaigns.status.draft', ...status.neutral },
} as const;

export const aiFeatureStatusMap: Record<AIFeatureStatus, StatusConfig & { labelKey: AIStatusKey }> = {
    enabled: { label: 'Enabled', labelKey: 'ai.enabled', ...status.live },
    disabled: { label: 'Disabled', labelKey: 'ai.disabled', ...status.neutral },
    degraded: { label: 'Degraded Performance', labelKey: 'ai.degraded', ...status.stale },
    'configuration-required': { label: 'Configuration Required', labelKey: 'ai.configurationRequired', ...status.talking },
} as const;
