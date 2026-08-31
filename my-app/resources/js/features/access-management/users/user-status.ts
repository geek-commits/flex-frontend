import type { FlexStatusTone } from '@/components/flex/flex-status';
import type { UserStatus } from '@/features/access-management/shared/types';

/**
 * User lifecycle → shared FLEX semantic tones.
 * Domain presentation rule (UI), not backend business logic.
 */
export const USER_STATUS_TONE: Record<UserStatus, FlexStatusTone> = {
    active: 'success',
    inactive: 'neutral',
    deleted: 'danger',
};

export const USER_STATUS_OPTIONS: UserStatus[] = ['active', 'inactive', 'deleted'];

export const USER_STATUS_KEYS = {
    active: 'users.status.active',
    inactive: 'users.status.inactive',
    deleted: 'users.status.deleted',
} as const satisfies Record<UserStatus, `users.status.${string}`>;

const LOCALE_MAP: Record<string, string> = {
    en: 'en-GB',
    sw: 'sw-TZ',
    fr: 'fr-FR',
};

export function formatLastActivity(value: string | undefined, locale: string): string {
    if (!value) {
        return '—';
    }

    const formatLocale = LOCALE_MAP[locale] ?? locale;

    return new Date(value).toLocaleString(formatLocale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}
