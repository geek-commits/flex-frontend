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
    titleKey: string;
    href: string;
    icon: FlexIconName;
    capability?: Capability;
}

export interface FlexDomainRouteGroup {
    groupTitle?: string;
    groupTitleKey?: string;
    items: FlexNavRoute[];
}

export interface FlexDomain {
    id: FlexDomainId;
    label: string;
    labelKey: string;
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
        labelKey: 'navigation:domains.agent',
        icon: 'agent-workspace',
        capability: 'agent.workspace',
        landingHref: '/agent/dashboard',
        hrefPrefixes: ['/agent'],
        groups: [
            {
                items: [
                    { title: 'Agent Dashboard', titleKey: 'navigation:items.agentDashboard', href: '/agent/dashboard', icon: 'dashboard', capability: 'agent.dashboard.view' },
                    { title: 'Agent Workspace', titleKey: 'navigation:items.agentWorkspace', href: '/agent', icon: 'agent-workspace', capability: 'agent.workspace' },
                ],
            },
            {
                groupTitle: 'Engagement',
                groupTitleKey: 'navigation:groups.engagement',
                items: [
                    { title: 'Social Inbox', titleKey: 'navigation:items.socialInbox', href: '/agent/social', icon: 'social-inbox', capability: 'social.view' },
                    { title: 'Callback & Voicemail', titleKey: 'navigation:items.missedCalls', href: '/agent/missed-calls', icon: 'missed-calls', capability: 'missed-calls.view' },
                ],
            },
            {
                groupTitle: 'Support',
                groupTitleKey: 'navigation:groups.support',
                items: [
                    { title: 'Troubleshooting', titleKey: 'navigation:items.troubleshooting', href: '/agent/troubleshooting', icon: 'troubleshooting', capability: 'troubleshooting.view' },
                    { title: 'Quick Support', titleKey: 'navigation:items.quickSupport', href: '/agent/support', icon: 'support', capability: 'support.view' },
                ],
            },
        ],
    },
    {
        id: 'supervision',
        label: 'Supervision',
        labelKey: 'navigation:domains.supervision',
        icon: 'monitoring',
        capability: 'dashboard.view',
        landingHref: '/dashboard',
        hrefPrefixes: ['/dashboard', '/admin/monitoring', '/admin/cdr', '/admin/campaigns', '/admin/reports'],
        groups: [
            {
                items: [
                    { title: 'Contact Center Dashboard', titleKey: 'navigation:items.contactCenterDashboard', href: '/dashboard', icon: 'dashboard', capability: 'dashboard.view' },
                    { title: 'Agent Monitoring', titleKey: 'navigation:items.agentMonitoring', href: '/admin/monitoring', icon: 'monitoring', capability: 'monitor.view' },
                ],
            },
            {
                groupTitle: 'Operations',
                groupTitleKey: 'navigation:groups.operations',
                items: [
                    { title: 'Call Records (CDR)', titleKey: 'navigation:items.cdr', href: '/admin/cdr', icon: 'call-records', capability: 'cdr.view' },
                    { title: 'Call Campaigns', titleKey: 'navigation:items.campaigns', href: '/admin/campaigns', icon: 'campaigns', capability: 'campaigns.view' },
                    { title: 'Reports & Analytics', titleKey: 'navigation:items.reports', href: '/admin/reports', icon: 'reports', capability: 'reports.view' },
                ],
            },
        ],
    },
    {
        id: 'administration',
        label: 'Administration',
        labelKey: 'navigation:domains.administration',
        icon: 'management-console',
        capability: 'console.view',
        landingHref: '/admin/console',
        hrefPrefixes: ['/admin/console', '/admin/users', '/admin/roles', '/admin/queues', '/admin/ivr', '/admin/time-groups', '/admin/time-conditions', '/admin/recordings', '/admin/mail-config', '/admin/subscription', '/admin/system', '/admin/ai', '/settings'],
        groups: [
            {
                groupTitle: 'Overview',
                groupTitleKey: 'navigation:groups.overview',
                items: [
                    { title: 'Management Console', titleKey: 'navigation:items.managementConsole', href: '/admin/console', icon: 'management-console', capability: 'console.view' },
                ],
            },
            {
                groupTitle: 'People',
                groupTitleKey: 'navigation:groups.people',
                items: [
                    { title: 'Users', titleKey: 'navigation:items.users', href: '/admin/users', icon: 'users', capability: 'console.view' },
                    { title: 'Roles & Permissions', titleKey: 'navigation:items.roles', href: '/admin/roles', icon: 'roles', capability: 'roles.manage' },
                ],
            },
            {
                groupTitle: 'Routing',
                groupTitleKey: 'navigation:groups.routing',
                items: [
                    { title: 'Queues', titleKey: 'navigation:items.queues', href: '/admin/queues', icon: 'queues', capability: 'console.view' },
                    { title: 'IVR', titleKey: 'navigation:items.ivr', href: '/admin/ivr', icon: 'ivr', capability: 'console.view' },
                    { title: 'Time Groups', titleKey: 'navigation:items.timeGroups', href: '/admin/time-groups', icon: 'schedules', capability: 'console.view' },
                    { title: 'Time Conditions', titleKey: 'navigation:items.timeConditions', href: '/admin/time-conditions', icon: 'time-conditions', capability: 'console.view' },
                ],
            },
            {
                groupTitle: 'Media',
                groupTitleKey: 'navigation:groups.media',
                items: [
                    { title: 'Recordings', titleKey: 'navigation:items.recordings', href: '/admin/recordings', icon: 'recordings', capability: 'console.view' },
                ],
            },
            {
                groupTitle: 'System',
                groupTitleKey: 'navigation:groups.system',
                items: [
                    { title: 'Subscriptions', titleKey: 'navigation:items.subscriptions', href: '/admin/subscription', icon: 'subscriptions', capability: 'settings.manage' },
                    { title: 'Mail Configuration', titleKey: 'navigation:items.mailConfig', href: '/admin/mail-config', icon: 'mail', capability: 'settings.manage' },
                    { title: 'System & Infrastructure', titleKey: 'navigation:items.infrastructure', href: '/admin/system', icon: 'infrastructure', capability: 'system.view' },
                    { title: 'AI Center', titleKey: 'navigation:items.aiCenter', href: '/admin/ai', icon: 'ai-center', capability: 'ai.view' },
                ],
            },
        ],
    },
    {
        id: 'platform',
        label: 'Platform',
        labelKey: 'navigation:domains.platform',
        icon: 'organizations',
        capability: 'tenants.manage',
        landingHref: '/admin/tenants',
        hrefPrefixes: ['/admin/tenants'],
        groups: [
            {
                items: [
                    { title: 'Tenant Management', titleKey: 'navigation:items.tenantManagement', href: '/admin/tenants', icon: 'organizations', capability: 'tenants.manage' },
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
