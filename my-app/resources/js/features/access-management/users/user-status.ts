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

export function formatLastActivity(value?: string): string {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}
