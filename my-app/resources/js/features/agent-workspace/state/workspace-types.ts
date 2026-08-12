import type { AgentState, CallState, ConnectionState } from '@/types/flex';

/**
 * Call manager domain types (AGENT_WORKSPACE_PLAN §13, §24, §45, §46).
 *
 * The POC telephony is a deterministic mock (see mock-workspace-state.ts);
 * these types describe what the mock adapter may expose. No external system
 * contract is invented here.
 */

export type CallDirection = 'inbound' | 'outbound';

export type CallTargetKind = 'phone' | 'agent' | 'queue';

/** Who a call is with — a phone number, an agent, or a queue. */
export interface CallTarget {
    id: string;
    kind: CallTargetKind;
    /** Display label (customer name when known; otherwise the number). */
    label: string;
    phone?: string;
}

/** The live call the agent is handling (incoming, active, held, transferring). */
export interface ActiveCall {
    id: string;
    direction: CallDirection;
    target: CallTarget;
    /** Inbound queue context when the runtime provides it. */
    queueLabel?: string;
    /** ISO timestamp — when the call was initiated. */
    startedAt: string;
    /** ISO timestamp — when media was established (drives the talk timer). */
    connectedAt?: string;
}

export type CallHistoryOutcome = 'answered' | 'missed' | 'declined' | 'failed' | 'outgoing' | 'transferred';

/** Lightweight agent convenience history — not CDR (AGENT_WORKSPACE_PLAN §46). */
export interface CallHistoryEntry {
    id: string;
    target: CallTarget;
    direction: CallDirection;
    outcome: CallHistoryOutcome;
    startedAt: string;
    durationSeconds: number;
}

export type TransferStatus = 'selecting' | 'pending' | 'failed';

/**
 * Direct-transfer flow state (AGENT_WORKSPACE_PLAN §40–§44).
 *
 * Warm transfer is not supported: the runtime has no consultation state, so
 * `transferring` always means a direct transfer. `failed` keeps the target so
 * the surface can state what failed; the original call stays connected.
 */
export interface TransferState {
    status: TransferStatus;
    target: CallTarget | null;
}

export type MicStatus = 'available' | 'denied' | 'unavailable';

export interface MediaState {
    mic: MicStatus;
}

export interface WorkspaceState {
    /** Availability state (system-driven states are never manually selectable). */
    agentState: AgentState;
    agentStatePending: AgentState | null;
    sessionStartedAt: string;
    connection: ConnectionState;
    media: MediaState;

    callState: CallState;
    activeCall: ActiveCall | null;
    isMuted: boolean;
    isOnHold: boolean;
    transfer: TransferState | null;
    history: CallHistoryEntry[];

    /** ISO timestamp the current Wrap Up began; `null` outside Wrap Up. */
    wrapUpStartedAt: string | null;
}
