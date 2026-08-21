import { describe, expect, it } from 'vitest';
import { dedupeMessages, mergeMessages } from './social-dedupe';
import type { SocialMessage } from './social-types';

const msg = (id: string, at: string): SocialMessage => ({ id, conversationId: 'c1', direction: 'inbound', body: id, createdAt: at });

describe('social dedupe', () => {
    it('dedupes by id', () => {
        const a = msg('m1', '2026-01-01T00:00:00Z');
        expect(dedupeMessages([a, a, msg('m2', '2026-01-01T00:01:00Z')])).toHaveLength(2);
    });

    it('mergeMessages orders by createdAt', () => {
        const m1 = msg('m1', '2026-01-01T00:00:00Z');
        const m2 = msg('m2', '2026-01-01T00:02:00Z');
        const incoming = msg('m3', '2026-01-01T00:01:00Z');
        expect(mergeMessages([m1, m2], [incoming]).map((m) => m.id)).toEqual(['m1', 'm3', 'm2']);
    });
});
