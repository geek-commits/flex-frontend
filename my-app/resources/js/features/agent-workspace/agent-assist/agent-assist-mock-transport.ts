import type { AgentAssistEventHandlers, AgentAssistTransport } from './agent-assist-transport';
import type { AssistLanguageState, TranscriptSegment, AssistSuggestion } from './agent-assist-types';

/**
 * Deterministic mock transport — implements the same contract as the future
 * backend transport. Emits interim→final transcript mutation, language
 * detection, suggestions, and transport state transitions without logging
 * transcript text.
 */

export type MockFixtureMode = 'swahili' | 'english' | 'french' | 'code-switch' | 'error' | 'stalled';

interface MockFixture {
    language: AssistLanguageState;
    segments: Array<{ text: string; speaker: TranscriptSegment['speaker']; status: TranscriptSegment['status']; suggestion?: AssistSuggestion }>;
}

const FIXTURES: Record<MockFixtureMode, MockFixture> = {
    swahili: {
        language: { code: 'sw', label: 'Swahili', isDetecting: false },
        segments: [
            { text: 'Nahitaji msaada', speaker: 'customer', status: 'interim' },
            { text: 'Nahitaji msaada na malipo', speaker: 'customer', status: 'interim' },
            { text: 'Nahitaji msaada na malipo yangu.', speaker: 'customer', status: 'final' },
            {
                text: 'Naomba namba ya kumbukumbu ya malipo.',
                speaker: 'agent',
                status: 'final',
                suggestion: {
                    id: 'sug-1',
                    type: 'recommended-response',
                    body: 'Ask for the payment reference.',
                    sourceLabel: 'Payments KB',
                },
            },
            { text: 'Nilituma jana kupitia M-Pesa.', speaker: 'customer', status: 'final' },
        ],
    },
    english: {
        language: { code: 'en', label: 'English', isDetecting: false },
        segments: [
            { text: 'I need help', speaker: 'customer', status: 'interim' },
            { text: 'I need help with my payment.', speaker: 'customer', status: 'final' },
            {
                text: 'Could you share the payment reference?',
                speaker: 'agent',
                status: 'final',
                suggestion: { id: 'sug-1', type: 'recommended-response', body: 'Ask for the payment reference.', sourceLabel: 'Payments KB' },
            },
        ],
    },
    french: {
        language: { code: 'fr', label: 'French', isDetecting: false },
        segments: [
            { text: "J'ai besoin d'aide", speaker: 'customer', status: 'interim' },
            { text: "J'ai besoin d'aide pour mon paiement.", speaker: 'customer', status: 'final' },
        ],
    },
    'code-switch': {
        language: { code: 'sw', label: 'Swahili', isDetecting: false },
        segments: [
            { text: 'Nahitaji msaada na malipo.', speaker: 'customer', status: 'final' },
            { text: 'Can you help me in English?', speaker: 'customer', status: 'final' },
        ],
    },
    error: {
        language: { code: 'sw', label: 'Swahili', isDetecting: false },
        segments: [],
    },
    stalled: {
        language: { code: 'sw', label: 'Swahili', isDetecting: false },
        segments: [
            { text: 'Nahitaji msaada', speaker: 'customer', status: 'interim' },
            // Intentionally stalls after interim — no final
        ],
    },
};

interface ActiveSession {
    sessionId: string;
    callId: string;
    mode: MockFixtureMode;
    handlers: Set<AgentAssistEventHandlers>;
    timers: Set<ReturnType<typeof setTimeout>>;
    started: boolean;
}

export function getMockFixture(mode: MockFixtureMode): MockFixture {
    return FIXTURES[mode];
}

export class AgentAssistMockTransport implements AgentAssistTransport {
    private sessions = new Map<string, ActiveSession>();
    private defaultMode: MockFixtureMode = 'swahili';

    setDefaultMode(mode: MockFixtureMode) {
        this.defaultMode = mode;
    }

    async start(input: { callId: string }): Promise<{ sessionId: string }> {
        const sessionId = `assist-${input.callId}-${Date.now()}`;
        const session: ActiveSession = {
            sessionId,
            callId: input.callId,
            mode: this.defaultMode,
            handlers: new Set(),
            timers: new Set(),
            started: false,
        };
        this.sessions.set(sessionId, session);

        // Error failure is emitted on subscribe/pump, not here

        return { sessionId };
    }

    subscribe(sessionId: string, handlers: AgentAssistEventHandlers): () => void {
        const session = this.sessions.get(sessionId);
        if (!session) {
            return () => {};
        }

        session.handlers.add(handlers);

        if (!session.started) {
            session.started = true;
            this.pumpSession(session);
        }

        return () => {
            session.handlers.delete(handlers);
        };
    }

    async stop(sessionId: string): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (!session) {
            return;
        }
        for (const t of session.timers) {
            clearTimeout(t);
        }
        session.timers.clear();
        this.sessions.delete(sessionId);
    }

    private pumpSession(session: ActiveSession) {
        const fixture = FIXTURES[session.mode];

        // Handle error mode — emit offline/error without connecting flow
        if (session.mode === 'error') {
            this.emitForSession(session, (h) => h.onTransportState?.('offline'));
            this.emitForSession(session, (h) =>
                h.onError?.({ code: 'assist_session_start_failed', message: 'Assist unavailable for this call.' }),
            );
            return;
        }

        // Transport state: connecting → streaming
        this.emitForSession(session, (h) => h.onTransportState?.('connecting'));
        this.schedule(session, 300, () => {
            this.emitForSession(session, (h) => h.onTransportState?.('streaming'));
        });

        // Language: detecting → detected
        this.emitForSession(session, (h) =>
            h.onLanguage?.({ code: 'und', label: 'Detecting language…', isDetecting: true }),
        );
        this.schedule(session, 900, () => {
            this.emitForSession(session, (h) => h.onLanguage?.(fixture.language));
        });

        // Handle stalled mode — emit interim then stall marker
        if (session.mode === 'stalled') {
            this.schedule(session, 1400, () => {
                const seg = fixture.segments[0];
                if (!seg) {
                    return;
                }
                const segment: TranscriptSegment = {
                    id: `seg-${session.sessionId}-0`,
                    speaker: seg.speaker,
                    text: seg.text,
                    language: { code: fixture.language.code, label: fixture.language.label },
                    status: seg.status,
                    startedAt: Date.now(),
                };

                this.emitForSession(session, (h) => h.onTranscriptSegment?.(segment));
            });
            this.schedule(session, 6000, () => {
                this.emitForSession(session, (h) => h.onTransportState?.('stalled'));
            });

            return;
        }

        // Normal streaming segments
        let delay = 1600;
        const baseStartedAt = Date.now();
        fixture.segments.forEach((seg, idx) => {
            // For the first segment which has two interims, emit them spaced
            if (idx === 0 && fixture.segments.length > 1 && fixture.segments[1]?.status === 'interim') {
                // Interim steps already modeled as separate entries — emit sequentially
            }
            this.schedule(session, delay, () => {
                const segment: TranscriptSegment = {
                    id: `seg-${session.sessionId}-${seg.status === 'interim' && idx < 2 ? 0 : idx}`,
                    speaker: seg.speaker,
                    text: seg.text,
                    language: { code: fixture.language.code, label: fixture.language.label },
                    status: seg.status,
                    startedAt: baseStartedAt + idx * 100,
                    endedAt: seg.status === 'final' ? Date.now() : undefined,
                };

                // Special handling: first two swahili interims share same id for replacement
                if (session.mode === 'swahili' && idx < 3) {
                    segment.id = `seg-${session.sessionId}-0`;
                }

                this.emitForSession(session, (h) => h.onTranscriptSegment?.(segment));

                if (seg.suggestion) {
                    this.emitForSession(session, (h) => h.onSuggestion?.(seg.suggestion!));
                }
            });
            delay += seg.status === 'interim' ? 700 : 1100;
        });

        // Simulate a reconnect window: emit transport reconnecting at ~8s, then replay final dups
        this.schedule(session, 8500, () => {
            const currentHandlers = [...session.handlers];
            if (currentHandlers.length === 0) {
                return;
            }

            this.emitForSession(session, (h) => h.onTransportState?.('reconnecting'));
            this.schedule(session, 1200, () => {
                this.emitForSession(session, (h) => h.onTransportState?.('streaming'));
                // Replayed finals — should be deduped by reconciliation
                fixture.segments
                    .filter((s) => s.status === 'final')
                    .slice(0, 1)
                    .forEach((seg) => {
                        const segment: TranscriptSegment = {
                            id: `seg-${session.sessionId}-0`,
                            speaker: seg.speaker,
                            text: seg.text,
                            language: { code: fixture.language.code, label: fixture.language.label },
                            status: 'final',
                            startedAt: baseStartedAt,
                            endedAt: Date.now(),
                        };

                        this.emitForSession(session, (h) => h.onTranscriptSegment?.(segment));
                    });
            });
        });
    }

    private schedule(session: ActiveSession, ms: number, fn: () => void) {
        const t = setTimeout(() => {
            session.timers.delete(t);
            fn();
        }, ms);
        session.timers.add(t);
    }

    private emitForSession(session: ActiveSession, fn: (h: AgentAssistEventHandlers) => void) {
        for (const h of [...session.handlers]) {
            try {
                fn(h);
            } catch {
                // Isolate handler failure — transport never degrades telephony
            }
        }
    }
}

/** Default singleton for the POC */
export const agentAssistMockTransport = new AgentAssistMockTransport();
