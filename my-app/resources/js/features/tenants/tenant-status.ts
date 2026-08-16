import type { FlexStatusTone } from '@/components/flex/flex-status';
import type { TenantStatus } from '@/features/tenants/shared/types';

/**
 * Tenant lifecycle → shared FLEX semantic tones.
 * Domain presentation rule (UI), not backend business logic.
 */
export const TENANT_STATUS_TONE: Record<TenantStatus, FlexStatusTone> = {
    active: 'success',
    disabled: 'neutral',
};

export const TENANT_STATUS_OPTIONS: TenantStatus[] = ['active', 'disabled'];

export const TENANT_STATUS_LABELS: Record<TenantStatus, string> = {
    active: 'Active',
    disabled: 'Disabled',
};

export function formatTenantDate(value: string): string {
    return new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
