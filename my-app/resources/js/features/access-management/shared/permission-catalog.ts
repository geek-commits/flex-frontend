import type { Capability, Role } from '@/auth/capabilities';
import { ROLE_CAPABILITIES } from '@/auth/capabilities';

/**
 * Roles & Permissions POC contracts.
 *
 * Permission vocabulary derives from the real capability registry
 * (`auth/capabilities.tsx`) — no invented taxonomy. Roles are the three
 * canonical runtime roles. The mock adapter (`domain/access-repository.ts`)
 * must be replaced by the real backend in rollout; the backend remains
 * authoritative for authorization.
 */

export interface PermissionDefinition {
    id: string;
    name: string;
    module: string;
    /** Action suffix derived from the real capability token (`view` | `manage` | `workspace` | `manager`). */
    type: string;
}

/** Human labels for each capability — display-only, derived 1:1 from the registry. */
export const PERMISSION_LABELS: Record<Capability, string> = {
    'dashboard.view': 'View Dashboard',
    'monitor.view': 'View Agent Monitoring',
    'console.view': 'View Management Console',
    'cdr.view': 'View Call Records',
    'campaigns.view': 'View Campaigns',
    'campaigns.manage': 'Manage Campaigns',
    'reports.view': 'View Reports',
    'ai.view': 'View AI Center',
    'system.view': 'View System & Infrastructure',
    'settings.manage': 'Manage Settings',
    'security.view': 'View Security',
    'roles.manage': 'Manage Roles & Permissions',
    'agent.workspace': 'Use Agent Workspace',
    'agent.dashboard.view': 'View Agent Dashboard',
    'social.view': 'View Social Inbox',
    'call.manager': 'Use Call Manager',
    'missed-calls.view': 'View Missed Calls',
    'troubleshooting.view': 'View Troubleshooting',
    'support.view': 'View Quick Support',
};

/** Module derived from the capability token prefix. */
const MODULE_BY_PREFIX: Record<string, string> = {
    dashboard: 'Dashboard',
    monitor: 'Monitoring',
    console: 'Management Console',
    cdr: 'Call Records',
    campaigns: 'Campaigns',
    reports: 'Reports',
    ai: 'AI Center',
    system: 'System',
    settings: 'Settings',
    security: 'Security',
    roles: 'Roles & Permissions',
    agent: 'Agent Workspace',
    call: 'Call Manager',
    social: 'Social Inbox',
    'missed-calls': 'Missed Calls',
    troubleshooting: 'Troubleshooting',
    support: 'Support',
};

export const PERMISSIONS: PermissionDefinition[] = (Object.keys(PERMISSION_LABELS) as Capability[]).map((id) => {
    const parts = id.split('.');
    const prefix = parts[0];
    const type = parts[1] ?? prefix;

    return {
        id,
        name: PERMISSION_LABELS[id],
        module: MODULE_BY_PREFIX[prefix] ?? prefix,
        type,
    };
});

/** Distinct permission types present in the real capability set. */
export const PERMISSION_TYPES: string[] = Array.from(new Set(PERMISSIONS.map((permission) => permission.type))).sort();

/** Human module label for a permission id (derived from the token prefix). */
export function permissionModuleLabel(id: string): string {
    const prefix = id.split('.')[0];

    return MODULE_BY_PREFIX[prefix] ?? prefix;
}

export interface PermissionDraft {
    name: string;
    type: string;
}

export interface RoleRecord {
    id: string;
    name: string;
    permissions: string[];
    /** Count of POC users currently assigned this role. */
    userCount: number;
}

export function roleRecords(userCounts: Record<Role, number>): RoleRecord[] {
    return (Object.keys(ROLE_CAPABILITIES) as Role[]).map((id) => ({
        id,
        name: id === 'super-admin' ? 'Super Administrator' : id === 'admin' ? 'Administrator' : 'Agent',
        permissions: [...ROLE_CAPABILITIES[id]],
        userCount: userCounts[id] ?? 0,
    }));
}

export interface RoleDraft {
    name: string;
    permissions: string[];
}

/** Modules with their permission options, in a stable order. */
export function permissionGroups(permissions: PermissionDefinition[]): { module: string; permissions: PermissionDefinition[] }[] {
    const byModule = new Map<string, PermissionDefinition[]>();

    for (const permission of permissions) {
        const list = byModule.get(permission.module) ?? [];

        list.push(permission);
        byModule.set(permission.module, list);
    }

    return Array.from(byModule.entries()).map(([module, items]) => ({ module, permissions: items }));
}