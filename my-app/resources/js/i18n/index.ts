import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE, getInitialLocale } from './locale';

import enAgent from './locales/en/agent.json';
import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';

import frAgent from './locales/fr/agent.json';
import frAuth from './locales/fr/auth.json';
import frCommon from './locales/fr/common.json';
import frNavigation from './locales/fr/navigation.json';

import swAgent from './locales/sw/agent.json';
import swAuth from './locales/sw/auth.json';
import swCommon from './locales/sw/common.json';
import swNavigation from './locales/sw/navigation.json';

export const defaultNS = 'common';

export const resources = {
    en: {
        agent: enAgent,
        auth: enAuth,
        common: enCommon,
        navigation: enNavigation,
    },
    fr: {
        agent: frAgent,
        auth: frAuth,
        common: frCommon,
        navigation: frNavigation,
    },
    sw: {
        agent: swAgent,
        auth: swAuth,
        common: swCommon,
        navigation: swNavigation,
    },
} as const;

void i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getInitialLocale(),
        fallbackLng: DEFAULT_LOCALE,
        defaultNS,
        interpolation: {
            escapeValue: false,
        },
    });

// Synchronize <html lang> with the resolved locale immediately after init.
// This runs before any React render because app.tsx imports this module
// as a side-effect prior to createInertiaApp. Inline allowlist avoids
// circular import with locale.ts (which itself imports i18n).
if (typeof document !== 'undefined') {
    const raw = i18n.language || DEFAULT_LOCALE;
    const normalized = raw.split('-')[0].toLowerCase();
    const isSupported = (v: string) => ['en', 'sw', 'fr'].includes(v);
    document.documentElement.lang = isSupported(normalized) ? normalized : DEFAULT_LOCALE;
}

export default i18n;
