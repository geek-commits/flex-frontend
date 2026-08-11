import type { CallState } from '@/types/flex';

export interface CallStateConfig {
    label: string;
    badgeClass: string;
}

export const callStateMap: Record<CallState, CallStateConfig> = {
    idle: { label: 'Idle', badgeClass: 'bg-muted text-muted-foreground' },
    dialing: {
        label: 'Dialing',
        badgeClass: 'bg-status-stale-bg text-status-stale border-status-stale/30',
    },
    ringing: {
        label: 'Incoming',
        badgeClass: 'bg-status-stale-bg text-status-stale border-status-stale/30',
    },
    connecting: {
        label: 'Connecting',
        badgeClass: 'bg-status-stale-bg text-status-stale border-status-stale/30',
    },
    connected: {
        label: 'Connected',
        badgeClass: 'bg-status-live-bg text-status-live border-status-live/30',
    },
    hold: {
        label: 'On Hold',
        badgeClass: 'bg-status-notready-bg text-status-notready border-status-notready/30',
    },
    muted: {
        label: 'Muted',
        badgeClass: 'bg-status-notready-bg text-status-notready border-status-notready/30',
    },
    transferring: {
        label: 'Transferring',
        badgeClass: 'bg-status-stale-bg text-status-stale border-status-stale/30',
    },
    'wrap-up': { label: 'Wrap Up', badgeClass: 'bg-muted text-muted-foreground' },
    ended: { label: 'Ended', badgeClass: 'bg-muted text-muted-foreground' },
    failed: {
        label: 'Failed',
        badgeClass: 'bg-status-disconnected-bg text-status-disconnected border-status-disconnected/30',
    },
};
