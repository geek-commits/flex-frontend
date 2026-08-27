import { useEffect, useState } from 'react';

export const SUPPORTED_LOCALES = ['en', 'sw', 'fr'] as const;
export type FlexLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: FlexLocale = 'en';
export const STORAGE_KEY = 'flex.locale';
export const COOKIE_NAME = 'flex_locale';

export interface LocaleMeta {
    code: FlexLocale;
    label: string;
    compact: string;
    formatLocale: string;
    direction: 'ltr';
}

export const LOCALE_CONFIG: Record<FlexLocale, LocaleMeta> = {
    en: {
        code: 'en',
        label: 'English',
        compact: 'EN',
        formatLocale: 'en-GB',
        direction: 'ltr',
    },
    sw: {
        code: 'sw',
        label: 'Kiswahili',
        compact: 'SW',
        formatLocale: 'sw-TZ',
        direction: 'ltr',
    },
    fr: {
        code: 'fr',
        label: 'Français',
        compact: 'FR',
        formatLocale: 'fr-FR',
        direction: 'ltr',
    },
};

export function isSupportedLocale(locale: unknown): locale is FlexLocale {
    return typeof locale === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
return null;
}

    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));

    return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 365): void {
    if (typeof document === 'undefined') {
return;
}

    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function resolveBrowserLocale(): FlexLocale {
    if (typeof navigator === 'undefined') {
return DEFAULT_LOCALE;
}

    const navLangs = navigator.languages || [navigator.language];

    for (const lang of navLangs) {
        if (!lang) {
continue;
}

        const normalized = lang.toLowerCase().split('-')[0];

        if (isSupportedLocale(normalized)) {
            return normalized;
        }
    }

    return DEFAULT_LOCALE;
}

export function getInitialLocale(): FlexLocale {
    // 1. LocalStorage preference
    if (typeof localStorage !== 'undefined') {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (isSupportedLocale(saved)) {
return saved;
}
        } catch {
            // Ignore storage access errors
        }
    }

    // 2. Cookie preference
    const cookie = getCookie(COOKIE_NAME);

    if (isSupportedLocale(cookie)) {
return cookie;
}

    // 3. Browser language
    const browser = resolveBrowserLocale();

    if (isSupportedLocale(browser)) {
return browser;
}

    // 4. Default fallback
    return DEFAULT_LOCALE;
}

export async function setFlexLocale(locale: FlexLocale): Promise<void> {
    if (!isSupportedLocale(locale)) {
return;
}

    // 1. Update i18next — lazy import to avoid circular init TDZ with i18n/index.ts
    const { default: i18n } = await import('@/i18n');
    await i18n.changeLanguage(locale);

    // 2. Update localStorage
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem(STORAGE_KEY, locale);
        } catch {
            // Ignore storage access errors
        }
    }

    // 3. Update cookie for Laravel backend
    setCookie(COOKIE_NAME, locale);

    // 4. Update html tag lang attribute
    if (typeof document !== 'undefined') {
        document.documentElement.lang = locale;
    }
}

export function useFlexLocale() {
    const [currentLocale, setCurrentLocale] = useState<FlexLocale>(() => {
        if (typeof window !== 'undefined') {
            try {
                const fromHtml = document.documentElement.lang?.split('-')[0];
                if (isSupportedLocale(fromHtml)) return fromHtml;
            } catch {
                // ignore
            }
        }
        return DEFAULT_LOCALE;
    });

    useEffect(() => {
        let i18n: { on: (e: string, cb: (lng: string) => void) => void; off: (e: string, cb: (lng: string) => void) => void; language: string } | null = null;
        let handleLanguageChanged: ((lng: string) => void) | null = null;
        void import('@/i18n').then((mod) => {
            i18n = mod.default;
            // sync initial from i18n if available
            const normalizedInit = mod.default.language?.split('-')[0];
            if (isSupportedLocale(normalizedInit)) setCurrentLocale(normalizedInit);
            handleLanguageChanged = (lng: string) => {
                const normalized = lng.split('-')[0];
                if (isSupportedLocale(normalized)) setCurrentLocale(normalized);
            };
            i18n.on('languageChanged', handleLanguageChanged);
        });
        return () => {
            if (i18n && handleLanguageChanged) i18n.off('languageChanged', handleLanguageChanged);
        };
    }, []);

    return {
        locale: currentLocale,
        meta: LOCALE_CONFIG[currentLocale],
        supportedLocales: SUPPORTED_LOCALES.map((code) => LOCALE_CONFIG[code]),
        setLocale: setFlexLocale,
    };
}
