import type { Role } from '@/auth/capabilities';

/**
 * Access-management domain types (POC UI contracts).
 *
 * These mirror the manual-confirmed access concepts (user lifecycle, roles,
 * permissions) and derive role/permission vocabulary from the existing
 * capability registry (`auth/capabilities.tsx`). The real backend contracts
 * are DEFERRED — the mock adapters behind `domain/access-repository.ts` must
 * be replaced in rollout, and the backend remains authoritative.
 */

/** Runtime-confirmed user lifecycle states (no invented suspended/pending). */
export type UserStatus = 'active' | 'inactive' | 'deleted';

export interface UserAccount {
    id: string;
    name: string;
    email: string;
    username: string;
    role: Role;
    status: UserStatus;
    organization: string;
    /** ISO datetime of last recorded activity, when known. */
    lastActivity?: string;
    createdAt: string;
    /** Set when soft-deleted; restore clears it. */
    deletedAt?: string;
}

export type UserStatusFilter = 'all' | UserStatus;

export type UserRoleFilter = 'all' | Role;

export interface UserQuery {
    search?: string;
    status?: UserStatusFilter;
    role?: UserRoleFilter;
    /** When true, the deleted-user view is returned (Show Deleted). */
    deleted?: boolean;
}

export interface UserDraft {
    name: string;
    email: string;
    username: string;
    role: Role;
    organization: string;
    /** Temporary credentials are sent by email; never surfaced in the UI. */
    credentials: 'email' | 'manual';
}

export interface UserUpdateDraft {
    name: string;
    email: string;
    username: string;
    role: Role;
    organization: string;
}
