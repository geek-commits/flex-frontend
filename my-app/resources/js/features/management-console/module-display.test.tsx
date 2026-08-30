import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';
import { CONSOLE_MODULES } from '@/domain/modules';
import i18n from '@/i18n';
import { ConsoleModuleDirectory } from './console-module-directory';
import { ConsoleModuleItem } from './console-module-item';
import { filterModulesByQuery } from './use-visible-modules';

describe('ConsoleModuleItem — key-driven', () => {
    it('resolves titleKey and descriptionKey', async () => {
        await i18n.changeLanguage('en');
        const mod = CONSOLE_MODULES.find((m) => m.id === 'tenants')!;
        render(
            <I18nextProvider i18n={i18n}>
                <ConsoleModuleItem module={mod} />
            </I18nextProvider>,
        );
        expect(screen.getByText('Tenants & Multi-Org')).toBeTruthy();
        expect(screen.getByText('Manage tenant accounts, organizations, and domain isolation.')).toBeTruthy();
    });

    it('reacts to language change', async () => {
        await i18n.changeLanguage('en');
        const mod = CONSOLE_MODULES.find((m) => m.id === 'tenants')!;
        const { rerender } = render(
            <I18nextProvider i18n={i18n}>
                <ConsoleModuleItem module={mod} />
            </I18nextProvider>,
        );
        expect(screen.getByText('Tenants & Multi-Org')).toBeTruthy();
        await i18n.changeLanguage('fr');
        rerender(
            <I18nextProvider i18n={i18n}>
                <ConsoleModuleItem module={mod} />
            </I18nextProvider>,
        );
        // French translation for tenants title is still English copy (fallback) but key-driven — ensure no crash and still renders
        expect(screen.getByText('Tenants & Multi-Org')).toBeTruthy();
        await i18n.changeLanguage('en');
    });
});

describe('ConsoleModuleDirectory — categoryKey-driven', () => {
    it('groups by translated categoryKey', async () => {
        await i18n.changeLanguage('en');
        const mods = CONSOLE_MODULES.slice(0, 2); // both Core Administration
        render(
            <I18nextProvider i18n={i18n}>
                <ConsoleModuleDirectory modules={mods} />
            </I18nextProvider>,
        );
        expect(screen.getByText('Core Administration')).toBeTruthy();
    });
});

describe('filterModulesByQuery — translated corpus', () => {
    it('searches translated title/description/category', async () => {
        await i18n.changeLanguage('en');
        const t = i18n.getFixedT('en', 'administration');
        const result = filterModulesByQuery(CONSOLE_MODULES, 'Core Administration', t);
        expect(result.length).toBeGreaterThan(0);
        expect(result.every((m) => m.categoryKey === 'modules.categories.coreAdministration')).toBe(true);
    });
});
