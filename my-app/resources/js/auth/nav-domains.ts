import type { Capability } from '@/auth/capabilities';
import type { FlexIconName } from '@/components/flex/iconography';

/**
 * Major FLEX product domains for the primary app rail and contextual sidebar.
 *
 * Single source of truth: domains group the existing `NAVIGATION` entries by
 * their `workspace` field; visibility is gated through existing capabilities.
 * No route is defined here that does not already exist in `auth/capabilities.tsx`.
 */
export type FlexDomainId = 'agent' | 'supervision' | 'administration' | 'platform';

export interface FlexNavRoute {
    title: string;
    href: string;
    icon: FlexIconName;
    capability?: Capability;
}

export interface FlexDomainRouteGroup {
    groupTitle?: string;
    items: FlexNavRoute[];
}

export interface FlexDomain {
    id: FlexDomainId;
    label: string;
    icon: FlexIconName;
    /** Capability gating visibility of the whole domain on the rail. */
    capability: Capability;
    /** Canonical landing route when the domain icon is activated. */
    landingHref: string;
    /** Route-prefix used to derive the active domain from the current URL. */
    hrefPrefixes: string[];
    groups: FlexDomainRouteGroup[];
}

export const FLEX_DOMAINS: FlexDomain[] = [
    {
        id: 'agent',
        label: 'Agent',
        icon: 'agent-workspace',
        capability: 'agent.workspace',
        landingHref: '/agent/dashboard',
        hrefPrefixes: ['/agent'],
        groups: [
            {
                items: [
                    { title: 'Agent Dashboard', href: '/agent/dashboard', icon: 'dashboard', capability: 'agent.dashboard.view' },
                    { title: 'Agent Workspace', href: '/agent', icon: 'agent-workspace', capability: 'agent.workspace' },
                ],
            },
            {
                groupTitle: 'Engagement',
                items: [
                    { title: 'Social Inbox', href: '/agent/social', icon: 'social-inbox', capability: 'social.view' },
                    { title: 'Callback & Voicemail', href: '/agent/missed-calls', icon: 'missed-calls', capability: 'missed-calls.view' },
                ],
            },
            {
                groupTitle: 'Support',
                items: [
                    { title: 'Troubleshooting', href: '/agent/troubleshooting', icon: 'troubleshooting', capability: 'troubleshooting.view' },
                    { title: 'Quick Support', href: '/agent/support', icon: 'support', capability: 'support.view' },
                ],
            },
        ],
    },
    {
        id: 'supervision',
        label: 'Supervision',
        icon: 'monitoring',
        capability: 'dashboard.view',
        landingHref: '/dashboard',
        hrefPrefixes: ['/dashboard', '/admin/monitoring', '/admin/cdr', '/admin/campaigns', '/admin/reports'],
        groups: [
            {
                items: [
                    { title: 'Contact Center Dashboard', href: '/dashboard', icon: 'dashboard', capability: 'dashboard.view' },
                    { title: 'Agent Monitoring', href: '/admin/monitoring', icon: 'monitoring', capability: 'monitor.view' },
                ],
            },
            {
                groupTitle: 'Operations',
                items: [
                    { title: 'Call Records (CDR)', href: '/admin/cdr', icon: 'call-records', capability: 'cdr.view' },
                    { title: 'Call Campaigns', href: '/admin/campaigns', icon: 'campaigns', capability: 'campaigns.view' },
                    { title: 'Reports & Analytics', href: '/admin/reports', icon: 'reports', capability: 'reports.view' },
                ],
            },
        ],
    },
    {
        id: 'administration',
        label: 'Administration',
        icon: 'management-console',
        capability: 'console.view',
        landingHref: '/admin/console',
        hrefPrefixes: ['/admin/console', '/admin/users', '/admin/roles', '/admin/queues', '/admin/ivr', '/admin/time-groups', '/admin/time-conditions', '/admin/recordings', '/admin/mail-config', '/admin/subscription', '/admin/system', '/admin/ai', '/settings'],
        groups: [
            {
                groupTitle: 'Overview',
                items: [
                    { title: 'Management Console', href: '/admin/console', icon: 'management-console', capability: 'console.view' },
                ],
            },
            {
                groupTitle: 'People',
                items: [
                    { title: 'Users', href: '/admin/users', icon: 'users', capability: 'console.view' },
                    { title: 'Roles & Permissions', href: '/admin/roles', icon: 'roles', capability: 'roles.manage' },
                ],
            },
            {
                groupTitle: 'Routing',
                items: [
                    { title: 'Queues', href: '/admin/queues', icon: 'queues', capability: 'console.view' },
                    { title: 'IVR', href: '/admin/ivr', icon: 'ivr', capability: 'console.view' },
                    { title: 'Time Groups', href: '/admin/time-groups', icon: 'schedules', capability: 'console.view' },
                    { title: 'Time Conditions', href: '/admin/time-conditions', icon: 'time-conditions', capability: 'console.view' },
                ],
            },
            {
                groupTitle: 'Media',
                items: [
                    { title: 'Recordings', href: '/admin/recordings', icon: 'recordings', capability: 'console.view' },
                ],
            },
            {
                groupTitle: 'System',
                items: [
                    { title: 'Subscriptions', href: '/admin/subscription', icon: 'subscriptions', capability: 'settings.manage' },
                    { title: 'Mail Configuration', href: '/admin/mail-config', icon: 'mail', capability: 'settings.manage' },
                    { title: 'System & Infrastructure', href: '/admin/system', icon: 'infrastructure', capability: 'system.view' },
                    { title: 'AI Center', href: '/admin/ai', icon: 'ai-center', capability: 'ai.view' },
                ],
            },
        ],
    },
    {
        id: 'platform',
        label: 'Platform',
        icon: 'organizations',
        capability: 'tenants.manage',
        landingHref: '/admin/tenants',
        hrefPrefixes: ['/admin/tenants'],
        groups: [
            {
                items: [
                    { title: 'Tenant Management', href: '/admin/tenants', icon: 'organizations', capability: 'tenants.manage' },
                ],
            },
        ],
    },
];

/** Boundary-aware active-route check: exact match or prefix with slash boundary. */
export function isActiveRoute(currentUrl: string, href: string): boolean {
    const path = currentUrl.split(/[?#]/)[0] ?? currentUrl;

    return path === href || path.startsWith(`${href}/`);
}

/** Derive the active major domain from the current URL using the domain map. */
export function deriveActiveDomain(url: string): FlexDomainId | null {
    const path = url.split(/[?#]/)[0] ?? url;

    for (const domain of FLEX_DOMAINS) {
        if (domain.hrefPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
            return domain.id;
        }
    }

    return null;
}
