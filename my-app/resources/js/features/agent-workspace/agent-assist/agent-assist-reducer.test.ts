import { describe, expect, it } from 'vitest';
import { INITIAL_ASSIST_STATE, assistReducer } from './agent-assist-reducer';
import type { TranscriptSegment } from './agent-assist-types';

function seg(partial: Partial<TranscriptSegment> & { id: string; text: string }): TranscriptSegment {
    return {
        speaker: 'customer',
        status: 'final',
        startedAt: Date.now(),
        language: { code: 'sw', label: 'Swahili' },
        ...partial,
    };
}

describe('assistReducer transcript reconciliation', () => {
    it('interim add appends', () => {
        let s = assistReducer(INITIAL_ASSIST_STATE, { type: 'SESSION_START', callId: 'c1', sessionId: 's1' });
        s = assistReducer(s, {
            type: 'TRANSCRIPT_SEGMENT',
            segment: seg({ id: 'seg-1', text: 'Nahitaji msaada', status: 'interim', startedAt: 1000 }),
        });
        expect(s.segments).toHaveLength(1);
        expect(s.segments[0]?.text).toBe('Nahitaji msaada');
    });

    it('interim replace same id replaces text', () => {
        let s = assistReducer(INITIAL_ASSIST_STATE, { type: 'SESSION_START', callId: 'c1', sessionId: 's1' });
        s = assistReducer(s, {
            type: 'TRANSCRIPT_SEGMENT',
            segment: seg({ id: 'seg-1', text: 'Nahitaji msaada', status: 'interim', startedAt: 1000 }),
        });
        s = assistReducer(s, {
            type: 'TRANSCRIPT_SEGMENT',
            segment: seg({ id: 'seg-1', text: 'Nahitaji msaada na malipo', status: 'interim', startedAt: 1000 }),
        });
        expect(s.segments).toHaveLength(1);
        expect(s.segments[0]?.text).toBe('Nahitaji msaada na malipo');
    });

    it('same-id final replaces interim', () => {
        let s = assistReducer(INITIAL_ASSIST_STATE, { type: 'SESSION_START', callId: 'c1', sessionId: 's1' });
        s = assistReducer(s, {
            type: 'TRANSCRIPT_SEGMENT',
            segment: seg({ id: 'seg-1', text: 'Nahitaji msaada na malipo', status: 'interim', startedAt: 1000 }),
        });
        s = assistReducer(s, {
            type: 'TRANSCRIPT_SEGMENT',
            segment: seg({ id: 'seg-1', text: 'Nahitaji msaada na malipo yangu.', status: 'final', startedAt: 1000 }),
        });
        expect(s.segments[0]?.status).toBe('final');
        expect(s.segments[0]?.text).toBe('Nahitaji msaada na malipo yangu.');
    });

    it('duplicate final same text ignored', () => {
        let s = assistReducer(INITIAL_ASSIST_STATE, { type: 'SESSION_START', callId: 'c1', sessionId: 's1' });
        const final = seg({ id: 'seg-1', text: 'Nahitaji msaada na malipo yangu.', status: 'final', startedAt: 1000 });
        s = assistReducer(s, { type: 'TRANSCRIPT_SEGMENT', segment: final });
        const before = s.segments;
        s = assistReducer(s, { type: 'TRANSCRIPT_SEGMENT', segment: final });
        expect(s.segments).toBe(before); // reference equal — no change
    });

    it('reconnect replay deduped by same id+text', () => {
        let s = assistReducer(INITIAL_ASSIST_STATE, { type: 'SESSION_START', callId: 'c1', sessionId: 's1' });
        s = assistReducer(s, {
            type: 'TRANSCRIPT_SEGMENT',
            segment: seg({ id: 'seg-1', text: 'Nahitaji msaada na malipo yangu.', status: 'final', startedAt: 1000 }),
        });
        s = assistReducer(s, {
            type: 'TRANSCRIPT_SEGMENT',
            segment: seg({ id: 'seg-1', text: 'Nahitaji msaada na malipo yangu.', status: 'final', startedAt: 1000 }),
        });
        expect(s.segments).toHaveLength(1);
    });

    it('ordering by startedAt', () => {
        let s = assistReducer(INITIAL_ASSIST_STATE, { type: 'SESSION_START', callId: 'c1', sessionId: 's1' });
        s = assistReducer(s, {
            type: 'TRANSCRIPT_SEGMENT',
            segment: seg({ id: 'seg-2', text: 'second', status: 'final', startedAt: 2000 }),
        });
        s = assistReducer(s, {
            type: 'TRANSCRIPT_SEGMENT',
            segment: seg({ id: 'seg-1', text: 'first', status: 'final', startedAt: 1000 }),
        });
        expect(s.segments.map((x) => x.id)).toEqual(['seg-1', 'seg-2']);
    });

    it('session end clears transcript', () => {
        let s = assistReducer(INITIAL_ASSIST_STATE, { type: 'SESSION_START', callId: 'c1', sessionId: 's1' });
        s = assistReducer(s, {
            type: 'TRANSCRIPT_SEGMENT',
            segment: seg({ id: 'seg-1', text: 'hi', status: 'final', startedAt: 1000 }),
        });
        s = assistReducer(s, { type: 'SESSION_END' });
        expect(s.segments).toHaveLength(0);
        expect(s.sessionId).toBeNull();
        expect(s.sessionState).toBe('idle');
    });

    it('auto-open once per call on first final, respects minimize', () => {
        let s = assistReducer(INITIAL_ASSIST_STATE, { type: 'SESSION_START', callId: 'c1', sessionId: 's1' });
        expect(s.isOpen).toBe(false);
        s = assistReducer(s, {
            type: 'TRANSCRIPT_SEGMENT',
            segment: seg({ id: 'seg-1', text: 'interim', status: 'interim', startedAt: 1000 }),
        });
        expect(s.isOpen).toBe(false);
        s = assistReducer(s, {
            type: 'TRANSCRIPT_SEGMENT',
            segment: seg({ id: 'seg-1', text: 'final', status: 'final', startedAt: 1000 }),
        });
        expect(s.isOpen).toBe(true);
        expect(s.hasAutoOpened).toBe(true);
        // Minimize then new final should not reopen
        s = assistReducer(s, { type: 'MINIMIZE' });
        expect(s.isMinimized).toBe(true);
        expect(s.isOpen).toBe(false);
        s = assistReducer(s, {
            type: 'TRANSCRIPT_SEGMENT',
            segment: seg({ id: 'seg-2', text: 'another final', status: 'final', startedAt: 2000 }),
        });
        expect(s.isOpen).toBe(false);
    });

    it('new call resets hasAutoOpened', () => {
        let s = assistReducer(INITIAL_ASSIST_STATE, { type: 'SESSION_START', callId: 'c1', sessionId: 's1' });
        s = assistReducer(s, {
            type: 'TRANSCRIPT_SEGMENT',
            segment: seg({ id: 'seg-1', text: 'final', status: 'final', startedAt: 1000 }),
        });
        expect(s.hasAutoOpened).toBe(true);
        s = assistReducer(s, { type: 'SESSION_END' });
        s = assistReducer(s, { type: 'SESSION_START', callId: 'c2', sessionId: 's2' });
        expect(s.hasAutoOpened).toBe(false);
    });

    it('suggestion dedupe', () => {
        let s = assistReducer(INITIAL_ASSIST_STATE, { type: 'SESSION_START', callId: 'c1', sessionId: 's1' });
        s = assistReducer(s, { type: 'SUGGESTION', suggestion: { id: 'sug-1', type: 'recommended-response', body: 'Ask for ref' } });
        s = assistReducer(s, { type: 'SUGGESTION', suggestion: { id: 'sug-1', type: 'recommended-response', body: 'Ask for ref' } });
        expect(s.suggestions).toHaveLength(1);
    });
});
