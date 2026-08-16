import { TENANTS_MOCK_RECORDS } from '@/data/tenants.mock';
import type { TenantDraft, TenantQuery, TenantRecord, TenantStatus, TenantUpdateDraft } from '@/features/tenants/shared/types';

/**
 * Tenant repository boundary.
 *
 * POC MOCK — operates on the in-memory synthetic dataset. CRUD mutations
 * update a local copy for the session. The real backend must implement the
 * same contract (persistence, authorization, validation, status semantics,
 * context switching) later. No HTTP API is faked. The backend remains
 * authoritative for tenant decisions and cross-tenant isolation.
 */

export interface TenantRepository {
    queryTenants(query: TenantQuery): TenantRecord[];
    getById(id: string): TenantRecord | undefined;
    createTenant(draft: TenantDraft): TenantRecord;
    updateTenant(id: string, draft: TenantUpdateDraft): TenantRecord | undefined;
    setStatus(id: string, status: TenantStatus): TenantRecord | undefined;
}

let records = [...TENANTS_MOCK_RECORDS];

function matches(query: TenantQuery, tenant: TenantRecord): boolean {
    const needle = query.search?.trim().toLowerCase();

    const matchesSearch =
        !needle ||
        tenant.name.toLowerCase().includes(needle) ||
        tenant.domain.toLowerCase().includes(needle) ||
        tenant.email.toLowerCase().includes(needle) ||
        tenant.contact.toLowerCase().includes(needle) ||
        tenant.phone.toLowerCase().includes(needle);

    const matchesStatus = !query.status || query.status === 'all' || tenant.status === query.status;

    return matchesSearch && matchesStatus;
}

export const tenantRepository: TenantRepository = {
    queryTenants(query: TenantQuery) {
        return records.filter((tenant) => matches(query, tenant));
    },

    getById(id: string) {
        return records.find((tenant) => tenant.id === id);
    },

    createTenant(draft: TenantDraft) {
        const tenant: TenantRecord = {
            id: `t${Date.now()}`,
            name: draft.name,
            email: draft.email,
            domain: draft.domain,
            contact: draft.contact,
            phone: draft.phone,
            status: 'active',
            createdAt: new Date().toISOString(),
        };
        records = [tenant, ...records];

        return tenant;
    },

    updateTenant(id: string, draft: TenantUpdateDraft) {
        const existing = records.find((tenant) => tenant.id === id);

        if (!existing) {
            return undefined;
        }

        existing.name = draft.name;
        existing.email = draft.email;
        existing.domain = draft.domain;
        existing.contact = draft.contact;
        existing.phone = draft.phone;
        existing.status = draft.status;

        return existing;
    },

    setStatus(id: string, status: TenantStatus) {
        const existing = records.find((tenant) => tenant.id === id);

        if (existing) {
            existing.status = status;
        }

        return existing;
    },
};
