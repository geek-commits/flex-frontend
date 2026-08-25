import { describe, expect, it } from 'vitest';
import { getSafeLandingForRole, isRouteAccessibleForRole } from './role-routing';

describe('role-routing', () => {
    describe('getSafeLandingForRole', () => {
        it('agent -> /agent/dashboard', () => expect(getSafeLandingForRole('agent')).toBe('/agent/dashboard'));
        it('supervisor -> /dashboard', () => expect(getSafeLandingForRole('supervisor')).toBe('/dashboard'));
        it('admin -> /admin/console', () => expect(getSafeLandingForRole('admin')).toBe('/admin/console'));
        it('super-admin -> /admin/tenants', () =>
            expect(getSafeLandingForRole('super-admin')).toBe('/admin/tenants'));
    });

    describe('isRouteAccessibleForRole', () => {
        // Agent
        it('agent can access /agent/dashboard', () =>
            expect(isRouteAccessibleForRole('/agent/dashboard', 'agent')).toBe(true));
        it('agent can access /agent/missed-calls', () =>
            expect(isRouteAccessibleForRole('/agent/missed-calls', 'agent')).toBe(true));
        it('agent cannot access /dashboard', () =>
            expect(isRouteAccessibleForRole('/dashboard', 'agent')).toBe(false));
        it('agent cannot access /admin/console', () =>
            expect(isRouteAccessibleForRole('/admin/console', 'agent')).toBe(false));
        it('agent cannot access /admin/tenants', () =>
            expect(isRouteAccessibleForRole('/admin/tenants', 'agent')).toBe(false));

        // Supervisor — operational only
        it('supervisor can access /dashboard', () =>
            expect(isRouteAccessibleForRole('/dashboard', 'supervisor')).toBe(true));
        it('supervisor can access /admin/cdr', () =>
            expect(isRouteAccessibleForRole('/admin/cdr', 'supervisor')).toBe(true));
        it('supervisor can access /admin/users', () =>
            expect(isRouteAccessibleForRole('/admin/users', 'supervisor')).toBe(true));
        it('supervisor can access /admin/queues', () =>
            expect(isRouteAccessibleForRole('/admin/queues', 'supervisor')).toBe(true));
        it('supervisor cannot access /admin/roles', () =>
            expect(isRouteAccessibleForRole('/admin/roles', 'supervisor')).toBe(false));
        it('supervisor cannot access /admin/subscription', () =>
            expect(isRouteAccessibleForRole('/admin/subscription', 'supervisor')).toBe(false));
        it('supervisor cannot access /admin/mail-config', () =>
            expect(isRouteAccessibleForRole('/admin/mail-config', 'supervisor')).toBe(false));
        it('supervisor cannot access /admin/system', () =>
            expect(isRouteAccessibleForRole('/admin/system', 'supervisor')).toBe(false));
        it('supervisor cannot access /admin/ai', () =>
            expect(isRouteAccessibleForRole('/admin/ai', 'supervisor')).toBe(false));
        it('supervisor cannot access /admin/tenants', () =>
            expect(isRouteAccessibleForRole('/admin/tenants', 'supervisor')).toBe(false));

        // Administrator — operational + administration config
        it('admin can access /admin/roles', () =>
            expect(isRouteAccessibleForRole('/admin/roles', 'admin')).toBe(true));
        it('admin can access /admin/subscription', () =>
            expect(isRouteAccessibleForRole('/admin/subscription', 'admin')).toBe(true));
        it('admin can access /admin/mail-config', () =>
            expect(isRouteAccessibleForRole('/admin/mail-config', 'admin')).toBe(true));
        it('admin can access /admin/system', () =>
            expect(isRouteAccessibleForRole('/admin/system', 'admin')).toBe(true));
        it('admin can access /admin/ai', () =>
            expect(isRouteAccessibleForRole('/admin/ai', 'admin')).toBe(true));
        it('admin cannot access /admin/tenants', () =>
            expect(isRouteAccessibleForRole('/admin/tenants', 'admin')).toBe(false));
        it('admin cannot access /agent', () =>
            expect(isRouteAccessibleForRole('/agent', 'admin')).toBe(false));

        // Super Admin — everything
        it('super-admin can access /admin/tenants', () =>
            expect(isRouteAccessibleForRole('/admin/tenants', 'super-admin')).toBe(true));
        it('super-admin can access /agent/dashboard', () =>
            expect(isRouteAccessibleForRole('/agent/dashboard', 'super-admin')).toBe(true));

        // Boundary-aware — sub-routes gated by parent
        it('admin /admin/cdr/123 gated by cdr.view', () =>
            expect(isRouteAccessibleForRole('/admin/cdr/123', 'admin')).toBe(true));
        it('sub-route does not bleed: /admin does not match /admin/cdr', () =>
            expect(isRouteAccessibleForRole('/admins/other', 'supervisor')).toBe(true)); // unknown -> accessible (preserved)

        // Settings
        it('admin can access /settings/profile', () =>
            expect(isRouteAccessibleForRole('/settings/profile', 'admin')).toBe(true));
        it('supervisor cannot access /settings/profile', () =>
            expect(isRouteAccessibleForRole('/settings/profile', 'supervisor')).toBe(false));

        // Role-switch redirect examples from plan §63
        it('admin on /admin/roles switching to supervisor is inaccessible', () =>
            expect(isRouteAccessibleForRole('/admin/roles', 'supervisor')).toBe(false));
        it('admin on /admin/cdr switching to supervisor remains accessible', () =>
            expect(isRouteAccessibleForRole('/admin/cdr', 'supervisor')).toBe(true));
        it('super-admin on /admin/tenants switching to agent is inaccessible', () =>
            expect(isRouteAccessibleForRole('/admin/tenants', 'agent')).toBe(false));
    });
});
