import type { Capability } from '@/auth/capabilities';
import type { FlexIconName } from '@/components/flex/iconography';

export type NavAreaKey =
    | 'domains.agent'
    | 'domains.supervision'
    | 'domains.administration'
    | 'domains.platform'
    | 'areas.settings';

export type NavGroupKey =
    | 'groups.account'
    | 'groups.analytics'
    | 'groups.contactCenter'
    | 'groups.engagement'
    | 'groups.media'
    | 'groups.operations'
    | 'groups.operationalPolicies'
    | 'groups.overview'
    | 'groups.people'
    | 'groups.routing'
    | 'groups.routingTrunks'
    | 'groups.support'
    | 'groups.system'
    | 'groups.systemSecurity';

export type NavItemKey =
    | 'items.agentDashboard'
    | 'items.agentWorkspace'
    | 'items.socialInbox'
    | 'items.missedCalls'
    | 'items.troubleshooting'
    | 'items.quickSupport'
    | 'items.contactCenterDashboard'
    | 'items.agentMonitoring'
    | 'items.exceptions'
    | 'items.cdr'
    | 'items.campaigns'
    | 'items.reports'
    | 'items.callStats'
    | 'items.charts'
    | 'items.surveyMonitoring'
    | 'items.managementConsole'
    | 'items.agents'
    | 'items.users'
    | 'items.roles'
    | 'items.queues'
    | 'items.ivr'
    | 'items.inboundRoutes'
    | 'items.outboundRoutes'
    | 'items.timeGroups'
    | 'items.timeConditions'
    | 'items.recordings'
    | 'items.subscriptions'
    | 'items.mailConfig'
    | 'items.infrastructure'
    | 'items.systemHealth'
    | 'items.securityAdministration'
    | 'items.backups'
    | 'items.aiCenter'
    | 'items.tenantManagement'
    | 'items.settings'
    | 'items.profile'
    | 'items.accountSecurity'
    | 'items.appearance'
    | 'items.musicOnHold'
    | 'items.tones'
    | 'items.agentStates'
    | 'items.departments'
    | 'items.surveys'
    | 'items.cdrConfiguration'
    | 'items.globalConfiguration';

export type FlexDomainId =
    'agent' | 'supervision' | 'administration' | 'platform';
export type FlexNavigationAreaId = FlexDomainId | 'settings';

export interface FlexNavRoute {
    title: string;
    titleKey: NavItemKey;
    href: string;
    icon: FlexIconName;
    capability?: Capability;
    /** Additional paths that resolve to this canonical navigation destination. */
    aliases?: string[];
    /** The route exists but currently resolves to the shared module placeholder. */
    placeholder?: boolean;
}

export interface FlexDomainRouteGroup {
    groupTitle?: string;
    groupTitleKey?: NavGroupKey;
    items: FlexNavRoute[];
}

export interface FlexNavigationArea {
    id: FlexNavigationAreaId;
    kind: 'workspace' | 'utility';
    label: string;
    labelKey: NavAreaKey;
    icon: FlexIconName;
    capability?: Capability;
    landingHref: string;
    groups: FlexDomainRouteGroup[];
}

export interface FlexDomain extends FlexNavigationArea {
    id: FlexDomainId;
    kind: 'workspace';
    capability: Capability;
}

export const FLEX_DOMAINS: FlexDomain[] = [
    {
        id: 'agent',
        kind: 'workspace',
        label: 'Agent',
        labelKey: 'domains.agent',
        icon: 'agent-workspace',
        capability: 'agent.workspace',
        landingHref: '/agent/dashboard',
        groups: [
            {
                groupTitle: 'Overview',
                groupTitleKey: 'groups.overview',
                items: [
                    {
                        title: 'Agent Dashboard',
                        titleKey: 'items.agentDashboard',
                        href: '/agent/dashboard',
                        icon: 'dashboard',
                        capability: 'agent.dashboard.view',
                    },
                    {
                        title: 'Agent Workspace',
                        titleKey: 'items.agentWorkspace',
                        href: '/agent',
                        icon: 'agent-workspace',
                        capability: 'agent.workspace',
                        aliases: ['/customers'],
                    },
                ],
            },
            {
                groupTitle: 'Engagement',
                groupTitleKey: 'groups.engagement',
                items: [
                    {
                        title: 'Social Inbox',
                        titleKey: 'items.socialInbox',
                        href: '/agent/social',
                        icon: 'social-inbox',
                        capability: 'social.view',
                    },
                    {
                        title: 'Callback & Voicemail',
                        titleKey: 'items.missedCalls',
                        href: '/agent/missed-calls',
                        icon: 'missed-calls',
                        capability: 'missed-calls.view',
                    },
                ],
            },
            {
                groupTitle: 'Support',
                groupTitleKey: 'groups.support',
                items: [
                    {
                        title: 'Troubleshooting',
                        titleKey: 'items.troubleshooting',
                        href: '/agent/troubleshooting',
                        icon: 'troubleshooting',
                        capability: 'troubleshooting.view',
                    },
                    {
                        title: 'Quick Support',
                        titleKey: 'items.quickSupport',
                        href: '/agent/support',
                        icon: 'support',
                        capability: 'support.view',
                    },
                ],
            },
        ],
    },
    {
        id: 'supervision',
        kind: 'workspace',
        label: 'Supervision',
        labelKey: 'domains.supervision',
        icon: 'monitoring',
        capability: 'dashboard.view',
        landingHref: '/dashboard',
        groups: [
            {
                groupTitle: 'Overview',
                groupTitleKey: 'groups.overview',
                items: [
                    {
                        title: 'Contact Center Dashboard',
                        titleKey: 'items.contactCenterDashboard',
                        href: '/dashboard',
                        icon: 'dashboard',
                        capability: 'dashboard.view',
                    },
                    {
                        title: 'Agent Monitoring',
                        titleKey: 'items.agentMonitoring',
                        href: '/admin/monitoring',
                        icon: 'monitoring',
                        capability: 'monitor.view',
                    },
                    {
                        title: 'Operational Exceptions',
                        titleKey: 'items.exceptions',
                        href: '/supervision/exceptions',
                        icon: 'error',
                        capability: 'dashboard.view',
                    },
                ],
            },
            {
                groupTitle: 'Operations',
                groupTitleKey: 'groups.operations',
                items: [
                    {
                        title: 'Call Records (CDR)',
                        titleKey: 'items.cdr',
                        href: '/admin/cdr',
                        icon: 'call-records',
                        capability: 'cdr.view',
                    },
                    {
                        title: 'Call Campaigns',
                        titleKey: 'items.campaigns',
                        href: '/admin/campaigns',
                        icon: 'campaigns',
                        capability: 'campaigns.view',
                    },
                ],
            },
            {
                groupTitle: 'Analytics',
                groupTitleKey: 'groups.analytics',
                items: [
                    {
                        title: 'Reports & Analytics',
                        titleKey: 'items.reports',
                        href: '/admin/reports',
                        icon: 'reports',
                        capability: 'reports.view',
                    },
                    {
                        title: 'Call Statistics',
                        titleKey: 'items.callStats',
                        href: '/admin/stats',
                        icon: 'call-statistics',
                        capability: 'reports.view',
                        placeholder: true,
                    },
                    {
                        title: 'Charts',
                        titleKey: 'items.charts',
                        href: '/admin/charts',
                        icon: 'charts',
                        capability: 'reports.view',
                        placeholder: true,
                    },
                    {
                        title: 'Survey Monitoring',
                        titleKey: 'items.surveyMonitoring',
                        href: '/admin/surveys',
                        icon: 'surveys',
                        capability: 'reports.view',
                        placeholder: true,
                    },
                ],
            },
        ],
    },
    {
        id: 'administration',
        kind: 'workspace',
        label: 'Administration',
        labelKey: 'domains.administration',
        icon: 'management-console',
        capability: 'console.view',
        landingHref: '/admin/console',
        groups: [
            {
                groupTitle: 'Overview',
                groupTitleKey: 'groups.overview',
                items: [
                    {
                        title: 'Management Console',
                        titleKey: 'items.managementConsole',
                        href: '/admin/console',
                        icon: 'management-console',
                        capability: 'console.view',
                    },
                ],
            },
            {
                groupTitle: 'People',
                groupTitleKey: 'groups.people',
                items: [
                    {
                        title: 'Agents',
                        titleKey: 'items.agents',
                        href: '/admin/agents',
                        icon: 'agents',
                        capability: 'console.view',
                        placeholder: true,
                    },
                    {
                        title: 'Users',
                        titleKey: 'items.users',
                        href: '/admin/users',
                        icon: 'users',
                        capability: 'console.view',
                    },
                    {
                        title: 'Roles & Permissions',
                        titleKey: 'items.roles',
                        href: '/admin/roles',
                        icon: 'roles',
                        capability: 'roles.manage',
                    },
                ],
            },
            {
                groupTitle: 'Routing',
                groupTitleKey: 'groups.routing',
                items: [
                    {
                        title: 'Queues',
                        titleKey: 'items.queues',
                        href: '/admin/queues',
                        icon: 'queues',
                        capability: 'console.view',
                    },
                    {
                        title: 'IVR',
                        titleKey: 'items.ivr',
                        href: '/admin/ivr',
                        icon: 'ivr',
                        capability: 'console.view',
                    },
                    {
                        title: 'Inbound Routes',
                        titleKey: 'items.inboundRoutes',
                        href: '/admin/inbound-routes',
                        icon: 'routes',
                        capability: 'console.view',
                        placeholder: true,
                    },
                    {
                        title: 'Time Groups',
                        titleKey: 'items.timeGroups',
                        href: '/admin/time-groups',
                        icon: 'schedules',
                        capability: 'console.view',
                    },
                    {
                        title: 'Time Conditions',
                        titleKey: 'items.timeConditions',
                        href: '/admin/time-conditions',
                        icon: 'time-conditions',
                        capability: 'console.view',
                    },
                ],
            },
            {
                groupTitle: 'Media',
                groupTitleKey: 'groups.media',
                items: [
                    {
                        title: 'Recordings',
                        titleKey: 'items.recordings',
                        href: '/admin/recordings',
                        icon: 'recordings',
                        capability: 'console.view',
                    },
                ],
            },
            {
                groupTitle: 'System',
                groupTitleKey: 'groups.system',
                items: [
                    {
                        title: 'Subscriptions',
                        titleKey: 'items.subscriptions',
                        href: '/admin/subscription',
                        icon: 'subscriptions',
                        capability: 'settings.manage',
                    },
                    {
                        title: 'Mail Configuration',
                        titleKey: 'items.mailConfig',
                        href: '/admin/mail-config',
                        icon: 'mail',
                        capability: 'settings.manage',
                    },
                    {
                        title: 'System & Infrastructure',
                        titleKey: 'items.infrastructure',
                        href: '/admin/system',
                        icon: 'infrastructure',
                        capability: 'system.view',
                    },
                    {
                        title: 'System Health',
                        titleKey: 'items.systemHealth',
                        href: '/admin/health',
                        icon: 'service-health',
                        capability: 'system.view',
                    },
                    {
                        title: 'Security Administration',
                        titleKey: 'items.securityAdministration',
                        href: '/admin/security',
                        icon: 'security',
                        capability: 'roles.manage',
                        placeholder: true,
                    },
                    {
                        title: 'Backups',
                        titleKey: 'items.backups',
                        href: '/admin/backups',
                        icon: 'backups',
                        capability: 'console.view',
                        placeholder: true,
                    },
                    {
                        title: 'AI Center',
                        titleKey: 'items.aiCenter',
                        href: '/admin/ai',
                        icon: 'ai-center',
                        capability: 'ai.view',
                    },
                ],
            },
        ],
    },
    {
        id: 'platform',
        kind: 'workspace',
        label: 'Platform',
        labelKey: 'domains.platform',
        icon: 'organizations',
        capability: 'tenants.manage',
        landingHref: '/admin/tenants',
        groups: [
            {
                groupTitle: 'Overview',
                groupTitleKey: 'groups.overview',
                items: [
                    {
                        title: 'Tenant Management',
                        titleKey: 'items.tenantManagement',
                        href: '/admin/tenants',
                        icon: 'organizations',
                        capability: 'tenants.manage',
                    },
                ],
            },
        ],
    },
];

export const FLEX_SETTINGS_AREA: FlexNavigationArea = {
    id: 'settings',
    kind: 'utility',
    label: 'Settings',
    labelKey: 'areas.settings',
    icon: 'settings',
    landingHref: '/settings/profile',
    groups: [
        {
            groupTitle: 'Account',
            groupTitleKey: 'groups.account',
            items: [
                {
                    title: 'Profile',
                    titleKey: 'items.profile',
                    href: '/settings/profile',
                    icon: 'users',
                },
                {
                    title: 'Security',
                    titleKey: 'items.accountSecurity',
                    href: '/settings/security',
                    icon: 'security',
                },
                {
                    title: 'Appearance',
                    titleKey: 'items.appearance',
                    href: '/settings/appearance',
                    icon: 'sun',
                },
            ],
        },
        {
            groupTitle: 'Contact Center',
            groupTitleKey: 'groups.contactCenter',
            items: [
                {
                    title: 'Settings Directory',
                    titleKey: 'items.settings',
                    href: '/admin/settings',
                    icon: 'settings',
                    capability: 'settings.manage',
                },
            ],
        },
        {
            groupTitle: 'Routing & Trunks',
            groupTitleKey: 'groups.routingTrunks',
            items: [
                {
                    title: 'Inbound Routes',
                    titleKey: 'items.inboundRoutes',
                    href: '/admin/settings/inbound-routes',
                    icon: 'routes',
                    capability: 'settings.manage',
                    placeholder: true,
                },
                {
                    title: 'Outbound Routes',
                    titleKey: 'items.outboundRoutes',
                    href: '/admin/settings/outbound-routes',
                    icon: 'routes',
                    capability: 'settings.manage',
                    placeholder: true,
                },
            ],
        },
        {
            groupTitle: 'Media & Audio',
            groupTitleKey: 'groups.media',
            items: [
                {
                    title: 'Recordings',
                    titleKey: 'items.recordings',
                    href: '/admin/settings/recordings',
                    icon: 'recordings',
                    capability: 'settings.manage',
                    placeholder: true,
                },
                {
                    title: 'Music on Hold',
                    titleKey: 'items.musicOnHold',
                    href: '/admin/settings/moh',
                    icon: 'music',
                    capability: 'settings.manage',
                    placeholder: true,
                },
                {
                    title: 'Tones',
                    titleKey: 'items.tones',
                    href: '/admin/settings/tones',
                    icon: 'tones',
                    capability: 'settings.manage',
                    placeholder: true,
                },
            ],
        },
        {
            groupTitle: 'Operational Policies',
            groupTitleKey: 'groups.operationalPolicies',
            items: [
                {
                    title: 'Agent States',
                    titleKey: 'items.agentStates',
                    href: '/admin/settings/agent-states',
                    icon: 'agents',
                    capability: 'settings.manage',
                    placeholder: true,
                },
                {
                    title: 'Departments',
                    titleKey: 'items.departments',
                    href: '/admin/settings/departments',
                    icon: 'organizations',
                    capability: 'settings.manage',
                    placeholder: true,
                },
                {
                    title: 'Surveys',
                    titleKey: 'items.surveys',
                    href: '/admin/settings/surveys',
                    icon: 'surveys',
                    capability: 'settings.manage',
                    placeholder: true,
                },
            ],
        },
        {
            groupTitle: 'System & Security',
            groupTitleKey: 'groups.systemSecurity',
            items: [
                {
                    title: 'Security',
                    titleKey: 'items.securityAdministration',
                    href: '/admin/settings/security',
                    icon: 'security',
                    capability: 'settings.manage',
                    placeholder: true,
                },
                {
                    title: 'CDR Configuration',
                    titleKey: 'items.cdrConfiguration',
                    href: '/admin/settings/cdr-config',
                    icon: 'cdr-configuration',
                    capability: 'settings.manage',
                    placeholder: true,
                },
                {
                    title: 'Global Configuration',
                    titleKey: 'items.globalConfiguration',
                    href: '/admin/settings/global',
                    icon: 'global-config',
                    capability: 'settings.manage',
                    placeholder: true,
                },
            ],
        },
    ],
};

export const FLEX_NAVIGATION_AREAS: FlexNavigationArea[] = [
    ...FLEX_DOMAINS,
    FLEX_SETTINGS_AREA,
];

function cleanPath(url: string): string {
    return url.split(/[?#]/)[0] ?? url;
}

/** Boundary-aware route check: exact match or slash-boundary descendant. */
export function isActiveRoute(currentUrl: string, href: string): boolean {
    const path = cleanPath(currentUrl);

    return path === href || path.startsWith(`${href}/`);
}

function routeMatchLength(path: string, item: FlexNavRoute): number {
    const matches = [item.href, ...(item.aliases ?? [])].filter((href) =>
        isActiveRoute(path, href),
    );

    return Math.max(0, ...matches.map((href) => href.length));
}

export function resolveNavigationArea(
    url: string,
): FlexNavigationAreaId | null {
    const path = cleanPath(url);
    let match: { id: FlexNavigationAreaId; score: number } | null = null;

    for (const area of FLEX_NAVIGATION_AREAS) {
        for (const item of area.groups.flatMap((group) => group.items)) {
            const score = routeMatchLength(path, item);

            if (score > (match?.score ?? 0)) {
                match = { id: area.id, score };
            }
        }
    }

    if (match) {
        return match.id;
    }

    if (path.startsWith('/admin/settings') || path.startsWith('/settings')) {
        return 'settings';
    }

    if (path.startsWith('/customers') || path.startsWith('/agent')) {
        return 'agent';
    }

    if (path.startsWith('/supervision')) {
        return 'supervision';
    }

    if (path.startsWith('/admin')) {
        return 'administration';
    }

    // Authenticated catch-all modules stay in the operational Administration
    // workspace without inventing a navigation entry for an unknown route.
    return 'administration';
}

export function resolveActiveNavigationHref(
    url: string,
    areaId = resolveNavigationArea(url),
): string | null {
    if (!areaId) {
        return null;
    }

    const path = cleanPath(url);
    const area = FLEX_NAVIGATION_AREAS.find(
        (candidate) => candidate.id === areaId,
    );
    let match: { href: string; score: number } | null = null;

    for (const item of area?.groups.flatMap((group) => group.items) ?? []) {
        const score = routeMatchLength(path, item);

        if (score > (match?.score ?? 0)) {
            match = { href: item.href, score };
        }
    }

    return match?.href ?? null;
}

export function getFirstAccessibleHref(
    area: FlexNavigationArea,
    has: (capability: Capability) => boolean,
): string {
    return (
        area.groups
            .flatMap((group) => group.items)
            .find((item) => !item.capability || has(item.capability))?.href ??
        area.landingHref
    );
}

/** Backwards-compatible workspace-only resolver. */
export function deriveActiveDomain(url: string): FlexDomainId | null {
    const area = resolveNavigationArea(url);

    return area && area !== 'settings' ? area : null;
}
