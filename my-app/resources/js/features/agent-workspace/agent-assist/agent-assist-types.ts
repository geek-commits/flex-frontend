/**
 * Agent Assist domain contracts — backend-ready, call-scoped.
 *
 * Session is owned by the active call (ADR-001 via `workspaceState`).
 * No call → no session. Transport is replaceable (mock now, WebSocket/SSE later).
 * Transcript never persists beyond memory.
 */

export type AssistSessionState = 'idle' | 'starting' | 'active' | 'error' | 'ended';

export type AssistTransportState =
    | 'disconnected'
    | 'connecting'
    | 'streaming'
    | 'reconnecting'
    | 'stalled'
    | 'offline';

export interface AssistLanguageState {
    /** BCP-47 or product code, e.g. 'sw', 'en', 'fr', 'ar' */
    code: string;
    /** Display label, e.g. 'Swahili' */
    label: string;
    /** Whether detection is still in progress for the current call */
    isDetecting: boolean;
}

export interface TranscriptSegment {
    /** Stable identity for reconciliation — same id interim→final replaces */
    id: string;
    speaker: 'customer' | 'agent';
    text: string;
    language: {
        code: string;
        label: string;
    };
    status: 'interim' | 'final';
    startedAt: number;
    endedAt?: number;
}

export interface AssistSuggestion {
    id: string;
    type: 'recommended-response' | 'knowledge' | 'next-action';
    title?: string;
    body: string;
    sourceLabel?: string;
}

export interface AssistRuntimeError {
    code: string;
    message: string;
}

/** Composite snapshot exposed to UI via session context */
export interface AssistSnapshot {
    sessionId: string | null;
    callId: string | null;
    sessionState: AssistSessionState;
    transportState: AssistTransportState;
    language: AssistLanguageState;
    segments: TranscriptSegment[];
    suggestions: AssistSuggestion[];
    error: AssistRuntimeError | null;
    /** Presentation: is the dock/sheet open while a session exists */
    isOpen: boolean;
    /** Minimized preserves same session for the call's lifetime */
    isMinimized: boolean;
}

/** @deprecated legacy placeholder — kept for Transitional compat, remove after dock cutover */
export const ASSIST_PANEL_META = {
    notModeled: { status: 'Not modeled', title: '', description: '' },
} as const;
export type AssistPanelState = 'notModeled';
