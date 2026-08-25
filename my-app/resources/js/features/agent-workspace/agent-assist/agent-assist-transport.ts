import type {
    AssistLanguageState,
    AssistSuggestion,
    AssistTransportState,
    TranscriptSegment,
    AssistRuntimeError,
} from './agent-assist-types';

export interface AgentAssistEventHandlers {
    onTransportState?: (state: AssistTransportState) => void;
    onTranscriptSegment?: (segment: TranscriptSegment) => void;
    onLanguage?: (language: AssistLanguageState) => void;
    onSuggestion?: (suggestion: AssistSuggestion) => void;
    onError?: (error: AssistRuntimeError) => void;
}

export interface AgentAssistTransport {
    start(input: { callId: string }): Promise<{ sessionId: string }>;
    subscribe(sessionId: string, handlers: AgentAssistEventHandlers): () => void;
    stop(sessionId: string): Promise<void>;
}
