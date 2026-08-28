/**
 * Social message dedupe + ordering helper — Increment 3.
 * Pure helpers, Vitest-covered, no fetch.
 */

import type { SocialMessage } from './social-types';

export function dedupeMessages(messages: SocialMessage[]): SocialMessage[] {
    const seen = new Set<string>();
    const out: SocialMessage[] = [];

    for (const m of messages) {
        if (!seen.has(m.id)) {
            seen.add(m.id);
            out.push(m);
        }
    }

    return out;
}

export function mergeMessages(existing: SocialMessage[], incoming: SocialMessage[]): SocialMessage[] {
    // Incoming is already ordered by server createdAt; merge keeps existing order + appends deduped incoming.
    return dedupeMessages([...existing, ...incoming].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
}
