import { describe, expect, it } from 'vitest';
import { CONSOLE_MODULES } from '@/domain/modules';
import { NAVIGATION, ROLE_CAPABILITIES } from './capabilities';
import { FLEX_DOMAINS } from './nav-domains';

describe('capabilities', () => {
    it('super-admin has all capabilities', () => {
        expect(ROLE_CAPABILITIES['super-admin']).toHaveLength(20);
        expect(ROLE_CAPABILITIES['super-admin']).toContain('tenants.manage');
    });

    it('agent has frontline capabilities', () => {
        const caps = ROLE_CAPABILITIES.agent;

        for (const c of ['agent.workspace', 'agent.dashboard.view', 'social.view', 'call.manager', 'missed-calls.view', 'troubleshooting.view', 'support.view'] as const) {
            expect(caps).toContain(c);
        }

        for (const c of ['dashboard.view', 'console.view', 'roles.manage', 'tenants.manage'] as const) {
            expect(caps).not.toContain(c);
        }
    });

    it('supervisor has operational capabilities', () => {
        const caps = ROLE_CAPABILITIES.supervisor;

        for (const c of ['dashboard.view', 'monitor.view', 'console.view', 'cdr.view', 'campaigns.view', 'campaigns.manage', 'reports.view'] as const) {
            expect(caps).toContain(c);
        }

        for (const c of ['roles.manage', 'tenants.manage', 'agent.workspace'] as const) {
            expect(caps).not.toContain(c);
        }
    });

    it('admin has supervisor set plus roles', () => {
        const caps = ROLE_CAPABILITIES.admin;

        for (const c of ['dashboard.view', 'monitor.view', 'console.view', 'cdr.view', 'campaigns.view', 'campaigns.manage', 'reports.view', 'roles.manage', 'settings.manage', 'system.view'] as const) {
            expect(caps).toContain(c);
        }

        expect(caps).not.toContain('tenants.manage');
        expect(caps).not.toContain('agent.workspace');
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

    it('domain visibility: Agent sees only Agent', () => {
        const caps = ROLE_CAPABILITIES.agent;
        const has = (c: string) => (caps as string[]).includes(c);
        const visible = FLEX_DOMAINS.filter((d) => has(d.capability)).map((d) => d.id);
        expect(visible).toEqual(['agent']);
    });

    it('domain visibility: Supervisor sees Supervision+Administration', () => {
        const caps = ROLE_CAPABILITIES.supervisor;
        const has = (c: string) => (caps as string[]).includes(c);
        const visible = FLEX_DOMAINS.filter((d) => has(d.capability)).map((d) => d.id);
        expect(visible).toEqual(expect.arrayContaining(['supervision', 'administration']));
        expect(visible).not.toContain('platform');
        expect(visible).not.toContain('agent');
    });

    it('domain visibility: Admin sees Supervision+Administration but not Platform', () => {
        const caps = ROLE_CAPABILITIES.admin;
        const has = (c: string) => (caps as string[]).includes(c);
        const visible = FLEX_DOMAINS.filter((d) => has(d.capability)).map((d) => d.id);
        expect(visible).toEqual(expect.arrayContaining(['supervision', 'administration']));
        expect(visible).not.toContain('platform');
        expect(visible).not.toContain('agent');
    });

    it('domain visibility: Super Admin sees all', () => {
        const caps = ROLE_CAPABILITIES['super-admin'];
        const has = (c: string) => (caps as string[]).includes(c);
        const visible = FLEX_DOMAINS.filter((d) => has(d.capability)).map((d) => d.id);
        expect(visible.sort()).toEqual(['administration', 'agent', 'platform', 'supervision'].sort());
    });

    it('Platform domain gated by tenants.manage (not roles.manage)', () => {
        expect(FLEX_DOMAINS.find((d) => d.id === 'platform')?.capability).toBe('tenants.manage');
    });

    it('Management Console module gating', () => {
        const hasSupervisor = (c: string) => (ROLE_CAPABILITIES.supervisor as string[]).includes(c);
        const hasAdmin = (c: string) => (ROLE_CAPABILITIES.admin as string[]).includes(c);
        const hasSuper = (c: string) => (ROLE_CAPABILITIES['super-admin'] as string[]).includes(c);
        const visibleFor = (has: (c: string) => boolean) =>
            CONSOLE_MODULES.filter((m) => !m.capability || has(m.capability)).map((m) => m.id);
        // Users should be visible to supervisor via console.view
        expect(visibleFor(hasSupervisor)).toContain('users');
        expect(visibleFor(hasSupervisor)).not.toContain('tenants');
        expect(visibleFor(hasSupervisor)).not.toContain('roles');
        expect(visibleFor(hasAdmin)).toContain('users');
        expect(visibleFor(hasAdmin)).toContain('roles');
        expect(visibleFor(hasAdmin)).not.toContain('tenants');
        expect(visibleFor(hasSuper)).toContain('tenants');
        expect(visibleFor(hasSuper)).toContain('roles');
    });
});
