/**
 * Tenants / platform domain types (POC UI contracts).
 *
 * These mirror the manual-confirmed platform concepts (tenant directory, add,
 * edit, enable/disable, view, context switch). The real backend contracts are
 * DEFERRED — the mock adapter behind `domain/tenant-repository.ts` must be
 * replaced in rollout, and the backend remains authoritative.
 *
 * No invented statuses: only `active` and `disabled` are modeled (no
 * suspended/pending/archived) until the backend defines the true enum.
 */

/** Runtime-confirmed tenant lifecycle states (no invented states). */
export type TenantStatus = 'active' | 'disabled';

export interface TenantRecord {
    id: string;
    name: string;
    email: string;
    domain: string;
    contact: string;
    phone: string;
    status: TenantStatus;
    /** ISO datetime of creation. */
    createdAt: string;
}

export type TenantStatusFilter = 'all' | TenantStatus;

export interface TenantQuery {
    search?: string;
    status?: TenantStatusFilter;
}

export interface TenantDraft {
    name: string;
    email: string;
    domain: string;
    contact: string;
    phone: string;
}

export interface TenantUpdateDraft extends TenantDraft {
    status: TenantStatus;
}
