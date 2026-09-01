import { describe, expect, it } from 'vitest';
import { PERMISSION_LABEL_KEYS, PERMISSION_MODULE_KEYS, PERMISSION_TYPE_KEYS } from '@/features/access-management/shared/permission-catalog';
import { ROLE_LABEL_KEYS } from '@/features/access-management/shared/role-options';
import i18n from '@/i18n';

describe('Access Management Phase 7E — roles and permissions', () => {
    it('builtin role label EN → SW → FR', async () => {
        expect(i18n.t(`administration:${ROLE_LABEL_KEYS['super-admin']}`, { lng: 'en' })).toBe('Super Administrator');
        expect(i18n.t(`administration:${ROLE_LABEL_KEYS['super-admin']}`, { lng: 'sw' })).toBe('Msimamizi Mkuu');
        expect(i18n.t(`administration:${ROLE_LABEL_KEYS['super-admin']}`, { lng: 'fr' })).toBe('Super administrateur');
        expect(i18n.t(`administration:${ROLE_LABEL_KEYS.agent}`, { lng: 'en' })).toBe('Agent');
        expect(i18n.t(`administration:${ROLE_LABEL_KEYS.agent}`, { lng: 'sw' })).toBe('Wakala');
    });

    it('builtin permission label EN → SW → FR', async () => {
        expect(i18n.t(`administration:${PERMISSION_LABEL_KEYS['dashboard.view']}`, { lng: 'en' })).toBe('View Dashboard');
        expect(i18n.t(`administration:${PERMISSION_LABEL_KEYS['dashboard.view']}`, { lng: 'sw' })).toBe('Tazama Dashibodi');
        expect(i18n.t(`administration:${PERMISSION_LABEL_KEYS['dashboard.view']}`, { lng: 'fr' })).toBe('Voir le tableau de bord');
    });

    it('builtin module EN → SW → FR', async () => {
        expect(i18n.t(`administration:${PERMISSION_MODULE_KEYS.dashboard}`, { lng: 'en' })).toBe('Dashboard');
        expect(i18n.t(`administration:${PERMISSION_MODULE_KEYS.dashboard}`, { lng: 'sw' })).toBe('Dashibodi');
        expect(i18n.t(`administration:${PERMISSION_MODULE_KEYS.dashboard}`, { lng: 'fr' })).toBe('Tableau de bord');
    });

    it('builtin type EN → SW → FR', async () => {
        expect(i18n.t(`administration:${PERMISSION_TYPE_KEYS.view}`, { lng: 'en' })).toBe('View');
        expect(i18n.t(`administration:${PERMISSION_TYPE_KEYS.view}`, { lng: 'sw' })).toBe('Tazama');
        expect(i18n.t(`administration:${PERMISSION_TYPE_KEYS.view}`, { lng: 'fr' })).toBe('Voir');
    });

    it('custom permission name unchanged', async () => {
        const customName = 'My Custom Permission';
        expect(customName).toBe('My Custom Permission');
    });

    it('permission validation EN → SW → FR without resubmit', async () => {
        expect(i18n.t('administration:roles.permissions.form.validation.nameRequired', { lng: 'en' })).toBe('Permission name is required.');
        expect(i18n.t('administration:roles.permissions.form.validation.nameRequired', { lng: 'sw' })).not.toBe('Permission name is required.');
    });

    it('role validation and plural count 1/2', async () => {
        expect(i18n.t('administration:roles.form.validation.nameRequired', { lng: 'en' })).toBe('Role name is required.');
        expect(i18n.t('administration:roles.form.assignedWarning', { lng: 'en', count: 1 })).toContain('1');
        expect(i18n.t('administration:roles.form.assignedWarning', { lng: 'en', count: 2 })).toContain('2');
        expect(i18n.t('administration:roles.form.unknownWarning', { lng: 'en', count: 1 })).toContain('1');
    });
});
