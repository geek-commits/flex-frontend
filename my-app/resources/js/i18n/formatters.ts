import i18n from '@/i18n';
import { DEFAULT_LOCALE,  LOCALE_CONFIG } from './locale';
import type {FlexLocale} from './locale';

function resolveLocale(locale?: FlexLocale): string {
    if (locale && LOCALE_CONFIG[locale]) {
        return LOCALE_CONFIG[locale].formatLocale;
    }

    const current = (i18n.language || DEFAULT_LOCALE) as FlexLocale;

    return LOCALE_CONFIG[current]?.formatLocale || LOCALE_CONFIG[DEFAULT_LOCALE].formatLocale;
}

export function formatDate(
    value: Date | string | number,
    locale?: FlexLocale,
    options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
    try {
        const date = typeof value === 'object' ? value : new Date(value);

        return new Intl.DateTimeFormat(resolveLocale(locale), options).format(date);
    } catch {
        return String(value);
    }
}

export function formatDateTime(
    value: Date | string | number,
    locale?: FlexLocale,
    options: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' },
): string {
    try {
        const date = typeof value === 'object' ? value : new Date(value);

        return new Intl.DateTimeFormat(resolveLocale(locale), options).format(date);
    } catch {
        return String(value);
    }
}

export function formatNumber(
    value: number,
    locale?: FlexLocale,
    options?: Intl.NumberFormatOptions,
): string {
    try {
        return new Intl.NumberFormat(resolveLocale(locale), options).format(value);
    } catch {
        return String(value);
    }
}

export function formatPercent(
    value: number,
    locale?: FlexLocale,
    options?: Intl.NumberFormatOptions,
): string {
    try {
        return new Intl.NumberFormat(resolveLocale(locale), {
            style: 'percent',
            maximumFractionDigits: 1,
            ...options,
        }).format(value);
    } catch {
        return `${value}%`;
    }
}

export function formatCurrency(
    value: number,
    currency = 'USD',
    locale?: FlexLocale,
    options?: Intl.NumberFormatOptions,
): string {
    try {
        return new Intl.NumberFormat(resolveLocale(locale), {
            style: 'currency',
            currency,
            ...options,
        }).format(value);
    } catch {
        return `${currency} ${value}`;
    }
}

export function formatDuration(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) {
return '00:00';
}

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hrs > 0) {
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }

    return `${pad(mins)}:${pad(secs)}`;
}
