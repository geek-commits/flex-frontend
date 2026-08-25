import { describe, expect, it } from 'vitest';
import { NAVIGATION, ROLE_CAPABILITIES } from './capabilities';
import { FLEX_DOMAINS, isActiveRoute } from './nav-domains';
import { CONSOLE_MODULES } from '@/domain/modules';

function visibleHrefsForRole(role: keyof typeof ROLE_CAPABILITIES) {
    const caps = ROLE_CAPABILITIES[role];
    const has = (c: string) => (caps as string[]).includes(c);
    return FLEX_DOMAINS.flatMap((domain) =>
        !has(domain.capability)
            ? []
            : domain.groups.flatMap((group) =>
                  group.items.filter((item) => !item.capability || has(item.capability)).map((i) => i.href),
              ),
    );
}

function visibleGroupsForDomain(domainId: string, role: keyof typeof ROLE_CAPABILITIES) {
    const domain = FLEX_DOMAINS.find((d) => d.id === domainId);
    const caps = ROLE_CAPABILITIES[role];
    const has = (c: string) => (caps as string[]).includes(c);
    if (!domain || !has(domain.capability)) {
        return [];
    }

    return domain.groups
        .map((g) => ({
            groupTitle: g.groupTitle,
            hrefs: g.items.filter((i) => !i.capability || has(i.capability)).map((i) => i.href),
        }))
        .filter((g) => g.hrefs.length > 0);
}

describe('nav shell parity', () => {
    describe('domain rail visibility (plan 57)', () => {
        it('agent sees only Agent', () => {
            expect(visibleHrefsForRole('agent').length).toBeGreaterThan(0);
            const caps = ROLE_CAPABILITIES.agent;
            const has = (c: string) => (caps as string[]).includes(c);
            const domains = FLEX_DOMAINS.filter((d) => has(d.capability)).map((d) => d.id);
            expect(domains).toEqual(['agent']);
        });

        it('supervisor sees Supervision+Administration, not Agent/Platform', () => {
            const caps = ROLE_CAPABILITIES.supervisor;
            const has = (c: string) => (caps as string[]).includes(c);
            const domains = FLEX_DOMAINS.filter((d) => has(d.capability)).map((d) => d.id);
            expect(domains).toEqual(expect.arrayContaining(['supervision', 'administration']));
            expect(domains).not.toContain('agent');
            expect(domains).not.toContain('platform');
        });

        it('admin sees Supervision+Administration, not Platform', () => {
            const caps = ROLE_CAPABILITIES.admin;
            const has = (c: string) => (caps as string[]).includes(c);
            const domains = FLEX_DOMAINS.filter((d) => has(d.capability)).map((d) => d.id);
            expect(domains).toEqual(expect.arrayContaining(['supervision', 'administration']));
            expect(domains).not.toContain('platform');
            expect(domains).not.toContain('agent');
        });

        it('super-admin sees all four domains', () => {
            const caps = ROLE_CAPABILITIES['super-admin'];
            const has = (c: string) => (caps as string[]).includes(c);
            const domains = FLEX_DOMAINS.filter((d) => has(d.capability)).map((d) => d.id);
            expect(new Set(domains)).toEqual(new Set(['agent', 'supervision', 'administration', 'platform']));
        });
    });

    describe('agent sidebar (plan 58)', () => {
        it('contains expected agent routes', () => {
            const hrefs = new Set(visibleHrefsForRole('agent'));
            for (const href of ['/agent/dashboard', '/agent', '/agent/social', '/agent/missed-calls', '/agent/troubleshooting', '/agent/support']) {
                expect(hrefs.has(href), `agent should see ${href}`).toBe(true);
            }
        });

        it('labels Callback & Voicemail, not Missed Calls', () => {
            const agentDomain = FLEX_DOMAINS.find((d) => d.id === 'agent');
            const titles = agentDomain?.groups.flatMap((g) => g.items.map((i) => i.title)) ?? [];
            expect(titles).toContain('Callback & Voicemail');
            expect(titles).not.toContain('Missed Calls');
        });
    });

    describe('supervisor administration sidebar (plan 59)', () => {
        it('visible contains operational subset', () => {
            const hrefs = new Set(visibleHrefsForRole('supervisor'));
            for (const h of ['/admin/console', '/admin/users', '/admin/queues', '/admin/ivr', '/admin/time-groups', '/admin/time-conditions', '/admin/recordings']) {
                expect(hrefs.has(h), `supervisor visible ${h}`).toBe(true);
            }
        });

        it('hidden does not contain administrator-only routes', () => {
            const hrefs = new Set(visibleHrefsForRole('supervisor'));
            for (const h of ['/admin/roles', '/admin/subscription', '/admin/mail-config', '/admin/system', '/admin/ai', '/admin/tenants']) {
                expect(hrefs.has(h), `supervisor hidden ${h}`).toBe(false);
            }
        });

        it('administration grouping for supervisor has 5 groups (Overview, People, Routing, Media) without System', () => {
            const groups = visibleGroupsForDomain('administration', 'supervisor');
            const titles = groups.map((g) => g.groupTitle);
            expect(titles).toContain('Overview');
            expect(titles).toContain('People');
            expect(titles).toContain('Routing');
            expect(titles).toContain('Media');
            expect(titles).not.toContain('System');
        });
    });

    describe('administrator sidebar (plan 60)', () => {
        it('visible contains full administration', () => {
            const hrefs = new Set(visibleHrefsForRole('admin'));
            for (const h of [
                '/admin/console',
                '/admin/users',
                '/admin/roles',
                '/admin/queues',
                '/admin/ivr',
                '/admin/time-groups',
                '/admin/time-conditions',
                '/admin/recordings',
                '/admin/subscription',
                '/admin/mail-config',
                '/admin/system',
                '/admin/ai',
            ]) {
                expect(hrefs.has(h), `admin visible ${h}`).toBe(true);
            }
        });

        it('hidden does not contain Platform', () => {
            const hrefs = new Set(visibleHrefsForRole('admin'));
            expect(hrefs.has('/admin/tenants')).toBe(false);
        });
    });

    describe('FLEX_DOMAINS canonical parity', () => {
        it('NAVIGATION is derived from FLEX_DOMAINS (plus Settings)', () => {
            const derivedHrefs = new Set(FLEX_DOMAINS.flatMap((d) => d.groups.flatMap((g) => g.items.map((i) => i.href))));
            derivedHrefs.add('/settings/profile');
            const navHrefs = NAVIGATION.map((n) => n.href);
            for (const href of navHrefs) {
                expect(derivedHrefs.has(href), `NAVIGATION href ${href} should be in FLEX_DOMAINS or shared`).toBe(true);
            }
            for (const href of derivedHrefs) {
                expect(navHrefs.includes(href), `FLEX_DOMAIN href ${href} should appear in NAVIGATION`).toBe(true);
            }
        });

        it('no duplicate NAVIGATION hrefs', () => {
            const hrefs = NAVIGATION.map((n) => n.href);
            expect(new Set(hrefs).size).toBe(hrefs.length);
        });

        it('NAVIGATION has no LIVE badge', () => {
            for (const nav of NAVIGATION) {
                expect(nav.badge, `${nav.title} should not have LIVE badge`).not.toBe('Live');
            }
        });
    });

    describe('CONSOLE_MODULES parity with sidebar', () => {
        it('Subscriptions gated by settings.manage', () =>
            expect(CONSOLE_MODULES.find((m) => m.id === 'subscriptions')?.capability).toBe('settings.manage'));
        it('Mail Configuration gated by settings.manage', () =>
            expect(CONSOLE_MODULES.find((m) => m.id === 'mail-config')?.capability).toBe('settings.manage'));
    });

    describe('isActiveRoute boundary', () => {
        it('exact match is active', () => expect(isActiveRoute('/admin/cdr', '/admin/cdr')).toBe(true));
        it('sub-route with slash boundary is active', () => expect(isActiveRoute('/admin/cdr/123', '/admin/cdr')).toBe(true));
        it('prefix without boundary is not active', () => expect(isActiveRoute('/admin/cdrs', '/admin/cdr')).toBe(false));
        it('/admin does not activate /admin/cdr', () => expect(isActiveRoute('/admin', '/admin/cdr')).toBe(false));
        it('query string stripped', () => expect(isActiveRoute('/admin/cdr?page=1', '/admin/cdr')).toBe(true));
    });
});
