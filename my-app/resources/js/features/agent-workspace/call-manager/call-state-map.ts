import type { CallState } from '@/types/flex';

export interface CallStateConfig {
    label: string;
    labelKey?: string;
    badgeClass: string;
}

export const callStateMap: Record<CallState, CallStateConfig> = {
    idle: { label: 'Idle', labelKey: 'agent:callState.idle', badgeClass: 'bg-muted text-muted-foreground' },
    dialing: {
        label: 'Dialing',
        labelKey: 'agent:callState.dialing',
        badgeClass: 'bg-status-stale-bg text-status-stale border-status-stale/30',
    },
    ringing: {
        label: 'Incoming',
        labelKey: 'agent:callState.ringingIncoming',
        badgeClass: 'bg-status-stale-bg text-status-stale border-status-stale/30',
    },
    connecting: {
        label: 'Connecting',
        labelKey: 'agent:callState.connecting',
        badgeClass: 'bg-status-stale-bg text-status-stale border-status-stale/30',
    },
    connected: {
        label: 'Connected',
        labelKey: 'agent:callState.connected',
        badgeClass: 'bg-status-live-bg text-status-live border-status-live/30',
    },
    hold: {
        label: 'On Hold',
        labelKey: 'agent:callState.held',
        badgeClass: 'bg-status-notready-bg text-status-notready border-status-notready/30',
    },
    muted: {
        label: 'Muted',
        labelKey: 'agent:callState.muted',
        badgeClass: 'bg-status-notready-bg text-status-notready border-status-notready/30',
    },
    transferring: {
        label: 'Transferring',
        labelKey: 'agent:callState.transferring',
        badgeClass: 'bg-status-stale-bg text-status-stale border-status-stale/30',
    },
    'wrap-up': { label: 'Wrap Up', labelKey: 'agent:callState.wrapUp', badgeClass: 'bg-muted text-muted-foreground' },
    ended: { label: 'Ended', labelKey: 'agent:callState.ended', badgeClass: 'bg-muted text-muted-foreground' },
    failed: {
        label: 'Failed',
        labelKey: 'agent:callState.failed',
        badgeClass: 'bg-status-disconnected-bg text-status-disconnected border-status-disconnected/30',
    },
};
