import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { FlexIconName } from '@/components/flex/iconography';

/**
 * POC capability registry — UI-only source of truth for role-aware navigation,
 * global search visibility, and contextual sidebar visibility.
 *
 * IMPORTANT: This is a frontend-only proof-of-concept model. The backend has no
 * roles/permissions yet (Fortify session auth only). Server-side authorization is
 * DEFERRED and must be enforced at the data source in a later rollout. The default
 * role is `super-admin`; the POC role switcher (in the global search footer) is
 * purely for demonstrating role-aware UI and does not grant or restrict access.
 */

export type Role = 'super-admin' | 'admin' | 'agent';

export type Capability =
    | 'dashboard.view'
    | 'monitor.view'
    | 'console.view'
    | 'cdr.view'
    | 'campaigns.view'
    | 'campaigns.manage'
    | 'reports.view'
    | 'ai.view'
    | 'system.view'
    | 'settings.manage'
    | 'security.view'
    | 'roles.manage'
    | 'agent.workspace'
    | 'call.manager'
    | 'missed-calls.view'
    | 'troubleshooting.view'
    | 'support.view';

const ALL: Capability[] = [
    'dashboard.view',
    'monitor.view',
    'console.view',
    'cdr.view',
    'campaigns.view',
    'campaigns.manage',
    'reports.view',
    'ai.view',
    'system.view',
    'settings.manage',
    'security.view',
    'roles.manage',
    'agent.workspace',
    'call.manager',
    'missed-calls.view',
    'troubleshooting.view',
    'support.view',
];

/** Verified capability sets per role (mirrors INSTRUCTIONS §7 role boundaries). */
export const ROLE_CAPABILITIES: Record<Role, Capability[]> = {
    'super-admin': ALL,
    admin: [
        'dashboard.view',
        'monitor.view',
        'console.view',
        'cdr.view',
        'campaigns.view',
        'campaigns.manage',
        'reports.view',
        'settings.manage',
        'support.view',
    ],
    agent: [
        'agent.workspace',
        'call.manager',
        'missed-calls.view',
        'troubleshooting.view',
        'support.view',
    ],
};

export interface NavEntry {
    title: string;
    href: string;
    icon: FlexIconName;
    capability: Capability;
    workspace: 'admin' | 'agent' | 'shared';
    badge?: string;
}

/** Single navigation model consumed by PrimaryRail, ContextSidebar and Global Search. */
export const NAVIGATION: NavEntry[] = [
    { title: 'Agent Workspace', href: '/agent', icon: 'agent-workspace', capability: 'agent.workspace', workspace: 'agent', badge: 'Live' },
    { title: 'Contact Center Dashboard', href: '/dashboard', icon: 'dashboard', capability: 'dashboard.view', workspace: 'admin' },
    { title: 'Agent Monitoring', href: '/admin/monitoring', icon: 'monitoring', capability: 'monitor.view', workspace: 'admin' },
    { title: 'Management Console', href: '/admin/console', icon: 'management-console', capability: 'console.view', workspace: 'admin' },
    { title: 'Call Records (CDR)', href: '/admin/cdr', icon: 'call-records', capability: 'cdr.view', workspace: 'admin' },
    { title: 'Call Campaigns', href: '/admin/campaigns', icon: 'campaigns', capability: 'campaigns.view', workspace: 'admin' },
    { title: 'Reports & Analytics', href: '/admin/reports', icon: 'reports', capability: 'reports.view', workspace: 'admin' },
    { title: 'AI Center', href: '/admin/ai', icon: 'ai-center', capability: 'ai.view', workspace: 'admin' },
    { title: 'System & Infrastructure', href: '/admin/system', icon: 'infrastructure', capability: 'system.view', workspace: 'admin' },
    { title: 'Missed Calls', href: '/agent/missed-calls', icon: 'missed-calls', capability: 'missed-calls.view', workspace: 'agent' },
    { title: 'Troubleshooting', href: '/agent/troubleshooting', icon: 'troubleshooting', capability: 'troubleshooting.view', workspace: 'agent' },
    { title: 'Quick Support', href: '/agent/support', icon: 'support', capability: 'support.view', workspace: 'agent' },
    { title: 'Settings', href: '/settings/profile', icon: 'settings', capability: 'settings.manage', workspace: 'shared' },
];

const ROLE_STORAGE_KEY = 'flex.poc.role';

function readInitialRole(): Role {
    try {
        const stored = localStorage.getItem(ROLE_STORAGE_KEY) as Role | null;

        if (stored && stored in ROLE_CAPABILITIES) {
return stored;
}
    } catch {
        /* ignore */
    }

    return 'super-admin';
}

interface CapabilityContextValue {
    role: Role;
    setRole: (role: Role) => void;
    has: (capability: Capability) => boolean;
    /** Navigation entries the current role can see, in declared order. */
    navEntries: NavEntry[];
}

const CapabilityContext = createContext<CapabilityContextValue | null>(null);

export function CapabilityProvider({ children }: { children: React.ReactNode }) {
    const [role, setRoleState] = useState<Role>(readInitialRole);

    useEffect(() => {
        try {
            localStorage.setItem(ROLE_STORAGE_KEY, role);
        } catch {
            /* ignore */
        }
    }, [role]);

    const setRole = useCallback((next: Role) => setRoleState(next), []);

    const value = useMemo<CapabilityContextValue>(() => {
        const caps = ROLE_CAPABILITIES[role];
        const has = (capability: Capability) => caps.includes(capability);

        return {
            role,
            setRole,
            has,
            navEntries: NAVIGATION.filter((entry) => caps.includes(entry.capability)),
        };
    }, [role, setRole]);

    return <CapabilityContext.Provider value={value}>{children}</CapabilityContext.Provider>;
}

export function useCapabilities(): CapabilityContextValue {
    const ctx = useContext(CapabilityContext);

    if (!ctx) {
throw new Error('useCapabilities must be used within a CapabilityProvider');
}

    return ctx;
}
