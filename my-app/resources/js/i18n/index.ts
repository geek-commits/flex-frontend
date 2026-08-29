import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE, getInitialLocale } from './locale';

import enAdministration from './locales/en/administration.json';
import enAgent from './locales/en/agent.json';
import enAssist from './locales/en/assist.json';
import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enPlatform from './locales/en/platform.json';
import enSupervision from './locales/en/supervision.json';
import enValidation from './locales/en/validation.json';

import frAdministration from './locales/fr/administration.json';
import frAgent from './locales/fr/agent.json';
import frAssist from './locales/fr/assist.json';
import frAuth from './locales/fr/auth.json';
import frCommon from './locales/fr/common.json';
import frNavigation from './locales/fr/navigation.json';
import frPlatform from './locales/fr/platform.json';
import frSupervision from './locales/fr/supervision.json';
import frValidation from './locales/fr/validation.json';

import swAdministration from './locales/sw/administration.json';
import swAgent from './locales/sw/agent.json';
import swAssist from './locales/sw/assist.json';
import swAuth from './locales/sw/auth.json';
import swCommon from './locales/sw/common.json';
import swNavigation from './locales/sw/navigation.json';
import swPlatform from './locales/sw/platform.json';
import swSupervision from './locales/sw/supervision.json';
import swValidation from './locales/sw/validation.json';

export const defaultNS = 'common';

export const resources = {
    en: {
        agent: enAgent,
        assist: enAssist,
        auth: enAuth,
        common: enCommon,
        navigation: enNavigation,
        platform: enPlatform,
        supervision: enSupervision,
        administration: enAdministration,
        validation: enValidation,
    },
    fr: {
        agent: frAgent,
        assist: frAssist,
        auth: frAuth,
        common: frCommon,
        navigation: frNavigation,
        platform: frPlatform,
        supervision: frSupervision,
        administration: frAdministration,
        validation: frValidation,
    },
    sw: {
        agent: swAgent,
        assist: swAssist,
        auth: swAuth,
        common: swCommon,
        navigation: swNavigation,
        platform: swPlatform,
        supervision: swSupervision,
        administration: swAdministration,
        validation: swValidation,
    },
} as const;

void i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getInitialLocale(),
        fallbackLng: DEFAULT_LOCALE,
        supportedLngs: ['en', 'sw', 'fr'],
        load: 'languageOnly',
        defaultNS,
        returnNull: false,
        returnEmptyString: false,
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

// Synchronize <html lang/dir> with the resolved locale immediately after init.
// This runs before any React render because app.tsx imports this module
// as a side-effect prior to createInertiaApp. Inline allowlist avoids
// circular import with locale.ts (which itself imports i18n).
if (typeof document !== 'undefined') {
    const raw = i18n.language || DEFAULT_LOCALE;
    const normalized = raw.split('-')[0].toLowerCase();
    const isSupported = (v: string) => ['en', 'sw', 'fr'].includes(v);
    const resolved = isSupported(normalized) ? normalized : DEFAULT_LOCALE;
    document.documentElement.lang = resolved;
    document.documentElement.dir = i18n.dir(resolved);
}

export default i18n;
