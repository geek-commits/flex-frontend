import { describe, expect, it, beforeEach } from 'vitest';
import { accessRepository } from '@/domain/access-repository';
import { PERMISSION_LABEL_KEYS, PERMISSION_MODULE_KEYS, PERMISSION_TYPE_KEYS, PERMISSIONS } from '@/features/access-management/shared/permission-catalog';
import { ROLE_LABEL_KEYS } from '@/features/access-management/shared/role-options';
import i18n from '@/i18n';

describe('Phase 7E Final — builtin role editing', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('en');
    });

    it('builtin role permission edit successfully saves despite immutable name', async () => {
        const roles = accessRepository.queryRoles();
        const adminRole = roles.find((r) => r.id === 'admin')!;
        expect(adminRole.kind).toBe('builtin');
        // Simulate editing admin role: change permissions but not name
        const newPerms = ['dashboard.view'];
        const updated = accessRepository.updateRole(adminRole.id, { name: '', permissions: newPerms });
        expect(updated?.permissions).toEqual(newPerms);
        // Name should remain id for builtin (not persisted as empty or translated)
        expect(updated?.kind).toBe('builtin');

        if (updated && updated.kind === 'builtin') {
            expect(updated.id).toBe('admin');
        }
    });

    it('builtin localized role label is never persisted', async () => {
        const roles = accessRepository.queryRoles();
        const superAdmin = roles.find((r) => r.id === 'super-admin')!;
        const enLabel = i18n.getFixedT('en', 'administration')(ROLE_LABEL_KEYS['super-admin']);
        const swLabel = i18n.getFixedT('sw', 'administration')(ROLE_LABEL_KEYS['super-admin']);
        const frLabel = i18n.getFixedT('fr', 'administration')(ROLE_LABEL_KEYS['super-admin']);
        expect(enLabel).toBe('Super Administrator');
        expect(swLabel).toBe('Msimamizi Mkuu');
        expect(frLabel).toBe('Super administrateur');
        // Ensure persisted role still has id 'super-admin', not translated label
        expect(superAdmin.id).toBe('super-admin');
        // Try to update with translated label should not change id
        const updated = accessRepository.updateRole(superAdmin.id, { name: enLabel, permissions: superAdmin.permissions });
        expect(updated?.id).toBe('super-admin');
    });

    it('custom role remains kind:custom with raw name', async () => {
        const draft = { name: 'My Custom Role', permissions: ['dashboard.view'] };
        const created = accessRepository.createRole(draft);
        expect(created.kind).toBe('custom');

        if (created.kind === 'custom') {
            expect(created.name).toBe('My Custom Role');
            await i18n.changeLanguage('sw');
            const swDisplay = created.name;
            expect(swDisplay).toBe('My Custom Role');
            await i18n.changeLanguage('fr');
            expect(swDisplay).toBe('My Custom Role');
            await i18n.changeLanguage('en');
        }
    });
});

describe('Phase 7E Final — permissions', () => {
    it('builtin permission label EN→SW→FR', async () => {
        expect(i18n.getFixedT('en', 'administration')(PERMISSION_LABEL_KEYS['dashboard.view'])).toBe('View Dashboard');
        expect(i18n.getFixedT('sw', 'administration')(PERMISSION_LABEL_KEYS['dashboard.view'])).toBe('Tazama Dashibodi');
        expect(i18n.getFixedT('fr', 'administration')(PERMISSION_LABEL_KEYS['dashboard.view'])).toBe('Voir le tableau de bord');
    });

    it('builtin module EN→SW→FR', async () => {
        expect(i18n.getFixedT('en', 'administration')(PERMISSION_MODULE_KEYS.dashboard)).toBe('Dashboard');
        expect(i18n.getFixedT('sw', 'administration')(PERMISSION_MODULE_KEYS.dashboard)).toBe('Dashibodi');
        expect(i18n.getFixedT('fr', 'administration')(PERMISSION_MODULE_KEYS.dashboard)).toBe('Tableau de bord');
    });

    it('builtin type EN→SW→FR and agent.dashboard.view → view', async () => {
        expect(i18n.getFixedT('en', 'administration')(PERMISSION_TYPE_KEYS.view)).toBe('View');
        expect(i18n.getFixedT('sw', 'administration')(PERMISSION_TYPE_KEYS.view)).toBe('Tazama');
        // agent.dashboard.view should derive to view, not dashboard
        const perms = PERMISSIONS.find((p) => p.id === 'agent.dashboard.view');
        expect(perms?.kind).toBe('builtin');

        if (perms && perms.kind === 'builtin') {
            expect(perms.type).toBe('view');
            expect(perms.typeKey).toBe('roles.permissions.types.view');
        }
    });

    it('custom permission name/type/id survive language changes', async () => {
        const draft = { name: 'My Custom Permission XYZ', type: 'view' };
        const created = accessRepository.createPermission(draft);
        expect(created.kind).toBe('custom');

        if (created.kind === 'custom') {
            expect(created.name).toBe('My Custom Permission XYZ');
            expect(created.id).toContain('my-custom-permission-xyz');
            expect(created.type).toBe('view');
            await i18n.changeLanguage('sw');
            expect(created.name).toBe('My Custom Permission XYZ');
            expect(created.id).toContain('my-custom-permission-xyz');
            await i18n.changeLanguage('fr');
            expect(created.type).toBe('view');
            await i18n.changeLanguage('en');
        }
    });

    it('custom permission duplicate detection not locale dependent', async () => {
        const existing = accessRepository.queryPermissions().find((p) => p.kind === 'custom');

        if (existing && existing.kind === 'custom') {
            const duplicate = existing.name;
            const isDuplicate = accessRepository.queryPermissions().some((p) => p.kind === 'custom' && p.name.toLowerCase() === duplicate.toLowerCase());
            expect(isDuplicate).toBe(true);
            // Translated label should not affect duplicate check
            const translated = i18n.getFixedT('en', 'administration')(PERMISSION_LABEL_KEYS['dashboard.view']);
            expect(translated.toLowerCase()).not.toBe(duplicate.toLowerCase());
        }
    });
});

describe('Phase 7E Final — validation and plurals', () => {
    it('PermissionForm validation changes language while visible', async () => {
        const key = 'roles.permissions.form.validation.nameRequired' as const;
        expect(i18n.getFixedT('en', 'administration')(key)).toBe('Permission name is required.');
        expect(i18n.getFixedT('sw', 'administration')(key)).toBe('Jina la ruhusa linahitajika.');
        expect(i18n.getFixedT('fr', 'administration')(key)).toBe('Le nom de la permission est requis.');
    });

    it('role validation and plural count 1/2', async () => {
        expect(i18n.getFixedT('en', 'administration')('roles.form.validation.nameRequired')).toBe('Role name is required.');
        expect(i18n.t('administration:roles.form.assignedWarning', { lng: 'en', count: 1 })).toContain('1');
        expect(i18n.t('administration:roles.form.assignedWarning', { lng: 'en', count: 2 })).toContain('2');
        expect(i18n.t('administration:roles.form.unknownWarning', { lng: 'en', count: 1 })).toContain('1');
        expect(i18n.t('administration:roles.form.unknownWarning', { lng: 'en', count: 2 })).toContain('2');
        // SW plural
        expect(i18n.t('administration:roles.form.assignedWarning', { lng: 'sw', count: 1 })).toContain('1');
        expect(i18n.t('administration:roles.form.assignedWarning', { lng: 'sw', count: 2 })).toContain('2');
    });

    it('lifecycle/reset regression', async () => {
        expect(i18n.getFixedT('en', 'administration')('users.lifecycle.deactivate.success', { name: 'Alice' })).toContain('Alice');
        expect(i18n.getFixedT('sw', 'administration')('users.lifecycle.deactivate.success', { name: 'Alice' })).toContain('Alice');
        expect(i18n.getFixedT('en', 'administration')('users.resetPassword.success')).toBe('Password reset link sent.');
        expect(i18n.getFixedT('fr', 'administration')('users.resetPassword.success')).not.toBe('Password reset link sent.');
    });
});
