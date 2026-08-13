import type { Role } from '@/auth/capabilities';
import { USERS_MOCK_RECORDS } from '@/data/users.mock';
import type { UserAccount, UserDraft, UserQuery, UserUpdateDraft } from '@/features/access-management/shared/types';

/**
 * Access repository boundary.
 *
 * POC MOCK — operates on the in-memory synthetic dataset. CRUD mutations
 * update a local copy for the session. The real backend must implement the
 * same contract (persistence, authorization, validation) later. No HTTP API
 * is faked. The backend remains authoritative for access decisions.
 */

export interface AccessRepository {
    queryUsers(query: UserQuery): UserAccount[];
    getById(id: string): UserAccount | undefined;
    createUser(draft: UserDraft): UserAccount;
    updateUser(id: string, draft: UserUpdateDraft): UserAccount | undefined;
    resetPasswordLink(id: string): void;
    deactivateUser(id: string): UserAccount | undefined;
    softDeleteUser(id: string): UserAccount | undefined;
    restoreUser(id: string): UserAccount | undefined;
}

let records = [...USERS_MOCK_RECORDS];

export const roleLabels: Record<Role, string> = {
    'super-admin': 'Super Administrator',
    admin: 'Administrator',
    agent: 'Agent',
};

function matches(query: UserQuery, user: UserAccount): boolean {
    const needle = query.search?.trim().toLowerCase();

    const matchesSearch =
        !needle ||
        user.name.toLowerCase().includes(needle) ||
        user.email.toLowerCase().includes(needle) ||
        user.username.toLowerCase().includes(needle);

    const matchesStatus = !query.status || query.status === 'all' || user.status === query.status;
    const matchesRole = !query.role || query.role === 'all' || user.role === query.role;
    const matchesDeletedView = query.deleted ? user.status === 'deleted' : user.status !== 'deleted';

    return matchesSearch && matchesStatus && matchesRole && matchesDeletedView;
}

export const accessRepository: AccessRepository = {
    queryUsers(query: UserQuery) {
        return records.filter((user) => matches(query, user));
    },

    getById(id: string) {
        return records.find((user) => user.id === id);
    },

    createUser(draft: UserDraft) {
        const now = new Date().toISOString();
        const user: UserAccount = {
            id: `u${Date.now()}`,
            name: draft.name,
            email: draft.email,
            username: draft.username,
            role: draft.role,
            status: 'active',
            organization: draft.organization,
            createdAt: now,
            lastActivity: now,
        };
        records = [user, ...records];

        return user;
    },

    updateUser(id: string, draft: UserUpdateDraft) {
        const existing = records.find((user) => user.id === id);

        if (!existing) {
            return undefined;
        }

        existing.name = draft.name;
        existing.email = draft.email;
        existing.username = draft.username;
        existing.role = draft.role;
        existing.organization = draft.organization;

        return existing;
    },

    resetPasswordLink() {
        // POC MOCK — no email is sent. A real adapter would call the reset endpoint.
    },

    deactivateUser(id: string) {
        const existing = records.find((user) => user.id === id);

        if (existing) {
            existing.status = 'inactive';
        }

        return existing;
    },

    softDeleteUser(id: string) {
        const existing = records.find((user) => user.id === id);

        if (existing) {
            existing.status = 'deleted';
            existing.deletedAt = new Date().toISOString();
        }

        return existing;
    },

    restoreUser(id: string) {
        const existing = records.find((user) => user.id === id);

        if (existing) {
            existing.status = 'active';
            existing.deletedAt = undefined;
        }

        return existing;
    },
};
