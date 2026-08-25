import type {
    AssistLanguageState,
    AssistRuntimeError,
    AssistSessionState,
    AssistSuggestion,
    AssistTransportState,
    TranscriptSegment,
} from './agent-assist-types';

export interface AssistState {
    sessionId: string | null;
    callId: string | null;
    sessionState: AssistSessionState;
    transportState: AssistTransportState;
    language: AssistLanguageState;
    segments: TranscriptSegment[];
    suggestions: AssistSuggestion[];
    error: AssistRuntimeError | null;
    isOpen: boolean;
    isMinimized: boolean;
    hasAutoOpened: boolean;
}

export const INITIAL_ASSIST_STATE: AssistState = {
    sessionId: null,
    callId: null,
    sessionState: 'idle',
    transportState: 'disconnected',
    language: { code: 'und', label: 'Detecting language…', isDetecting: true },
    segments: [],
    suggestions: [],
    error: null,
    isOpen: false,
    isMinimized: false,
    hasAutoOpened: false,
};

export type AssistAction =
    | { type: 'SESSION_START'; callId: string; sessionId: string }
    | { type: 'SESSION_END' }
    | { type: 'TRANSPORT_STATE'; state: AssistTransportState }
    | { type: 'LANGUAGE'; language: AssistLanguageState }
    | { type: 'TRANSCRIPT_SEGMENT'; segment: TranscriptSegment }
    | { type: 'SUGGESTION'; suggestion: AssistSuggestion }
    | { type: 'SUGGESTION_DISMISS'; id: string }
    | { type: 'ERROR'; error: AssistRuntimeError }
    | { type: 'OPEN' }
    | { type: 'MINIMIZE' }
    | { type: 'RESTORE' }
    | { type: 'CLOSE' };

function upsertSegment(segments: TranscriptSegment[], segment: TranscriptSegment): TranscriptSegment[] {
    const idx = segments.findIndex((s) => s.id === segment.id);
    if (idx !== -1) {
        const existing = segments[idx] as TranscriptSegment;
        if (existing.text === segment.text && existing.status === segment.status) {
            return segments;
        }

        const next = [...segments];
        // Final replaces interim; interim replaces interim
        next[idx] = segment;
        // Keep sort stable by startedAt then id
        next.sort((a, b) => a.startedAt - b.startedAt || a.id.localeCompare(b.id));
        return next;
    }

    const next = [...segments, segment];
    next.sort((a, b) => a.startedAt - b.startedAt || a.id.localeCompare(b.id));
    return next;
}

export function assistReducer(state: AssistState, action: AssistAction): AssistState {
    switch (action.type) {
        case 'SESSION_START':
            return {
                ...INITIAL_ASSIST_STATE,
                callId: action.callId,
                sessionId: action.sessionId,
                sessionState: 'starting',
                transportState: 'connecting',
                language: { code: 'und', label: 'Detecting language…', isDetecting: true },
            };
        case 'SESSION_END':
            return { ...INITIAL_ASSIST_STATE };
        case 'TRANSPORT_STATE': {
            let sessionState = state.sessionState;
            if (state.sessionState === 'starting' && action.state === 'streaming') {
                sessionState = 'active';
            }
            if (action.state === 'offline' || action.state === 'stalled') {
                // session stays active but transport reflects issue
            }
            return { ...state, transportState: action.state, sessionState };
        }
        case 'LANGUAGE':
            return { ...state, language: action.language };
        case 'TRANSCRIPT_SEGMENT': {
            const segments = upsertSegment(state.segments, action.segment);
            const didChange = segments !== state.segments;
            if (!didChange) {
                return state;
            }
            // Auto-open once per call when first final becomes useful
            let isOpen = state.isOpen;
            let hasAutoOpened = state.hasAutoOpened;
            if (!state.hasAutoOpened && !state.isMinimized && action.segment.status === 'final') {
                isOpen = true;
                hasAutoOpened = true;
            }
            // Transition starting→active on first streaming segment if not already
            let sessionState = state.sessionState;
            if (state.sessionState === 'starting' && state.transportState === 'streaming') {
                sessionState = 'active';
            } else if (state.sessionState === 'starting') {
                sessionState = 'active';
            }
            return { ...state, segments, isOpen, hasAutoOpened, sessionState };
        }
        case 'SUGGESTION': {
            if (state.suggestions.some((s) => s.id === action.suggestion.id)) {
                return state;
            }

            return { ...state, suggestions: [...state.suggestions, action.suggestion] };
        }
        case 'SUGGESTION_DISMISS':
            return { ...state, suggestions: state.suggestions.filter((s) => s.id !== action.id) };
        case 'ERROR':
            return { ...state, error: action.error, sessionState: 'error', transportState: 'offline' };
        case 'OPEN':
            return { ...state, isOpen: true, isMinimized: false };
        case 'MINIMIZE':
            return { ...state, isOpen: false, isMinimized: true };
        case 'RESTORE':
            return { ...state, isOpen: true, isMinimized: false };
        case 'CLOSE':
            return { ...state, isOpen: false, isMinimized: false };
        default:
            return state;
    }
}
