import type { Capability } from '@/auth/capabilities';
import type { FlexIconName } from '@/components/flex/iconography';

export type NavDomainKey = 'domains.agent' | 'domains.supervision' | 'domains.administration' | 'domains.platform';
export type NavGroupKey = 'groups.engagement' | 'groups.support' | 'groups.operations' | 'groups.overview' | 'groups.people' | 'groups.routing' | 'groups.media' | 'groups.system';
export type NavItemKey =
    | 'items.agentDashboard'
    | 'items.agentWorkspace'
    | 'items.socialInbox'
    | 'items.missedCalls'
    | 'items.troubleshooting'
    | 'items.quickSupport'
    | 'items.contactCenterDashboard'
    | 'items.agentMonitoring'
    | 'items.cdr'
    | 'items.campaigns'
    | 'items.reports'
    | 'items.managementConsole'
    | 'items.users'
    | 'items.roles'
    | 'items.queues'
    | 'items.ivr'
    | 'items.timeGroups'
    | 'items.timeConditions'
    | 'items.recordings'
    | 'items.subscriptions'
    | 'items.mailConfig'
    | 'items.infrastructure'
    | 'items.aiCenter'
    | 'items.tenantManagement'
    | 'items.settings';

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
    titleKey: NavItemKey;
    href: string;
    icon: FlexIconName;
    capability?: Capability;
}

export interface FlexDomainRouteGroup {
    groupTitle?: string;
    groupTitleKey?: NavGroupKey;
    items: FlexNavRoute[];
}

export interface FlexDomain {
    id: FlexDomainId;
    label: string;
    labelKey: NavDomainKey;
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
        labelKey: 'domains.agent',
        icon: 'agent-workspace',
        capability: 'agent.workspace',
        landingHref: '/agent/dashboard',
        hrefPrefixes: ['/agent'],
        groups: [
            {
                items: [
                    { title: 'Agent Dashboard', titleKey: 'items.agentDashboard', href: '/agent/dashboard', icon: 'dashboard', capability: 'agent.dashboard.view' },
                    { title: 'Agent Workspace', titleKey: 'items.agentWorkspace', href: '/agent', icon: 'agent-workspace', capability: 'agent.workspace' },
                ],
            },
            {
                groupTitle: 'Engagement',
                groupTitleKey: 'groups.engagement',
                items: [
                    { title: 'Social Inbox', titleKey: 'items.socialInbox', href: '/agent/social', icon: 'social-inbox', capability: 'social.view' },
                    { title: 'Callback & Voicemail', titleKey: 'items.missedCalls', href: '/agent/missed-calls', icon: 'missed-calls', capability: 'missed-calls.view' },
                ],
            },
            {
                groupTitle: 'Support',
                groupTitleKey: 'groups.support',
                items: [
                    { title: 'Troubleshooting', titleKey: 'items.troubleshooting', href: '/agent/troubleshooting', icon: 'troubleshooting', capability: 'troubleshooting.view' },
                    { title: 'Quick Support', titleKey: 'items.quickSupport', href: '/agent/support', icon: 'support', capability: 'support.view' },
                ],
            },
        ],
    },
    {
        id: 'supervision',
        label: 'Supervision',
        labelKey: 'domains.supervision',
        icon: 'monitoring',
        capability: 'dashboard.view',
        landingHref: '/dashboard',
        hrefPrefixes: ['/dashboard', '/admin/monitoring', '/admin/cdr', '/admin/campaigns', '/admin/reports'],
        groups: [
            {
                items: [
                    { title: 'Contact Center Dashboard', titleKey: 'items.contactCenterDashboard', href: '/dashboard', icon: 'dashboard', capability: 'dashboard.view' },
                    { title: 'Agent Monitoring', titleKey: 'items.agentMonitoring', href: '/admin/monitoring', icon: 'monitoring', capability: 'monitor.view' },
                ],
            },
            {
                groupTitle: 'Operations',
                groupTitleKey: 'groups.operations',
                items: [
                    { title: 'Call Records (CDR)', titleKey: 'items.cdr', href: '/admin/cdr', icon: 'call-records', capability: 'cdr.view' },
                    { title: 'Call Campaigns', titleKey: 'items.campaigns', href: '/admin/campaigns', icon: 'campaigns', capability: 'campaigns.view' },
                    { title: 'Reports & Analytics', titleKey: 'items.reports', href: '/admin/reports', icon: 'reports', capability: 'reports.view' },
                ],
            },
        ],
    },
    {
        id: 'administration',
        label: 'Administration',
        labelKey: 'domains.administration',
        icon: 'management-console',
        capability: 'console.view',
        landingHref: '/admin/console',
        hrefPrefixes: ['/admin/console', '/admin/users', '/admin/roles', '/admin/queues', '/admin/ivr', '/admin/time-groups', '/admin/time-conditions', '/admin/recordings', '/admin/mail-config', '/admin/subscription', '/admin/system', '/admin/ai', '/settings'],
        groups: [
            {
                groupTitle: 'Overview',
                groupTitleKey: 'groups.overview',
                items: [
                    { title: 'Management Console', titleKey: 'items.managementConsole', href: '/admin/console', icon: 'management-console', capability: 'console.view' },
                ],
            },
            {
                groupTitle: 'People',
                groupTitleKey: 'groups.people',
                items: [
                    { title: 'Users', titleKey: 'items.users', href: '/admin/users', icon: 'users', capability: 'console.view' },
                    { title: 'Roles & Permissions', titleKey: 'items.roles', href: '/admin/roles', icon: 'roles', capability: 'roles.manage' },
                ],
            },
            {
                groupTitle: 'Routing',
                groupTitleKey: 'groups.routing',
                items: [
                    { title: 'Queues', titleKey: 'items.queues', href: '/admin/queues', icon: 'queues', capability: 'console.view' },
                    { title: 'IVR', titleKey: 'items.ivr', href: '/admin/ivr', icon: 'ivr', capability: 'console.view' },
                    { title: 'Time Groups', titleKey: 'items.timeGroups', href: '/admin/time-groups', icon: 'schedules', capability: 'console.view' },
                    { title: 'Time Conditions', titleKey: 'items.timeConditions', href: '/admin/time-conditions', icon: 'time-conditions', capability: 'console.view' },
                ],
            },
            {
                groupTitle: 'Media',
                groupTitleKey: 'groups.media',
                items: [
                    { title: 'Recordings', titleKey: 'items.recordings', href: '/admin/recordings', icon: 'recordings', capability: 'console.view' },
                ],
            },
            {
                groupTitle: 'System',
                groupTitleKey: 'groups.system',
                items: [
                    { title: 'Subscriptions', titleKey: 'items.subscriptions', href: '/admin/subscription', icon: 'subscriptions', capability: 'settings.manage' },
                    { title: 'Mail Configuration', titleKey: 'items.mailConfig', href: '/admin/mail-config', icon: 'mail', capability: 'settings.manage' },
                    { title: 'System & Infrastructure', titleKey: 'items.infrastructure', href: '/admin/system', icon: 'infrastructure', capability: 'system.view' },
                    { title: 'AI Center', titleKey: 'items.aiCenter', href: '/admin/ai', icon: 'ai-center', capability: 'ai.view' },
                ],
            },
        ],
    },
    {
        id: 'platform',
        label: 'Platform',
        labelKey: 'domains.platform',
        icon: 'organizations',
        capability: 'tenants.manage',
        landingHref: '/admin/tenants',
        hrefPrefixes: ['/admin/tenants'],
        groups: [
            {
                items: [
                    { title: 'Tenant Management', titleKey: 'items.tenantManagement', href: '/admin/tenants', icon: 'organizations', capability: 'tenants.manage' },
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
