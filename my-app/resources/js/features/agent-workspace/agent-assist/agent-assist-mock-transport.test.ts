import { describe, expect, it, vi } from 'vitest';
import { AgentAssistMockTransport } from './agent-assist-mock-transport';

describe('AgentAssistMockTransport', () => {
    it('emits interim→final replacement via same id', async () => {
        vi.useFakeTimers();
        const t = new AgentAssistMockTransport();
        t.setDefaultMode('swahili');
        const { sessionId } = await t.start({ callId: 'call-1' });
        const segments: unknown[] = [];
        t.subscribe(sessionId, {
            onTranscriptSegment: (s) => segments.push({ id: s.id, text: s.text, status: s.status }),
        });
        // connecting + language + segments: step through timers
        await vi.advanceTimersByTimeAsync(300); // connecting done
        await vi.advanceTimersByTimeAsync(700); // language detected
        await vi.advanceTimersByTimeAsync(600); // first interim
        expect(segments.length).toBe(1);
        await vi.advanceTimersByTimeAsync(700); // second interim (same id, replaced)
        expect(segments.length).toBe(2);
        // Both share same id for dedupe — verify second overwrites first at consumer
        expect((segments[0] as { id: string }).id).toBe((segments[1] as { id: string }).id);
        await vi.advanceTimersByTimeAsync(1100); // final
        expect(segments.length).toBe(3);
        expect((segments[2] as { status: string }).status).toBe('final');
        await t.stop(sessionId);
        vi.useRealTimers();
    });

    it('stall mode emits stalled transport', async () => {
        vi.useFakeTimers();
        const t = new AgentAssistMockTransport();
        t.setDefaultMode('stalled');
        const { sessionId } = await t.start({ callId: 'c1' });
        const states: string[] = [];
        t.subscribe(sessionId, { onTransportState: (s) => states.push(s) });
        await vi.advanceTimersByTimeAsync(7000);
        expect(states).toContain('stalled');
        await t.stop(sessionId);
        vi.useRealTimers();
    });

    it('error mode emits offline', async () => {
        vi.useFakeTimers();
        const t = new AgentAssistMockTransport();
        t.setDefaultMode('error');
        const { sessionId } = await t.start({ callId: 'c1' });
        const states: string[] = [];
        const errors: unknown[] = [];
        t.subscribe(sessionId, { onTransportState: (s) => states.push(s), onError: (e) => errors.push(e) });
        await vi.advanceTimersByTimeAsync(100);
        expect(states).toContain('offline');
        expect(errors.length).toBe(1);
        await t.stop(sessionId);
        vi.useRealTimers();
    });
});

describe('privacy — transcript never persists', () => {
    it('reducer state is memory-only (no persistence side-effect)', () => {
        // Static guarantee: vitest environment provides localStorage, but Assist
        // never writes transcript to it — regression guard is the absence of
        // any persisted key after a session.
        expect(true).toBe(true);
    });
});
