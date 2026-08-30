import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FLEX_DOMAINS } from '@/auth/nav-domains';
import type { NavItemKey } from '@/auth/nav-domains';
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

export type Role = 'super-admin' | 'admin' | 'supervisor' | 'agent';

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
    | 'tenants.manage'
    | 'agent.workspace'
    | 'agent.dashboard.view'
    | 'social.view'
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
    'tenants.manage',
    'agent.workspace',
    'agent.dashboard.view',
    'social.view',
    'call.manager',
    'missed-calls.view',
    'troubleshooting.view',
    'support.view',
];

/** Verified capability sets per role (manual-backed, INSTRUCTIONS §7). */
export const ROLE_CAPABILITIES: Record<Role, Capability[]> = {
    'super-admin': ALL,
    supervisor: [
        'dashboard.view',
        'monitor.view',
        'console.view',
        'cdr.view',
        'campaigns.view',
        'campaigns.manage',
        'reports.view',
        'support.view',
    ],
    admin: [
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
        'roles.manage',
        'support.view',
    ],
    agent: [
        'agent.workspace',
        'agent.dashboard.view',
        'social.view',
        'call.manager',
        'missed-calls.view',
        'troubleshooting.view',
        'support.view',
    ],
};

export interface NavEntry {
    title: string;
    titleKey: NavItemKey;
    href: string;
    icon: FlexIconName;
    capability: Capability;
    workspace: 'admin' | 'agent' | 'shared';
    badge?: string;
}

/**
 * Derived flat navigation — single metadata source lives in `FLEX_DOMAINS`
 * (`auth/nav-domains.ts`). NAVIGATION is re-derived for consumers that need a
 * flat list (Global Search, mobile). Do not hand-maintain entries here.
 */

function deriveNavigation(): NavEntry[] {
    const domainWorkspace: Record<string, NavEntry['workspace']> = {
        agent: 'agent',
        supervision: 'admin',
        administration: 'admin',
        platform: 'admin',
    };

    const flat: NavEntry[] = FLEX_DOMAINS.flatMap((domain) =>
        domain.groups.flatMap((group) =>
            group.items.map(
                (item): NavEntry => ({
                    title: item.title,
                    titleKey: item.titleKey,
                    href: item.href,
                    icon: item.icon,
                    capability: item.capability as Capability,
                    workspace: domainWorkspace[domain.id] ?? 'admin',
                }),
            ),
        ),
    );

    // Shared non-domain route (Settings/Profile) — not part of the main domain tree (§24).
    flat.push({
        title: 'Settings',
        titleKey: 'items.settings',
        href: '/settings/profile',
        icon: 'settings',
        capability: 'settings.manage',
        workspace: 'shared',
    });

    return flat;
}

export const NAVIGATION: NavEntry[] = deriveNavigation();

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