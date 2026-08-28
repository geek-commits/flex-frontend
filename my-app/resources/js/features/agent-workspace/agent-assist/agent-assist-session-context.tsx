 
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { useWorkspaceState } from '@/features/agent-workspace/state/use-workspace-state';
import { agentAssistMockTransport } from './agent-assist-mock-transport';
import { assistReducer, INITIAL_ASSIST_STATE  } from './agent-assist-reducer';
import type {AssistState} from './agent-assist-reducer';
import type { AgentAssistTransport } from './agent-assist-transport';

interface AgentAssistSessionContextValue extends AssistState {
    openAssist: () => void;
    minimizeAssist: () => void;
    restoreAssist: () => void;
    closeAssist: () => void;
    dismissSuggestion: (id: string) => void;
}

const AgentAssistSessionContext = createContext<AgentAssistSessionContextValue | null>(null);

export function AgentAssistSessionProvider({
    children,
    transport = agentAssistMockTransport,
}: {
    children: React.ReactNode;
    transport?: AgentAssistTransport;
}) {
    const [state, dispatch] = useReducer(assistReducer, INITIAL_ASSIST_STATE);
    const { callState, activeCall } = useWorkspaceState();
    const sessionRef = useRef<{ sessionId: string; callId: string; unsubscribe: (() => void) | null } | null>(null);

    // Active call is the lifecycle boundary — no call means no session (call-scoped per ADR-004)
    const activeCallId = activeCall?.id ?? null;
    const hasCall = callState === 'connected' || callState === 'hold' || callState === 'transferring';

    useEffect(() => {
        // No call → teardown if session exists
        if (!hasCall || !activeCallId) {
            if (sessionRef.current) {
                const { sessionId, unsubscribe } = sessionRef.current;

                try {
                    unsubscribe?.();
                } catch {
                    // transport never degrades telephony
                }

                void transport.stop(sessionId).catch(() => {});
                sessionRef.current = null;
                dispatch({ type: 'SESSION_END' });
            }

            return;
        }

        // Same call ID → same session
        if (sessionRef.current?.callId === activeCallId) {
            return;
        }

        // Different call ID → teardown old + start new
        const kickoff = async () => {
            if (sessionRef.current) {
                const { sessionId, unsubscribe } = sessionRef.current;

                try {
                    unsubscribe?.();
                } catch {
 void 0; 
}

                await transport.stop(sessionId).catch(() => {});
                sessionRef.current = null;
            }

            try {
                const { sessionId } = await transport.start({ callId: activeCallId });

                sessionRef.current = { sessionId, callId: activeCallId, unsubscribe: null };
                dispatch({ type: 'SESSION_START', callId: activeCallId, sessionId });

                const unsubscribe = transport.subscribe(sessionId, {
                    onTransportState: (s) => dispatch({ type: 'TRANSPORT_STATE', state: s }),
                    onTranscriptSegment: (segment) => dispatch({ type: 'TRANSCRIPT_SEGMENT', segment }),
                    onLanguage: (language) => dispatch({ type: 'LANGUAGE', language }),
                    onSuggestion: (suggestion) => dispatch({ type: 'SUGGESTION', suggestion }),
                    onError: (error) => dispatch({ type: 'ERROR', error }),
                });

                if (sessionRef.current) {
                    sessionRef.current.unsubscribe = unsubscribe;
                }
            } catch {
                dispatch({
                    type: 'ERROR',
                    error: { code: 'assist_session_start_failed', message: 'Assist unavailable for this call.' },
                });
            }
        };

        void kickoff();

        // Cleanup not needed here — hasCall guard handles teardown
    }, [hasCall, activeCallId, transport]);

    // Ensure teardown on unmount
    useEffect(() => {
        return () => {
            if (sessionRef.current) {
                const { sessionId, unsubscribe } = sessionRef.current;

                try {
                    unsubscribe?.();
                } catch {
 void 0; 
}

                void transport.stop(sessionId).catch(() => {});
                sessionRef.current = null;
            }
        };
    }, [transport]);

    const openAssist = useCallback(() => dispatch({ type: 'OPEN' }), []);
    const minimizeAssist = useCallback(() => dispatch({ type: 'MINIMIZE' }), []);
    const restoreAssist = useCallback(() => dispatch({ type: 'RESTORE' }), []);
    const closeAssist = useCallback(() => dispatch({ type: 'CLOSE' }), []);
    const dismissSuggestion = useCallback((id: string) => dispatch({ type: 'SUGGESTION_DISMISS', id }), []);

    const value = useMemo<AgentAssistSessionContextValue>(
        () => ({
            ...state,
            openAssist,
            minimizeAssist,
            restoreAssist,
            closeAssist,
            dismissSuggestion,
        }),
        [state, openAssist, minimizeAssist, restoreAssist, closeAssist, dismissSuggestion],
    );

    return <AgentAssistSessionContext.Provider value={value}>{children}</AgentAssistSessionContext.Provider>;
}

export function useAgentAssistSession(): AgentAssistSessionContextValue {
    const ctx = useContext(AgentAssistSessionContext);

    if (!ctx) {
        throw new Error('useAgentAssistSession must be used within AgentAssistSessionProvider');
    }

    return ctx;
}

/** Safe hook that returns null when outside provider (e.g. tests) */
export function useAgentAssistSessionOptional(): AgentAssistSessionContextValue | null {
    return useContext(AgentAssistSessionContext);
}
