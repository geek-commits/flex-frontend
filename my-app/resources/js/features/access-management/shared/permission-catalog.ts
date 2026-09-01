import type { Capability, Role } from '@/auth/capabilities';
import { ROLE_CAPABILITIES } from '@/auth/capabilities';

/**
 * Roles & Permissions POC contracts.
 *
 * Permission vocabulary derives from the real capability registry
 * (`auth/capabilities.tsx`) — no invented taxonomy. Roles are the four
 * canonical POC roles. The mock adapter (`domain/access-repository.ts`)
 * must be replaced by the real backend in rollout; the backend remains
 * authoritative for authorization.
 */

export type PermissionType = 'view' | 'manage' | 'workspace' | 'manager';

export type PermissionLabelKey =
    | 'roles.permissions.catalog.dashboardView'
    | 'roles.permissions.catalog.monitorView'
    | 'roles.permissions.catalog.consoleView'
    | 'roles.permissions.catalog.cdrView'
    | 'roles.permissions.catalog.campaignsView'
    | 'roles.permissions.catalog.campaignsManage'
    | 'roles.permissions.catalog.reportsView'
    | 'roles.permissions.catalog.aiView'
    | 'roles.permissions.catalog.systemView'
    | 'roles.permissions.catalog.settingsManage'
    | 'roles.permissions.catalog.securityView'
    | 'roles.permissions.catalog.rolesManage'
    | 'roles.permissions.catalog.tenantsManage'
    | 'roles.permissions.catalog.agentWorkspace'
    | 'roles.permissions.catalog.agentDashboardView'
    | 'roles.permissions.catalog.socialView'
    | 'roles.permissions.catalog.callManager'
    | 'roles.permissions.catalog.missedCallsView'
    | 'roles.permissions.catalog.troubleshootingView'
    | 'roles.permissions.catalog.supportView';

export const PERMISSION_LABEL_KEYS: Record<Capability, PermissionLabelKey> = {
    'dashboard.view': 'roles.permissions.catalog.dashboardView',
    'monitor.view': 'roles.permissions.catalog.monitorView',
    'console.view': 'roles.permissions.catalog.consoleView',
    'cdr.view': 'roles.permissions.catalog.cdrView',
    'campaigns.view': 'roles.permissions.catalog.campaignsView',
    'campaigns.manage': 'roles.permissions.catalog.campaignsManage',
    'reports.view': 'roles.permissions.catalog.reportsView',
    'ai.view': 'roles.permissions.catalog.aiView',
    'system.view': 'roles.permissions.catalog.systemView',
    'settings.manage': 'roles.permissions.catalog.settingsManage',
    'security.view': 'roles.permissions.catalog.securityView',
    'roles.manage': 'roles.permissions.catalog.rolesManage',
    'tenants.manage': 'roles.permissions.catalog.tenantsManage',
    'agent.workspace': 'roles.permissions.catalog.agentWorkspace',
    'agent.dashboard.view': 'roles.permissions.catalog.agentDashboardView',
    'social.view': 'roles.permissions.catalog.socialView',
    'call.manager': 'roles.permissions.catalog.callManager',
    'missed-calls.view': 'roles.permissions.catalog.missedCallsView',
    'troubleshooting.view': 'roles.permissions.catalog.troubleshootingView',
    'support.view': 'roles.permissions.catalog.supportView',
};

export type PermissionModuleKey =
    | 'roles.permissions.modules.dashboard'
    | 'roles.permissions.modules.monitoring'
    | 'roles.permissions.modules.managementConsole'
    | 'roles.permissions.modules.callRecords'
    | 'roles.permissions.modules.campaigns'
    | 'roles.permissions.modules.reports'
    | 'roles.permissions.modules.aiCenter'
    | 'roles.permissions.modules.system'
    | 'roles.permissions.modules.settings'
    | 'roles.permissions.modules.security'
    | 'roles.permissions.modules.rolesPermissions'
    | 'roles.permissions.modules.platform'
    | 'roles.permissions.modules.agentWorkspace'
    | 'roles.permissions.modules.callManager'
    | 'roles.permissions.modules.socialInbox'
    | 'roles.permissions.modules.missedCalls'
    | 'roles.permissions.modules.troubleshooting'
    | 'roles.permissions.modules.support'
    | 'roles.permissions.modules.custom';

export const PERMISSION_MODULE_KEYS: Record<string, PermissionModuleKey> = {
    dashboard: 'roles.permissions.modules.dashboard',
    monitor: 'roles.permissions.modules.monitoring',
    console: 'roles.permissions.modules.managementConsole',
    cdr: 'roles.permissions.modules.callRecords',
    campaigns: 'roles.permissions.modules.campaigns',
    reports: 'roles.permissions.modules.reports',
    ai: 'roles.permissions.modules.aiCenter',
    system: 'roles.permissions.modules.system',
    settings: 'roles.permissions.modules.settings',
    security: 'roles.permissions.modules.security',
    roles: 'roles.permissions.modules.rolesPermissions',
    tenants: 'roles.permissions.modules.platform',
    agent: 'roles.permissions.modules.agentWorkspace',
    call: 'roles.permissions.modules.callManager',
    social: 'roles.permissions.modules.socialInbox',
    'missed-calls': 'roles.permissions.modules.missedCalls',
    troubleshooting: 'roles.permissions.modules.troubleshooting',
    support: 'roles.permissions.modules.support',
    custom: 'roles.permissions.modules.custom',
};

export type PermissionTypeKey =
    | 'roles.permissions.types.view'
    | 'roles.permissions.types.manage'
    | 'roles.permissions.types.workspace'
    | 'roles.permissions.types.manager';

export const PERMISSION_TYPE_KEYS: Record<PermissionType, PermissionTypeKey> = {
    view: 'roles.permissions.types.view',
    manage: 'roles.permissions.types.manage',
    workspace: 'roles.permissions.types.workspace',
    manager: 'roles.permissions.types.manager',
};

export type BuiltinPermissionDefinition = {
    kind: 'builtin';
    id: Capability;
    labelKey: PermissionLabelKey;
    moduleKey: PermissionModuleKey;
    type: PermissionType;
    typeKey: PermissionTypeKey;
};

export type CustomPermissionDefinition = {
    kind: 'custom';
    id: string;
    name: string;
    moduleKey: PermissionModuleKey;
    type: string;
};

export type PermissionDefinition = BuiltinPermissionDefinition | CustomPermissionDefinition;

export const PERMISSIONS: PermissionDefinition[] = (Object.keys(PERMISSION_LABEL_KEYS) as Capability[]).map((id) => {
    const parts = id.split('.');
    const prefix = parts[0];
    const rawType = parts[parts.length - 1] as PermissionType;
    const type: PermissionType = rawType === 'view' || rawType === 'manage' || rawType === 'workspace' || rawType === 'manager' ? rawType : 'view';

    return {
        kind: 'builtin',
        id,
        labelKey: PERMISSION_LABEL_KEYS[id],
        moduleKey: PERMISSION_MODULE_KEYS[prefix] ?? PERMISSION_MODULE_KEYS.custom,
        type,
        typeKey: PERMISSION_TYPE_KEYS[type],
    };
});

export const PERMISSION_TYPES: PermissionType[] = Array.from(
    new Set(PERMISSIONS.filter((p): p is BuiltinPermissionDefinition => p.kind === 'builtin').map((p) => p.type)),
).sort() as PermissionType[];

export interface PermissionDraft {
    name: string;
    type: string;
}

export type BuiltinRoleRecord = {
    kind: 'builtin';
    id: Role;
    permissions: string[];
    userCount: number;
};

export type CustomRoleRecord = {
    kind: 'custom';
    id: string;
    name: string;
    permissions: string[];
    userCount: number;
};

export type RoleRecord = BuiltinRoleRecord | CustomRoleRecord;

export function roleRecords(userCounts: Record<Role, number>): RoleRecord[] {
    return (Object.keys(ROLE_CAPABILITIES) as Role[]).map((id) => ({
        kind: 'builtin' as const,
        id,
        permissions: [...ROLE_CAPABILITIES[id]],
        userCount: userCounts[id] ?? 0,
    }));
}

export interface RoleDraft {
    name: string;
    permissions: string[];
}

/** Modules with their permission options, in a stable order. */
export function permissionGroups(permissions: PermissionDefinition[]): { moduleKey: PermissionModuleKey; permissions: PermissionDefinition[] }[] {
    const byModule = new Map<PermissionModuleKey, PermissionDefinition[]>();

    for (const permission of permissions) {
        const key = permission.moduleKey;
        const list = byModule.get(key) ?? [];
        list.push(permission);
        byModule.set(key, list);
    }

    return Array.from(byModule.entries()).map(([moduleKey, items]) => ({ moduleKey, permissions: items }));
}
