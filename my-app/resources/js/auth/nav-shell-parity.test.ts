import { describe, expect, it } from 'vitest';
import { CONSOLE_MODULES } from '@/domain/modules';
import { NAVIGATION, ROLE_CAPABILITIES } from './capabilities';
import {
    FLEX_DOMAINS,
    FLEX_NAVIGATION_AREAS,
    isActiveRoute,
    resolveActiveNavigationHref,
    resolveNavigationArea,
} from './nav-domains';

function visibleHrefsForRole(role: keyof typeof ROLE_CAPABILITIES) {
    const caps = ROLE_CAPABILITIES[role];
    const has = (c: string) => (caps as string[]).includes(c);

    return FLEX_DOMAINS.flatMap((domain) =>
        !has(domain.capability)
            ? []
            : domain.groups.flatMap((group) =>
                  group.items
                      .filter(
                          (item) => !item.capability || has(item.capability),
                      )
                      .map((i) => i.href),
              ),
    );
}

function visibleGroupsForDomain(
    domainId: string,
    role: keyof typeof ROLE_CAPABILITIES,
) {
    const domain = FLEX_DOMAINS.find((d) => d.id === domainId);
    const caps = ROLE_CAPABILITIES[role];
    const has = (c: string) => (caps as string[]).includes(c);

    if (!domain || !has(domain.capability)) {
        return [];
    }

    return domain.groups
        .map((g) => ({
            groupTitle: g.groupTitle,
            hrefs: g.items
                .filter((i) => !i.capability || has(i.capability))
                .map((i) => i.href),
        }))
        .filter((g) => g.hrefs.length > 0);
}

describe('nav shell parity', () => {
    describe('domain rail visibility (plan 57)', () => {
        it('agent sees only Agent', () => {
            expect(visibleHrefsForRole('agent').length).toBeGreaterThan(0);
            const caps = ROLE_CAPABILITIES.agent;
            const has = (c: string) => (caps as string[]).includes(c);
            const domains = FLEX_DOMAINS.filter((d) => has(d.capability)).map(
                (d) => d.id,
            );
            expect(domains).toEqual(['agent']);
        });

        it('supervisor sees Supervision+Administration, not Agent/Platform', () => {
            const caps = ROLE_CAPABILITIES.supervisor;
            const has = (c: string) => (caps as string[]).includes(c);
            const domains = FLEX_DOMAINS.filter((d) => has(d.capability)).map(
                (d) => d.id,
            );
            expect(domains).toEqual(
                expect.arrayContaining(['supervision', 'administration']),
            );
            expect(domains).not.toContain('agent');
            expect(domains).not.toContain('platform');
        });

        it('admin sees Supervision+Administration, not Platform', () => {
            const caps = ROLE_CAPABILITIES.admin;
            const has = (c: string) => (caps as string[]).includes(c);
            const domains = FLEX_DOMAINS.filter((d) => has(d.capability)).map(
                (d) => d.id,
            );
            expect(domains).toEqual(
                expect.arrayContaining(['supervision', 'administration']),
            );
            expect(domains).not.toContain('platform');
            expect(domains).not.toContain('agent');
        });

        it('super-admin sees all four domains', () => {
            const caps = ROLE_CAPABILITIES['super-admin'];
            const has = (c: string) => (caps as string[]).includes(c);
            const domains = FLEX_DOMAINS.filter((d) => has(d.capability)).map(
                (d) => d.id,
            );
            expect(new Set(domains)).toEqual(
                new Set(['agent', 'supervision', 'administration', 'platform']),
            );
        });
    });

    describe('agent sidebar (plan 58)', () => {
        it('contains expected agent routes', () => {
            const hrefs = new Set(visibleHrefsForRole('agent'));

            for (const href of [
                '/agent/dashboard',
                '/agent',
                '/agent/social',
                '/agent/missed-calls',
                '/agent/troubleshooting',
                '/agent/support',
            ]) {
                expect(hrefs.has(href), `agent should see ${href}`).toBe(true);
            }
        });

        it('labels Callback & Voicemail, not Missed Calls', () => {
            const agentDomain = FLEX_DOMAINS.find((d) => d.id === 'agent');
            const titles =
                agentDomain?.groups.flatMap((g) =>
                    g.items.map((i) => i.title),
                ) ?? [];
            expect(titles).toContain('Callback & Voicemail');
            expect(titles).not.toContain('Missed Calls');
        });
    });

    describe('supervisor administration sidebar (plan 59)', () => {
        it('visible contains operational subset', () => {
            const hrefs = new Set(visibleHrefsForRole('supervisor'));

            for (const h of [
                '/admin/console',
                '/admin/users',
                '/admin/queues',
                '/admin/ivr',
                '/admin/time-groups',
                '/admin/time-conditions',
                '/admin/recordings',
            ]) {
                expect(hrefs.has(h), `supervisor visible ${h}`).toBe(true);
            }
        });

        it('hidden does not contain administrator-only routes', () => {
            const hrefs = new Set(visibleHrefsForRole('supervisor'));

            for (const h of [
                '/admin/roles',
                '/admin/subscription',
                '/admin/mail-config',
                '/admin/system',
                '/admin/ai',
                '/admin/tenants',
            ]) {
                expect(hrefs.has(h), `supervisor hidden ${h}`).toBe(false);
            }
        });

        it('keeps every accessible administration group, including placeholder modules', () => {
            const groups = visibleGroupsForDomain(
                'administration',
                'supervisor',
            );
            const titles = groups.map((g) => g.groupTitle);
            expect(titles).toContain('Overview');
            expect(titles).toContain('People');
            expect(titles).toContain('Routing');
            expect(titles).toContain('Media');
            expect(titles).toContain('System');
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

    describe('FLEX navigation-area canonical parity', () => {
        it('covers every known authenticated runtime route family', () => {
            const registered = new Set(
                FLEX_NAVIGATION_AREAS.flatMap((area) =>
                    area.groups.flatMap((group) =>
                        group.items.flatMap((item) => [
                            item.href,
                            ...(item.aliases ?? []),
                        ]),
                    ),
                ),
            );
            for (const href of [
                '/dashboard',
                '/admin/monitoring',
                '/admin/console',
                '/admin/cdr',
                '/admin/cdr/record-1',
                '/admin/campaigns',
                '/admin/campaigns/campaign-1',
                '/admin/reports',
                '/admin/settings',
                '/admin/system',
                '/admin/ai',
                '/admin/users',
                '/admin/roles',
                '/admin/queues',
                '/admin/ivr',
                '/admin/time-groups',
                '/admin/time-conditions',
                '/admin/recordings',
                '/admin/subscription',
                '/admin/mail-config',
                '/admin/tenants',
                '/admin/health',
                '/supervision/exceptions',
                '/agent',
                '/agent/dashboard',
                '/agent/social',
                '/agent/missed-calls',
                '/agent/troubleshooting',
                '/agent/support',
                '/customers/customer-1',
                '/settings/profile',
                '/settings/security',
                '/settings/appearance',
            ]) {
                const match = [...registered].some(
                    (route) =>
                        href === route ||
                        href.startsWith(`${route}/`) ||
                        route.startsWith(`${href}/`),
                );
                expect(match, `runtime route ${href} should resolve`).toBe(
                    true,
                );
            }
        });

        it('NAVIGATION is derived from the unified navigation registry', () => {
            const derivedHrefs = new Set(
                FLEX_NAVIGATION_AREAS.flatMap((area) =>
                    area.groups.flatMap((group) =>
                        group.items.map((item) => item.href),
                    ),
                ),
            );
            const navHrefs = NAVIGATION.map((n) => n.href);

            for (const href of navHrefs) {
                expect(
                    derivedHrefs.has(href),
                    `NAVIGATION href ${href} should be in FLEX_NAVIGATION_AREAS`,
                ).toBe(true);
            }

            for (const href of derivedHrefs) {
                expect(
                    navHrefs.includes(href),
                    `navigation-area href ${href} should appear in NAVIGATION`,
                ).toBe(true);
            }
        });

        it('no duplicate NAVIGATION hrefs', () => {
            const hrefs = NAVIGATION.map((n) => n.href);
            expect(new Set(hrefs).size).toBe(hrefs.length);
        });

        it('NAVIGATION has no LIVE badge', () => {
            for (const nav of NAVIGATION) {
                expect(
                    nav.badge,
                    `${nav.title} should not have LIVE badge`,
                ).not.toBe('Live');
            }
        });
    });

    describe('CONSOLE_MODULES parity with sidebar', () => {
        it('Subscriptions gated by settings.manage', () =>
            expect(
                CONSOLE_MODULES.find((m) => m.id === 'subscriptions')
                    ?.capability,
            ).toBe('settings.manage'));
        it('Mail Configuration gated by settings.manage', () =>
            expect(
                CONSOLE_MODULES.find((m) => m.id === 'mail-config')?.capability,
            ).toBe('settings.manage'));
    });

    describe('isActiveRoute boundary', () => {
        it('exact match is active', () =>
            expect(isActiveRoute('/admin/cdr', '/admin/cdr')).toBe(true));
        it('sub-route with slash boundary is active', () =>
            expect(isActiveRoute('/admin/cdr/123', '/admin/cdr')).toBe(true));
        it('prefix without boundary is not active', () =>
            expect(isActiveRoute('/admin/cdrs', '/admin/cdr')).toBe(false));
        it('/admin does not activate /admin/cdr', () =>
            expect(isActiveRoute('/admin', '/admin/cdr')).toBe(false));
        it('query string stripped', () =>
            expect(isActiveRoute('/admin/cdr?page=1', '/admin/cdr')).toBe(
                true,
            ));
    });

    describe('route affinity', () => {
        it('maps Settings routes to the utility area', () => {
            expect(resolveNavigationArea('/settings/security')).toBe(
                'settings',
            );
            expect(resolveNavigationArea('/admin/settings/moh')).toBe(
                'settings',
            );
            expect(resolveNavigationArea('/admin/unknown-module')).toBe(
                'administration',
            );
        });

        it('maps detail routes to their parent navigation item', () => {
            expect(resolveActiveNavigationHref('/admin/cdr/ACME-1')).toBe(
                '/admin/cdr',
            );
            expect(
                resolveActiveNavigationHref('/admin/campaigns/campaign-1'),
            ).toBe('/admin/campaigns');
            expect(resolveActiveNavigationHref('/customers/customer-1')).toBe(
                '/agent',
            );
        });

        it('uses the most specific Agent route', () => {
            expect(resolveActiveNavigationHref('/agent/dashboard')).toBe(
                '/agent/dashboard',
            );
            expect(resolveActiveNavigationHref('/agent/troubleshooting')).toBe(
                '/agent/troubleshooting',
            );
        });
    });
});
