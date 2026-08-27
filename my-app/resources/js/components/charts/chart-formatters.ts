import { LOCALE_CONFIG, type FlexLocale } from '@/i18n/locale';

function resolveLocaleTag(locale?: string): string {
    const tag = (locale as FlexLocale | undefined) && LOCALE_CONFIG[locale as FlexLocale]?.formatLocale;
    return tag ?? 'en-GB';
}

export function getShortDateFmt(locale?: string): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(resolveLocaleTag(locale), {
        month: 'short',
        day: 'numeric',
    });
}
export const shortDateFmt = getShortDateFmt('en');

export function getWeekdayDateFmt(locale?: string): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(resolveLocaleTag(locale), {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}
export const weekdayDateFmt = getWeekdayDateFmt('en');

export function getHmsTimeFmt(locale?: string): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(resolveLocaleTag(locale), {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
}
export const hmsTimeFmt = getHmsTimeFmt('en');

export function getIntFmt(locale?: string): (n: number) => string {
    return new Intl.NumberFormat(resolveLocaleTag(locale)).format;
}
// `Intl.NumberFormat.prototype.format` is a bound getter — safe to extract.
export const intFmt = getIntFmt('en');
