import { useEffect, useMemo, useState } from 'react';
import type { AgentState, ConnectionState } from '@/types/flex';
import { workspaceState } from './mock-workspace-state';
import type { CallTarget, MicStatus, WorkspaceState } from './workspace-types';

/**
 * React binding to the canonical workspace state owner.
 *
 * Subscribes once (no duplicate subscriptions), exposes the current snapshot
 * and stable action callbacks. Cleanup on unmount never cancels the mock
 * telephony line itself — a live call keeps running across navigation.
 */
export function useWorkspaceState(): WorkspaceState & {
    setAgentState: (state: AgentState) => void;
    dial: (target: CallTarget) => void;
    simulateIncomingCall: (target: CallTarget, queueLabel?: string) => void;
    answer: () => void;
    decline: () => void;
    toggleMute: () => void;
    toggleHold: () => void;
    endCall: () => void;
    startTransfer: () => void;
    selectTransferTarget: (target: CallTarget) => void;
    cancelTransfer: () => void;
    completeTransfer: () => void;
    setConnection: (state: ConnectionState) => void;
    setMicStatus: (status: MicStatus) => void;
} {
    const [state, setState] = useState<WorkspaceState>(() => workspaceState.getState());

    useEffect(() => workspaceState.subscribe(setState), []);

    const actions = useMemo(
        () => ({
            setAgentState: (next: AgentState) => workspaceState.setAgentState(next),
            dial: (target: CallTarget) => workspaceState.dial(target),
            simulateIncomingCall: (target: CallTarget, queueLabel?: string) =>
                workspaceState.simulateIncomingCall(target, queueLabel),
            answer: () => workspaceState.answer(),
            decline: () => workspaceState.decline(),
            toggleMute: () => workspaceState.toggleMute(),
            toggleHold: () => workspaceState.toggleHold(),
            endCall: () => workspaceState.endCall(),
            startTransfer: () => workspaceState.startTransfer(),
            selectTransferTarget: (target: CallTarget) => workspaceState.selectTransferTarget(target),
            cancelTransfer: () => workspaceState.cancelTransfer(),
            completeTransfer: () => workspaceState.completeTransfer(),
            setConnection: (next: ConnectionState) => workspaceState.setConnection(next),
            setMicStatus: (status: MicStatus) => workspaceState.setMicStatus(status),
        }),
        [],
    );

    return { ...state, ...actions };
}
