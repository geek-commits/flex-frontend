import { describe, expect, it } from 'vitest';
import { NAVIGATION, ROLE_CAPABILITIES } from './capabilities';

describe('capabilities', () => {
    it('super-admin has all capabilities', () => {
        expect(ROLE_CAPABILITIES['super-admin']).toHaveLength(19);
    });

    it('admin does not have agent.workspace', () => {
        expect(ROLE_CAPABILITIES.admin).not.toContain('agent.workspace');
        expect(ROLE_CAPABILITIES.admin).toContain('dashboard.view');
    });

    it('agent does not have console.view', () => {
        expect(ROLE_CAPABILITIES.agent).not.toContain('console.view');
        expect(ROLE_CAPABILITIES.agent).toContain('social.view');
    });

    it('NAVIGATION entries all reference a known capability', () => {
        const all = new Set(ROLE_CAPABILITIES['super-admin']);
        for (const entry of NAVIGATION) {
            expect(all.has(entry.capability), `${entry.title} capability ${entry.capability} must be in ALL`).toBe(true);
        }
    });

    it('NAVIGATION workspace values are valid', () => {
        for (const entry of NAVIGATION) {
            expect(['admin', 'agent', 'shared'].includes(entry.workspace)).toBe(true);
        }
    });
});
