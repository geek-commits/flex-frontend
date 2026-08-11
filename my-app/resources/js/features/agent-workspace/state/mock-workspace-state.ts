import type { AgentState, CallState, ConnectionState } from '@/types/flex';
import type {
    ActiveCall,
    CallHistoryEntry,
    CallTarget,
    MicStatus,
    MediaState,
    WorkspaceState,
} from './workspace-types';

/**
 * Deterministic mock workspace owner (AGENT_WORKSPACE_PLAN §50, §56, §57).
 *
 * This is the POC's single canonical owner for agent state, telephony
 * connection, call state, the active call, mute/hold, transfer, wrap-up, and
 * call history. The UI never mutates state directly and never schedules fake
 * transitions in components — every transition lives here, behind the same
 * production-facing interface a real adapter would implement.
 *
 * Timings are deterministic constants (dev/test reproducibility over
 * randomness). The singleton keeps a live call alive across route
 * leave/re-enter (call persistence audit — §51); subscribers clean up on
 * unmount.
 */

export const WORKSPACE_TIMINGS = {
    /** Agent availability state transition round-trip. */
    agentStateTransitionMs: 450,
    /** Outbound: dialing → connecting. */
    dialingToConnectingMs: 800,
    /** Outbound: connecting → connected. */
    outboundConnectingMs: 1000,
    /** Inbound: answer → connecting → connected. */
    inboundConnectingMs: 1000,
    /** Incoming ring timeout before the call auto-registers as missed. */
    ringTimeoutMs: 12000,
    /** Wrap Up auto-return to Ready / idle. */
    wrapUpReturnMs: 6000,
} as const;

type Listener = (state: WorkspaceState) => void;

let callId = 0;

const nextCallId = () => `call-${++callId}`;

const initialWorkspaceState = (): WorkspaceState => ({
    agentState: 'ready',
    agentStatePending: null,
    sessionStartedAt: new Date().toISOString(),
    connection: 'live',
    media: { mic: 'available' },

    callState: 'idle',
    activeCall: null,
    isMuted: false,
    isOnHold: false,
    transfer: null,
    history: [],
});

export class MockWorkspaceState {
    private state: WorkspaceState = initialWorkspaceState();
    private listeners = new Set<Listener>();
    private timers = new Set<ReturnType<typeof setTimeout>>();

    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        listener(this.state);

        return () => {
            this.listeners.delete(listener);
        };
    }

    getState(): WorkspaceState {
        return this.state;
    }

    private schedule(fn: () => void, ms: number): void {
        const timer = setTimeout(() => {
            this.timers.delete(timer);
            fn();
        }, ms);
        this.timers.add(timer);
    }

    private set(patch: Partial<WorkspaceState>): void {
        this.state = { ...this.state, ...patch };
        this.listeners.forEach((listener) => listener(this.state));
    }

    /** Enter a call phase, clearing phase-specific flags that do not apply. */
    private transitionTo(callState: CallState, patch: Partial<WorkspaceState> = {}): void {
        this.set({
            callState,
            isMuted: callState === 'connected' || callState === 'hold' ? this.state.isMuted : false,
            isOnHold: callState === 'hold',
            transfer: callState === 'transferring' ? this.state.transfer : null,
            ...patch,
        });
    }

    private pushHistory(entry: Omit<CallHistoryEntry, 'id'>): void {
        this.set({
            history: [
                { id: nextCallId(), ...entry },
                ...this.state.history,
            ].slice(0, 50),
        });
    }

    /** Wrap Up mode begins; the call record is closed. */
    private beginWrapUp(): void {
        this.set({ agentState: 'wrap-up', agentStatePending: null });
        this.transitionTo('wrap-up', {
            isMuted: false,
            isOnHold: false,
            transfer: null,
            activeCall: null,
        });
        this.schedule(() => {
            if (this.state.callState === 'wrap-up') {
                this.set({ callState: 'idle', agentState: 'ready' });
            }
        }, WORKSPACE_TIMINGS.wrapUpReturnMs);
    }

    // ── Agent availability ────────────────────────────────────────────────

    setAgentState(next: AgentState): void {
        if (this.state.agentStatePending !== null || next === this.state.agentState) {
            return;
        }

        this.set({ agentStatePending: next });
        this.schedule(() => {
            this.set({ agentState: next, agentStatePending: null });
        }, WORKSPACE_TIMINGS.agentStateTransitionMs);
    }

    // ── Outbound ──────────────────────────────────────────────────────────

    dial(target: CallTarget): void {
        if (this.state.callState !== 'idle') {
            return;
        }

        const call: ActiveCall = {
            id: nextCallId(),
            direction: 'outbound',
            target,
            startedAt: new Date().toISOString(),
        };

        this.set({ activeCall: call });
        this.transitionTo('dialing');
        this.schedule(() => this.transitionTo('connecting'), WORKSPACE_TIMINGS.dialingToConnectingMs);
        this.schedule(() => this.establish(call), WORKSPACE_TIMINGS.dialingToConnectingMs + WORKSPACE_TIMINGS.outboundConnectingMs);
    }

    // ── Incoming ──────────────────────────────────────────────────────────

    simulateIncomingCall(target: CallTarget, queueLabel?: string): void {
        if (this.state.callState !== 'idle') {
            return;
        }

        const call: ActiveCall = {
            id: nextCallId(),
            direction: 'inbound',
            target,
            queueLabel,
            startedAt: new Date().toISOString(),
        };

        this.set({ activeCall: call });
        this.transitionTo('ringing');
        this.schedule(() => {
            if (this.state.callState === 'ringing' && this.state.activeCall?.id === call.id) {
                this.pushHistory({
                    target: call.target,
                    direction: 'inbound',
                    outcome: 'missed',
                    startedAt: call.startedAt,
                    durationSeconds: 0,
                });
                this.set({ activeCall: null });
                this.transitionTo('idle');
            }
        }, WORKSPACE_TIMINGS.ringTimeoutMs);
    }

    answer(): void {
        const call = this.state.activeCall;

        if (this.state.callState !== 'ringing' || !call) {
            return;
        }

        this.transitionTo('connecting');
        this.schedule(() => this.establish(call), WORKSPACE_TIMINGS.inboundConnectingMs);
    }

    decline(): void {
        const call = this.state.activeCall;

        if (this.state.callState !== 'ringing' || !call) {
            return;
        }

        this.pushHistory({
            target: call.target,
            direction: 'inbound',
            outcome: 'declined',
            startedAt: call.startedAt,
            durationSeconds: 0,
        });
        this.set({ activeCall: null });
        this.transitionTo('idle');
    }

    // ── Active call ───────────────────────────────────────────────────────

    private establish(call: ActiveCall): void {
        if (this.state.activeCall?.id !== call.id) {
            return;
        }

        this.set({
            activeCall: {
                ...call,
                connectedAt: new Date().toISOString(),
            },
        });
        this.transitionTo('connected', { agentState: 'talking' });
    }

    toggleMute(): void {
        if (this.state.callState !== 'connected' && this.state.callState !== 'hold') {
            return;
        }

        this.set({ isMuted: !this.state.isMuted });
    }

    toggleHold(): void {
        if (this.state.callState === 'connected') {
            this.transitionTo('hold');
        } else if (this.state.callState === 'hold') {
            this.transitionTo('connected');
        }
    }

    endCall(): void {
        const call = this.state.activeCall;

        if (!call || this.state.callState === 'wrap-up' || this.state.callState === 'idle') {
            return;
        }

        const durationSeconds = call.connectedAt
            ? Math.max(0, Math.floor((Date.now() - new Date(call.connectedAt).getTime()) / 1000))
            : 0;
        const outcome =
            call.direction === 'outbound'
                ? durationSeconds > 0
                    ? 'answered'
                    : 'outgoing'
                : durationSeconds > 0
                  ? 'answered'
                  : 'declined';

        this.pushHistory({
            target: call.target,
            direction: call.direction,
            outcome,
            startedAt: call.startedAt,
            durationSeconds,
        });

        this.beginWrapUp();
    }

    // ── Transfer (direct only — warm requires real backend capability) ────

    startTransfer(): void {
        if (this.state.callState !== 'connected') {
            return;
        }

        this.set({ transfer: { status: 'selecting', target: null } });
        this.transitionTo('transferring');
    }

    selectTransferTarget(target: CallTarget): void {
        if (this.state.callState !== 'transferring') {
            return;
        }

        this.set({ transfer: { status: 'selecting', target } });
    }

    cancelTransfer(): void {
        if (this.state.callState !== 'transferring') {
            return;
        }

        this.set({ transfer: null });
        this.transitionTo('connected');
    }

    completeTransfer(): void {
        const transfer = this.state.transfer;
        const call = this.state.activeCall;

        if (this.state.callState !== 'transferring' || !transfer?.target || !call) {
            return;
        }

        this.pushHistory({
            target: call.target,
            direction: call.direction,
            outcome: 'outgoing',
            startedAt: call.startedAt,
            durationSeconds: call.connectedAt
                ? Math.max(0, Math.floor((Date.now() - new Date(call.connectedAt).getTime()) / 1000))
                : 0,
        });
        this.beginWrapUp();
    }

    // ── Media / connection (deterministic mock scenarios — §57) ───────────

    setConnection(state: ConnectionState): void {
        this.set({ connection: state });
    }

    setMicStatus(status: MicStatus): void {
        this.set({ media: { ...this.state.media, mic: status } as MediaState });
    }

    /** Release every pending timer (used in tests / hot reload hygiene). */
    dispose(): void {
        this.timers.forEach((timer) => clearTimeout(timer));
        this.timers.clear();
    }
}

/** Canonical module-scoped owner so a live call survives route navigation. */
export const workspaceState = new MockWorkspaceState();
