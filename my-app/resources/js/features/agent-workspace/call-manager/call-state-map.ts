import type { CallState } from '@/types/flex';

export type CallStateLabelKey =
    | 'callState.idle'
    | 'callState.dialing'
    | 'callState.ringingIncoming'
    | 'callState.connecting'
    | 'callState.connected'
    | 'callState.held'
    | 'callState.muted'
    | 'callState.transferring'
    | 'callState.wrapUp'
    | 'callState.ended'
    | 'callState.failed';

export interface CallStateConfig {
    label: string;
    labelKey?: CallStateLabelKey;
    badgeClass: string;
}

export const callStateMap: Record<CallState, CallStateConfig> = {
    idle: { label: 'Idle', labelKey: 'callState.idle', badgeClass: 'bg-muted text-muted-foreground' },
    dialing: {
        label: 'Dialing',
        labelKey: 'callState.dialing',
        badgeClass: 'bg-status-stale-bg text-status-stale border-status-stale/30',
    },
    ringing: {
        label: 'Incoming',
        labelKey: 'callState.ringingIncoming',
        badgeClass: 'bg-status-stale-bg text-status-stale border-status-stale/30',
    },
    connecting: {
        label: 'Connecting',
        labelKey: 'callState.connecting',
        badgeClass: 'bg-status-stale-bg text-status-stale border-status-stale/30',
    },
    connected: {
        label: 'Connected',
        labelKey: 'callState.connected',
        badgeClass: 'bg-status-live-bg text-status-live border-status-live/30',
    },
    hold: {
        label: 'On Hold',
        labelKey: 'callState.held',
        badgeClass: 'bg-status-notready-bg text-status-notready border-status-notready/30',
    },
    muted: {
        label: 'Muted',
        labelKey: 'callState.muted',
        badgeClass: 'bg-status-notready-bg text-status-notready border-status-notready/30',
    },
    transferring: {
        label: 'Transferring',
        labelKey: 'callState.transferring',
        badgeClass: 'bg-status-stale-bg text-status-stale border-status-stale/30',
    },
    'wrap-up': { label: 'Wrap Up', labelKey: 'callState.wrapUp', badgeClass: 'bg-muted text-muted-foreground' },
    ended: { label: 'Ended', labelKey: 'callState.ended', badgeClass: 'bg-muted text-muted-foreground' },
    failed: {
        label: 'Failed',
        labelKey: 'callState.failed',
        badgeClass: 'bg-status-disconnected-bg text-status-disconnected border-status-disconnected/30',
    },
};
