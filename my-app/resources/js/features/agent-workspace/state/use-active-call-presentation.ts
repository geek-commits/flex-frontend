import { useMemo } from 'react';
import { useWorkspaceState } from '@/features/agent-workspace/state/use-workspace-state';
import type { CallDirection } from '@/features/agent-workspace/state/workspace-types';

/**
 * States where the agent is actually live on a connected call and the runtime
 * has established media (`connectedAt` drives the talk timer). Excludes
 * pre-answer (dialing/connecting/ringing) and post-call (wrap-up/ended).
 */
const LIVE_CALL_STATES = new Set<string>(['connected', 'hold', 'transferring']);

export type LiveCallState = 'connected' | 'hold' | 'transferring';

/**
 * Minimal UI shape the island needs. Derived from canonical telephony state —
 * no backend fields or new runtime enums are invented for the island.
 */
export interface ActiveCallPresentation {
    id: string;
    displayName?: string;
    phoneNumber?: string;
    queueName?: string;
    direction?: CallDirection;
    state: LiveCallState;
    /** ISO timestamp of media establishment — the authoritative duration source. */
    connectedAt: string;
}

/**
 * Selector mapping canonical call state into the island's presentation shape.
 * Returns `null` when there is no personal active/connected call, so the island
 * stays hidden until the runtime reports a real live call.
 */
export function useActiveCallPresentation(): ActiveCallPresentation | null {
    const { activeCall, callState } = useWorkspaceState();

    return useMemo<ActiveCallPresentation | null>(() => {
        if (!LIVE_CALL_STATES.has(callState as LiveCallState) || !activeCall?.connectedAt) {
            return null;
        }

        return {
            id: activeCall.id,
            displayName: activeCall.target.label || undefined,
            phoneNumber: activeCall.target.phone,
            queueName: activeCall.queueLabel,
            direction: activeCall.direction,
            state: callState as LiveCallState,
            connectedAt: activeCall.connectedAt,
        };
    }, [activeCall, callState]);
}